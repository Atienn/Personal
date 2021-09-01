//The location of music files.
const musicLocation = 'assets/sounds/';
//The extenstion of music files.
const musicExt = '.mp3';


/** Object which handles and tracks everything related to music. */
let music = {

    //Tracks the reference to the currently playing track.
    currentTrack: undefined,
    //Holds the name of the currently playing track.
    currentTrackName: 'Nothing',

    //Is used to measure the level of multiple frequecies as 'music' plays out.
    freqAnalyzer: undefined,
    //Is used to meansure the amplitude level as 'music' plays out.
    ampAnalyzer: undefined,

    //Holds the amplitude level measured for the current frame.
    ampCurrent: 0,


    /**
     * Tries to load a track from the game's files.
     * @param trackName {String} - The name of the file (which should be the name of the music track)
     * without the path leading to it or it's file extension.
     */
    loadTrack(trackName) {
        return loadSound(musicLocation + trackName + musicExt);
    },


    /**
     * Stops playing the current track and starts the given one.
     * @param track {any} - The new track to switch to.
     * @param trackName {String} - The name of the track.
     */
    setTrack(track, trackName) {
        //Unlocks the analyzers from 'currentMusic' as it's switching track.
        //Not doing so causes the analyzers to stop working entirely.
        this.freqAnalyzer.setInput();
        this.ampAnalyzer.setInput();
        
        //Stop any currently playing music.
        this.currentTrack.stop();
        //Switch the current track to the playing state music.
        this.currentTrack = track;
        //Make the current track loop.
        this.currentTrack.loop();

        //Change the index of the music name accordingly.
        this.currentTrackName = trackName;

        //Sets the music as the input source. (Makes them ignore all other sounds, if any.)
        this.freqAnalyzer.setInput(this.currentTrack);
        this.ampAnalyzer.setInput(this.currentTrack);
    },


    /**
     * Shows the name of the track playing at the bottom-right of the screen.
     */
    displayCurrTrack() {
        push(); //We don't want to keep the following text settings.

        textAlign(RIGHT, CENTER); //Align text to the right-center.
        textSize(15); //Reduce the text size.
        text(`Currently Playing:\n${music.currentTrackName}`, width - 5, height - 20); //Give credit to the artist.

        pop(); //Revert to the previous text settings.
    }
}

function beat() {
    //We don't want to keep these drawing settings.
    push();

    //BEATING VIGNETTE

    //Set the size of the circle to scale with the size of the screen.
    size = Math.hypot(width, height) / 4;
    

    //Offset everyting until the next pop() so that (0,0) is at the center of the screen.
    translate(width / 2, height / 2);

    //Creates a background "gradient" for the music visualizer going from bright orange to grey.
    //Draws a large half-transparent bright circle with color dependent on time. 
    fill(0, 0, 25, 0.5);
    circle(0,0, 1.5 * size + music.ampCurrent * 25);
    //Draws a half-transparent grey circle in the previous' center.
    fill(0, 0, 25, 0.5);
    circle(0,0, 1.25 * size + music.ampCurrent * 25);
    //Draws a small half-transparent grey circle in the previous' center.
    fill(0, 0, 25, 0.5);
    circle(0,0, size + music.ampCurrent * 25);
    //Draws an even smaller half-transparent grey circle in the previous' center.
    fill(0, 0, 25, 0.5);
    circle(0,0, 0.75 * size + music.ampCurrent * 25);

    //Makes the beating circle black and going to grey when the current amplitude is high.
    fill(Math.pow(music.ampCurrent * 10, 2));
    //Draw a circle who's size is dependent on the current amplitude. (Makes it 'beat' to the music.)
    circle(0,0, 0.75* size * Math.sqrt(music.ampCurrent));

    pop(); //Revert to the previous drawing and position settings.
}


//Code that was removed but might be re-implemented later.
/*
 //MUSIC VISUALIZER

        //Creates the music visualizer which is a vignette effect 'beating' with the amplitude of the music.
        //Display the music visualizer if the music is playing.
        if(music.currentTrack.isPlaying())
        {
            //We don't want to keep these drawing settings.
            push();


            //BEATING VIGNETTE

            //Set the size of the circle to scale with the size of the screen.
            size = Math.hypot(width, height) - music.ampCurrent * 100;

            //Offset everyting until the next pop() so that (0,0) is horizontally in the middle and
            //vertically far below what's in view (just under half the beating circle's height).



            //Makes a pattern within the beating circle going from dark to lighter shades.
            //A multiple of the window's height is removed from the beating circle's size to restrain in to the bottom of the window.

            //Draws a large, almost black circle at the point specified by translate above.
            fill(0, 0, 10);
            circle(0, 0, 1.03 * size);

            //Draws a slightly smaller, slighly lighter circle at the same point.
            fill(0, 0, 20);
            circle(0, 0, 1.02 * size);

            //Draws a slightly smaller, slighly lighter circle at the same point.
            fill(0, 0, 25);
            circle(0, 0, 1.01 * size);

            //Draws a slightly smaller, slighly lighter circle at the same point.
            fill(0, 0, 30);
            circle(0, 0, 1 * size);

            //Draws a slightly smaller, slighly lighter circle at the same point.
            fill(0, 0, 35);
            circle(0, 0, 0.99 * size);

            pop(); //Revert to the previous drawing and position settings.
        }
*/