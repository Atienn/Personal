/* **************
PROJECT VECTOR
Étienne Racine

Built off template-p5-project. The program is a platformer game with a focus on speed.
The goal is to navigate pre-made levels in the shortest amount of time possible.

All music used is royalty-free.
************** */

//#region Variables

//Tracks if the user has clicked their mouse on the specific frame it's called on.
let mouseClick = false;

//Tracks if the window was in focus last frame.
let wasFocused = true;

//Tracks which state the game is in.
let state;

//Holds a hue value (0-359) that varies with time. 
//Starts at 140 so that the 'MenuState' setup will set it to 230 (blue).
let hueChange = 140;

//Holds the music played in levels.
let gameMusic;

//Holds the music played in the menu.
let menuMusic;

//Holds the name of all music used.
let musicNames = ['AIRGLOW - Blueshift','INTL.CMD - Sunset City']

//Holds the music currently playing.
let currentMusic;

//Holds the index of the currently playing music in the 'musicNames' array.
let currentMusicIndex;

//Tracks how much to offset the camera's view from the player's position.
let camOffset = new Vector2D(0,0);

//Is used to measure the level of multiple frequecies as 'music' plays out.
let freqAnalyzer;
//Holds the level of each frequency measured for the current frame.
let freqsCurrent = 0;

//Is used to meansure the amplitude level as 'music' plays out.
let ampAnalyzer;
//Holds the amplitude level measured for the current frame.
let ampCurrent = 0;




/**Representation of the player 'character'.*/
let Player =
{
    //Represents the XY position of the player object.
    pos: new Vector2D(0,0),
    //Represents the last XY position the player object held.
    lastPos: new Vector2D(0,0),

    //Represents the XY velocity of the player object.
    vel: new Vector2D(0,0),
    //We have a separate vector because we want to manipulate the velocity input before applying it.
    velAdd: new Vector2D(0,0),

    //Represents the direction given by W,A,s and D inputs.
    dir: new Vector2D(0,0),

    //Tracks the player's state (0: mid-air, 1: grounded, 2/3: wall-sliding).
    state: 0,
    //Tracks the player's last state. Used to allow the player to still jump right after leaving a platform/wall.
    lastState: 0,
    //Tracks the time the last state isn't valid anymore.
    lastStateTimer: 0,

    //Tracks of the player has used thier dash.
    dash: true,

    //Tracks the cooldown timer for the dash.
    dashTimer: 0,

    //Tracks which side the player is facing (false: left, true: right)
    oritentation: false,

    /**
    * Handles everything related to the player's movement.
    */
    //Is called once per draw().
    behaviour()
    {
        //PHYSICS & ENVIRONMENT

        //Mimicks gravity - Accelerate the player downwards if it is in the air.
        if(this.state === 0) { this.vel.y += 1.5; }
        //If the player is on a wall, add less gravity, as if there was extra friction slowing them down.
        else if (this.state >= 2) { this.vel.y += 0.65; }

        //Mimicks friction - If their velocity isn't 0, slows the player down by 7.5%.
        //For the x direction, add 5% of extra friction if there is no input (makes braking faster).
        if(this.vel.x !== 0) { this.vel.x = moveTowards(this.vel.x, 0, Math.abs(0.075 * this.vel.x) + 0.5*(this.velAdd.x === 0)); }
        if(this.vel.y !== 0) { this.vel.y = moveTowards(this.vel.y, 0, 0.075 * this.vel.y); }

        //The position the player had last frame is now thier last position.
        this.lastPos.x = this.pos.x;
        this.lastPos.y = this.pos.y;

        //Move the player by their current velocity. 
        //With the built-in friction, the max speed is 20 (asymptotic).
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;

        //Assume the player is mid-air.
        this.state = 0;

        //If the last state represents something else than mid-air, then lower the timer and possibly reset the last state.
        if(this.lastState !== 0) 
        {
            //Lower the timer by 1.
            this.lastStateTimer--; 

            //If the timer is now at 0, reset the last state.
            if(this.lastStateTimer <= 0) { this.lastState = 0; }
        }


        //#region Collision Checks

        //Since after a first collision any further ones won't have any effect (for a single frame),
        //then we don't have to any more collisons one one has happened.
        //Sections the horizontal collision check process for horizontal platforms so that it can be halted mid-process.
        horizontalCheck:
        {
            //Only check for ground collisions if the player is moving down.
            if(this.vel.y > 0)
            {
                //For every ground, check if there is collision.
                for(let i = 0; i < Platform.allG.length; i++)
                {
                    //Check for collisions using the player's lower boundaries (bottom-left, bottom-right).
                    if( Platform.allG[i].collisionCheck(new Vector2D(this.pos.x - 10, this.pos.y + 10), this.vel)
                        ||
                        Platform.allG[i].collisionCheck(new Vector2D(this.pos.x + 10, this.pos.y + 10), this.vel) )
                    {
                        //Anchor the player to the ground.
                        this.pos.y = Platform.allG[i].pos - 10;
                        //Remove any vertical velocity.
                        this.vel.y = 0.1;
                        //Switch the player's state and last state to grounded.
                        this.state = 1;
                        this.lastState = 1;
                        //Activate the last state's timer.
                        this.lastStateTimer = 5;
                        //Recharge the player's dash.
                        this.dash = true;

                        //If a collision has happened, then any other ones won't change anything (for this frame).
                        //Stops the collision check for horizontal platforms until next frame.
                        break horizontalCheck;
                    }
                }
            }
            //Only check for ceiling collision if the player isn't moving down and is moving up.
            else if (this.vel.y < 0)
            {
                //For every ceiling, check if there is collision.
                for(let i = 0; i < Platform.allC.length; i++)
                {
                    //Check for collisions using the player's upper boundary (top-left, top-right).
                    if( Platform.allC[i].collisionCheck(new Vector2D(this.pos.x - 10, this.pos.y - 10), this.vel)
                        ||
                        Platform.allC[i].collisionCheck(new Vector2D(this.pos.x + 10, this.pos.y - 10), this.vel) )
                    {
                        //Bring the player back to where they collided with the ceiling.
                        this.pos.y = Platform.allC[i].pos + 10;
                        //Remove and vertical velocity.
                        this.vel.y = 0;

                        //If a collision has happened, then any other ones won't change anything (for this frame).
                        //Stops the collision check for horizontal platforms until next frame.
                        break horizontalCheck;
                    }
                } 
    
            }
            //If the player has no veritcal velocity, no check will be made.
        }


        //Since after a first collision any further ones won't have any effect (for a single frame),
        //then we don't have to any more collisons one one has happened.
        //Sections the vertical collision check process for horizontal platforms so that it can be halted mid-process.
        verticalCheck:
        {
            //Only check for right wall collisions if the player is moving left.
            if(this.vel.x > 0)
            {
                //For every right wall, check if there is collision.
                for(let i = 0; i < Platform.allR.length; i++)
                {
                    //Check for collisions using the player's right boundary (top-right, bottom-right).
                    if( Platform.allR[i].collisionCheck(new Vector2D(this.pos.x + 10, this.pos.y - 10), this.vel)
                        ||
                        Platform.allR[i].collisionCheck(new Vector2D(this.pos.x + 10, this.pos.y + 10), this.vel) )
                    {
                        //Anchor the player to the wall.
                        this.pos.x = Platform.allR[i].pos - 10;
                        //Keep the player on the wall with a small velocity to the right.
                        this.vel.x = 1;

                        //Switch the player's state and last state to wall-sliding (right).
                        this.state = 3;
                        this.lastState = 3;
                        //Activate the last state's timer. (Wall-jumping can be unintuative, so an extra 3 frames are given.)
                        this.lastStateTimer = 8;

                        //Recharge the player's dash.
                        this.dash = true;
                        //Set the player's desired direction away from the wall.
                        this.dir.x--;

                        //Make the player face left.
                        this.oritentation = false;

                        //If a collision has happened, then any other ones won't change anything (for this frame).
                        //Stops the collision check for horizontal platforms until next frame.
                        break verticalCheck;
                    }
                }
            }
            //Only check for left wall collision if the player isn't moving right and is moving left.
            else if(this.vel.x < 0)
            {
                //For every left wall, check if there is collision.
                for(let i = 0; i < Platform.allL.length; i++)
                {
                    //Check for collisions using the player's right boundary (top-left, bottom-left).
                    if( Platform.allL[i].collisionCheck(new Vector2D(this.pos.x - 10, this.pos.y - 10), this.vel)
                        ||
                        Platform.allL[i].collisionCheck(new Vector2D(this.pos.x - 10, this.pos.y + 10), this.vel) )
                    {
                        //Anchor the player to the wall.
                        this.pos.x = Platform.allL[i].pos + 10;
                        //Keep the player on the wall with a small velocity to the left.
                        this.vel.x = -1;

                        //Switch the player's state and last state to wall-sliding (left).
                        this.state = 2;
                        this.lastState = 2;
                        //Activate the last state's timer. (Wall-jumping can be unintuative, so an extra 3 frames are given.)
                        this.lastStateTimer = 8;

                        //Recharge the player's dash.
                        this.dash = true;
                        //Set the player's desired direction away from the wall.
                        this.dir.x++;

                        //Make the player face right.
                        this.oritentation = true;

                        //If a collision has happened, then any other ones won't change anything (for this frame).
                        //Stops the collision check for horizontal platforms until next frame.
                        break verticalCheck;
                    }
                }
            }
            //If the player has no vertical velocity, no check will be made.
        }


        //#endregion
    

        //Makes the camera slightly ahead of the player when it is moving.
        camOffset.Add(this.vel.Scale(0.20));

        //Makes the camera view shifted towards where the player is facing.
        if(this.oritentation) { camOffset.x += 2.5; }
        else { camOffset.x -= 2.5; }

        //Makes the camera return back to a centered view when there's no input (still will be offset form the player orientation).
        if(camOffset.x !== 0) { camOffset.x = moveTowards(camOffset.x, 0, 0.05 * camOffset.x); }
        if(camOffset.y !== 0) { camOffset.y = moveTowards(camOffset.y, 0, 0.05 * camOffset.y); }


        //INPUTS

        //If A, S or D are pressed, add to the player's velocity in the appropriate direction.

        //If 'UP ARROW' is pressed, add velocity to upwards.
        if(keyIsDown(38)) 
        { 
            this.dir.y--;
        }
        
        //If 'DOWN ARROW' is pressed, add velocity downwards.
        if(keyIsDown(40)) 
        {
            this.dir.y++;
            this.velAdd.y++;
        }

        //If 'LEFT ARROW' is pressed, set desired direction and add velocity to the left.
        if(keyIsDown(37)) 
        {
            //If the player isn't currently on a left wall, add left to their desired direction.
            //This is because if the player is on the wall, their x direction will already have been set.
            if(this.state !== 2)
            {
                //Add left to the desired direction.
                this.dir.x--;
            }

            //Set to add velocity to the left.
            this.velAdd.x--;
            
            //Make the player face left.
            this.oritentation = false;
        }
        
        //If 'RIGHT ARROW' is pressed, set desired direction and add velocity to the right.
        if(keyIsDown(39)) 
        {
            //If the player isn't currently on a right wall, add right to their desired direction.
            //This is because if the player is on the wall, their x direction will already have been set.
            if(this.state !== 3)
            {
                //Add right to the desired direction.
                this.dir.x++;
            }

            //Set to add velocity to the right.
            this.velAdd.x++;

            //Make the player face right.
            this.oritentation = true;
        }

        //If 'SPACE' is pressed, either make the player jump or lenghten thier air-time.
        if(keyIsDown(32)) 
        {
            //If 'SPACE' is pressed and the player is not in the air (for regular and last state), add a burst of velocity.
            if(this.state !== 0 || this.lastState !== 0)
            {
                //If the player is considered sliding down a right wall, give an upwards-left velocity.
                if(this.state == 2 || this.lastState == 2) 
                {
                    this.vel.x = 21;
                    this.vel.y = -21;
                }
                //If the player is considered sliding down a left wall, give an upwards-right velocity.
                else if(this.state == 3 || this.lastState == 3)
                {
                    this.vel.x = -21;
                    this.vel.y = -21;
                }
                //If the player is not in the air and not on a wall, then it is on the ground.
                //If the player is considered on the ground, give an upwards velocity.
                else
                {
                    this.vel.y = -30;
                }

                //If the player has jumped, remove their last state and reset the timer. 
                this.lastState = 0;
                this.lastStateTimer = 0;
            }

            //If the player is ascending and hasn't used their dash, lengthen their jump.
            else if(this.vel.y < 5)
            {
                //Remove just under 1/2 of the gravity acceleration.
                this.vel.y -= 0.7;
            }
        }

        //If the dash is still on cooldown, decrement the timer.
        if(this.dashTimer > 0) { this.dashTimer--; }

        //Normalizes the direction vector.
        this.dir = this.dir.Normalized();

        //If 'Z' is pressed and the player's dash is available, give a burst of speed in pDir's direction.
        if(keyIsDown(90) && this.dash && this.dashTimer <= 0) 
        {
            //Consider the dash as being used.
            this.dash = false;

            //Puts some time before the dash can be used again.
            this.dashTimer = 25;

            //Add roughly 71 (magnitude) times the desired direction as velocity to the player.
            this.vel.x = 40 * this.dir.x;
            this.vel.y = 40 * this.dir.y - 10; //The -10 makes it so that horizontal dashes have a bit of 'lift'.

            //Snap the screen away from where the player is dashing.
            camOffset.Add(this.dir.Scale(10));
        }

        //Reset the direction vector for next frame.
        this.dir = Vector2D.Zero();


        //Normalizes the addXY vector and applies each component to the player velocity.
        //Store the normalized vector instead of doing the Normalized calculation twice.
        this.velAdd = this.velAdd.Normalized();

        //Give the components of the double of normalized vector sepatately.
        this.vel.x += 2 * this.velAdd.x;
        this.vel.y += 2 * this.velAdd.y;
    
        //Resets the velAdd vector for the next frame.
        this.velAdd = Vector2D.Zero();
    },
}

//#endregion


//Disables p5 friendly errors and possibly leads to a performance boost.
p5.disableFriendlyErrors = true;

/**
 * Loads the music.
 * This function is called and completed before any other.
 */
function preload()
{
    //Since loading a sound file is asynchronous, placing it in 'preload()' prevents the program from continuing until it's done.
    menuMusic = loadSound('assets/sounds/AIRGLOW - Blueshift.mp3')
    gameMusic = loadSound('assets/sounds/INTL.CMD - Sunset City.mp3');
}

/**
 * Prepares the canvas/background and modifies general settings.
 * Is called once on startup.
 */
function setup() 
{
    //Create the canvas and set the background color
    createCanvas(windowWidth, windowHeight);

    //#region Visual Settings
  
    noCursor(); //Hides the cursor as there is a custom one provided.
    colorMode(HSB); //HSB is useful as the saturation and brightness can be modified independently of color.

    //Makes the default fill bright white, disable stroke and make line caps square.
    fill(100);
    noStroke();
    strokeCap(SQUARE);

    //Sets shapes to be drawn from the center.
    ellipseMode(CENTER);
    rectMode(CENTER);

    //Set the default text to be small and aligned from the left-center.
    textSize(20);
    textAlign(LEFT, CENTER);

    //#endregion

    //#region Sound Settings

    //Reduce the volume to 10%.
    masterVolume(0.1);

    //Give the current track an abstract sound file so that analyzers can connect to it and to
    //allow it to be stopped and switched to something else when calling the first 'state.setup()'.
    currentMusic = new p5.SoundFile();

    //Creates a FFT object with large smoothing and 128 output frequencies.
    //Here, smoothing means that the returned level of frequecies will rise and fall slower, appearing smoother.
    freqAnalyzer = new p5.FFT(0.75, 128);

    //Create an Amplitude object with little smoothing.
    ampAnalyzer = new p5.Amplitude();
    ampAnalyzer.smooth(0.1);

    //Allows the music to start.
    userStartAudio();

    //#endregion

    //Set the starting game state.
    state = MenuState;

    //Get the default density of the canvas.
    MenuState.density = Math.round(pixelDensity()*10);

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
        //Measure the level of amplitude and send it to the amplitude variable.
        ampCurrent = ampAnalyzer.getLevel();
        //Measures the level of frequencies and sends them to the frequency array.
        freqsCurrent = freqAnalyzer.analyze();

        //Call the game state's update function.
        state.update();

        //Now that any logic is done, assume that the user won't click next frame.
        mouseClick = false;


        //Since 'playing' is defined as false and needs to be set to false for the player to return to menu,
        //by only checking for it, we can have behaviour happen both on 'MenuState' and 'PlayingState' pause.
        
        //Either on menu or on pause, display the name and artist of the currently playing music on the bottom-right.
        if(!PlayingState.playing)
        {
            push(); //We don't want to keep the following text settings.

            textAlign(RIGHT, CENTER); //Align text to the right-center.
            textSize(15); //Reduce the text size.
            text(`Currently Playing:\n${musicNames[currentMusicIndex]}`, width - 5, height - 20); //Give credit to the artist.

            pop(); //Revert to the previous text settings.
        }

        //Draws a custom '+' cursor at the mouse position that 'beats' with the music.
        rect(mouseX,mouseY, 20 + ampCurrent * 25, 1 + ampCurrent);
        rect(mouseX,mouseY, 1 + ampCurrent, 20 + ampCurrent * 25);

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

        //Draw a sem-transparent black background over the previous frame.
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
 * Shifts 'current' towards 'target' at a rate of 'change' making sure not to go over it.
 * Is called twice per draw().
 * @param {Number} current - the current value.
 * @param {Number} target - the target value.
 * @param {Number} change - the rate at which 'current' moves to 'target'.
 */
function moveTowards(current, target, change)
{
    let isBigger;   //Tracks if the input is larger than the target.

    //If the input is larger than the target, than set 'isBigger' appropriately and remove 'change' from 'current'.
    if(current > target) 
    {   
        isBigger = true;
        //Remove 'change' from current, disregarding if it's positive or not.
        current -= Math.abs(change); 
    }
    //If the input is smaller than the target, than set 'isBigger' appropriately and add 'change' to 'current'.
    else if (current < target) 
    { 
        isBigger = false;
        //Add 'change' to current, disregarding if it's positive or not.
        current +=  Math.abs(change); 
    }

    //Corrects the values of 'current' if it moved past 'target'.
    //If 'target' was bigger and now isn't, then we've passed it.
    //If 'target' was smaller and now isn't, then we've passed it.
    if((isBigger && current < target) || (!isBigger && current > target))
    {
        //Corrects the value of 'current' (we wanted to stop at 'target').
        current = target;
    }

    //Return the modified value.
    return current;
}

/**
 * Only sets 'mouseClick' to true on the frame the user clicks their mouse.
 * This is very useful since it prevents any double input and the condition
 * can be checked with a global variable.
 */
function mousePressed()
{
    mouseClick = true;
}

/**
 * Ups the value of 'hueChange' by the specified amount making sure to
 * keep it within its 0-360 range.
 * 
 * @param {Number} value - The amount to add to 'hueChange'.
 */
function changeHue(value)
{
    //Increase the hue by the specified amount
    hueChange += value;

    //If the hue is over its max value (360), remove 360 to make it loop around.
    if(hueChange >= 360) { hueChange -= 360; }
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