class BGBlock { 
    
    //Complex, but ultra modular constructor.
    //Subclasses that automatically fill out part of it may be implemented later.
    /**
     * Game object which occupies some or no space.
     * Runs its 'event' function if 'check' returns true.
     * 
     * @param {Vector2D} position - The position (x, y) of the entity.
     * @param {Number} width - The widrh (x) of the entity's collider.
     * @param {Number} height - (Optional) The height (y) of the entity's collider. Defaults to width.

     */
    constructor(startX, endX, startY, endY) {
        //Position.
        this.x1 = startX;
        this.x2 = endX;

        this.y1 = startY;
        this.y2 = endY;
    }

    /** Holds all of the entities present in the current game state. */
    static current = [];

    static displayAll() {
        push();

        BGBlock.displayOptions();
        
        //Draw by corners (since writing each background block with that format is much easier)
        rectMode(CORNERS);

        this.current.forEach(bg => {
            rect(bg.x1, bg.y1, bg.x2, bg.y2);
        });
        pop();
    }

    //Bright blocks, dark outlines.
    static displayBright() {
        fill(hueChange, 100, 75 - dim);
        stroke(0);
        strokeWeight(2);
    }

    //Dark blocks, bright outlines.
    static displayDark() {
        fill(0);
        stroke(hueChange, 100, 75 - 1.5 * dim);
        strokeWeight(2);
    }

    //
    static displayOptions = this.displayBright;

    static cycleOptions() {
        switch(this.displayOptions) {
            case this.displayBright:
                this.displayOptions = this.displayDark;
            break;

            case this.displayDark:
                this.displayOptions = this.displayBright;
            break;

            default:
                this.displayOptions = this.displayBright;
            break;
        }
    }
}

//Dev mode
//Cycle display options when pressing 'Q'.
window.onkeydown = (event) => {
    if(event.keyCode == 81) {
        BGBlock.cycleOptions();
    }
}