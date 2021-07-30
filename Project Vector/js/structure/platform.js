
/**
 * Represents platforms that the player can't pass though.
 * This includes grounds, walls and ceilings.
 */
class Platform {
    /**
     * @param {Number} position - The position of the platform over the axis it's perpendicular to.
     * @param {Number} limitLow - Lower limit of the platform over the axis it's parallel to.
     * @param {Number} limitHigh - Upper limit of the platform over the axis it's parallel to.
     */
    constructor(position, limitLow, limitHigh) {
        this.pos = position;
        this.low = limitLow;
        this.upp = limitHigh;
    }

    //These hold each type of platform while of a level when playing.
    static currG = [];
    static currC = [];
    static currL = [];
    static currR = [];


    //#region Collisions

    /**
     * Checks if an entity has collided with the platform using its current and last position.
     * This method works well as long as the entity's has non-zero vertical (y) movement.
     * 
     * The method considers a line between the player's current and last position.
     * Using that line and the platform's, the method calculates the intersection between the two and checks
     * if it is part of both lines (it checks if the solution to the system of equations is within the boundaries).
     * 
     * @param {Vector2D} cPos - The entity's current position.
     * @param {Vector2D} lPos - The entity's position one frame ago.
     * @returns {Boolean} - If there was a collision.
     */
    collisionCheckX(cPos, lPos) {
        //The y component of the intersection (solution) is found by calculating the equation 
        //for a line (y = m(x - h) + k) and substituting the x value of the platform into it.
        //m, the line's slope, is given by:  m = (y2 - y1) / (x2 - x1)
        let sol = (((cPos.y - lPos.y) / (cPos.x - lPos.x)) * (this.pos - cPos.x)) + cPos.y;

        //If the intersection is between the y1 and y2 AND between the platform's limits, then there is a collision.
        //Could be written as 2 separate statements: (Math.min(p2.y, p1.y) <= sol && sol <= Math.max(p2.y,p1.y)) && (this.c1 <= sol && sol <= this.c2)
        return (Math.max(Math.min(cPos.y, lPos.y), this.low) <= sol && sol <= Math.min(Math.max(cPos.y, lPos.y), this.upp));
    }

    /**
     * Checks if an entity has collided with the platform using its current and last position.
     * This method works well as long as the entity's has non-zero horizontal (x) movement.
     * 
     * The method considers a line between the player's current and last position.
     * Using that line and the platform's, the method calculates the intersection between the two and checks
     * if it is part of both lines (it checks if the solution to the system of equations is within the boundaries).
     * 
     * Returns true on collision and false if none are detected.
     * 
     * @param {Vector2D} cPos - The entity's current position.
     * @param {Vector2D} lPos - The entity's position one frame ago.
     * @returns {Boolean} - If there was a collision.
     */
    collisionCheckY(cPos, lPos) {
        //The x component of the intersection (solution) is found by calculating the equation 
        //for a line (x = m(y - k) + h) and substituting the y value of the platform into it.
        //m, the line's slope, is given by:  m = (x2 - x1) / (y2 - y1)
        let sol = (((cPos.x - lPos.x) / (cPos.y - lPos.y)) * (this.pos - cPos.y)) + cPos.x;

        //If the intersection is between the y1 and y2 AND between the platform's limits, then there is a collision.
        //Could be written as 2 separate statements: (Math.min(p2.x, p1.x) <= sol && sol <= Math.max(p2.x,p1.x)) && (this.c1 <= sol && sol <= this.c2)
        return (Math.max(Math.min(cPos.x, lPos.x), this.low) <= sol && sol <= Math.min(Math.max(cPos.x, lPos.x), this.upp));
    }

    /**
     * Checks if an entity has collided with the platform using its current and last position.
     * (This method assumes that the entity's vertical (y) velocity is 0.)
     * 
     * @param {Vector2D} cPos - The entity's current position.
     * @param {Vector2D} lPos - The entity's position one frame ago.
     * @returns {Boolean} - If there was a collision.
     */
    colCheckXSimple(cPos, lPos) {
        //If the movement line's y component is between the platform's limits and the platform line's x
        //component is in the movement line's possible x values, then we know that there is a collision.
        //Since the movement line has no slope (because delta = 0), we can just use one point's y component.
        return (this.low <= cPos.y && cPos.y <= this.upp && Math.min(cPos.x, lPos.x) <= this.pos && this.pos <= Math.max(cPos.x, lPos.x));
    }

    /**
     * Checks if an entity has collided with the platform using its current and last position.
     * (This method assumes that the entity's horizontal (x) velocity is 0.)
     * 
     * @param {Vector2D} cPos - The entity's current position.
     * @param {Vector2D} lPos - The entity's position one frame ago.
     * @returns {Boolean} - If there was a collision.
     */
    colCheckYSimple(cPos, lPos) {
        //If the movement line's x component is between the platform's limits and the platform line's y
        //component is between the movement line's possible y values, then we know that there is a collision.
        //Since the movement line has no slope (because delta = 0), we can just use one point's x component.
        return (this.low <= cPos.x && cPos.x <= this.upp && Math.min(cPos.y, lPos.y) <= this.pos && this.pos <= Math.max(cPos.y, lPos.y ));
    }

    //#endregion


    //#region Display

    /**
     * Cycle through all platfrom types and call their 
     * display method which draws them as white lines.
     */
    static displayAll() {
        push(); //We don't want to keep these drawing settings.
        stroke(100); //Make the line white.
        strokeWeight(2); //Make the line thicker.

        //Go through the elements of the ground array and diplay each.
        for (let i = 0; i < this.currG.length; i++) {
            this.currG[i].displayHorizontal();
        }
        //Go through the elements of the ceiling array and diplay each.
        for (let i = 0; i < this.currC.length; i++) {
            this.currC[i].displayHorizontal();
        }
        //Go through the elements of the left wall array and diplay each.
        for (let i = 0; i < this.currL.length; i++) {
            this.currL[i].displayVertical();
        }
        //Go through the elements of the right wall array and diplay each.
        for (let i = 0; i < this.currR.length; i++) {
            this.currR[i].displayVertical();
        }

        //Revert to the previous drawing settings.
        pop();
    }

    /** Draws horizontal platforms as white lines. */
    displayHorizontal() {
        strokeWeight(3);
        //Display a horizontal line at y = value and x is between the limits.            
        line(this.low, this.pos, this.upp, this.pos);
    }

    /** Draws vertical platforms as white lines. */
    displayVertical() {
        strokeWeight(3);
        //Display a vertical line at x = value and y is between the limits.
        line(this.pos, this.low, this.pos, this.upp);
    }

    //#endregion
}