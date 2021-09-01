/**
 * Menu state of the program where the user can choose to quit, adjust settings or start playing.
 */
let MenuState = 
{
    //Menu music.
    track: null,
    trackName: "AIRGLOW - Blueshift",

    //Array of subtitles describing the game.
    descr: [
        "pretending to have a coherent artistic vision",
        "speed and making mistakes",
        "speed and improvement",
        "trying over and over again",
        "hopefully finding satisfaction",
        "muscle memory",
        "holding down the jump and dash keys",
        "restarting at the slightest hiccup",
        "not undestanding how to correctly use colors"
    ],

    descrIndx: 0,

    //Tracks what text should be displayed on the bottom of the screen.
    contextualText: "",

    //Tracks if the level panel is active.
    levelPanel: false,

    //Tracks if the settings panel is active.
    settingsPanel: false,

    //Arrays of buttons. 
    menuButtons: [],
    levelButtons: [],
    settingsButtons: [],


    /**
     * Switch to the menu music, creates the buttons, sets 
     */
    setup()
    {
        music.setTrack(this.track, this.trackName);

        this.menuButtons = [
            new StateEntity(new Vector2D(297.5, 375), 300, 50, StateEntity.menuButton, StateEntity.rectCheckHold, this.playSelect, 'PLAY'),
            new StateEntity(new Vector2D(297.5, 500), 300, 50, StateEntity.menuButton, StateEntity.rectCheckHold, this.settingSelect, 'SETTINGS'),
            new StateEntity(new Vector2D(297.5, 625), 300, 50, StateEntity.menuButton, StateEntity.rectCheckHold, this.quitSelect, 'QUIT')
        ];

        this.settingsButtons = [
            new StateEntity(new Vector2D(1265, 635), 70, 15, StateEntity.textButton, StateEntity.rectCheckHold, this.rebindSelect, 'REBIND'),
            new StateEntity(new Vector2D(1270, 482.5), 20, 15, StateEntity.arrowButton, StateEntity.rectCheckHold, this.densityUpSelect, true),
            new StateEntity(new Vector2D(1320, 482.5), 20, 15, StateEntity.arrowButton, StateEntity.rectCheckHold, this.densityDownSelect, false),
            new StateEntity(new Vector2D(1270, 557.5), 20, 15, StateEntity.arrowButton, StateEntity.rectCheckHold, this.volumeUpSelect, true),
            new StateEntity(new Vector2D(1320, 557.5), 20, 15, StateEntity.arrowButton, StateEntity.rectCheckHold, this.volumeDownSelect, false)  
        ];

        //Create a button for each level.
        for (let i = 0; i < Level.list.length; i++) {
            this.levelButtons.unshift(
                new StateEntity(new Vector2D(1065, 410 + (i * 50)), 275, 17.5, StateEntity.levelButton, StateEntity.rectCheckHold, this.launchLevel, Level.list[i])
            );
        }

        //Choose the next description (sub-title) to display.
        this.descrIndx++;
        //Return to start once having looped through each.
        if(this.descrIndx >= this.descr.length) {
            this.descrIndx = 0;
        }

        //Send 'hueChange' a quarter further into the spectrum.
        misc.changeHue(90);

        //Start with the level select and settings panel closed.
        this.levelPanel = false;
        this.settingsPanel = false;
    },

    /**
     * Does relevant behaviour if the user clicks on a button or hovers over it.
     * Displays an image of a title, three large buttons and a level select / settings panel.
     * Is called one per 'draw()' when on the menu.
     */
    update()
    {
        //Assume that no button is selected.
        this.contextualText = "";

        //Check if the mouse is hovering over any button.
        Entity.checkAll(mouse, this.menuButtons);
        

        //Ups the value of 'hueChange' by 0.05.
        misc.changeHue(0.075);

        //Draw a background with color dependent on time.
        background(hueChange, 100, 85);

        //We don't want to keep the following drawing settings.
        push();

        //LEVEL SELECT PANEL

        //Render the level select panel if it's active.
        if(this.levelPanel)  {
            //Check if any of the level buttons are being hovered over.
            Entity.checkAll(mouse, this.levelButtons);

            //Makes the rectangle's fill white.
            stroke(100);
            strokeWeight(5);

            //Switch back to the previous fill.
            fill(0);
            //Draw the body of the window.
            rect(1065, 500, 295, 190);

            noStroke();

            //Make the following text white.
            fill(100);

            //Increase the text size.
            textSize(40);
            //Write the title of the panel.
            text('LEVEL SELECT', 785, 350);
            //Display all level buttons.
            Entity.displayAll(this.levelButtons);
        }

        //SETTINGS PANEL
    
        //If the settings panel is active, render it.
        else if(this.settingsPanel)
        {
            //Check if any of the level buttons are being hovered over.
            Entity.checkAll(mouse, this.settingsButtons);
            
            //Makes the rectangle's fill white.
            stroke(100);
            strokeWeight(5);

            //Switch back to the previous fill.
            fill(0);
            //Draw the body of the window.
            rect(1065, 500, 295, 190);

            noStroke();

            //Make the following text white.
            fill(100);

            //Increase the text size.
            textSize(40);
            //Write the title of the panel.
            text('SETTINGS MENU', 785, 350);

            //Reduce the text size.
            textSize(25);
            //Write the individual setting names along with their respective value.
            text('Display Resolution ', 815, 410);
            text(`${width} x ${height}`, 1200, 410); //Displays the user's resolution which depends on thier window size.

            text('Pixel Density', 815, 485);
            text((settings.density / 10).toFixed(1), 1200, 485); //Ranges from 0.1 to 3.0.

            text('Audio Volume', 815, 560);
            text((settings.volume / 10).toFixed(1), 1200, 560); //Ranges from 0.1 to 1.0.

            text('Controls', 815, 635);

            textSize(15);
            text(`Recommended values are around 1500 x 750. Modify by zooming in / out.`, 825, 440);
            text('Affects the sharpness of the image. Lower to increase performance.', 825, 515);
            text('Modifies of how loud all game sounds are.', 825, 590);
            text('Use to re-map game controls.', 825, 665);
            //Display all settings buttons.
            Entity.displayAll(this.settingsButtons);
        }

        //Make the text white.
        fill(100);

        //Make the text much larger.
        textSize(150);
        //Write the game's title.
        text("PROJECT VECTOR", 50, 150);

        //Reduce the text's size.
        textSize(40);
        //Write a subtitle.
        text(`A game about ${this.descr[this.descrIndx]}.`, 60, 245);

        //Reduce the text size's further
        textSize(30);

        //Display the text under the buttons.
        text(this.contextualText, 50, 725);
        
        //Revert to the previous drawing settings.
        pop();

        Entity.displayAll(this.menuButtons);

        //Display current track.
        music.displayCurrTrack();

        //Draw the cursor.
        mouse.display();

        //#endregion
    },


    /** Free up memory used by the state before exiting. */
    exit() {        
        this.menuButtons = [];
        this.levelButtons = [];
        this.settingsButtons = [];
        this.contextualText = "";
    },

    
    //#region BUTTON FUNCTIONS

    /** Enables / Disables the levels panel. */
    playSelect() {
        if(mouse.click) {
            //Disable the settings panel if it's active and activate the level select one.
            MenuState.settingsPanel = false;
            MenuState.levelPanel = !MenuState.levelPanel;
        }
        MenuState.contextualText = "Select a level. Adjusting settings first is recommended.";
    },

    /** Switches to the gane state. */
    launchLevel() {
        if(mouse.click) {
            switchState(GameState, this.mod);
        }
        MenuState.contextualText = "Start playing.";
    },

    /** Enables / Disables the settings panel. */
    settingSelect() {
        if(mouse.click) {

            //Disable the level select panel if it's active and activate the settings one.
            MenuState.levelPanel = false;
            MenuState.settingsPanel = !MenuState.settingsPanel;
        }
        MenuState.contextualText = "Adjust inputs, audio volume or pixel density.";
    },

    /** Quits the game. */
    quitSelect() {
        if(mouse.click) {
            quit();
        }
        MenuState.contextualText = "Quit the game.";
    },

    densityUpSelect() {
        if(mouse.click) {
            settingsHandler.densityUp();
        }
        MenuState.contextualText = "Increase the canvas' pixel density.";
    },

    densityDownSelect() {
        if(mouse.click) {
            settingsHandler.densityDown();
        }
        MenuState.contextualText = "Decrease the canvas' pixel density.";
    },
    
    volumeUpSelect() {
        if(mouse.click) {
            settingsHandler.volumeUp();
        }
        MenuState.contextualText = "Increase the game's volume.";
    },

    volumeDownSelect() {
        if(mouse.click) {
            settingsHandler.volumeDown();
        }
        MenuState.contextualText = "Decrease the game's volume.";
    },

    /**
     * Brings up a panel that prompts the user to rebind thier inputs.
     */
    rebindSelect() {
        if(mouse.click) {
            //Save the previous update function, it will be re-assigned once input re-binding is done.
            let pastUpdate = MenuState.update;
            //Get all of the game actions whose inputs can be re-mapped.
            let actions = Object.getOwnPropertyNames(settings.input);

            //Tracks which action is being re-binded.
            let keyIndex = 0;
            //Tracks if a key was pressed last frame.
            let keyDown = false;
            //Tracks the name of the pressed key.
            let keyName = 'none';
            
            //Set an event on key press to record the key's name.
            window.onkeydown = (event) => {
                keyName = event.code;
            }

            //Set a new temporary update function.
            MenuState.update = () => {
                //Calculate the coordinates of the center of the screen (where the re-bind panel will be located).
                let hWidth = windowWidth / 2;
                let hHeight = windowHeight / 2;


                //DISPLAY

                //Transparent light grey background.
                //Has the effect of gradually 'greying out' the background by applying a new layer each frame.
                background(0, 0, 50, 0.1);

                //Save current drawing settings.
                push();

                //Draw rectangles from the center.
                rectMode(RADIUS);
                //Black with thick white outline.
                fill(0);
                stroke(100);
                strokeWeight(5);

                //Draw a rectangular panel at the center of the screen. 
                rect(hWidth, hHeight, 275, 135);

                //Align text from the center.
                textAlign(CENTER);
                //White with no stroke.
                fill(100);
                noStroke();

                //Write the action of to be rebinded in large.
                textSize(100);
                text(actions[keyIndex].toUpperCase(), hWidth, hHeight - 10);
                //Write the current input for the action as well as instruction to the user.
                textSize(30);
                text('Press the desired key for:', hWidth, hHeight - 110);
                text('Current: ' + settings.inputName[actions[keyIndex]], hWidth, hHeight + 50);
                //Show the option to skip in small.
                textSize(20);
                text(`(Press ESCAPE to skip)`, hWidth, hHeight + 115);

                //Revert to saved drawing settings.
                pop();

                //If a key is pressed but none were last frame, then re-bind.
                if(keyIsPressed) {
                    if(!keyDown) {
                        //Prevent a single key press (lasting multiple frames) from re-binding multiple action's inputs. 
                        keyDown = true;

                        //Unless the key pressed is Escape, assign the new key to the action.
                        //If escape is pressed, the action's re-bind is skipped.
                        if(keyCode != 27) {
                            settingsHandler.modifyInput(actions[keyIndex], keyCode, keyName);
                        }

                        //Moves to the next action.
                        keyIndex++;

                        //If all actions have been re-binded (or skipped), return to the main update
                        //function and remove the event on key press.
                        if (keyIndex >= actions.length) {
                            MenuState.update = pastUpdate;
                            window.onkeydown = null;
                        }
                    }
                }
                //Let the next input be recorded if no keys were pressed this frame.
                else {
                    keyDown = false;
                }
            };
        }
        MenuState.contextualText = "Rebind game inputs.";
    }

    //#endregion
}