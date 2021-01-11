/**************************************************
2D Template (built off template-p5-project)
Étienne Racine

This is a template for 2D projects.
The user can control a player object using the W, A, S and D keys.
The player object can be teleported to the mouse's position using the SPACE key or any mouse button.
**************************************************/



/**
 * Representation of the player character.
 */
let Player =
{
    //Tracks the cooldown remaining for the teleport.
    cooldown: 120,

    //Represents the XY position of the player objects.
    position: new Vector2D(0,0),

    //Tracks the last 4 positions of the player
    prevPos : new Array(4),

    //Represents the XY velocity of the player object.
    velocity: new Vector2D(0,0),
    //We have a separate vector because we want to manipulate the velocity input before applying it.
    velAdd: new Vector2D(0,0),

    /**
     * Registers inputs and computes physics.
     */
    update()
    {
        //PHYSICS & ENVIRONMENT

        //Record the position the player had last frame (set it as first in the 'prevPos' array).
        //For some reason, giving the vector directly seems to break things, so another one is constructed with same values.
        this.prevPos.unshift(new Vector2D(this.position.x, this.position.y)); 
        this.prevPos.pop();   //Clear the now 5th entry of the array as it isn't needed anymore.

        //If the player exits any of the window edges, loop them back on the opposite side.
        if(this.position.x < 0) { this.position.x = width; }
        if(this.position.x > width) { this.position.x = 0; }
        if(this.position.y < 0) { this.position.y = height; }
        if(this.position.y > height) { this.position.y = 0; }

        //Mimicks friction - Slows the player down by 5% if their velocity isn't 0.
        if(this.velocity.x !== 0) { this.velocity.x = moveTowards(this.velocity.x, 0, 0.05 * this.velocity.x); }
        if(this.velocity.y !== 0) { this.velocity.y = moveTowards(this.velocity.y, 0, 0.05 * this.velocity.y); }

        //Move the player by their current velocity. 
        //With the built-in friction, the max speed is 20 (asymptotic).
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //Ups the cooldown timer of the teleoport by 1 if it isn't 120.
        if(this.cooldown < 120) { this.cooldown++; }



        //INPUTS

        //Teleports the player to the mouse's position if spacebar or the mouse is pressed and if the cooldown is over.
        if((keyIsDown(32) || mouseIsPressed) && this.cooldown == 120)
        {
            //Reset the cooldown.
            this.cooldown = 0; 

            //Teleport the player to the mouse's position.
            this.position.x = mouseX;
            this.position.y = mouseY;

            //Resets the player's velocity.
            this.velocity.x = 0;
            this.velocity.y = 0;
        }


        //If W, A, S or D are pressed, add to the player's desired velocity in the appropriate direction.
        if(keyIsDown(87)) { this.velAdd.y -= 0.25; }   //If 'W' is pressed, add 'up' to the desired velocity.
        if(keyIsDown(65)) { this.velAdd.x -= 0.25; }   //If 'A' is pressed, add 'left' to the desired velocity.
        if(keyIsDown(83)) { this.velAdd.y += 0.25; }   //If 'S' is pressed, add 'down' to the desired velocity.
        if(keyIsDown(68)) { this.velAdd.x += 0.25; }   //If 'D' is pressed, add 'right' to the desired velocity.

        //Normalize the desired velocity and add it's components to the actual velocity vector.
        this.velocity.Add(this.velAdd.Normalized());

        //Resets the desired velocity vector for the next frame.
        this.velAdd = Vector2D.Zero();
    },
}



/**
 * Prepares the canvas/background and modifies general settings.
 * Is called once on startup.
 */
function setup() 
{
    //Create the canvas and set the background color
    createCanvas(windowWidth, windowHeight);
    background(0,0,25);


    //SETTINGS

    frameRate(48);  //Lowers the framerate to reduce CPU usage (still looks good at 48fps).
    noCursor(); //Hides the cursor as there is a custom one provided.
    colorMode(HSB); //HSB is useful as the brightness component only ranges from 0-100

    //Changes the fill to bright green and disables stroke
    fill(120,100,100);
    noStroke();

    //Sets shapes to be drawn from the center.
    ellipseMode(CENTER);
    rectMode(CENTER);


    //POSITIONNING OBJECTS

    //Places the player at the center of the screen.
    Player.position = new Vector2D(width/2, height/2);

    //Set the previous positions to the player's position (as if it stood still).
    for(let i = 0; i < 4; i++) { Player.prevPos[i] = Player.position; }
}



/**
 * Calls the player update and draws the frame.
 * Is called 48 times per second.
 */
function draw() 
{   
    //Don't do anything if the window is not in focus.
    if(focused)
    {
        //Call the player's update.
        Player.update();


        //VISUALS

        //Redraws the background with a color dependent of the cooldown timer.
        background(0,0, Player.cooldown / 4); 

        //Draw the player object at its specified position.
        ellipse(Player.position.x, Player.position.y, 12, 12);
        
        //Create a trail by drawing an ellipse for the last 4 positions the player had. 
        for(let i = 0; i < Player.prevPos.length; i++)
        {
            //Create an ellipse at the position specified in the array. Each smaller than the last (minimum 2).
            ellipse(Player.prevPos[i].x, Player.prevPos[i].y, 10 - (2 * i), 10 - (2 *i));
        }

        //Draw a custom '+' cursor at the mouse position.
        rect(mouseX,mouseY, 17, 1);
        rect(mouseX,mouseY, 1, 17);
    }
}



/**
 * Shifts 'current' towards 'target' at a rate of 'change' making sure not to go over it.
 * Is called twice per draw().
 * @param {number} current - The value to shift towards 'target'.
 * @param {number} target - The target value.
 * @param {number} change - The rate at which 'current' moves to 'target'.
 */
//Highly inspired by UnityEngine's Mathf.moveTowards.
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
 * Adjusts the size of what's displayed to match the window.
 * Is automatically called if the window is resized at any point.
 */
function windowResized()
{
  //Resizes the canvas with the values of the window
  resizeCanvas(windowWidth, windowHeight);
}