
/**
 * Represents platforms that the player can't pass though.
 * This includes grounds, walls and ceilings.
 */
class Platform
{
    /**
     * @param {Number} position - The position of the platform over the axis it's perpendicular to.
     * @param {Number} limitLow - Lower limit of the platform over the axis it's parallel to.
     * @param {Number} limitHigh - Upper limit of the platform over the axis it's parallel to.
     * @param {Boolean} axis - The orientation of the platform. false: horizontal (parallel to x), true: vertical (parallel to y).
     */
    constructor(position, limitLow, limitHigh, axis)
    {
        this.pos = position;
        this.low = limitLow;
        this.upp = limitHigh;
        this.axis = axis;
    }

/**
 * Creates a line between the player's current and last position using the velocity.
 * Using that line and the platform's, calculates the intersection between the two and checks
 * if it is part of both lines (checks if the solution to the system of equations is within the boundaries).
 * 
 * Returns true on collision and false if none are detected.
 * 
 * @param {Vector2D} cPos - The entity's current position.
 * @param {Vector2D} vel - The entity's velocity.
 */
    collisionCheck(cPos, vel)
    {
        /* The following comments of this funtion refer to certain values with special notation.
       
        y1 = p1.y, y2 = p2.y
        x1 = p1.x, x2 = p2.x

        h = x2, k = y2
        (could also be h = x1, k = y1)
        */

        //Calculate the position that the player had last frame by subtracting the using their velocity.
        var lPos = new Vector2D(cPos.x - vel.x, cPos.y - vel.y);
        
        //If the platform is vertical, calculate the y component of the intersection and verify if it's valid.
        if(this.axis)
        {
            //If the vertical velocity is 0, then the verification process can be simplified.
            if(vel.y === 0)
            {
                //If the movement line's y component is between the platform's limits and the platform
                //line's x component is in the movement line's possible x values, then we know that there is a collision.
                //Since the movement line has no slope (because delta = 0), we can just use one point's y component.
                if(this.low <= cPos.y && cPos.y <= this.upp && Math.min(cPos.x, lPos.x) <= this.pos && this.pos <= Math.max(cPos.x, lPos.x))
                {
                    //Since there is collision, return true.
                    return true;
                }
            }
            //Calculate the y value of intersection between the player's movement line and the platform's line.
            else
            {
                //The y component of the intersection (solution) is found by calculating the equation 
                //for a line (y = m(x - h) + k) and substituting the x value of the platform into it.
                //m, the line's slope, is given by:  m = (y2 - y1) / (x2 - x1)
                var sol = (((cPos.y - lPos.y) / (cPos.x - lPos.x)) * (this.pos - cPos.x)) + cPos.y;
    
                //If the intersection is between the y1 and y2 AND between the platform's limits, then there is a collision.
                //Could be written as 2 separate statements: (Math.min(p2.y, p1.y) <= sol && sol <= Math.max(p2.y,p1.y)) && (this.c1 <= sol && sol <= this.c2)
                if(Math.max(Math.min(cPos.y, lPos.y), this.low) <= sol && sol <= Math.min(Math.max(cPos.y,lPos.y), this.upp))
                {
                    //Since there is collision, return true.
                    return true;
                }
            }
        }

        //If the platform is horizontal, calculate the x component of the intersection and verify if it's valid.
        else
        {
            //If the horizontal velocity is 0, then the verification process can be simplified.
            if(vel.x === 0)
            {
                //If the movement line's x component is between the platform's limits and the platform
                //line's y component is between the movement line's possible y values, then we know that there is a collision.
                //Since the movement line has no slope (because delta = 0), we can just use one point's x component.
                if(this.low <= cPos.x && cPos.x <= this.upp && Math.min(cPos.y, lPos.y) <= this.pos && this.pos <= Math.max(cPos.y, lPos.y))
                {
                    //Since there is collision, return true.
                    return true;
                }
            }
            //Calculate the x value of intersection between the player's movement line and the platform's line.
            else
            {
                //The x component of the intersection (solution) is found by calculating the equation 
                //for a line (x = m(y - k) + h) and substituting the y value of the platform into it.
                //m, the line's slope, is given by:  m = (x2 - x1) / (y2 - y1)
                var sol = (((cPos.x - lPos.x) / (cPos.y - lPos.y)) * (this.pos - cPos.y)) + cPos.x;
    
                //If the intersection is between the y1 and y2 AND between the platform's limits, then there is a collision.
                //Could be written as 2 separate statements: (Math.min(p2.x, p1.x) <= sol && sol <= Math.max(p2.x,p1.x)) && (this.c1 <= sol && sol <= this.c2)
                if(Math.max(Math.min(cPos.x, lPos.x), this.low) <= sol && sol <= Math.min(Math.max(cPos.x,lPos.x), this.upp))
                {
                    //Since there is collision, return true.
                    return true; 
                }
            }
        } 

        //If no return statement, has been reached, then there was no collision.
        //Since there is no collision, return false.
        return false;
    }

    /**
     * Cycle through all platfrom types and call their display function
     * which draws them as white lines.
     */
    static displayAll()
    {
        push(); //We don't want to keep these drawing settings.
        stroke(100); //Make the line white.
        strokeWeight(2); //Make the line thicker.

        //Translates the platfroms to be drawn from the player's perspective.
        translate((width/2) - Player.pos.x - camOffset.x, (height/1.5) - Player.pos.y - camOffset.y);

        //Go through the elements of the ground array and diplay each.
        for(let i = 0; i < this.allG.length; i++)
        {
            this.allG[i].display();
        }
        //Go through the elements of the ceiling array and diplay each.
        for(let i = 0; i < this.allC.length; i++)
        {
            this.allC[i].display();
        }
        //Go through the elements of the left wall array and diplay each.
        for(let i = 0; i < this.allL.length; i++)
        {
            this.allL[i].display();
        }
        //Go through the elements of the right wall array and diplay each.
        for(let i = 0; i < this.allR.length; i++)
        {
            this.allR[i].display();
        }

        //Revert to the previous drawing settings.
        pop();
    }

    /** Draws the platforms as white lines. */
    display()
    {
        //If the platform is veritcal, it's value is refers to the x axis and the limits to the y axis.
        if(this.axis)
        {
            //Display a vertical line at x = value and y is between the limits.
            line(this.pos, this.low, this.pos, this.upp);    
        }
        //If the platform is horizontal, it's value is refers to the y axis and the limits to the x axis.
        else
        {
            //Display a horizontal line at y = value and x is between the limits.            
            line(this.low, this.pos, this.upp, this.pos);
        }
    }

    //#region Arrays

    //In order to prevent some tunneling (passing through walls) bug, the platforms
    //are made slightly longer.

    /** Holds all ground platforms. */
    static allG = 
    [
        new Platform(1600, 25, 1025, false),
        new Platform(1450, 350, 450, false),
        new Platform(1300, 1000, 1200, false),
        new Platform(1400, 1175, 1675, false),
        new Platform(550, 1400, 1525, false),
        new Platform(1000, 975, 1425, false),
        new Platform(900, 75, 1000, false),
        new Platform(300, 225, 325, false),
        new Platform(300, 900, 1800, false)
    ];

    /** Holds all ceiling platforms. */
    static allC = 
    [
        new Platform(1100, 25, 1525, false),
        new Platform(400, 900, 1675, false),
        new Platform(800, 1150, 1275, false),
        new Platform(50, 75, 1800, false),
        new Platform(675, 225, 325, false)
    ];

    /** Holds all left walls. */
    static allL = 
    [
        new Platform(50, 1075, 1625, true),
        new Platform(450, 1450, 1625, true),
        new Platform(1200, 1300, 1425, true),
        new Platform(1525, 550, 1100, true),
        new Platform(1275, 375, 800, true),
        new Platform(1000, 900, 1025, true),
        new Platform(100, 25, 925, true),
        new Platform(325, 300, 675, true)
    ];

    /** Holds all right walls. */
    static allR = 
    [
        new Platform(350, 1450, 1625, true),
        new Platform(1000, 1300, 1625, true),
        new Platform(1650, 375, 1425, true),
        new Platform(1400, 550, 1025, true),
        new Platform(1150, 375, 800, true),
        new Platform(225, 300, 675, true),
        new Platform(900, 300, 400, true),
        new Platform(1775, 25, 325, true)
    ];

    //#endregion
}
