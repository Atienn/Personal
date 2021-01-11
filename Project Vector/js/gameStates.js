"use strict";

/**
 * Menu state of the program where the user can choose to quit, adjust settings or start playing.
 */
let MenuState = 
{
    //Tracks which button is currently selected.
    selected: 0,

    //Tracks what text should be displayed to 
    contextualText: "",

    //Tracks if the settings panel is active.
    settings: false,

    //Tracks the pixel density of the canvas.
    //Lower numbers means a blurrier image, but faster performance.
    //To avoid floating point error, we use interger numbers and divide by 10 afterwards.
    density: 0,

    //Tracks the master volume of the game.
    //To avoid floating point error, we use interger numbers and divide by 10 afterwards.
    volume: 1,


    //Holds the text of each main menu button.
    buttonText:
    [
        'PLAY',
        'SETTINGS',
        'QUIT'
    ],


    /**
     * Switch to the menu music, disables the settings panel and switches the state.
     */
    setup()
    {
        //Unlocks the analyzers from 'currentMusic' as it's switching track.
        //Not doing so causes the analyzers to stop working entirely.
        freqAnalyzer.setInput();
        ampAnalyzer.setInput();

        //Stop any currently playing music.
        currentMusic.stop();
        //Switch the current track to the playing state music.
        currentMusic = menuMusic;
        //Make the current track loop.
        currentMusic.loop();

        //Change the index of the music name accordingly.
        currentMusicIndex = 0;

        //Sets the music as the input source. (Makes them ignore all other sounds, if any.)
        freqAnalyzer.setInput(currentMusic);
        ampAnalyzer.setInput(currentMusic);

        //Send 'hueChange' a quarter further into the spectrum.
        changeHue(90);

        //Start with the settings panel closed.
        this.settings = false;

        //Switch to the menu state.
        state = MenuState;
    },

    /**
     * Does relevant behaviour if the user clicks on a button or hovers over it.
     * Displays an image of a title, three large buttons and a potential settings panel.
     * Is called one per 'draw()' when on the menu.
     */
    update()
    {
        //Assume that no button is selected.
        this.selected = -1;

        //Check if the mouse is hovering over any button.
        //If it is 'selected' will receive the index of the button.
        TriggerBox.isWithinBound(new Vector2D(mouseX, mouseY), TriggerBox.allM);

        //If the mouse is pressed 
        if(mouseClick)
        {
            //Change the behaviour depending on which button is selected, if any.
            switch(this.selected)
            {
                //PLAY
                //Calls the 'PlayingState' setup, switching the game state to it.
                case 0:
                    PlayingState.setup();
                break;

                //SETTINGS
                case 1:
                    //If the settings panel is closed, open it. If it's open, close it.
                    this.settings = !this.settings;
                break;

                //QUIT
                //Makes the user leave the page, either by closing it or by sending them to their previously visited page.
                case 2:
                    //Checks if the user has more than a single page in their history.
                    //If they do, close the page, other wise send them forwards/backwards in their history.
                    if(window.history.length === 1)
                    {
                        //If the user only has this page in their history, close the window or tab.
                        window.close();
                    }
                    else
                    {
                        //Send the user to the previous page in their history.
                        window.history.back();

                        //If the user is still on the page, then there were no last page to go to.
                        //Send the user to the next page in their history.
                        window.history.forward();
                    }
                break;

                //INCREASE DENSITY
                case 3:
                    //If the density is below 3.0, add 0.1.
                    if(this.density < 30)
                    {
                        //Add 1 to the density counter.
                        this.density++;
                        //Apply the change, dividing by 10 to only add 0.1.
                        pixelDensity(this.density / 10);
                    }
                break;
                
                //LOWER DENSITY
                case 4:
                    //If the density is above 0.1, subtract 0.1.
                    if(this.density > 1)
                    {
                        //Remove 1 from the density counter.
                        this.density--;
                        //Apply the change, dividing by 10 to only remove 0.1.
                        pixelDensity(this.density / 10);
                    }
                break;

                //INCREASE VOLUME
                case 5:
                    //If the volume is below 1.0, add 0.1.
                    if(this.volume < 10)
                    {
                        //Add 1 to the volume counter.
                        this.volume++;
                        //Apply the change, dividing by 10 to only add 0.1.
                        masterVolume(this.volume / 10);
                    }
                break;

                //DECREASE VOLUME
                case 6:
                    //If the volume is above 0.0, remove 0.1.
                    if(this.volume > 0)
                    {
                        //Remove 1 from the volume counter.
                        this.volume--;
                        //Apply the change, dividing by 10 to only remove 0.1.
                        masterVolume(this.volume / 10);
                    }
                break;
            }
        }

        //#region Rendering

        //Ups the value of 'hueChange' by 0.05.
        changeHue(0.05);

        //Draw a background with color dependent on time.
        background(hueChange, 100, 85);

        //We don't want to keep the following drawing settings.
        push();


        //Makes rectangles drawn from the corner, simplying things in our case.
        rectMode(CORNER);


        //BUTTONS

        //Makes the rectangle's fill white.
        fill(100);
        //For each button, draw a rectangle which will act as an outline.
        for(let i = 0; i < 3; i++)
        {
            rect(0, (i*125)+340, 600, 100);
        }

        //Make's the rectangle's fill black.
        fill(0);

        //For each button, draw a rectangle going from the left side of the screen.
        for(let i = 0; i < 3; i++)
        {
            rect(0, (i*125)+345, 595, 90);
            
            //If the button is selected, add a semi-transparent highlight over it.
            if(this.selected === i)
            {
                //Switch to a half-transparent grey fill.
                fill(0,0,100,0.25);
                //Draw the highlight.
                rect(0, (i*125)+340, 600, 100);
                //Switch back to the previous fill.
                fill(0);
            }
        }


        //SETTINGS PANEL

        //If the settings panel is active, render it.
        if(this.settings)
        {
            //Makes the rectangle's fill white.
            fill(100);
            //Draw the outline of the window.
            rect(765, 360, 600, 300);

            //Switch back to the previous fill.
            fill(0);
            //Draw the body of teh window.
            rect(770, 365, 590, 290);


            //Make the following text white.
            fill(100);

            //Increase the text size.
            textSize(40);
            //Write the title of the panel.
            text('SETTINGS MENU', 785, 400);

            //Reduce the text size.
            textSize(25);
            //Write the individual setting names along with their respective value.
            text('Display Resolution ', 815, 455);
            text(`${width} x ${height}`, 1200, 455); //Displays the user's resolution which depends on thier window size.

            text('Pixel Density', 815, 530);
            text((this.density / 10).toFixed(1), 1200, 530); //Ranges from 0.1 to 3.0.

            text('Audio Volume', 815, 605);
            text((this.volume / 10).toFixed(1), 1200, 605); //Ranges from 0.1 to 1.0.

            textSize(15);
            text(`Reccomended values are around 1500 x 750. Modify with 'Ctrl' + 'Scroll'.`, 825, 485);
            text('Affects the sharpness of the image. Lower to increase performance.', 825, 560);
            text('Modifies of how loud all game sounds are.', 825, 635);

            //Draw arrows representing increase/decrease buttons.
            triangle(1270, 520, 1260, 535, 1280, 535); //Up arrow, pixel density.
            triangle(1320, 535, 1310, 520, 1330, 520); //Down arrow, pixel density.
            triangle(1270, 595, 1260, 610, 1280, 610); //Up arrow, audio volume.
            triangle(1320, 610, 1310, 595, 1330, 595); //Down arrow, audio volume.
            

            //If an increase/decrease button is selected, draw a highlight over it.
            if(this.selected > 2)
            {
                //Make the highlight semi-transparent.
                fill(0,0,100,0.25);

                //Draw a semi-transparent rectangle over the button.
                switch(this.selected)
                {
                    //Density increase highlight.
                    case 3:
                        rect(1250, 515, 40, 25);
                    break;

                    //Density decrease highlight.
                    case 4:
                        rect(1300, 515, 40, 25);
                    break;

                    //Volume increase highlight.
                    case 5:
                        rect(1250, 590, 40, 25);
                    break;

                    //Volume increase highlight.
                    case 6:
                        rect(1300, 590, 40, 25);
                    break;
                }

            }
        }
        

        //TEXT

        //Makes the text larger.
        textSize(50);

        //Make the text white.
        fill(100);
        //For each button, write its respective text in the left-center as to align each button's text.
        for(let i = 0; i < 3; i++)
        {
            text(this.buttonText[i],50,(i*125)+395);
        }

        //Make the text much larger.
        textSize(150);
        //Write the game's title.
        text("PROJECT VECTOR", 50, 150);

        //Reduce the text's size.
        textSize(40);
        //Write a subtitle.
        text("A game about going fast and making mistakes.", 60, 245);

        //Reduce the text size's further
        textSize(30);
        //Chooses a message to display under the buttons if they are selected.
        switch(this.selected)
        {
            //Play message.
            case 0:
                this.contextualText = "Start playing. Adjusting settings first is recommended."
            break;

            //Settings message.
            case 1:
                this.contextualText = "Adjust settings like audio volume or pixel density."
            break;

            //Quit message.
            case 2:
                this.contextualText = "Quit the game."
            break;

            //Increase density message.
            case 3:
                this.contextualText = "Increase the pixel density."
            break;

            //Decrease density message.
            case 4:
                this.contextualText = "Lower the pixel density."
            break;

            //Increase volume message.
            case 5:
                this.contextualText = "Increase the audio volume."
            break;

            //Decrease volume message.
            case 6:
                this.contextualText = "Lower the audio volume."
            break;

            //If no buttons are selected, don't show any text.
            default:
                this.contextualText = "";
            break;
        }

        //Display the text under the buttons.
        text(this.contextualText, 50, 725)
        
        //Revert to the previous drawing settings.
        pop();

        //#endregion
    }
}

/**
 * Game state where the player can navigate levels.
 */
let PlayingState =
{
    //Tracks if the game is paused or not.
    playing: false,

    //Tracks if the player has cleared the level.
    cleared: false,

    //Tracks which level is playing.
    level: 1,

    //Tracks how long the player takes to complete a level.
    timer: 0,

    //Tracks if the player has restarted recently.
    //Dims the background.
    dim: 0,

    /**
     * Sets the player to the start of the level.
     */
    setup()
    {
        //Unlocks the analyzers from 'currentMusic' as it's switching track.
        //Not doing so causes the analyzers to stop working entirely.
        freqAnalyzer.setInput();
        ampAnalyzer.setInput();

        //Stop any currently playing music.
        currentMusic.stop();
        //Switch the current track to the playing state music.
        currentMusic = gameMusic;
        //Make the current track loop.
        currentMusic.loop();

        //Change the index of the music name accordingly.
        currentMusicIndex = 1;

        //Sets the music as the input source. (Makes them ignore all other sounds, if any.)
        freqAnalyzer.setInput(currentMusic);
        ampAnalyzer.setInput(currentMusic);

        //Send 'hueChange' a quarter further into the spectrum.
        changeHue(90);

        //Pause the game, resets the player's position, velocity, dash, state
        //and reset switches.
        this.restart();

        //Switch to the playing state.
        state = PlayingState;
    },


    /**
     * Computes physics, registers inputs and renders each frame.
     * Is called once per 'draw()' when playing.
     */
    update()
    {
        //If the game is unpaused, then do boundary checks, player input/movement.
        if(this.playing)
        {
            //Check if the player is within a trigger box and potentially trigger an effect.
            TriggerBox.isWithinBound(Player.pos, TriggerBox.allL1);

            //Update the player's position and react to inputs.
            Player.behaviour();

            //Ups the timer by 1.
            this.timer++

            //If ESCAPE is pressed, switch to the paused state.
            if(keyIsDown(27)) 
            {
                //Pause the game.
                this.playing = false;
            }
        }

        //Regardless of pause, if R is pressed, make the player restart the level.
        if(keyIsDown(82) && keyCode)
        {
            //Make the player restart.
            this.restart();
        }


        //#region Rendering


        //BACKGROUND

        //Ups the value of 'hueChange' by 0.1 (twice as much as in the menu state).
        changeHue(0.1);

        //Draw a background whose color changes with time and that briefly gets dimmer with if the player is teleported.
        background(hueChange, 100, 60-this.dim);

        //If the background dim is over 0, lower it by 1.
        if(this.dim > 0) { this.dim--; }


        //TRIGGER BOXES
        //Display all trigger boxes.
        TriggerBox.displayAll(TriggerBox.allL1);


        //PLATFORMS
        //Display all platforms.
        Platform.displayAll();


        //PLAYER

        //Draw the player character as a black circle with a white outline whose thickness 'beats' with the music.
        push(); //We don't want to keep these drawing settings.

        //Makes the stroke white, its thickness dependent on the amplitude level.
        strokeWeight(2 + ampCurrent * 5); 
        stroke(100);

        //Make the player circle's fill dependent on the dash cooldown. Also add 40 to the brightness
        //if the dashTimer is over 0 to have a more noticeable switch when the dash is avaiable again.
        fill(0 + 2 * Player.dashTimer + 40 * (Player.dashTimer > 0));

        //Draw the player circle around the center of the screen (affected by the camera offset).
        circle((width/2) - camOffset.x, (height/1.5) - camOffset.y, 20, 20); 
        //Revert to the previous drawing settings.
        pop();


        //TIMER
        //Display how many frames it has been since the player started in the top-left corner.
        text('TIME: ' + this.timer.toLocaleString(undefined, {minimumIntegerDigits: 5, useGrouping: false}), 5, 15);


        //PAUSE MENU

        //If not in the game state, then draw a transparent background over the frame with text.
        if(!this.playing)
        {
            //Draw a semi-transparent black background.
            background(0, 0, 10, 0.4);

            //Sets the drawing settings to write text.
            
            push(); //We don't want to keep these drawing settings.
            strokeWeight(5); //Gives a thick outline to text.
            stroke(0, 0, 0); //Set the outline's color to darker grey.
            
            textSize(120); //Makes the text larger for either of the following message.


            //If the level was cleared, display a different message than in regular pause.
            
            //After clearing the level, display time taken to complete.
            if(this.cleared)
            {
                text('CLEARED', 40, 100); //Display that the level was cleared.

                textSize(60); //Reduce the text size.
                text(`You took ${this.timer} frames to complete the level.`, 50, 300); //Display the time it took to clear.
                text('Press ENTER to return to menu.\nPress R to try again.', 50, 650); //Display instructions to quit/resume at the bottom.
            }
            //On regular pause, display controls and objective.
            else
            {
                text('PAUSED', 40, 100); //Display that the game is paused at the top.

                textSize(60); //Reduce the text size.

                text('CONTROLS', 50, 240); //Display a header in the middle-left.
                text('OBJECTIVE', 800, 240); //Display another header in the middle-right.
                text('Press ENTER to return to menu.\nPress any other key to resume.', 50, 660); //Display instructions to quit/resume at the bottom.
                
                textSize(40); //Reduce the text size again.
                
                text('- ARROW KEYS to move.\n- SPACE to jump.\n- Z to dash.\n- R to retry.\n- ESCAPE to pause.', 75, 405); //Display controls in the middle-left.
                text('- Activate all switches.\n- Reach the end.', 875, 335); //Display objectives in the middle-right.
            }
            pop(); //Revert to the previous text drawing settings.


            //Do the following after rendering because otherwise unpausing will result in a frame
            //of delay between removal of the pause overlay and player input being recorded.

            //Unpause the game or quit to menu if a key that isn't ESCAPE is pressed.
            if(keyIsPressed)
            {
                //If ENTER is pressed, quit to menu.
                if(keyCode === 13)
                {
                    //Calls the 'MenuState' setup and switch the state to it.
                    MenuState.setup();
                    state = MenuState;
                }
                //If the key isn't ESCAPE or R and the level wasn't cleared, unpause the game.
                //The first two prevent the paused menu from opening/closing itself over and over if ESCAPE/R are held down.
                else if(keyCode != 27 && keyCode != 82 && !this.cleared)
                {
                    //Set the playing state to true.
                    this.playing = true;
                }
            }
        }
        //#endregion
    },

    /**
     * Sends the player back to their initial position, removes their velocity, gives them
     * their dash back, resets the timer and switches.
     * Called if the player presses 'ESCAPE'.
     */
    restart()
    {
        //Reset all switches.
        Switch.reset(TriggerBox.S1);

        //If there are any switches, since we just reset them, 
        //the goal will be disabled with them.
        this.tryActivateGoal();

        //Pause the game.
        this.playing = false;

        //Reverts the cleared state if it's true.
        this.cleared = false;

        //Reset the timer to 0.
        this.timer = 0;


        //Sets the player to their initial position (150, 1500).
        Player.pos.x = 125;
        Player.pos.y = 1575;

        //Don't carry over any previous velocity.
        Player.vel.x = 0;
        Player.vel.y = 0;

        //Give the player their dash back if they didn't have it.
        Player.dash = true;
        Player.dashTimer = 0;

        //Allow the player to jump as soon as they start, even if they are mid-air.
        Player.lastState = 1;
        Player.lastStateTimer = 5;
    },

    tryActivateGoal()
    {
        //Tracks if the goal should activate or not.
        //Assume that all switches are active.
        let value = true;

        //For each switch in the array, check if it is active. If it isn't, don't let the goal activate.
        for(let i = 0; i < TriggerBox.S1.length; i++)
        {
            //If the switch is inactive then the goal should stay inactive as well.
            if(!TriggerBox.S1[i].e.active) 
            {
                //Prevent the goal from activating.
                value = false;
                
                //If one switch is inactive, then checking for more won't change anything.
                break;
            }
        }
        //Activate the goal if all switches are active. Keep it inactive otherwise.
        TriggerBox.G1.e.active = value;
    }
}

//Code that was removed but might be re-implemented later.
/*
        //MUSIC VISUALIZER

        //Creates the music visualizer which is a vignette effect 'beating' with the amplitude of the music.
        //Display the music visualizer if the music is playing.
        if(gameMusic.isPlaying())
        {
            //Measure the level of amplitude and send it to the amplitude variable.
            ampCurrent = ampAnalyzer.getLevel();
            //Measures the level of frequencies and sends them to the frequency array.
            freqsCurrent = freqAnalyzer.analyze();

            //We don't want to keep these drawing settings.
            push();


            //BEATING VIGNETTE

            //Set the size of the circle to scale with the size of the screen.
            size = Math.hypot(width, height) - ampCurrent * 100;

            //Offset everyting until the next pop() so that (0,0) is horizontally in the middle and
            //vertically far below what's in view (just under half the beating circle's height).



            //Makes a pattern within the beating circle going from dark to lighter shades.
            //A multiple of the window's height is removed from the beating circle's size to restrain in to the bottom of the window.

            //Draws a large, almost black circle at the point specified by translate above.
            fill(0, 0, 10);
            circle(0, 0, 1.03 * size);

            //Draws a slightly smaller, slighly lighter circle at the same point.
            fill(0, 0, 20);
            circle(0, 0, 1.02 * size);

            //Draws a slightly smaller, slighly lighter circle at the same point.
            fill(0, 0, 25);
            circle(0, 0, 1.01 * size);

            //Draws a slightly smaller, slighly lighter circle at the same point.
            fill(0, 0, 30);
            circle(0, 0, 1 * size);

            //Draws a slightly smaller, slighly lighter circle at the same point.
            fill(0, 0, 35);
            circle(0, 0, 0.99 * size);

            pop(); //Revert to the previous drawing and position settings.
        }
         */