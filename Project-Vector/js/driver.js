/* **************
PROJECT VECTOR
Étienne Racine

Built off template-p5-project. The program is a platformer game with a focus on speed.
The goal is to navigate pre-made levels in the shortest amount of time possible.

All music used is royalty-free.
************** */


//#region Structure

//Tracks which state the game is in.
let state;

//Tracks the user's desired settings (inputs, volume, etc).
let settings;

/** Object representation ofthe cursor. */
let mouse = {
    //Tracks if the user has clicked their mouse for the specific frame it's referred on.
    click: false,
    //The mouse's position on screen.
    pos: Vector2D.Zero(),

    /** Draws a custom '+' cursor at the mouse position that 'beats' with the music. */
    display() {
        rect(this.pos.x, this.pos.y, 10 + music.ampCurrent * 10, 1 + music.ampCurrent);
        rect(this.pos.x, this.pos.y, 1 + music.ampCurrent, 10 + music.ampCurrent * 10);
    },

    //Dev mode.
    // displayPos() {
    //     let worldPos = new Vector2D(this.pos.x - ((width/2) - Player.pos.x - camera.offset.x), this.pos.y - ((height/1.5) - Player.pos.y - camera.offset.y));
    //     text(worldPos.toString(), this.pos.x + 15, this.pos.y + 15);
    // }
}

/** Handles where entities, platforms and the player are drawn on screen. */
let camera = {

    //What the camera is following. 
    //Must have a Vector2D 'pos' property. 
    target: Player,
    
    //Tracks how much to offset the camera's view from the target's position.
    offset: Vector2D.Zero(),

    /** Translates everything to be drawn from the target's perspective. */
    translateTarget(){
        translate((width/2) - this.offset.x, (height/1.5) - this.offset.y);
    },

    /** Translates everything to be drawn relative to the target target's perspective. */
    translateLevel() {
        translate((width/2) - this.target.pos.x - this.offset.x, (height/1.5) - this.target.pos.y - this.offset.y);
    }
}

//#endregion


//#region Display

//Tracks if the window was in focus last frame.
let wasFocused = true;

//Holds a hue value (0-359) that varies with time. 
//Starts at 140 so that the 'MenuState' setup will set it to 230 (blue).
let hueChange = 140;

//Used as a global value to dim the colors of various objects.
let dim =  0;

//#endregion


//Disables p5 friendly errors and possibly leads to a performance boost.
p5.disableFriendlyErrors = true;


/**
 * Loads the music, settings and clear times.
 * This function is called and completed before any other.
 */
function preload()
{
    //Since loading a sound file is asynchronous, placing it in 'preload()' prevents the program from continuing until it's done.
    //Load the track of the menu.
    MenuState.track = music.loadTrack(MenuState.trackName);

    //Load the track of every level.
    Level.list.forEach(level => {
        level.track = music.loadTrack(level.trackName);
    });


    //Since both of the following rely on data stored on the user's system,
    //extra precaution measures should be taken.

    try {
        //Get locally stored settings data if any is available.
        settings = JSON.parse(localStorage.getItem(`P1:Settings`));
        //If said data doesn't exist yet, create a new settings object with default values.
        if(!settings) { settingsHandler.resetSettings(); }
    }
    //If parsing of the settings JSON object fails, reset to default values.
    catch (err) {
        console.warn('Unable to parse settings in local storage. Resetting to default.');
        settingsHandler.resetSettings();
    }

    try {
        //Get the clear time array from storage.
        let scores = JSON.parse(localStorage.getItem("P1:Scores"));
        //If defined, set each level's clear time as the one specified in storage.
        if(scores != undefined) {
            for (let i = 0; i < scores.length; i++) {
                Level.list[i].time = scores[i];
            }
        }
        //If undefined, reset the array.
        else { scoreHandler.resetScores(); }
    }
    //If parsing of the scores JSON object fails, reset to default values.
    catch (err) {
        console.warn('Unable to parse level highscores in local storage. Resetting to default.');
        scoreHandler.resetScores();
    }
}

/**
 * Prepares the canvas/background and modifies general settings.
 * Is called once on startup.
 */
function setup() 
{
    //Create the canvas and set the background color
    createCanvas(windowWidth, windowHeight);

    //#region Display Settings

    //Tries to set the game's framerate at 60 per second (affects the speed of the game).
    //If the refresh rate of the user's screen is below this however, browsers will not go above what can be shown.
    frameRate(60);

    noCursor(); //Hides the cursor as a custom one provided.
    colorMode(HSB); //HSB is useful as the saturation and brightness can be modified independently of hue.

    //Makes the default fill bright white, disable stroke and make line caps square.
    fill(100);
    noStroke();
    strokeCap(SQUARE);

    //Sets shapes to be drawn from the center.
    ellipseMode(RADIUS);
    rectMode(RADIUS);

    //Set the default text to be small and aligned from the left-center.
    textSize(20);
    textAlign(LEFT, CENTER);

    //#endregion

    //#region Audio Settings

    //Set the game volume.
    masterVolume(settings.volume / 10);

    //Give the current track an abstract sound file so that analyzers can connect to it and to
    //allow it to be stopped and switched to something else when calling the first 'state.setup()'.
    music.currentTrack = new p5.SoundFile();

    //Creates a FFT object with large smoothing and 128 output frequencies.
    //Here, smoothing means that the returned level of frequecies will rise and fall slower, appearing smoother.
    music.freqAnalyzer = new p5.FFT(0.75, 128);

    //Create an Amplitude object with little smoothing.
    music.ampAnalyzer = new p5.Amplitude();
    music.ampAnalyzer.smooth(0.25);

    //Allows the music to start.
    userStartAudio();

    //#endregion

    //Set the starting game state.
    state = MenuState;

    //Set density.    
    pixelDensity(settings.density / 10);

    //Call the state's setup before its behaviour.
    state.setup();
}


/**
 * Calls the current game state's update function and draw the cursor.
 */
function draw() 
{        
    //Don't update if the window is not in focus.
    if(focused)
    {
        //Set the new position of the mouse.
        mouse.pos.Set(mouseX, mouseY);

        //Measure the level of amplitude and send it to the amplitude variable.
        music.ampCurrent = music.ampAnalyzer.getLevel();
        
        //Measures the level of frequencies and sends them to the frequency array.
        music.freqCurrent = music.freqAnalyzer.analyze();

        //Call the game state's update function.
        state.update();

        //Now that all logic is done for this frame, assume that the user won't click next frame.
        mouse.click = false;


        //If the window wasn't focused last frame, then the cursor was enabled. Disables it. 
        if(!wasFocused)
        {
            //Consider the window as now being in focus.
            wasFocused = true;
            //Disable the cursor.
            noCursor();
        }
    }

    //If the window was in focus last frame, enable the cursor and display a message.
    else if(wasFocused)
    {
        //Consider the window as not being in focus anymore.
        wasFocused = false;

        //Enable the cursor.
        cursor();

        //Draw a semi-transparent black background over the previous frame.
        background(0,0,0,0.75);
        
        
        //OUT OF FOCUS MESSAGE

        push(); //We don't want to keep the following drawing settings.

        textSize(75); //Increase the text size.
        textAlign(CENTER, CENTER); //Align the text from the center.
        
        text('OUT OF FOCUS\nCLICK TO RESUME', width/2, height/2); //Display the message.
    
        pop(); //Revert to previous drawing settings.
    }
}



/**
 * Adjusts the size of what's displayed to match the window.
 * Is automatically called if the window is resized at any point.
 */
function windowResized()
{
    //Resizes the canvas with the values of the window
    resizeCanvas(windowWidth, windowHeight);
}


/** Safely switches to a new state by calling it's setup function first. */
function switchState(newState, level = null) {
    state.exit();
    state = newState;
    newState.setup(level);
}


/**
 * Only sets 'cursor.click' to true on the frame the user clicks their mouse.
 * This is very useful since it prevents any double input and the condition
 * can be checked with a global variable.
 */
function mousePressed() { mouse.click = true; }


/**
 * Quits the page, either by sending them somewhere 
 * in thier history, or by closing the page.
 */
 function quit() {

    //Force saving settings before exiting.
    settingsHandler.saveSettings();

    //Try to send the user to the previous page in their history.
    window.history.back();

    //If the user is still on the page, then there were no last page to go to.
    //Send the user to the next page in their history.
    window.history.forward();

    //Again, if the user is still on the page, then there were no page to go to.
    //Close the window or tab.
    window.close();
}