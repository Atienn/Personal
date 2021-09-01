"use strict"

//Takes care of saving and reseting level clear times.
let scoreHandler = {
    
    /** Saves the current clear times to browser storage. */
    saveScores() {
        //Get the clear time of each level.
        let scores = [];
        for (let i = 0; i < Level.list.length; i++) {
            scores[i] = Level.list[i].time;            
        }
        //Save them to browser storage.
        localStorage.setItem(`P1:Scores`, JSON.stringify(scores));
    },

    /** Reset the clear times to thier default value. */
    resetScores() {
        Level.list.forEach(level => {
            //Set all clear times to undefined.
            level.time = null;
        });
        //Save the empty times to browser storage.
        this.saveScores();
    }
}