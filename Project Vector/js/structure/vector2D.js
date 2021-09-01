/**
 * 2-dimensional (x,y) vector.
 * @property {Number} x - The x coordinate of the vector.
 * @property {Number} y - The y coordinate of the vector.
 */
//Highly inspired by UnityEngine's Vector2.
class Vector2D {
    /**
     * Creates a 2D vector. 
     * @param {Number} x - The x coordinate of the vector.
     * @param {Number} y - The y coordinate of the vector.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Returns a new zero vector (0,0).
     */
    static Zero() {
        return new Vector2D(0, 0);
    }

    /**
     * Returns the magnitude (numerical length) of the vector.
     */
    Magnitude() {
        //Calculate the hypotenuse and return it.
        return Math.hypot(this.x, this.y);
    }

    /** 
     * Returns the vector with a magnitude of 1 (if possible). Otherwise returns the zero vector.
     */
    Normalized() {
        //Calculate the magnitude of the non-normalized vector.
        let magnitude = this.Magnitude();

        //If the magnitude is 0, then the vector was the zero vector (we also don't want to divide by 0).
        if (magnitude !== 0) {
            //Return the normalized vector (each component is divided by the magnitude).
            return new Vector2D(this.x / magnitude, this.y / magnitude);
        }
        else {
            //Return the zero vector.
            return Vector2D.Zero();
        }
    }

    /**
     * Assigns the values of an input vector onto this one.
     * (Does the same function that an '=' operator would.)
     * @param {Vector2D} newValues - The vector holding the new values to assign.
     */
    Get(newValues) {
        //Assign the x and y values individually.
        this.x = newValues.x;
        this.y = newValues.y;
    }


    /**
     * Assigns new coordinates to the vector.
     * (Similar to Get(), but doesn't require creating a new object.)
     * @param newX {Number} - The new x coordinate of the vector.
     * @param newY {Number} - The new y coordinate of the vector.
     */
    Set(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

    /**
     * Adds the values of an input vector onto this one.
     * (Does the same function that a '+=' operator would.)
     * @param {Vector2D} newValues - The vector holding the new values to add.
     */
    Add(newValues) {
        //Add the x and y values onto the ones in the vector.
        this.x += newValues.x;
        this.y += newValues.y;
    }

    /**
     * Multiplies each component of the vector.
     * @param {number} scalingFactor The amount to scale the vector.
     */
    Scale(scalingFactor) {
        return new Vector2D(this.x * scalingFactor, this.y * scalingFactor);
    }

    /* Prints the Vector as a formatted string. */
    toString() {
        return `(${this.x.toFixed()}, ${this.y.toFixed()})`;
    }
}
