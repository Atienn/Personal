/**
 * Game object which occupies some or no space.
 * Runs its 'event' function if 'check' returns true.
 */
class Entity { 
    
    //Complex, but ultra modular constructor.
    //Subclasses that automatically fill out part of it may be implemented later.
    /**
     * Game object which occupies some or no space.
     * Runs its 'event' function if 'check' returns true.
     * 
     * @param {Vector2D} position - The position (x, y) of the entity.
     * @param {Number} width - The width (x) of the entity's collider.
     * @param {Number} height - (Optional) The height (y) of the entity's collider. Defaults to width.
     * @param {Function} display - (Optional) The function used to display the entity.
     * @param {Function} check - The function to check every frame to determine if the entity event should trigger. Ex: check if a given position overlaps this entity's 'collider'.
     * @param {Function} event - The function to run if 'check' returns true.
     * @param {any} modifier - (Optional) The value to specify the exact behaviour of the entity. (Ex: the speed to add or the text to display.) The type of this value is assumed to match what the entity type expects it to be.

     */
    constructor(position, width, height = width, display, check, event, modifier = null) {
        //Position.
        this.pos = position;

        //Width and height of the 'collider'.
        this.w = width;
        this.h = height;

        //The method to display the entity.
        this.display = display;

        //The function to check if there is overlap (dictates the shape of the check)
        //and the function to execute if there is overlap.
        this.check = check;
        this.event = event;

        //Value that will specify the exact behaviour of the entity. For example, for a teleport effect,
        //it would be a Vector2D specifying which position to teleport to.
        this.mod = modifier;
    }

    /** Holds all of the entities present in the current game state. */
    static current = [];

    /** 
     * Checks is a given target satisfies the check of all entities 
     * and potentially trigger each's 'event' method. 
     * 
     * @param target {Object} - The target to check against.
     * @param entities {Array} - The array of entities to check.
     */
    static checkAll(target, entities) {
        entities.forEach(entity => {
            if(entity.check(target)) {
                entity.event(target);
            }
        });
    }

    /** 
     * Displays all of the current entities.
     * @param entities {Array} - The array of entities to display.
     */
    static displayAll(entities) {
        //Push & pop between each display as not to carry over residue display settings.
        entities.forEach(entity => {
            push();
            entity.display();
            pop();
        });
    }


    //#region CHECK

    /** Horizontal linear overlap check. */
    static lineCheckX(target) {
        return misc.lineCheck(target.pos.y, target.pos.x, this.pos.y, this.pos.x - this.w, this.pos.x + this.w);
    }

    /** Vertical linear overlap check. */
    static lineCheckY(target) {
        return misc.lineCheck(target.pos.x, target.pos.y, this.pos.x, this.pos.y - this.h, this.pos.y + this.h);
    }


    /** Rectangular overlap check. */
    static rectCheck(target) {
        return misc.rectCheck(target.pos, this.pos, this.w, this.h);
    }

    /** Circular overlap check. */
    static circleCheck(target) {
        return misc.circleCheck(target.pos, this.pos, this.w);
    }


    //#endregion


    //#region EVENT

    /** Adds velocity to the specified target. */
    static knockback(target) {
        //Refresh dash contact is considered as ground / wall.
        Entity.dashRefresh(target);
        //Add to velocity.
        target.vel.Add(this.mod);
    }

    /** Teleports a specified target to a certain location. */
    static teleport(target) {
        //Refresh the dash since the target is 'reset' to a new position.
        Entity.dashRefresh(target);
        //Set the position.
        target.pos.Get(this.mod);
        //Remove any leftover velocity.
        target.vel = Vector2D.Zero();

        //Set the global dim to half.
        dim = 50;
    }

    /** Refreshes the target's dash. */
    static dashRefresh(target) {
        target.dash = true;
    }

    /** Ends the level. */
    static levelClear() {
        GameState.cleared = true;
        GameState.playing = false;
        GameState.scoreCheck();
    }

    //#endregion


    //#region DISPLAY
    
    /** Displays two red triangles pointing upwards, one wider, one taller. */
    static redTrianglesU() {
        //Black outline.
        stroke(0);
        strokeWeight(2);
        //Bright red fill.
        fill(0, 100, 100);

        let base = this.pos.y + this.h;

        //Wide triangle. Beats to the music.
        triangle(this.pos.x - this.w, base, this.pos.x + this.w, base, this.pos.x, base - (this.h + music.ampCurrent*10));
        //Tall triangle. Beats to the music.
        triangle(this.pos.x - this.w / 2, base, this.pos.x + this.w / 2, base, this.pos.x, base - (this.h + music.ampCurrent*10) * 1.5);
    }

    /** Displays two red triangles pointing down, one wider, one taller. */
    static redTrianglesD() {
        //Black outline.
        stroke(0);
        strokeWeight(2);
        //Bright red fill.
        fill(0, 100, 100);

        let base = this.pos.y - this.h;

        //Wide triangle. Beats to the music.
        triangle(this.pos.x - this.w, base, this.pos.x + this.w, base, this.pos.x, base + (this.h + music.ampCurrent*10));
        //Tall triangle. Beats to the music.
        triangle(this.pos.x - this.w / 2, base, this.pos.x + this.w / 2, base, this.pos.x, base + (this.h + music.ampCurrent*10) * 1.5);
    }

    /** Displays two red triangles pointing left, one wider, one taller. */
    static redTrianglesL() {
        //Black outline.
        stroke(0);
        strokeWeight(2);
        //Bright red fill.
        fill(0, 100, 100);

        let base = this.pos.x + this.w;

        //Wide triangle. Beats to the music.
        triangle(base, this.pos.y - this.h, base, this.pos.y + this.h, base - (this.w + music.ampCurrent*10), this.pos.y);
        //Tall triangle. Beats to the music.
        triangle(base, this.pos.y - this.h / 2, base, this.pos.y + this.h / 2, base - (this.w + music.ampCurrent*10) * 1.5, this.pos.y);
    }

    /** Displays two red triangles pointing right, one wider, one taller. */
    static redTrianglesR() {
        //Black outline.
        stroke(0);
        strokeWeight(2);
        //Bright red fill.
        fill(0, 100, 100);

        let base = this.pos.x - this.w;

        //Wide triangle. Beats to the music.
        triangle(base, this.pos.y - this.h, base, this.pos.y + this.h, base + (this.w + music.ampCurrent*10), this.pos.y);
        //Tall triangle. Beats to the music.
        triangle(base, this.pos.y - this.h / 2, base, this.pos.y + this.h / 2, base + (this.w + music.ampCurrent*10) * 1.5, this.pos.y);
    }



    /** Displays an orange rectangle with a shaded lower part. */
    static orangeRects() {
        //Black outline.
        stroke(0);
        strokeWeight(2);
        //Bright orange fill.
        fill(30, 100, 100);

        //Rectangle.
        rect(this.pos.x, this.pos.y, this.w, this.h);

        //No outline.
        noStroke();
        //Darker orange (brownish).
        fill(30, 100, 75);
        //Shade rectangle.
        rect(this.pos.x, this.pos.y + this.h * 0.5, this.w - 1, this.h * 0.5);
    }

    /** Displays stacking cyan rectangles of decreasing width and increasing brightness. */
    static cyanRectStack() {
        //Black outline.
        stroke(0);
        strokeWeight(2);
        
        //Dark cyan fill for widest rectangle.
        fill(180, 100, 45);
        //Bottom-layer rectangle.
        rect(this.pos.x, this.pos.y, this.w, this.h);

        //No outline.
        noStroke();
        //Draw 4 rectangle, each one thinner and lighter than the last.
        for(let i = 0; i < 3; i++) {
            //Increasingly bright fill.
            fill(180, 100, 60 + 15*i);
            //Increasingly thin rectangle. Beats to the music.
            rect(this.pos.x, this.pos.y, this.w * (1-0.33*i) - music.ampCurrent * 5, this.h);
        }
    }

    /** Draws white text within an invisible box. */
    static textBox() {
        //Black outline (for the text).
        stroke(0);
        strokeWeight(2);
        //Text size & alignment.
        textSize(20);
        textAlign(CENTER);

        //For some reason, setting rectMode to RADIUS makes text bounding boxes
        //act as if they're in rectMode CORNER. So we manually need to work around this.
        rectMode(CENTER);

        //Text within a bounding box.
        text(this.mod, this.pos.x, this.pos.y, this.w * 2, this.h * 2);
    }



//TO TRY
//Couldn't you just rely on object reference to track your changes?

    /** 
     * Draws white text within a text box.
     * Works just like whiteTextBox(), but calls a method to get
     * the text to display as to be able to track changes. 
     */
    static dynamicTextBox() {
        //Black outline.
        stroke(0);
        strokeWeight(2);
        //Text size & alignment.
        textSize(20);
        textAlign(CENTER);

        //For some reason, setting rectMode to RADIUS makes text bounding boxes
        //act as if they're in rectMode CORNER. So we manually need to work around this.
        rectMode(CENTER);

        //Text within a bounding box.
        text(this.mod(), this.pos.x, this.pos.y, this.w * 2, this.h * 2);
    }

    //#endregion
}


/**
 * Game object which occupies some or no space.
 * Runs its 'event' function if 'check' returns true.
 * Can be in either active or inactive state.
 */
class StateEntity extends Entity {
    /**
     * Game object which occupies some or no space.
     * Runs its 'event' function if 'check' returns true.
     * Can be in either active or inactive state.
     * 
     * @param {Vector2D} position - The position (x, y) of the entity.
     * @param {Number} width - The widrh (x) of the entity's collider.
     * @param {Number} height - (Optional) The height (y) of the entity's collider. Defaults to width.
     * @param {Function} display - (Optional) The function used to display the entity.
     * @param {Function} check - The function to check every frame to determine if the entity event should trigger. Ex: check if a given position overlaps this entity's 'collider'.
     * @param {Function} event - The function to run if there is overlap.
     * @param {any} modifier - (Optional) The value to specify the exact behaviour of the entity. Ex: the speed to add or the text to display.
     * @param {any} stateType - (Optional) The type of states the entity can have (either boolean or number).
     * The type of this value is assumed to match what the entity type expects it to be.
     */
    constructor(position, width, height = width, display, check, event, modifier = null) {

        //Create the entity.
        super(position, width, height, display, check, event, modifier);

        //Start the entity as inactive.
        this.state = false;
    }


    //#region CHECK

    /** 
     * Rectangular overlap check.
     * Continously updates the state value.
     */
    static rectCheckHold(target) {
        this.state = misc.rectCheck(target.pos, this.pos, this.w, this.h);
        return this.state;
    }

    /** 
     * Rectangular overlap check.
     * Only returns true on the first frame of overlap.
     * (state will still remain true.)
     */
    static rectCheckOnce(target) {
        //If not yet activated overlap.
        if(!this.state && misc.rectCheck(target.pos, this.pos, this.w, this.h)) {
            //Set the state and return true.
            this.state = true;
            return this.state;
        }
        //Otherwise, return false.
        else {
            return false;
        }
    }

    /**
     * Rectangular active overlap check.
     * Only returns true if there is overlap AND the entity is active.
     */
    static rectCheckActive(target) {
        return this.state && misc.rectCheck(target.pos, this.pos, this.w, this.h);
    }

    /** 
     * Circular overlap check.
     * Continously updates the state value.
     */
    static circleCheckHold(target) {
        this.state = misc.circleCheck(target.pos, this.pos, this.w);
        return this.state;
    }
    
    //#endregion


    //#region DISPLAY

    /** Displays a large black button with white outline and large white text. */
    static menuButton() {
        //Draw the 'body' of the button (black or light grey if the mouse if hovering over it) with a white outline.
        stroke(100);
        strokeWeight(5);
        fill(this.state ? 25 : 0);
        rect(this.pos.x, this.pos.y, this.w, this.h);

        //Write white text inside the button.
        noStroke();
        fill(100);
        //For some reason, setting rectMode to RADIUS makes text bounding boxes
        //act as if they're in rectMode CORNER. So we manually need to work around this.
        rectMode(CENTER);
        textSize(50);
        text(this.mod, 52.5, this.pos.y);
    }

    /** Displays a black button with small white text. */
    static textButton() {
        //Draw the 'body' of the button (black or light grey if the mouse if hovering over it).
        fill(this.state ? 25 : 0);
        rect(this.pos.x, this.pos.y, this.w, this.h);

        //Write white text inside the button.
        fill(100);
        //For some reason, setting rectMode to RADIUS makes text bounding boxes
        //act as if they're in rectMode CORNER. So we manually need to work around this.
        rectMode(CENTER);
        textSize(this.h * 1.5);
        textAlign(CENTER, BASELINE);
        text(this.mod, this.pos.x, this.pos.y + this.h / 2);
    }

    /** Displays a black button with white text and underline. */
    static levelButton() {
        //Draw a thin line at the bottom of the button.
        stroke(100);
        strokeWeight(2);
        line(this.pos.x - this.w, this.pos.y + this.h, this.pos.x + this.w, this.pos.y + this.h);
        
        //Draw the 'body' of the button (black or light grey if the mouse if hovering over it).
        noStroke();
        fill(this.state ? 25 : 0);
        rect(this.pos.x, this.pos.y, this.w, this.h);

        //Write white text inside the button.
        fill(100);
        //For some reason, setting rectMode to RADIUS makes text bounding boxes
        //act as if they're in rectMode CORNER. So we manually need to work around this.
        rectMode(CENTER);
        textSize(this.h * 1.5);
        textAlign(LEFT, BASELINE);
        text(this.mod.name, (this.pos.x - 0.8 * this.w), this.pos.y + this.h / 2);
        
        //If the level has a defined clear time, show it on the right.
        if(this.mod.time != null) {
            textAlign(RIGHT, BASELINE);
            text("TIME: " + this.mod.time, (this.pos.x + 0.95 * this.w), this.pos.y + this.h / 2);
        }
    }

    /** Displays a black button with an white triangle pointing up or down. */
    static arrowButton() {
        //Draw the 'body' of the button (black or light grey if the mouse if hovering over it).
        fill(this.state ? 25 : 0);
        rect(this.pos.x, this.pos.y, this.w, this.h);
        //White fill.
        fill(100);
        //Since they're used a lot below, save the half of the width and height instead of re-calculating them.
        let halfWidth = this.w / 2;
        let halfHeight = this.h / 2;

        //Up arrow.
        if(this.mod) {
            triangle(
                this.pos.x, this.pos.y - halfHeight,
                this.pos.x - halfWidth, this.pos.y + halfHeight,
                this.pos.x + halfWidth, this.pos.y + halfHeight
            );
        }
        //Down arrow.
        else {
            triangle(
                this.pos.x, this.pos.y + halfHeight,
                this.pos.x - halfWidth, this.pos.y - halfHeight,
                this.pos.x + halfWidth, this.pos.y - halfHeight
            );
        }
    }

    /**
     * Displays a small yellow circle with a wider arc around it.
     * Dimmer if it is acive.
     */
    static yellowCircles() {
        //No fill (transparent shapes).
        noFill();

        //Draw outer black arc. Beats to the music.
        stroke(0);
        strokeWeight(this.h);
        circle(this.pos.x, this.pos.y, this.w - 10 - music.ampCurrent * 5);

        //Draw an inner yellow arc (dimmer if active). Beats to the music.
        stroke(60, 100, this.state ? 50 : 100);
        circle(this.pos.x, this.pos.y, this.w - 12 - music.ampCurrent * 5);
    
        //Black outline.
        stroke(0);
        strokeWeight(2);
        //Bright yellow fill (dimmer if active).
        fill(60, 100, this.state ? 50 : 100);
        //Small circle.
        circle(this.pos.x, this.pos.y, this.w * 0.2);
    }

    /** 
     * Draws a simple green square with rounded corners.
     * Dimmer if it is active.
     */
    static greenSqr() {
        //Black outline.
        stroke(0);
        strokeWeight(2);

        //Bright green fill (dimmer if active).
        fill(120, 100, this.state ? 50 : 100);
        //Square with rounded corners, beats to the music.
        square(this.pos.x, this.pos.y, this.w * 0.5 - music.ampCurrent * 5, this.w * 0.25);
    }

    /**
     * Displays stacking cyan rectangles of decreasing width and increasing brightness.
     * Dimmer if inactive.
     */
    static cyanRectStackActive() {
        //Black outline.
        stroke(0);
        strokeWeight(2);

        //Dark cyan fill for widest rectangle.
        fill(180, 100, 45);
        //Bottom-layer rectangle.
        rect(this.pos.x, this.pos.y, this.w, this.h);

        //No outline.
        noStroke();
        //Draw 4 rectangle, each one thinner and lighter than the last.
        for(let i = 0; i < 3; i++) {
            //Increasingly bright fill.
            fill(180, 100, 10 + 50*this.state + 15*i);
            //Increasingly thin rectangle. Beats to the music.
            rect(this.pos.x, this.pos.y, this.w * (1-0.33*i) - music.ampCurrent * 5, this.h);
        }
    }

    //#endregion
}


/**
 * Game object which occupies some or no space.
 * Runs its 'event' function if 'check' returns true.
 * Can be in either active or inactive state.
 * Holds a label to be easily targeted within an array of entities.
 */
class LabeledEntity extends StateEntity {
    /**
     * Game object which occupies some or no space.
     * Runs its 'event' function if 'check' returns true.
     * Can be in either active or inactive state.
     * Holds a label to be easily targeted within an array of entities.
     * 
     * @param {Vector2D} position - The position (x, y) of the entity.
     * @param {Number} width - The widrh (x) of the entity's collider.
     * @param {Number} height - (Optional) The height (y) of the entity's collider. Defaults to width.
     * @param {Function} display - (Optional) The function used to display the entity.
     * @param {Function} check - The function to check every frame to determine if the entity event should trigger. Ex: check if a given position overlaps this entity's 'collider'.
     * @param {Function} event - The function to run if there is overlap.
     * @param {any} modifier - (Optional) The value to specify the exact behaviour of the entity. Ex: the speed to add or the text to display.
     * @param {any} stateType - (Optional) The type of states the entity can have (either boolean or number).
     * The type of this value is assumed to match what the entity type expects it to be.
     * @param {any} label - (Optional) The "type" of the entity. Only used when trying to target specific groups of entities within an array.
     */
    constructor(position, width, height = width, display, check, event, modifier = null, label = null) {

        //Create the entity.
        super(position, width, height, display, check, event, modifier);

        //Used to only target specific groups of entities within an array.
        this.label = label;
    }


    //#region EVENT

    /** Runs the mofifier function of the entity if all other entities with the same label are also active. */
    static groupCheck() {

        //Tracks if all entities are active or not.
        //Assume that all entities are active.
        let allActive = true;

        //Loop through all entities, only considering the ones with the same label.
        for (let i = 0; i < Entity.current.length; i++) {
            if(Entity.current[i].label === this.label) {
                //If inacitve correct the assumption and break out of the loop.
                if(!Entity.current[i].state) {
                    allActive = false;
                    break;
                }
            }            
        }
        //If all were active, run the method.
        if(allActive) {
            this.mod();
        }
    }

    //Finds the goal in the Entity.current array and activates it.
    static activateGoal() {
        for (let i = 0; i < Entity.current.length; i++) {
            if(Entity.current[i].label === GOAL) {
                Entity.current[i].state = true;
                break;
            }
        }
    }

    //#endregion
}