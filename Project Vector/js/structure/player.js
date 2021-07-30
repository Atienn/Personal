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

    //Represents the direction given by W,A,S and D inputs.
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
        if(this.vel.x !== 0) { this.vel.x = misc.moveTowards(this.vel.x, 0, Math.abs(0.075 * this.vel.x) + 0.5*(this.velAdd.x === 0)); }
        if(this.vel.y !== 0) { this.vel.y = misc.moveTowards(this.vel.y, 0, 0.075 * this.vel.y); }

        //The position the player had last frame is now thier last position.
        this.lastPos.Get(this.pos);

        //Move the player by their current velocity. 
        //With the built-in friction, the max speed is 20 (asymptotic).
        this.pos.Add(this.vel);

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

        //Since after the first collision any further ones won't have any effect (for one frame),
        //then we don't have to calculate if any more collisons has happened.
        horizontalCheck:
        {
            //Only check for ground collisions if the player is moving down.
            if(this.vel.y > 0)
            {
                //Calculate the positions of the player's boundaries for the current and last frame. 
                let currPosBL = new Vector2D(this.pos.x - 10, this.pos.y + 10);
                let currPosBR = new Vector2D(this.pos.x + 10, this.pos.y + 10);
                let lastPosBL = new Vector2D(this.lastPos.x - 10, this.lastPos.y + 10);
                let lastPosBR = new Vector2D(this.lastPos.x + 10, this.lastPos.y + 10);

                //If the horizotal velocity is 0, then the collision check process can be simplified.
                if(this.pos.x - this.lastPos.x === 0) {
                    //For every ground, check if there is collision.
                    for(let i = 0; i < Platform.currG.length; i++)
                    {
                        //Check for collisions using the player's lower boundaries (bottom-left, bottom-right).
                        if( Platform.currG[i].colCheckYSimple(currPosBL, lastPosBL, this.vel)
                            ||
                            Platform.currG[i].colCheckYSimple(currPosBR, lastPosBR, this.vel) )
                        {
                            //Call the collision event with the platform that triggered it.
                            this.onGCol(Platform.currG[i].pos);

                            //If a collision has happened, then any other ones won't change anything (for this frame).
                            //Stops the collision check for horizontal platforms on this frame.
                            break horizontalCheck;
                        }
                    }
                }
                else {
                    //For every ground, check if there is collision.
                    for(let i = 0; i < Platform.currG.length; i++)
                    {
                        //Check for collisions using the player's lower boundaries (bottom-left, bottom-right).
                        if( Platform.currG[i].collisionCheckY(currPosBL, lastPosBL, this.vel)
                            ||
                            Platform.currG[i].collisionCheckY(currPosBR, lastPosBR, this.vel) )
                        {
                            //Call the collision event with the platform that triggered it.
                            this.onGCol(Platform.currG[i].pos);

                            //If a collision has happened, then any other ones won't change anything (for this frame).
                            //Stops the collision check for horizontal platforms on this frame.
                            break horizontalCheck;
                        }
                    }
                }
            }
            //Only check for ceiling collisions if the player is moving upwards.
            else if (this.vel.y < 0)
            {
                //Calculate the positions of the player's boundaries for the current and last frame. 
                let currPosTL = new Vector2D(this.pos.x - 10, this.pos.y - 10);
                let currPosTR = new Vector2D(this.pos.x + 10, this.pos.y - 10);
                let lastPosTL = new Vector2D(this.lastPos.x - 10, this.lastPos.y - 10);
                let lastPosTR = new Vector2D(this.lastPos.x + 10, this.lastPos.y - 10);

                //If the horizotal velocity is 0, then the collision check process can be simplified.
                if(this.pos.x - this.lastPos.x === 0) {
                    //For every ceiling, check if there is collision.
                    for(let i = 0; i < Platform.currC.length; i++)
                    {
                        //Check for collisions using the player's upper boundary (top-left, top-right).
                        if( Platform.currC[i].colCheckYSimple(currPosTL, lastPosTL, this.vel)
                            ||
                            Platform.currC[i].colCheckYSimple(currPosTR, lastPosTR, this.vel) )
                        {
                            //Call the collision event with the platform that triggered it.
                            this.onTCol(Platform.currC[i].pos);

                            //If a collision has happened, then any other ones won't change anything (for this frame).
                            //Stops the collision check for horizontal platforms until next frame.
                            break horizontalCheck;
                        }
                    } 
                }
                else {
                    //For every ceiling, check if there is collision.
                    for(let i = 0; i < Platform.currC.length; i++)
                    {
                        //Check for collisions using the player's upper boundary (top-left, top-right).
                        if( Platform.currC[i].collisionCheckY(currPosTL, lastPosTL, this.vel)
                            ||
                            Platform.currC[i].collisionCheckY(currPosTR, lastPosTR, this.vel) )
                        {
                            //Call the collision event with the platform that triggered it.
                            this.onTCol(Platform.currC[i].pos);

                            //If a collision has happened, then any other ones won't change anything (for this frame).
                            //Stops the collision check for horizontal platforms until next frame.
                            break horizontalCheck;
                        }
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
                //Calculate the positions of the player's boundaries for the current and last frame. 
                let currPosRT = new Vector2D(this.pos.x + 10, this.pos.y - 10);
                let currPosRB = new Vector2D(this.pos.x + 10, this.pos.y + 10);
                let lastPosRT = new Vector2D(this.lastPos.x + 10, this.lastPos.y - 10);
                let lastPosRB = new Vector2D(this.lastPos.x + 10, this.lastPos.y + 10);

                //If the vertical velocity is 0, then the collision check process can be simplified.
                if(this.pos.y - this.lastPos.y === 0) {
                    //For every right wall, check if there is collision.
                    for(let i = 0; i < Platform.currR.length; i++)
                    {
                        //Check for collisions using the player's right boundary (top-right, bottom-right).
                        if( Platform.currR[i].colCheckXSimple(currPosRT, lastPosRT)
                            ||
                            Platform.currR[i].colCheckXSimple(currPosRB, lastPosRB) )
                        {
                            //Call the collision event with the platform that triggered it.
                            this.onRCol(Platform.currR[i].pos);

                            //If a collision has happened, then any other ones won't change anything (for this frame).
                            //Stops the collision check for horizontal platforms until next frame.
                            break verticalCheck;
                        }
                    }
                }
                else {
                    //For every right wall, check if there is collision.
                    for(let i = 0; i < Platform.currR.length; i++)
                    {
                        //Check for collisions using the player's right boundary (top-right, bottom-right).
                        if( Platform.currR[i].collisionCheckX(currPosRT, lastPosRT)
                            ||
                            Platform.currR[i].collisionCheckX(currPosRB, lastPosRB) )
                        {
                            //Call the collision event with the platform that triggered it.
                            this.onRCol(Platform.currR[i].pos);

                            //If a collision has happened, then any other ones won't change anything (for this frame).
                            //Stops the collision check for horizontal platforms until next frame.
                            break verticalCheck;
                        }
                    }
                }

            }
            //Only check for left wall collision if the player isn't moving right and is moving left.
            else if(this.vel.x < 0)
            {
                //Calculate the positions of the player's boundaries for the current and last frame. 
                let currPosLT = new Vector2D(this.pos.x - 10, this.pos.y - 10);
                let currPosLB = new Vector2D(this.pos.x - 10, this.pos.y + 10);
                let lastPosLT = new Vector2D(this.lastPos.x - 10, this.lastPos.y - 10);
                let lastPosLB = new Vector2D(this.lastPos.x - 10, this.lastPos.y + 10);

                //If the vertical velocity is 0, then the collision check process can be simplified.
                if(this.pos.y - this.lastPos.y === 0) {
                    //For every left wall, check if there is collision.
                    for(let i = 0; i < Platform.currL.length; i++)
                    {
                        //Check for collisions using the player's right boundary (top-left, bottom-left).
                        if( Platform.currL[i].colCheckXSimple(currPosLT, lastPosLT)
                            ||
                            Platform.currL[i].colCheckXSimple(currPosLB, lastPosLB) )
                        {
                            //Call the collision event with the platform that triggered it.
                            this.onLCol(Platform.currL[i].pos);

                            //If a collision has happened, then any other ones won't change anything (for this frame).
                            //Stops the collision check for horizontal platforms until next frame.
                            break verticalCheck;
                        }
                    }
                }
                else {
                    //For every left wall, check if there is collision.
                    for(let i = 0; i < Platform.currL.length; i++)
                    {
                        //Check for collisions using the player's right boundary (top-left, bottom-left).
                        if( Platform.currL[i].collisionCheckX(currPosLT, lastPosLT)
                            ||
                            Platform.currL[i].collisionCheckX(currPosLB, lastPosLB) )
                        {
                            //Call the collision event with the platform that triggered it.
                            this.onLCol(Platform.currL[i].pos);

                            //If a collision has happened, then any other ones won't change anything (for this frame).
                            //Stops the collision check for horizontal platforms until next frame.
                            break verticalCheck;
                        }
                    }
                }

            }
            //If the player has no vertical velocity, no check will be made.
        }

        //#endregion
    

        //Makes the camera slightly ahead of the player when it is moving.
        camera.offset.Add(this.vel.Scale(0.20));

        //Makes the camera view shifted towards where the player is facing.
        if(this.oritentation) { camera.offset.x += 2.5; }
        else { camera.offset.x -= 2.5; }

        //Makes the camera return back to a centered view when there's no input (still will be offset form the player orientation).
        if(camera.offset.x !== 0) { camera.offset.x = misc.moveTowards(camera.offset.x, 0, 0.05 * camera.offset.x); }
        if(camera.offset.y !== 0) { camera.offset.y = misc.moveTowards(camera.offset.y, 0, 0.05 * camera.offset.y); }


        //INPUTS

        //If directional inputs are pressed, add to the player's velocity in the appropriate direction.

        //If the up input is pressed, add velocity to upwards.
        if(keyIsDown(settings.input.up)) 
        { 
            this.dir.y--;
        }
        
        //If the down input is pressed, add velocity downwards.
        if(keyIsDown(settings.input.down)) 
        {
            this.dir.y++;
            this.velAdd.y++;
        }

        //If the left input is pressed, set desired direction and add velocity to the left.
        if(keyIsDown(settings.input.left)) 
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
        
        //If the right input is pressed, set desired direction and add velocity to the right.
        if(keyIsDown(settings.input.right)) 
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

        //If the jump input is pressed, either make the player jump or lenghten thier air-time.
        if(keyIsDown(settings.input.jump)) 
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

            //If the player is ascending or starting to descend, reduce gravity.
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

        //If the dash input is pressed and the player's dash is available, give a burst of speed in dir's direction.
        if(keyIsDown(settings.input.dash) && this.dash && this.dashTimer <= 0) 
        {
            //Consider the dash as being used.
            this.dash = false;

            //Puts some time before the dash can be used again.
            this.dashTimer = 25;

            //Add roughly 71 (magnitude) times the desired direction as velocity to the player.
            this.vel.x = 40 * this.dir.x;
            this.vel.y = 40 * this.dir.y - 10; //The -10 makes it so that horizontal dashes have a bit of 'lift'.

            //Snap the screen away from where the player is dashing.
            camera.offset.Add(this.dir.Scale(20));
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

    

    /**
     * Draw the player character as a black circle with a white outline whose thickness 'beats' with the music.
     */
    display() {
        push(); //We don't want to keep these drawing settings.

        //Makes the stroke white, its thickness dependent on the amplitude level.
        strokeWeight(2 + music.ampCurrent * 5);
        stroke(100);

        //Make the player circle's fill dependent on the dash cooldown. Also add 40 to the brightness
        //if the dashTimer is over 0 to have a more noticeable switch when the dash is avaiable again.
        fill(0 + 2 * Player.dashTimer + 40 * (Player.dashTimer > 0));

        //Draw the player circle around the center of the screen (affected by the camera offset).
        circle((width / 2) - camera.offset.x, (height / 1.5) - camera.offset.y, 10);

        //Revert to the previous drawing settings.
        pop();
    },



    //#region Collision events

    /** Event to execute when the player collides with a ground platform. */
    onGCol(platformPos) {
        //Anchor the player to the ground.
        this.pos.y = platformPos - 10;
        //Remove any vertical velocity.
        this.vel.y = 0.1;
        //Switch the player's state and last state to grounded.
        this.state = 1;
        this.lastState = 1;
        //Activate the last state's timer.
        this.lastStateTimer = 5;
        //Recharge the player's dash.
        this.dash = true;
    },

    /** Event to execute when the player collides with a ceilling platform. */
    onTCol(platformPos) {
        //Bring the player back to where they collided with the ceiling.
        this.pos.y = platformPos + 10;
        //Remove and vertical velocity.
        this.vel.y = 0;
    },

    /** Event to execute when the player collides with a left wall platform. */
    onLCol(platformPos) {
        //Anchor the player to the wall.
        this.pos.x = platformPos + 10;
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
    },

    /** Event to execute when the player collides with a right wall platform. */
    onRCol(platformPos) {
        //Anchor the player to the wall.
        this.pos.x = platformPos - 10;
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
    }

    //#endregion
}