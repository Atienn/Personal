"use strict";

//Takes care of everything related to game settings.
let settingsHandler = {

    /** Saves the current settings to browser storage. */
    saveSettings() {
        localStorage.setItem(`P1:Settings`, JSON.stringify(settings));
    },

    /** Resets settings to thier default values. */
    resetSettings() {
        settings = {

            //Tracks the pixel density of the canvas.
            //Lower numbers means a blurrier image, but faster performance.
            //To avoid floating point error, we use interger numbers and divide by 10 afterwards.
            density: 20,

            //Tracks the master volume of the game.
            //To avoid floating point error, we use interger numbers and divide by 10 afterwards.
            volume: 1,

            //User input.
            input: {
                //Movement
                up: 38,         // UP ARROW
                down: 40,       // DOWN ARROW
                left: 37,       // LEFT ARROW
                right: 39,      // RIGHT ARROW

                //Actions
                jump: 32,       // SPACE
                dash: 90,       // Z
                restart: 82,    // R
            },

            //Name of each input.
            inputName: {
                //Movement
                up: "ArrowUp",
                down: "ArrowDown",
                left: "ArrowLeft",
                right: "ArrowRight",

                //Actions
                jump: "Space",
                dash: "KeyZ",
                restart: "KeyR"
            }
        }

        //Save the settings after assigning new values.
        this.saveSettings();
    },

    /** Ups the pixel density by 0.1. */
    densityUp() {
        //If the density is below 3.0, add 0.1.
        if (settings.density < 30) {
            //Add 1 to the density counter.
            settings.density++;
            //Apply the change, dividing by 10 to only add 0.1.
            pixelDensity(settings.density / 10);

            //Redraw the background to avoid an annoying white flash.
            background(hueChange, 100, 85);
        }
    },

    /** Lowers the pixel density by 0.1. */
    densityDown() {
        //If the density is above 0.1, subtract 0.1.
        if (settings.density > 1) {
            //Remove 1 from the density counter.
            settings.density--;
            //Apply the change, dividing by 10 to only remove 0.1.
            pixelDensity(settings.density / 10);

            //Redraw the background to avoid an annoying white flash.
            background(hueChange, 100, 85);
        }
    },

    /** Ups the volume by 0.1. */
    volumeUp() {
        //If the volume is below 1.0, add 0.1.
        if (settings.volume < 10) {
            //Add 1 to the volume counter.
            settings.volume++;
            //Apply the change, dividing by 10 to only add 0.1.
            masterVolume(settings.volume / 10);
        }
    },

    /** Lowers the game volume by 0.1. */
    volumeDown() {
        //If the volume is above 0.0, remove 0.1.
        if (settings.volume > 0) {
            //Remove 1 from the volume counter.
            settings.volume--;
            //Apply the change, dividing by 10 to only remove 0.1.
            masterVolume(settings.volume / 10);
        }
    },

    /** 
     * Maps a given action to a new keycode.
     * @param action {String} - The name of the action to re-map.
     * @param keyCode {Number} - The code of the key to map to.
     * @param keyName {String} - The name of the key to map to.
     */
    modifyInput(action, keyCode, keyName) {
        settings.input[action] = keyCode;
        settings.inputName[action] = keyName;
    }
}

//Callback before window unload.
//While the page is unloading (in the process of moving to a new one) the anonymous function is called.
//Saves settings to browser storage (some browsers might choose not to execute this, though).
window.onbeforeunload = () => {
    //Only save settngs they aren't undefined.
    if (!settings) {
        settingsHandler.saveSettings();
    }
};