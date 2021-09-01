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
     * @param platforms {Array} - The array of the level's platforms.
     * @param entities {Array} - The array of the level's entities.
     * @param backgrounds {Array} - The array of the level's background blocks.
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
            new Vector2D(250, 1225),
            //OBJECTIVE(S)
            "- Reach the end gate.",
            //TRACK NAME
            "Floating Anarchy - Cyber Funk",

            //PLATFORM BUNDLE
            {
                g: [
                    new Platform(1300, 125, 700),
                    new Platform(1500, 675, 1525),
                    new Platform(1375, 1500, 1725),
                    new Platform(1250, 1700, 1875),
                    new Platform(850, 1400, 1725),
                    new Platform(1150, 1125, 1400),
                    new Platform(200, 1300, 1575),
                    new Platform(250, 575, 1325),
                    new Platform(200, 350, 600),
                    new Platform(850, 175, 725),
                    new Platform(500, 700, 800),
                    new Platform(600, 775, 1475)
                ],
                c: [
                    new Platform(1000, 125, 1025),
                    new Platform(1250, 1000, 1400),
                    new Platform(950, 1400, 1875),
                    new Platform(700, 1125, 1575),
                    new Platform(50, 175, 1725),
                    new Platform(700, 350, 550),
                    new Platform(350, 525, 1475)
                ],

                l: [
                    new Platform(150, 975, 1325),
                    new Platform(700, 1300, 1525),
                    new Platform(1150, 675, 1175),
                    new Platform(1400, 1150, 1250),
                    new Platform(1575, 200, 700),
                    new Platform(600, 200, 275),
                    new Platform(200, 25, 875),
                    new Platform(550, 325, 700),
                    new Platform(800, 500, 625)
                ],
                r: [
                    new Platform(1000, 975, 1250),
                    new Platform(1500, 1375, 1525),
                    new Platform(1700, 1250, 1400),
                    new Platform(1850, 925, 1275),
                    new Platform(1400, 850, 950),
                    new Platform(1700, 25, 875),
                    new Platform(1300, 200, 275),
                    new Platform(350, 200, 700),
                    new Platform(700, 500, 875),
                    new Platform(1450, 325, 625)
                ]
            },

            //ENTITIES ARRAY
            [
                //Goal.
                new Entity(new Vector2D(1435, 475), 15, 125, Entity.cyanRectStack, Entity.rectCheck, Entity.levelClear),

                //Teleport.
                new Entity(new Vector2D(950, 240), 350, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(1450, 125)),
                new Entity(new Vector2D(690, 675), 10, 175, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(450, 750)),                
                new Entity(new Vector2D(560, 525), 10, 175, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(450, 750)),

                //Textboxes. Some of which need to have text wrapped in a function to access variables that can change at run-time.
                new Entity(new Vector2D(425, 1150), 200, 100, Entity.dynamicTextBox, misc.noCheck, misc.none, () => { return `Welcome to PROJECT VECTOR\n\nUse ${settings.inputName.up}, ${settings.inputName.left}, ${settings.inputName.down} and ${settings.inputName.right} to move.` }),
                new Entity(new Vector2D(1275, 1375), 200, 100, Entity.dynamicTextBox, misc.noCheck, misc.none, () => { return `Use ${settings.inputName.jump} to jump.` }),
                new Entity(new Vector2D(1275, 1025), 75, 100, Entity.textBox, misc.noCheck, misc.none, `Jumping can be done off walls.`),
                new Entity(new Vector2D(1500, 750), 175, 100, Entity.textBox, misc.noCheck, misc.none, `When between narrow walls, hold jump to quickly chain wall-jumps.`),
                new Entity(new Vector2D(1450, 100), 100, 100, Entity.dynamicTextBox, misc.noCheck, misc.none, () => { return `Use ${settings.inputName.dash} to dash.`}),
                new Entity(new Vector2D(450, 100), 100, 100, Entity.dynamicTextBox, misc.noCheck, misc.none, () => { return `Hold ${settings.inputName.down} to fall faster.`}),
                new Entity(new Vector2D(450, 750), 150, 100, Entity.textBox, misc.noCheck, misc.none, `While mid-air, hold jump to slightly increase air time.`),
                new Entity(new Vector2D(1100, 450), 170, 150, Entity.dynamicTextBox, misc.noCheck, misc.none, () => { return `The goal of this game is to complete levels in the least amount of time.\n\nThe time taken is shown at the top-left corner.\n\nUse ${settings.inputName.restart} to restart.`})
            ],

            [
               new BGBlock(150, 700, 1000, 1300),
               new BGBlock(700, 1000, 1000, 1500),
               new BGBlock(1000, 1500, 1250, 1500),
               new BGBlock(1500, 1700, 1250, 1375),
               new BGBlock(1400, 1850, 950, 1250),
               new BGBlock(1150, 1400, 700, 1150),
               new BGBlock(1400, 1700, 700, 850),
               new BGBlock(1575, 1700, 50, 700),
               new BGBlock(950, 1575, 50, 200),
               new BGBlock(600, 1300, 200, 250),
               new BGBlock(350, 950, 50, 200),
               new BGBlock(200, 350, 50, 700),
               new BGBlock(200, 700, 700, 850),
               new BGBlock(550, 700, 350, 700),
               new BGBlock(700, 1450, 350, 500),
               new BGBlock(800, 1450, 500, 600),
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
                    new Platform(1600, 25, 375),
                    new Platform(1600, 425, 1025),
                    new Platform(1450, 350, 450),
                    new Platform(1300, 1000, 1200),
                    new Platform(1400, 1175, 1675),
                    new Platform(550, 1400, 1525),
                    new Platform(1000, 975, 1425),
                    new Platform(900, 75, 1000),
                    new Platform(300, 225, 325),
                    new Platform(300, 900, 1800)
                ],
                c: [
                    new Platform(1100, 25, 1525),
                    new Platform(400, 900, 1175),
                    new Platform(400, 1250, 1675),
                    new Platform(800, 1150, 1275),
                    new Platform(50, 75, 1800),
                    new Platform(675, 225, 325)
                ],

                l: [
                    new Platform(50, 1075, 1625),
                    new Platform(450, 1450, 1625),
                    new Platform(1200, 1300, 1425),
                    new Platform(1525, 550, 1100),
                    new Platform(1275, 375, 800),
                    new Platform(1000, 900, 1025),
                    new Platform(100, 25, 925),
                    new Platform(325, 300, 675)
                ],
                r: [
                    new Platform(350, 1450, 1625),
                    new Platform(1000, 1300, 1625),
                    new Platform(1650, 375, 1425),
                    new Platform(1400, 550, 1025),
                    new Platform(1150, 375, 800),
                    new Platform(225, 300, 675),
                    new Platform(900, 300, 400),
                    new Platform(1775, 25, 325)
                ]
            },

            //ENTITIES ARRAY
            [
                //Goal.
                new LabeledEntity(new Vector2D(1760, 175), 15, 125, StateEntity.cyanRectStackActive, StateEntity.rectCheckActive, Entity.levelClear, null, GOAL),

                //Switches.
                new LabeledEntity(new Vector2D(800, 1250), 50, 50, StateEntity.greenSqr, StateEntity.rectCheckOnce, LabeledEntity.groupCheck, LabeledEntity.activateGoal, SWITCH),
                new LabeledEntity(new Vector2D(1100, 550), 50, 50, StateEntity.greenSqr, StateEntity.rectCheckOnce, LabeledEntity.groupCheck, LabeledEntity.activateGoal, SWITCH),
                new LabeledEntity(new Vector2D(165, 300), 50, 50, StateEntity.greenSqr, StateEntity.rectCheckOnce, LabeledEntity.groupCheck, LabeledEntity.activateGoal, SWITCH),
                new LabeledEntity(new Vector2D(385, 300), 50, 50, StateEntity.greenSqr, StateEntity.rectCheckOnce, LabeledEntity.groupCheck, LabeledEntity.activateGoal, SWITCH),

                //Teleport.
                new Entity(new Vector2D(1200, 990), 200, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(1462.5, 525)),
                new Entity(new Vector2D(1425, 1390), 225, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(1100, 1275))
            ],

            //BACKGROUND ARRAY
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
                    new Platform(2400, 75, 625),
                    new Platform(2300, 600, 975),
                    new Platform(1700, 950, 1100),
                    new Platform(2600, 1075, 1525),
                    new Platform(2500, 1500, 2025),
                    new Platform(1900, 2000, 2200),
                    new Platform(2200, 2175, 3575),
                    new Platform(2100, 3550, 3825),
                    new Platform(1450, 3800, 4600),
                    new Platform(1300, 4800, 4925),
                    new Platform(2950, 3975, 4825),
                    new Platform(2900, 3700, 4000),
                    new Platform(4400, 2625, 3725),
                    new Platform(4000, 2275, 2700),
                    new Platform(3050, 2500, 3025)
                ],
                c: [
                    new Platform(2100, 75, 600),
                    new Platform(1250, 575, 975),
                    new Platform(1400, 950, 1525),
                    new Platform(2150, 1500, 1650),
                    new Platform(1600, 1625, 3675),
                    new Platform(1200, 3675, 4925),
                    new Platform(1600, 3975, 4600),
                    new Platform(2600, 3475, 4000),
                    new Platform(3950, 3100, 3500),
                    new Platform(4100, 2625, 2700),
                    new Platform(3650, 2500, 3125),
                    new Platform(2800, 2275, 3025)
                ],

                l: [
                    new Platform(100, 2075, 2425),
                    new Platform(600, 1225, 2100),
                    new Platform(1100, 1700, 2625),
                    new Platform(1650, 1575, 2150),
                    new Platform(2200, 1900, 2225),
                    new Platform(3675, 1200, 1600),
                    new Platform(4600, 1450, 1600),
                    new Platform(4000, 1575, 2600),
                    new Platform(4000, 2900, 2975),
                    new Platform(3500, 2575, 3950),
                    new Platform(2650, 4075, 4425),
                    new Platform(2700, 4000, 4100),
                    new Platform(2300, 2775, 4025)
                ],
                r: [
                    new Platform(600, 2300, 2425),
                    new Platform(950, 1700, 2325),
                    new Platform(950, 1225, 1400),
                    new Platform(1500, 1375, 2150),
                    new Platform(1500, 2500, 2625),
                    new Platform(2000, 1900, 2525),
                    new Platform(3550, 2100, 2225),
                    new Platform(3800, 1450, 2125),
                    new Platform(4900, 1175, 1325),
                    new Platform(4800, 1300, 2975),
                    new Platform(3700, 2900, 4425),
                    new Platform(3100, 3625, 3950),
                    new Platform(2500, 3050, 3650),
                    new Platform(3000, 2775, 3075)
                ]
            },

            //ENTITIES ARRAY
            [
                //Goal.
                new Entity(new Vector2D(2985, 2925), 15, 125, Entity.cyanRectStack, Entity.rectCheck, Entity.levelClear, undefined),

                //Teleport.
                new Entity(new Vector2D(1300, 2590), 200, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(1025, 1600)),
                new Entity(new Vector2D(2875, 2190), 675, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(2100, 1800)),
                new Entity(new Vector2D(4200, 1440), 400, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(3575, 2000)),
                new Entity(new Vector2D(4140, 1950), 140, 25, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(4850, 1250)),
                new Entity(new Vector2D(4660, 1950), 140, 25, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(4850, 1250)),
                new Entity(new Vector2D(4520, 2250), 280, 25, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(4850, 1250)),
                new Entity(new Vector2D(4280, 2550), 280, 25, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(4850, 1250)),
                new Entity(new Vector2D(4400, 2940), 400, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(4850, 1250)),
                new Entity(new Vector2D(3175, 4390), 525, 10, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(3800, 2800)),
                new Entity(new Vector2D(2660, 4250), 10, 150, Entity.orangeRects, Entity.rectCheck, Entity.teleport, new Vector2D(3800, 2800)),

                //Jump pads.
                new Entity(new Vector2D(850, 2290), 100, 10, Entity.redTrianglesU, Entity.lineCheckX, Entity.knockback, new Vector2D(0, -75)),
                new Entity(new Vector2D(1750, 2490), 150, 10, Entity.redTrianglesU, Entity.lineCheckX, Entity.knockback, new Vector2D(0, -55)),
                new Entity(new Vector2D(2210, 2000), 10, 100, Entity.redTrianglesR, Entity.lineCheckY, Entity.knockback, new Vector2D(65, -25)),
                new Entity(new Vector2D(3700, 2090), 100, 10, Entity.redTrianglesU, Entity.lineCheckX, Entity.knockback, new Vector2D(0, -65)),
                new Entity(new Vector2D(3685, 1300), 10, 100, Entity.redTrianglesR, Entity.lineCheckY, Entity.knockback, new Vector2D(55, -15)),
                new Entity(new Vector2D(3600, 2610), 100, 10, Entity.redTrianglesD, Entity.lineCheckX, Entity.knockback, new Vector2D(0, 60)),
                new Entity(new Vector2D(3690, 4250), 10, 150, Entity.redTrianglesL, Entity.lineCheckY, Entity.knockback, new Vector2D(-70, -20)),
                new Entity(new Vector2D(2400, 3990), 100, 10, Entity.redTrianglesU, Entity.lineCheckX, Entity.knockback, new Vector2D(0, -90)),
                new Entity(new Vector2D(2310, 2925), 10, 100, Entity.redTrianglesR, Entity.lineCheckY, Entity.knockback, new Vector2D(65, 0)),
                
                //Textboxes.
                new Entity(new Vector2D(350, 2250), 100, 100, Entity.textBox, misc.noCheck, misc.none, 'Leap and hold.\nRide the surge.\nDemand the skies.'),
            ],

            //BACKGROUND ARRAY
            [
                new BGBlock(100, 600, 2100, 2400),
                new BGBlock(600, 950, 1500, 2300),
                new BGBlock(600, 950, 1250, 1500),
                new BGBlock(950, 1500, 1400, 1700),
                new BGBlock(1100, 1500, 1700, 2300),
                new BGBlock(1100, 1500, 2300, 2600),
                new BGBlock(1500, 2000, 2150, 2500),
                new BGBlock(1650, 2000, 1600, 2150),
                new BGBlock(2000, 2800, 1600, 1900),
                new BGBlock(2200, 2800, 1900, 2200),
                new BGBlock(2800, 2950, 1600, 2200),
                new BGBlock(2950, 3675, 1600, 1900),
                new BGBlock(2950, 3550, 1900, 2200),
                new BGBlock(3550, 3800, 1900, 2100),
                new BGBlock(3675, 3800, 1200, 1900),
                new BGBlock(3800, 4800, 1200, 1450),
                new BGBlock(4800, 4900, 1200, 1300),
                new BGBlock(4600, 4800, 1450, 1900),
                new BGBlock(4000, 4600, 1600, 1900),
                new BGBlock(4000, 4200, 1900, 2300),
                new BGBlock(4200, 4800, 1900, 2300),
                new BGBlock(4000, 4400, 2300, 2600),
                new BGBlock(4400, 4800, 2300, 2600),
                new BGBlock(4600, 4800, 2600, 2900),
                new BGBlock(4200, 4600, 2600, 2900),
                new BGBlock(3700, 4200, 2600, 2900),
                new BGBlock(4000, 4800, 2900, 2950),
                new BGBlock(3500, 3700, 2600, 3950),
                new BGBlock(3100, 3700, 3950, 4100),
                new BGBlock(2700, 3100, 3650, 4100),
                new BGBlock(3500, 3700, 4100, 4400),
                new BGBlock(2650, 3500, 4100, 4400),
                new BGBlock(2300, 2700, 3650, 4000),
                new BGBlock(2300, 2500, 2800, 3650),
                new BGBlock(2500, 3000, 2800, 3050)
            ]
        ),

        new Level (
            //LEVEL NAME
            'TEST LEVEL',
            //STARTING POSITION
            new Vector2D(1225, 825),
            //OBJECTIVE(S)
            "- None.\n- This level exists purely as testing grounds for new / existing features.",
            //TRACK NAME
            "Neon.Deflector - Outpost X",

            //PLATFORM BUNDLE
            {
                g: [
                    new Platform(1100, 175, 1025),
                    new Platform(900, 1000, 1525)
                ],
                c: [
                    new Platform(400, 175, 1525)
                ],

                l: [
                    new Platform(200, 375, 1125)
                ],
                r: [
                    new Platform(1000, 900, 1125),
                    new Platform(1500, 375, 925)
                ]
            },

            //ENTITIES ARRAY
            [
                new Entity(new Vector2D(900, 1090), 50, 10, Entity.redTrianglesU, Entity.lineCheckX, Entity.knockback, new Vector2D(0, -50)),

                new StateEntity(new Vector2D(660, 1000), 50, 2, StateEntity.yellowCircles, StateEntity.circleCheckHold, Entity.dashRefresh),

                new Entity(new Vector2D(400, 1000), 125, 50, Entity.textBox, misc.noCheck, misc.none, 'Sample text.'),
                new Entity(new Vector2D(400, 1150), 150, 50, Entity.textBox, misc.noCheck, misc.none, 'Textbox.'),
                new Entity(new Vector2D(900, 1150), 50, 50, Entity.textBox, misc.noCheck, misc.none, 'Jump pad.'),
                new Entity(new Vector2D(660, 1150), 100, 50, Entity.textBox, misc.noCheck, misc.none, 'Dash refresh')
            ],

            //BACKGROUND ARRAY
            [
                new BGBlock(200, 1500, 400, 900),
                new BGBlock(200, 1000, 900, 1100)
            ]
        )
    ]
}