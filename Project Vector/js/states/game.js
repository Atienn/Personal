
/**
 * Game state where the player can navigate levels.
 * Interprets level objects.
 */
let GameState =
{
    //Tracks if the game is paused or not.
    playing: false,

    //Tracks if the player has cleared the level.
    cleared: false,

    //Tracks how long the player takes to complete a level.
    timer: 0,

    //Tracks if the player has restarted recently.


    //Tracks the reference to the current level being played.
    currLevel: null,

    /**
     * Sets up the level to be interpreted and starts.
     * @param {Level} level - The level to switch to.
     */
    //De-structure the level object into its components.
    setup(level) {
        //Get the reference to the level object.
        this.currLevel = level;

        //Switch to the level's track.
        music.setTrack(level.track, level.trackName);

        //Set the platforms as the 'current' ones.
        Platform.currG = level.platformArr.g;
        Platform.currC = level.platformArr.c;
        Platform.currL = level.platformArr.l;
        Platform.currR = level.platformArr.r;

        //Set the entities as the 'current' ones.
        Entity.current = level.entityArr;

        BGBlock.current = level.backArr;

        //Send 'hueChange' a quarter further into the spectrum.
        misc.changeHue(90);

        //Pause the game, resets the player's position, velocity, dash, state
        //and reset switches.
        this.restart();
    },


    /**
     * Computes physics, registers inputs and renders each frame.
     * Is called once per 'draw()' when playing.
     */
    update() {

        //If the game is unpaused, then do boundary checks, player input/movement.
        if (this.playing) {
            //Ups the timer by 1.
            this.timer++

            //Check if the player is overlapping an entity and potentially trigger its onOverlap function.
            Entity.checkAll(Player, Entity.current);

            //Update the player's position and react to inputs.
            Player.behaviour();

            //If ESCAPE is pressed, switch to the paused state.
            if (keyIsDown(27)) {
                //Pause the game.
                this.playing = false;
            }
        }

        //Regardless of pause, if R is pressed, make the player restart the level.
        if (keyIsDown(settings.input.restart)) {
            //Make the player restart.
            this.restart();
        }


        //#region Rendering


        //BACKGROUND

       background(0);

        //Advance the global hue.
        misc.changeHue(0.1 + 0.01 * Player.vel.Magnitude());

        //If the global dim is over 0, lower it by 1.
        if (dim > 0) { dim--; }

        //Store the current settings.
        push();

        //Translates everything to be drawn from the player's perspective.
        camera.translate();

        BGBlock.displayAll();

        //ENTITIES
        //Display all entities.
        Entity.displayAll(Entity.current);

        //PLATFORMS
        //Display all platforms.
        Platform.displayAll();

        //Revert the translate.
        pop();

        //Display the player.
        Player.display();

        //TIMER
        //Display how many frames it has been since the player started in the top-left corner.
        text('TIME: ' + this.timer.toLocaleString(undefined, { minimumIntegerDigits: 5, useGrouping: false }), 5, 15);

        //Dev mode
        text(`POS: (${Player.pos.x.toFixed()}, ${Player.pos.y.toFixed()})`, 5, height - 15);

        //Dev mode.
        mouse.display();
        mouse.displayPos();

        //PAUSE MENU

        //If not in the game state, then draw a transparent background over the frame with text.
        if (!this.playing) {
            //Draw a semi-transparent black background.
            background(0, 0, 10, 0.4);

            //Sets the drawing settings to write text.

            push(); //We don't want to keep these drawing settings.
            strokeWeight(5); //Gives a thick outline to text.
            stroke(0, 0, 0); //Set the outline's color to darker grey.

            textSize(120); //Makes the text larger for either of the following message.


            //If the level was cleared, display a different message than in regular pause.

            //After clearing the level, display time taken to complete.
            if (this.cleared) {
                text('CLEARED', 40, 100); //Display that the level was cleared.

                textSize(60); //Reduce the text size.
                text(`You took ${this.timer} frames to complete the level.`, 50, 300); //Display the time it took to clear.
                text('Press ENTER to return to menu.\nPress R to try again.', 50, 650); //Display instructions to quit/resume at the bottom.
            }
            //On regular pause, display controls and objective.
            else {
                text('PAUSED', 40, 100); //Display that the game is paused at the top.

                textSize(60); //Reduce the text size.
                text('OBJECTIVE', 50, 240); //Display a header in the middle-left.
                text('Press ENTER to return to menu.\nPress any other key to resume.', 50, 660); //Display instructions to quit/resume at the bottom.

                textSize(40); //Reduce the text size again.
                textAlign(LEFT, TOP);
                text(this.currLevel.objText, 75, 300); //Display objectives in the middle-left.
            }
            pop(); //Revert to the previous text drawing settings.

            //Display current track.
            music.displayCurrTrack();

            //Display the cursor.
            mouse.display();

            //Do the following after rendering because otherwise unpausing will result in a frame
            //of delay between removal of the pause overlay and player input being recorded.

            //Unpause the game or quit to menu if a key that isn't ESCAPE is pressed.
            if (keyIsPressed) {
                //If ENTER is pressed, quit to menu.
                if (keyCode === 13) {
                    //Calls the 'MenuState' setup and switch the state to it.
                    switchState(MenuState);
                }
                //If the key isn't ESCAPE or R and the level wasn't cleared, unpause the game.
                //The first two prevent the paused menu from opening/closing itself over and over if ESCAPE/R are held down.
                else if (keyCode != 27 && keyCode != settings.input.restart && !this.cleared) {
                    //Set the playing state to true.
                    this.playing = true;
                }
            }
        }
        //#endregion
    },

    /**
     * Sends the player back to their initial position, removes their velocity, gives them
     * their dash back, resets all entities.
     * Called if the player presses their 'RESTART' input.
     */
    restart() {

        //Reset all entities to thier base state.
        Entity.current.forEach(entity => {
            if(entity.state) {
                entity.state = false;
            }
        });

        //Pause the game.
        this.playing = false;

        //Reverts the cleared state if it's true.
        this.cleared = false;

        //Reset the timer to 0.
        this.timer = 0;

        //Reset the player's position.
        Player.pos.Get(this.currLevel.startPos);
        Player.lastPos.Get(this.currLevel.startPos);

        //Don't carry over any previous velocity.
        Player.vel.Set(0,0);

        //Give the player their dash back if they didn't have it.
        Player.dash = true;
        Player.dashTimer = 0;

        //Allow the player to jump as soon as they start, even if they are mid-air.
        Player.lastState = 1;
        Player.lastStateTimer = 5;
    },

    /** Saves the clear time if necessary. */
    scoreCheck() {
        //If the clear time is lower than the current one of if there isn't any clear time defined, save it.
        if(this.timer < this.currLevel.time || this.cleared.time == null) {
            this.currLevel.time = this.timer;
            scoreHandler.saveScores();
        }
    },

    /** Free up memory used by the state before exiting. */
    exit() {
        //Level object.
        this.currLevel = null;

        //Array of platforms.
        Platform.currC = null;
        Platform.currG = null;
        Platform.currL = null;
        Platform.currR = null;

        //Array of entities.
        Entity.current = null;
        //Array of background blocks.
        BGBlock.current = null;

        //Global dim.
        dim = 0;
    }
}