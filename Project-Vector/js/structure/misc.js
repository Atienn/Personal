/**
 * Objects which holds various methods that are too general to be placed anywhere else.
 */
let misc = {

    /** Function specifying doing nothing. */
    //Used for enities whose events shouldn't trigger anything.
    none() { },

    /** Function that only returns false. */
    //Used for entities that shouldn't check for overlap.
    noCheck() {
        return false;
    },

    /**
     * Shifts 'current' towards 'target' at a rate of 'change' making sure not to go over it.
     * @param {Number} current - the current value.
     * @param {Number} target - the target value.
     * @param {Number} change - the rate at which 'current' moves to 'target'.
     */
    moveTowards(current, target, change) {
        let isBigger;   //Tracks if the input is larger than the target.

        //If the input is larger than the target, than set 'isBigger' appropriately and remove 'change' from 'current'.
        if (current > target) {
            isBigger = true;
            //Remove 'change' from current, disregarding if it's positive or not.
            current -= Math.abs(change);
        }
        //If the input is smaller than the target, than set 'isBigger' appropriately and add 'change' to 'current'.
        else if (current < target) {
            isBigger = false;
            //Add 'change' to current, disregarding if it's positive or not.
            current += Math.abs(change);
        }

        //Corrects the values of 'current' if it moved past 'target'.
        //If 'target' was bigger and now isn't, then we've passed it.
        //If 'target' was smaller and now isn't, then we've passed it.
        if ((isBigger && current < target) || (!isBigger && current > target)) {
            //Corrects the value of 'current' (we wanted to stop at 'target').
            current = target;
        }

        //Return the modified value.
        return current;
    },


    /**
     * Ups the value of 'hueChange' by the specified amount making sure to keep it within its 0-360 range.
     * @param {Number} value - The amount to add to 'hueChange'.
     */
    changeHue(value) {
        //Increase the hue by the specified amount
        hueChange += value;

        //If the hue is at or over its max value (360), remove 360 to make it loop back.
        if (hueChange >= 360) { hueChange -= 360; }
    },

    /**
     * Returns if a position is exactly onto a bounded line.
     */
    lineCheck(p1, p2, cen, l1, l2) {
        return (
            p1 == cen &&
            p2 >= l1 &&
            p2 <= l2
        );
    },

    /**
     * Returns if a given position is within a rectangular area.
     * @param pos {Vector2D} - The position to verify.
     * @param cen {Vector2D} - The center of the rectangle.
     * @param w {Number} - The width of the rectangle.
     * @param h {Height} - The height of the rectangle.
     */
    rectCheck(pos, cen, w, h) {
        return (
            pos.x >= cen.x - w &&
            pos.x <= cen.x + w &&
            pos.y >= cen.y - h &&
            pos.y <= cen.y + h
        );
    },

    rectCheckCorner(pos, x1, x2, y1, y2) {
        return (
            pos.x >= x1 &&
            pos.x <= x2 &&
            pos.y >= y1 &&
            pos.y <= y2
        );
    },

    /**
     * Returns if a given position is within a circular area.
     * @param pos {Vector2D} - The position to verify.
     * @param cen {Vector2D} - The center of the circle.
     * @param rad {Number} - The radius of the circle.
     */
    circleCheck(pos, cen, rad) {
        return (dist(cen.x, cen.y, pos.x, pos.y) < rad);
    }
}