"use strict";

/**
 * Abstract class which allows polymorphism.
 * Effects are triggered by triggerboxes.
 */
class Effect
{
    constructor() {}

    /**
     * Abstract super function which can be overriden by subclasses.
     */
    trigger()
    {
        //Do nothing.    
    }

    /**
     * Abstract super function which can be overriden by subclasses.
     * Display the 'TriggerBox' parent as a box.
     * @param {Number} x - The x coordinate of the parent 'TriggerBox'.
     * @param {Number} y - The y coordinate of the parent 'TriggerBox'.
     * @param {Number} w - The width of the parent 'TriggerBox'.
     * @param {Number} h - The height of the parent 'TriggerBox'.
     */
    display(x, y, w, h)
    {
        //Draw the 'TriggerBox' as a rectangle with it's coordinates and dimensions.
        rect(x,y,w,h);
    }
}

/**
 * Notifies 'MenuState' that the button related to the effect is selected.
 */
class Button extends Effect
{
    /**
     * Creates a new effect that notifies 'MenuState' of which button is currently selected.
     * @param {Vector2D} index - The index of the button specified.

     * 1 - Play
     * 
     * 2 - Settings
     * 
     * 3 - Quit
     */
    constructor(index)
    {
        super();
        this.index = index;
    }

    /**
     * Overrides the super function.
     * Notifies 'MenuState' that the button related button is selected.
     */
    trigger()
    {
        MenuState.selected = this.index;
    }
}

/**
 * Knocks the player back by replacing thier velocity with a specified one.
 */
class KnockBack extends Effect
{
    /**
     * Creates a new knockback effect which knockbacks the player be replacing their velocity with the specified one.
     * @param {Vector2D} velocity - The velocity to replace the player velocity with.
     */
    constructor(velocity)
    {
        super();
        this.knock = velocity;
    }

    /**
     * Overrides the super function.
     * Replaces the player's velocity, knocking the player back.
     */
    trigger()
    {
        //Replace the player's velocity with the effect's specified knockback.
        Player.vel.Get(this.knock);
    }

    /**
     * To be added if implemented.
     */
    display(x, y, w, h)
    {
        //To be added if implemented
    }
}


/**
 * Teleports the player by replacing thier position with a specified one.
 */
class Teleport extends Effect
{
    /**
     * Creates a new teleport effect which teleports the player by replacing thier position with the specified one
     * and by removing their velocity.
     * @param {Vector2D} position - The position to teleport the player to.
     */
    constructor(position)
    {
        super();
        this.pos = position;
    }

    /**
     * Overrides the super function.
     * Replaces the player's position and removes any velocity.
     */
    trigger()
    {
        //Set the player's position to the effect's specified position.
        Player.pos.Get(this.pos);
        
        //Don't carry over any previous velocity.
        Player.vel.x = 0;
        Player.vel.y = 0;

        //Dim the background as the player is teleported.
        PlayingState.dim = 50;
    }

    /**
     * Display the effect as an orange box.
     */
    display(x, y, w, h)
    {
        //Make the box's fill orange.
        fill(30, 100, 100);

        //Draw the 'TriggerBox' as a rectangle with it's coordinates and dimensions.
        super.display(x, y, w, h);
    }
}


/**
 * Represents an object the player must activate by toutching it to reach the goal.
 */
class Switch extends Effect
{
    /**
     * Creates a new object at a specified position that the player must activate to reach the goal.
     */
    constructor()
    {
        super();

        //Tracks if the object has been activated.
        //Assume that the object isn't switched on when created.
        this.active = false;
    }

    /**
     * Overrides the super function.
     * Sets the switch to active.
     */
    trigger()
    {
        //If the switch hasn't been activated yet activate it.
        //This prevents 'tryActivateGoal()' from executing multiple time per switch.
        if(!this.active)
        {
            //Set the 'active' state to true.
            this.active = true;

            //Activate the goal if all switches have been activated.
            PlayingState.tryActivateGoal();
        }
    }

    /**
     * Display the effect as stracking green ellipses.
     */
    display(x, y, w, h)
    {
        //Make the ellipse's fill light green if not active and dark green if it is.
        fill(120, 100, 100 - 60*this.active);
        //Draw the 'TriggerBox' as an ellipse with it's coordinates and dimensions which 'beats' with the music (getting smaller with amplitude).
        ellipse(x, y, w-ampCurrent*5, h-ampCurrent*5);

        //Make the ellipse's fill green if not active and darker green if it is.
        fill(120, 100, 60 - 10*this.active);
        //Draw a sligtly smaller ellipse inside the first that 'beats' with the music (getting bigger with amplitude).
        ellipse(x, y, w-15+ampCurrent*10, h-15+ampCurrent*10);
    }

    /**
     * Resets every Switch instance in the given array to its original state.
     * @param {Switch[]} switches - The array of 'Switch' instances to deactivate.
     */
    static reset(switches)
    {
        //Deactivates every switch.
        for(let i = 0; i < switches.length; i++)
        {
            switches[i].e.active = false;
        }
    }
}


/**
 * Represents an object the player must reach to win.
 */
class Goal extends Effect
{
    /**
     * Creates a new object at a specified position that the player must touch to win.
     */
    constructor()
    {
        super();

        //Assume that switches aren't activated when created.
        this.active = false;
    }

    /**
     * Consider the level cleared if the goal is active.
     */
    trigger()
    {

        //If the goal is active, set the level as cleared and pause the game.
        if(this.active)
        {
            PlayingState.cleared = true; //Consider the level cleared.
            PlayingState.playing = false; //Pause the game.
        }
    }

    /**
     * Display the effect as increasingly thinner stacking teal boxes.
     */
    display(x, y, w, h)
    {
        //Draw 4 boxes, each one thinner, lighter than the last.
        for(let i = 0; i < 4; i++)
        {
            //Make the box's fill darker if it isn't active. Also make it lighter for every box drawn.
            fill(180, 100, 10 +50*this.active + 15*i);

            //Draw the 'TriggerBox' as a rectangle with it's coordinates and dimensions getting thinner every time.
            super.display(x, y, w * (1-0.33*i), h);
        }
    }
}
