/**
 * Colored block which exist purely for display purposes.
 * Are used to easily tell between areas that are within or outside of bounds.
 */
class BGBlock { 
    /**
     * Colored block which exist purely for display purposes.
     * Are used to easily tell between areas that are within or outside of bounds.
     * @param {Number} startX - Lower x boundary.
     * @param {Number} endX - Upper x boundary.
     * @param {Number} startY - Lower y boundary.
     * @param {Number} endY - Upper y boundary.
     */
    constructor(startX, endX, startY, endY) {
        this.x1 = startX;
        this.x2 = endX;

        this.y1 = startY;
        this.y2 = endY;
    }

    /** Holds all of the blocks present in the current game state. */
    static current = [];

    static displayAll() {
        //Save current drawing settings.
        push();

        //Set the drawing settings of the blocks.
        BGBlock.displayOptions();
        
        //Draw by corners, since writing each background block using that format is much easier.
        rectMode(CORNERS);

        //Draw each block in the 'current' array.
        this.current.forEach(bg => {
            rect(bg.x1, bg.y1, bg.x2, bg.y2);
        });

        //Return to saved drawing settings.
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
        stroke(hueChange, 100, 80 - 1.5 * dim);
        strokeWeight(2);
    }

    //Tracks how the backgronud blocks should be drawn.
    static displayOptions = this.displayBright;

    /** Cycles through the display options of the background blocks.  */
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
// window.onkeydown = (event) => {
//     if(event.keyCode == 81) {
//         BGBlock.cycleOptions();
//     }
// }