"use strict";

/**
 * Box which triggers a special effect when the player enters it.
 */
class TriggerBox
{
    /**
     * Creates a box at the specified position with specified
     * diemnsions which triggers a specified effect when entered.
     * 
     * @param {Number} posX - The x coordinate of the box's center.
     * @param {Number} posY - The y coordinate of the box's center.
     * @param {Number} width - The width of the box.
     * @param {Number} height - The height of the box.
     * @param {Effect} effect - The effect the box will trigger when the player enters it.
     */
    constructor(posX, posY, width, height, effect)
    {
        this.x = posX;
        this.y = posY;

        //Saving half of the width/heigh saves a lot on computation when it comes to 
        //checking if the player is within the bounds of the box and displaying it.
        this.w = width / 2;
        this.h = height / 2;

        this.e = effect;
    }

    /**
     * Checks if a given position is within a given array of triggerboxes instances.
     * If is is trigger the box's effect.
     * @param {Vector2D} pos - The position to verify.
     * @param {TriggerBox[]} boxes - The array of 'TriggerBox instances'
     */
    static isWithinBound(pos, boxes)
    {
        //For each trigger box, trigger the effect if the position is within the box.
        for(let i = 0; i < boxes.length; i++)
        {
            //If the player's center is within the dimensions of the box, trigger the effect.
            if( pos.x >= boxes[i].x - boxes[i].w && 
                pos.x <= boxes[i].x + boxes[i].w &&
                pos.y >= boxes[i].y - boxes[i].h &&
                pos.y <= boxes[i].y + boxes[i].h )
            {
                //Trigger the effect from the subclass.
                boxes[i].e.trigger();
            }
        }
    }

    /**
     * Displays triggerboxes with the color specified from the player's perspective.
     * @param {TriggerBox[]} boxes - The array of triggerboxes to display.
     */
    static displayAll(boxes)
    {
        //We don't want to keep these drawing settings.
        push();

        //Makes drawing more efficient by automatically doubling the width and height of rectangles.
        //Don't do the same for ellipses to make it so that switches have a more generous area than displayed.
        rectMode(RADIUS)

        //Add a thin black outline to differentiate from the background.
        stroke(0);

        //Translates the platfroms to be drawn from the player's perspective.
        translate((width/2) - Player.pos.x - camOffset.x, (height/1.5) - Player.pos.y - camOffset.y);

        //For each triggerbox, draw its effect which depends on its type.
        for(let i = 0; i < boxes.length; i++)
        {
            boxes[i].e.display(boxes[i].x, boxes[i].y, boxes[i].w, boxes[i].h);
        }
        //Revert to the previous drawing settings.
        pop();
    }

    /**
     * Holds all triggerboxes used in the menu.
     * Only contains 'ButtonSelect' effects.
     */
    static allM = 
    [
        new TriggerBox(300, 390, 600, 100, new Button(0)),
        new TriggerBox(300, 515, 600, 100, new Button(1)),
        new TriggerBox(300, 640, 600, 100, new Button(2)),
        new TriggerBox(1270, 527.5, 40, 25, new Button(3)),
        new TriggerBox(1320, 527.5, 40, 25, new Button(4)),
        new TriggerBox(1270, 602.5, 40, 25, new Button(5)),
        new TriggerBox(1320, 602.5, 40, 25, new Button(6))
    ];


    /** Holds the goal triggerbox used in level 1. */
    static G1 =  new TriggerBox(1750, 175, 50, 250, new Goal(true));

    /** Holds all switch-type triggerboxes used in level. */
    static S1 = 
    [
        new TriggerBox(800, 1250, 100, 100, new Switch()),
        new TriggerBox(1100, 550, 100, 100, new Switch()),
        new TriggerBox(165, 325, 100, 100, new Switch()),
        new TriggerBox(385, 325, 100, 100, new Switch())
    ];

    /** Holds all triggerboxes used in level 1. */
    static allL1 = 
    [
        new TriggerBox(1425, 1390, 450, 20, new Teleport(new Vector2D(1100, 1250))),
        new TriggerBox(1200, 990, 400, 20, new Teleport(new Vector2D(1450, 525))),
        TriggerBox.S1[0],
        TriggerBox.S1[1],
        TriggerBox.S1[2],
        TriggerBox.S1[3],
        TriggerBox.G1
    ];

    /** Holds all arrays which hold every triggerbox of a specific level. */
    //Will be more useful once more levels are added.
    static levels = 
    [
        TriggerBox.allL1
    ]
}
