using System.Collections;
using UnityEngine;
using TMPro;

//Allows music to be played when the user does specific actions (like switching cameras, pausing time, editing body values etc).
//Is only used in scenario scenes.
public class MusicPlayer : MonoBehaviour
{
    //The in-scene source of sound.
     AudioSource musicSource;
    //The individual music clips to play.
    [SerializeField] AudioClip[] tracks;
    
    //UI text element part of the pause menu showing when a track is playing along with the track's name.
    [SerializeField] TMP_Text musicStateText;
    [SerializeField] TMP_Text musicNameText;
    

    //Tracks the generated index of the next track to play.
    int toPlay;
    //Tracks the index of the last track played as not to repeat it.
    int lastPlayed;

    //Tracks if the player should be allowed to start another track.
    bool canPlay;



    //The game option script's Start function requires that this one has already executed.
    //Otherwise, the audio source gets used when it's still undefined.
    //As a result, this script must be earlier in the execution order.

    //Sets the audio source component and gives a fallback value for the next track.
    //Is called before the first frame.
    void Start()
    {
        //Assume an audios source is already attached to the object.
        musicSource = GetComponent<AudioSource>();

        //Set a fallback in case there is only a single track available.
        toPlay = 0;    
    }


    //Has a chance to start playing a new track with odds dependent on the given number. Does nothing if something is already playing.
    //Is called whenever 'SPACE' or 'V' are pressed or if the editor's 'APPLY' button is clicked. Can also be called if 'TAB' is pressed and results in a camera switch.
    public void ChanceToTrigger(float chance)
    {
        //Calculate the chance by generating a number between 0 and 1 and checking if it's lower than the given chance.
        //Skip entirely if the source is already playing something or if there isn't any tracks to play.
        if (Random.value <= chance && !musicSource.isPlaying && tracks.Length > 0)
        {
            //Skip this step if there is only a single track available. (New indexes can't be genrated with only one track.)
            if(tracks.Length > 1)
            {
                //Select the next track by generating a random index. 
                do { toPlay = Random.Range(0, tracks.Length); }
                //Keep retrying until the new index is different from one of the last played track. 
                while (toPlay == lastPlayed); 
            }

            //Set and play the selected track.
            musicSource.clip = tracks[toPlay];
            musicSource.Play();

            //Display that a track is playing along with its name on the pause menu.
            musicStateText.text = "currently playing:";
            musicNameText.text = tracks[toPlay].name.ToString();

            //Start a coroutine that will clear the text elements once the the current track is done.
            StartCoroutine(WaitForEnd());

            //Record the index of the current track in a separate variable as not to repeat it once the next track is selected.
            lastPlayed = toPlay;
        }
    }
    

    //Waits until the end of the track and clears the text text elements.
    //Is called every time a track starts playing.
    IEnumerator WaitForEnd()
    {
        //Suspends this coroutine until the current track is done playing.
        yield return new WaitWhile(() => musicSource.isPlaying);

        //Clear both text elements.
        musicStateText.text = "";
        musicNameText.text = "";
    }
    

    //Changes the volume of the audio source.
    //Is called whenever the game options's volume slider is dragged.
    public void ChangeVolume(float newVol) { musicSource.volume = newVol * 0.01f; }
}
