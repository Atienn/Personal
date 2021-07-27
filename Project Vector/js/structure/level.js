//ENTITY LABELS
const SWITCH = 's';
const GOAL = 'g';

/**
 * Object representing a game level.
 */
//Going through a level without making any mistake shouldn't be made overly difficult. 
//As a result of this, levels are kept on the shorter side.
class Level {

    /**
     * @param title {String} - The level's title.
     * @param startPosition {Vector2D} - The player's starting position.
     * @param objective {String} - List of the level's objectives.
     * @param musicFile {String} - Name of the music file associated with the level.
     * @param platforms {Array} - The array of platforms the level holds.
     * @param entities {Array} - The array of entities the level holds.
     * @param backgrounds {Array} - The array of background rects.
     */
    constructor(title, startPosition, objective, musicFile, platforms, entities, backgrounds = []) {
        this.name = title;
        this.startPos = startPosition;
        this.objText = objective;
        this.trackName = musicFile;
        this.platformArr = platforms;
        this.entityArr = entities;
        this.backArr = backgrounds;
        
        //The actual track and clear time will be set in preload().
        this.track = null;
        this.time = null;
    }

    /** Holds all levels of the game. */
    //In order to prevent some tunneling (passing through walls) issues, the platforms
    //usually are made slightly longer.
    static list = [

        //LEVEL 0 (TUTORIAL)
        new Level(
            //LEVEL NAME
            'TUTORIAL',
            //STARTING POSISION
            new Vector2D(550, 1050),
            //OBJECTIVE(S)
            "- Reach the end gate.",
            //TRACK NAME
            "Floating Anarchy - Cyber Funk",

            //PLATFORM BUNDLE
            {
                g: [
                    new Platform(1100, 425, 1425, false),
                    new Platform(975, 1400, 1625, false),
                    new Platform(850, 1600, 1825, false),
                    new Platform(600, 1350, 1600, false),
                    new Platform(650, 575, 1375, false),
                    new Platform(600, 400, 600, false),
                    new Platform(600, 175, 600, false),
                    new Platform(250, 500, 1275, false)
                ],
                c: [
                    new Platform(800, 425, 1000, false),
                    new Platform(700, 1000, 1600, false),
                    new Platform(350, 500, 1825, false),
                    new Platform(50, 175, 1275, false)
                ],

                l: [
                    new Platform(450, 775, 1125, true),
                    new Platform(1000, 700, 800, true),
                    new Platform(1600, 600, 700, true),
                    new Platform(600, 600, 675, true),
                    new Platform(200, 25, 625, true)
                ],
                r: [
                    new Platform(1400, 975, 1125, true),
                    new Platform(1600, 850, 1000, true),
                    new Platform(1800, 325, 875, true),
                    new Platform(1350, 600, 675, true),
                    new Platform(500, 250, 350, true),
                    new Platform(1250, 25, 275, true)
                ]
            },

            //ENTITIES ARRAY
            [
                new Entity(new Vector2D(1235, 150), 15, 100, Entity.cyanRectStack, Entity.rectCheck, Entity.levelClear, undefined),
                new Entity(new Vector2D(975, 640), 375, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(1450, 575)),

                //The text here needs to be a function since settings only get set at preload().
                new Entity(new Vector2D(675, 925), 200, 100, Entity.dynamicTextBox, misc.noCheck, misc.none, () => { return `Welcome to PROJECT VECTOR\n\nUse ${settings.inputName.up}, ${settings.inputName.left}, ${settings.inputName.down} and ${settings.inputName.right} to move.` }),
                new Entity(new Vector2D(1200, 925), 200, 100, Entity.dynamicTextBox, misc.noCheck, misc.none, () => { return `Use ${settings.inputName.jump} to jump.` }),
                new Entity(new Vector2D(1700, 700), 75, 100, Entity.whiteTextBox, misc.noCheck, misc.none, `Jumping can be done off walls.`),
                new Entity(new Vector2D(1350, 450), 100, 100, Entity.dynamicTextBox, misc.noCheck, misc.none, () => { return `Use ${settings.inputName.dash} to dash.`}),
                new Entity(new Vector2D(700, 150), 195, 100, Entity.whiteTextBox, misc.noCheck, misc.none, 'The goal of this game is to complete levels in the least amount of time possible.\n\nThe timer at the top-left corner shows the amount of time taken.'),
                new Entity(new Vector2D(1050, 150), 100, 100, Entity.dynamicTextBox, misc.noCheck, misc.none, () => { return `Use ${settings.inputName.restart} to quick-restart.`})
            ],

            [
                new BGBlock(450, 1400, 800, 1100),
                new BGBlock(1000, 1600, 700, 975),
                new BGBlock(1600, 1800, 350, 850),
                new BGBlock(200, 1600, 350, 600),
                new BGBlock(600, 1350, 600, 650),

            ]
        ),

        new Level (
            //LEVEL NAME
            'LEVEL 01',
            //STARTING POSISION
            new Vector2D(125, 1575),
            //OBJECTIVE(S)
            "- Activate all switches.\n- Reach the end gate.",
            //TRACK NAME
            'EVA - 失望した',

            //PLATFORM BUNDLE
            {
                g: [
                    new Platform(1600, 25, 375, false),
                    new Platform(1600, 425, 1025, false),
                    new Platform(1450, 350, 450, false),
                    new Platform(1300, 1000, 1200, false),
                    new Platform(1400, 1175, 1675, false),
                    new Platform(550, 1400, 1525, false),
                    new Platform(1000, 975, 1425, false),
                    new Platform(900, 75, 1000, false),
                    new Platform(300, 225, 325, false),
                    new Platform(300, 900, 1800, false)
                ],
                c: [
                    new Platform(1100, 25, 1525, false),
                    new Platform(400, 900, 1175, false),
                    new Platform(400, 1250, 1675, false),
                    new Platform(800, 1150, 1275, false),
                    new Platform(50, 75, 1800, false),
                    new Platform(675, 225, 325, false)
                ],

                l: [
                    new Platform(50, 1075, 1625, true),
                    new Platform(450, 1450, 1625, true),
                    new Platform(1200, 1300, 1425, true),
                    new Platform(1525, 550, 1100, true),
                    new Platform(1275, 375, 800, true),
                    new Platform(1000, 900, 1025, true),
                    new Platform(100, 25, 925, true),
                    new Platform(325, 300, 675, true)
                ],
                r: [
                    new Platform(350, 1450, 1625, true),
                    new Platform(1000, 1300, 1625, true),
                    new Platform(1650, 375, 1425, true),
                    new Platform(1400, 550, 1025, true),
                    new Platform(1150, 375, 800, true),
                    new Platform(225, 300, 675, true),
                    new Platform(900, 300, 400, true),
                    new Platform(1775, 25, 325, true)
                ]
            },

            //ENTITIES ARRAY
            [
                //Goal
                new LabeledEntity(new Vector2D(1760, 175), 15, 125, StateEntity.cyanRectStackActive, StateEntity.rectCheckActive, Entity.levelClear, null, GOAL),

                //Switches
                new LabeledEntity(new Vector2D(800, 1250), 50, 50, StateEntity.greenSqr, StateEntity.rectCheckOnce, LabeledEntity.groupCheck, LabeledEntity.activateGoal, SWITCH),
                new LabeledEntity(new Vector2D(1100, 550), 50, 50, StateEntity.greenSqr, StateEntity.rectCheckOnce, LabeledEntity.groupCheck, LabeledEntity.activateGoal, SWITCH),
                new LabeledEntity(new Vector2D(165, 300), 50, 50, StateEntity.greenSqr, StateEntity.rectCheckOnce, LabeledEntity.groupCheck, LabeledEntity.activateGoal, SWITCH),
                new LabeledEntity(new Vector2D(385, 300), 50, 50, StateEntity.greenSqr, StateEntity.rectCheckOnce, LabeledEntity.groupCheck, LabeledEntity.activateGoal, SWITCH),

                //Other
                new Entity(new Vector2D(1200, 990), 200, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(1462.5, 525)),
                new Entity(new Vector2D(1425, 1390), 225, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(1100, 1275))
            ],

            [
                new BGBlock(50, 450, 1100, 1450),
                new BGBlock(50, 350, 1450, 1600),
                new BGBlock(450, 1000, 1300, 1600),
                new BGBlock(450, 1200, 1100, 1300),
                new BGBlock(1200, 1650, 1100, 1400),
                new BGBlock(1525, 1650, 550, 1100),
                new BGBlock(1275, 1650, 400, 550),
                new BGBlock(1275, 1400, 550, 900),
                new BGBlock(1000, 1400, 800, 1000),
                new BGBlock(1000, 1150, 400, 800),
                new BGBlock(225, 1000, 675, 900),
                new BGBlock(325, 1000, 400, 675),
                new BGBlock(100, 225, 300, 900),
                new BGBlock(100, 325, 50, 300),
                new BGBlock(325, 900, 50, 400),
                new BGBlock(900, 1775, 50, 300),
            ]
        ),

        new Level (
            //LEVEL NAME
            'LEVEL 02',
            //STARTING POSITION
            new Vector2D(150, 2350),
            //OBJECTIVE(S)
            "- Reach the end gate.",
            //TRACK NAME
            "Aries Beats - Infinity",

            //PLATFORM BUNDLE
            {
                g: [
                    new Platform(2400, 75, 625, false),
                    new Platform(2300, 600, 975, false),
                    new Platform(1700, 950, 1100, false),
                    new Platform(2600, 1075, 1525, false),
                    new Platform(2500, 1500, 2025, false),
                    new Platform(2200, 2000, 2700, false),
                    new Platform(350, 2500, 2700, false),
                    new Platform(2400, 2675, 3825, false),
                    new Platform(2100, 3800, 3900, false),
                    new Platform(3100, 2675, 4075, false),
                    new Platform(3025, 2400, 2700, false),
                    new Platform(3700, 625, 2425, false),
                    new Platform(3600, 275, 650, false)
                ],
                c: [
                    new Platform(2100, 75, 600, false),
                    new Platform(1250, 575, 975, false),
                    new Platform(1400, 950, 2500, false),
                    new Platform(2200, 1500, 1650, false),
                    new Platform(1500, 2700, 3825, false),
                    new Platform(1900, 3800, 4075, false),
                    new Platform(2800, 625, 3900, false),
                    new Platform(3100, 1900, 2000, false),
                    new Platform(3250, 1450, 1550, false),
                    new Platform(3400, 1000, 1100, false),
                    new Platform(3400, 275, 650, false)
                ],

                l: [
                    new Platform(100, 2075, 2425, true),
                    new Platform(600, 1225, 2100, true),
                    new Platform(1100, 1700, 2625, true),
                    new Platform(1650, 1375, 2200, true),
                    new Platform(2500, 350, 1300, true),
                    new Platform(2700, 2200, 2425, true),
                    new Platform(3900, 2100, 2800, true),
                    new Platform(2700, 3025, 3125, true),
                    new Platform(2000, 2775, 3100, true),
                    new Platform(1550, 2775, 3250, true),
                    new Platform(1100, 2775, 3400, true),
                    new Platform(650, 2775, 3400, true),
                    new Platform(650, 3600, 3725, true),
                    new Platform(300, 3375, 3625, true)
                ],
                r: [
                    new Platform(600, 2300, 2425, true),
                    new Platform(950, 1700, 2325, true),
                    new Platform(950, 1225, 1400, true),
                    new Platform(1500, 1375, 2200, true),
                    new Platform(1500, 2500, 2625, true),
                    new Platform(2000, 2200, 2525, true),
                    new Platform(2700, 350, 1500, true),
                    new Platform(3800, 1475, 1900, true),
                    new Platform(3800, 2100, 2425, true),
                    new Platform(4050, 1875, 3125, true),
                    new Platform(2400, 3025, 3725, true),
                    new Platform(1900, 2775, 3100, true),
                    new Platform(1450, 2775, 3250, true),
                    new Platform(1000, 2775, 3400, true)
                ]
            },

            //ENTITIES ARRAY
            [
                //Goal.
                new Entity(new Vector2D(315, 3500), 15, 100, Entity.cyanRectStack, Entity.rectCheck, Entity.levelClear, undefined),

                //Teleport.
               // new Entity(new Vector2D(1425, 2290), 825, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(550, 2000)),
               // new Entity(new Vector2D(3250, 2390), 550, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(2400, 2075)),
               // new Entity(new Vector2D(3375, 3090), 675, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(3850, 2075)),
               // new Entity(new Vector2D(1525, 3690), 875, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(2550, 3000)),

                //Jump pad.
                new Entity(new Vector2D(850, 2290), 100, 10, Entity.redTrianglesU, Entity.lineCheckX, Entity.knockback, new Vector2D(0, -75)),
                new Entity(new Vector2D(2600, 2190), 100, 10, Entity.redTrianglesU, Entity.lineCheckX, Entity.knockback, new Vector2D(0, -55)),
                new Entity(new Vector2D(1775, 2490), 100, 10, Entity.redTrianglesU, Entity.lineCheckX, Entity.knockback, new Vector2D(0, -55)),
                new Entity(new Vector2D(1775, 2490), 100, 10, Entity.redTrianglesU, Entity.lineCheckX, Entity.knockback, new Vector2D(0, -55)),

                //Dash refresh.
                new StateEntity(new Vector2D(2600, 1200), 75, 2, StateEntity.yellowCircles, StateEntity.circleCheckHold, Entity.dashRefresh),
                new StateEntity(new Vector2D(2600, 750), 75, 2, StateEntity.yellowCircles, StateEntity.circleCheckHold, Entity.dashRefresh),
                new StateEntity(new Vector2D(3300, 2875), 75, 2, StateEntity.yellowCircles, StateEntity.circleCheckHold, Entity.dashRefresh),
                new StateEntity(new Vector2D(1950, 3175), 75, 2, StateEntity.yellowCircles, StateEntity.circleCheckHold, Entity.dashRefresh),
                new StateEntity(new Vector2D(1500, 3325), 75, 2, StateEntity.yellowCircles, StateEntity.circleCheckHold, Entity.dashRefresh),
                new StateEntity(new Vector2D(1050, 3475), 75, 2, StateEntity.yellowCircles, StateEntity.circleCheckHold, Entity.dashRefresh),
                
                //Textboxes.
                new Entity(new Vector2D(2600, 2000), 100, 100, Entity.whiteTextBox, misc.noCheck, misc.none, 'Leap and hold.\nRide the surge.\nDemand the skies.'),
                new Entity(new Vector2D(2600, 25), 250, 75, Entity.whiteTextBox, misc.noCheck, misc.none, 'Still, at the edge of the world,\nthere is nothing for you here.'),
                new Entity(new Vector2D(2600, 125), 250, 50, Entity.whiteTextBox, misc.noCheck, misc.none, 'Return to what you know.\nVenturing outwards will only lead to disappointment.'),
               // new Entity(new Vector2D(3300, 2975), 150, 50, Entity.whiteTextBox, misc.noCheck, misc.none, 'Fly again, and again.')
            ]
        ),

        new Level (
            //LEVEL NAME
            'LEVEL 3',
            //START POSITION
            new Vector2D(0,0),
            //OBJECTIVE(S)
            "- None.",
            //TRACK NAME
            "Neon.Deflector - Outpost X",

            //PLATFORM BUNDLE
            {
                g: [],
                c: [],
                l: [],
                r: []
            },

            //ENTITIES ARRAY
            [

            ]
        ),

        new Level (
            //LEVEL NAME
            'TEST LEVEL',
            //STARTING POSITION
            new Vector2D(1225, 825),
            //OBJECTIVE(S)
            "- None.",
            //TRACK NAME
            "Neon.Deflector - Outpost X",

            //PLATFORM BUNDLE
            {
                g: [
                    new Platform(1100, 175, 1025, false),
                    new Platform(900, 1000, 1525, false)
                ],
                c: [
                    new Platform(400, 175, 1525, false)
                ],

                l: [
                    new Platform(200, 375, 1125, true)
                ],
                r: [
                    new Platform(1000, 900, 1125, true),
                    new Platform(1500, 375, 925, true)
                ]
            },

            //ENTITIES ARRAY
            [
                new Entity(new Vector2D(900, 1100), 50, 10, Entity.redTrianglesU, Entity.rectCheck, Entity.knockback, new Vector2D(0, -50)),
                new StateEntity(new Vector2D(660, 1000), 50, 2, StateEntity.yellowCircles, StateEntity.circleCheckHold, Entity.dashRefresh),

                new Entity(new Vector2D(400, 1000), 125, 50, Entity.whiteTextBox, misc.noCheck, misc.none, 'Sample text.'),
                new Entity(new Vector2D(400, 1150), 150, 50, Entity.whiteTextBox, misc.noCheck, misc.none, 'Textbox.'),
                new Entity(new Vector2D(900, 1150), 50, 50, Entity.whiteTextBox, misc.noCheck, misc.none, 'Jump pad.'),
                new Entity(new Vector2D(660, 1150), 100, 50, Entity.whiteTextBox, misc.noCheck, misc.none, 'Dash refresh')
            ]
        )
    ]
}