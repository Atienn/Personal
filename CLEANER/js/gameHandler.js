"use strict";

//IMPORTANT
//Refer to: assets/data/README.md for an explanation on the structure of the JSON 'tags' object.


/** Object representation of the game the user plays. */
let game =
{
    /** The number of 'turns' (images ignored/deleted) the user has gone through. */
    turnCount: 0,
    /** The number of images the user correctly deleted/ignored. */
    score: 0,
    /** Track if the current image displayed should be ignored/deleted. (true: should delete, false: should ignore) */
    shouldDelete: undefined,
    /** The tags defining images that should be deleted. */
    tagsToCensor: [],

    /** Greets the user and gives them a small bit of instructions. */
    setup() {
        alert("Welcome back, cleaner.");
        alert("There's more work to do.");
        alert("Just as a reminder: your task here is to filter out content.");
        alert("Use the buttons or voice commands, whichever you prefer.");
        //Keep repeating '...' until the user accepts.
        while (!confirm("Are you ready to start?")) { alert("..."); }
        //Start the game.
        this.start();
    },

    /** Resets values, gets new tags to censor and starts the game. */
    start() {
        //Reset the turn amount.
        this.turnCount = 0;
        //Reset the score.
        this.score = 0;
        //Clear the array of tags to censor. 
        this.tagsToCensor = [];


        //Get a new random number (between 5 and 7) for the amount of tags to censor.
        let count = Math.ceil(Math.random() * 3 + 4);
        //Define a temporary variable to aid in tag selection.
        let tempTag;
        //Create a string to act as a list.
        let list = "";
        //Remove all current tags listed on the left column.
        tagList.innerHTML = "";


        //Select an amount equal to 'count' different tags to censor.
        for (let i = 0; i < count; i++) {

            //Select a new tag randomly from the concrete list.
            do {
                tempTag = randomElem(tags.concrete);
            }
            //Keep re-selecting until it's different from the others (no repetition).
            while (this.tagsToCensor.includes(tempTag));

            //Add the selected tag to the array.
            this.tagsToCensor[i] = tempTag;

            //Add the tag to censor the list, skipping a line each time.
            list += `\n - ${tempTag}`;
            //Add the tag to the list on the left side column.
            tagList.innerHTML += ` - ${tempTag}<br/>`;
        }

        //Display the list of tags to censor to the user.
        alert('Delete any image that contains or depicts any of the following:' + list);

        //Start the first prompt.
        this.nextPrompt();
    },


    /**
     * New turn. Gets a new image tag to search for and starts the request.
     * Can call this.end() if the number of turns is exceeded.
     */
    nextPrompt() {

        //If the user has gone through 23 turns, then end the game (and end this method).
        //23 leads to messier (not round) percentages at the end. Looks more authentic.
        if (this.turnCount > 23) {
            this.end();
            return;
        }
        //Otherwise, increase the number of turns.
        this.turnCount++;

        //Create a temporary variable to aid the tag selection of the next image to be fetched.
        let imageTag;

        //Bias the chances of getting certain image tags as to make the experience a bit more intersting.
        //otherwise, the vast majority of correct verdicts are 'ignore'.
        if (Math.random() > 0.5) {
            //25% of the time, choose an image that needs to be deleted. 
            if (Math.random() > 0.5) {
                imageTag = randomElem(this.tagsToCensor);
                this.shouldDelete = true;
            }
            //25% of the time, display an image not to be deleted.
            else {
                imageTag = randomElem(tags.abstract);
                this.shouldDelete = false;
            }
        }
        //50% of the time, choose an image that might (unlikely, with all possible choices) need to be deleted.
        else {
            //Pick a random tag from the whole concrete tag list.
            imageTag = randomElem(tags.concrete);
            //Check if the tag matches one of the list to be censored.
            this.shouldDelete = this.tagsToCensor.includes(imageTag);
        }

        //Fetch a new image with the given tag and display it.
        getNewImage(imageTag);
    },

    /** Display user rating and ask if they want to continue. */
    end() {
        //Draws a light grey background over the last canvas frame.
        background(220);

        //Display end message and rating (as a percentage with one decimal digit).
        alert("Alright, that's enough for now.");
        alert(`You have a rating of ${(this.score * (100 / 23)).toFixed(1)}%`);

        //Asks the user if they wish to continue.
        //If they do, start another round.
        if (confirm("Do you want to continue?")) {
            this.start();
        }
        //If they don't, quit the page. Only work is allowed within these walls.
        else {
            quit();
        }
    },


    /**
     * Is called automatically by annyang when hearing speech.
     * @param {String} command - What the user said.
     */
    userCall(command) {
        //If the command includes 'delete', take it as a delete command.
        if (command.toLowerCase().includes("delete")) {
            //Verify if the user's guess was correct.
            this.verifyVerdict(true);
            //Shortly display text at the bottom to confirm input.
            displayText('Deleting...', 1250);
            //Start the next prompt.
            this.nextPrompt();
        }
        //Otherwise, if the command includes ignore, take it as an ignore command.
        else if (command.toLowerCase().includes("ignore")) {
            //Verify if the user's guess was correct.
            this.verifyVerdict(false);
            //Shortly display text at the bottom to confirm input.
            displayText('Ignored.', 1250);
            //Start the next prompt.
            this.nextPrompt();
        }
        //Otherwise, display a fake error message.
        else {
            displayText(`Unrecognized command: '${command}'`);
        }
    },


    /**
     * Verifies if the user's action (ignore/delete) was correct.
     * @param {boolean} didDelete - If the user chose to delete the image.
     */
    verifyVerdict(didDelete) {
        if (didDelete == this.shouldDelete) { this.score++; }
    }
}