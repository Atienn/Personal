/****************
CLEANER
Étienne Racine

Built off template-p5-project.
This is a web game where the user must take on the role of a content moderator and filter out content from the internet. 
****************/
"use strict"


//Represents a 'span' element where tags can be listed.
let tagList;
//Center 'div', holds the canvas.
let centerArea;
//Invisible 'footer' at the bottom of the page. Is used to display messages back to the user. 
let output;

//Tracks the ID of ongoing timeout functions. Used to cancel them before they execute.
let currentTimeout = "";

//Represents all of the possible image tags.
let tags;

/**
 * Loads the tags from the JSON object.
 * Is called and completed before any other functions.
 */
function preload() {
    tags = loadJSON("assets/data/tags.json", () => { 
        tags.length = Object.keys(tags).length; 
    });
}

/**
 * Initializes the page, and scripts to start the game.
 * Is called once on startup.
 */
function setup() {
    //Get the reference of HTML elements.
    centerArea = document.getElementById("center");
    tagList = document.getElementById("tag-list");
    output = document.getElementById("output");

    //Create canvas and make it fit within the center area.
    createCanvas(centerArea.clientWidth, centerArea.clientHeight).parent(centerArea);

    //Setup the image handler script.
    imageSetup();
    //Setup game object.
    game.setup();

    //Only attempt to start annyang if it is present.
    if (annyang) {
        //Makes annyang call 'userCall' with parameter command when it recognizes speech.
        annyang.addCommands({ '*command': game.userCall });
        //Stars listening for voice input.
        annyang.start();
    }
}


/**
* Draws a new image onto the canvas without modifying its aspect ratio.
* Ensures that no part of the image gets cropped.
* @param {Image} img The image to display.
*/
function displayImage(img) {
    //Draws a light grey background over the last canvas frame.
    background(220);

    //The following calculates which dimension of the image can be set to match the 
    //canvas' width/height without overflow (the 'limiting' dimension).

    //In both cases the image is drawn from the center, and the non-limiting dimension is scaled 
    //by the same amount the limiting one is as to conserve the image's aspect ratio.

    //If the width is the limiting dimension, then set it to match the canvas' (as large as possible).
    if ((img.width - width) * img.height > (img.height - height) * img.width) { 
        image(img, width / 2, height / 2, width, img.height * (width / img.width)); 
    }
    //Otherwise, set the height to match the canvas'.
    else { 
        image(img, width / 2, height / 2, img.width * (height / img.height), height); 
    }
}


/**
 * Displays text at the bottom of the screen for a set amount of time. 
 * @param {String} text The string of text to display.
 * @param {Number} duration (Optional) The amount of time (in ms) to display for.
 */
function displayText(text, duration = 3000) {
    //Cancel any ongoing timeout to clear the text as not to have them take action
    //on the new text we're about to write.
    clearTimeout(currentTimeout);

    //Wrtite the text at the bottom of the screen.
    output.innerHTML = text;

    //Set a timeout to clear the text and record its ID to potentially cancel it.
    currentTimeout = setTimeout(() => { 
        output.innerHTML = ""; 
    }, duration);
}


/**
 * Returns a random element from an array.
 * @param {Array} array - Any type of array.
 * @returns A randomly picked element from the array.
 */
 function randomElem(array) { 
    return array[Math.floor(Math.random() * array.length)]; 
}


/**
 * Resizes the canvas and redraws its content.
 * Is called automatically when the window is resized.
 */
function windowResized() {
    //Make the canvas match its parent width.
    resizeCanvas(centerArea.clientWidth, centerArea.clientHeight);

    //Redraw what was on canvas if an image was being displayed.
    if (currentImage) { displayImage(currentImage); }
}


/**
 * Quits the page. Either, by going backwards/forwards in the
 * history or by closing the tab.
 */
function quit() {
    //Checks if the user has more than a single page in their history.
    //If they do, close the page, otherwise send them forwards/backwards in their history.
    if (window.history.length === 1) {
        //If the user only has this page in their history, close the window or tab.
        window.close();
    } 
    else {
        //Send the user to the previous page in their history.
        window.history.back();

        //If the user is still on the page, then there were no last page to go to.
        //Send the user to the next page in their history.
        window.history.forward();
    }
}