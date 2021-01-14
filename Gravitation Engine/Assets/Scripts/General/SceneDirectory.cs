using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

//Saves selected game options and allows smoother transitions between scenes by displaying a loading screen.
//Is used in every scene.
public class SceneDirectory : MonoBehaviour
{
    /*
    SCENE INDEXES
      
      Menu(s)
      0 : Main Menu

      Scenarios
      1 : Introduction
      2 : Stellar 'Wobble'
      3 : S.E.M. System
    */

    //The UI overlay that will cover the screen when loading a new scene.
    [SerializeField] GameObject loadingOverlay;
    
    //The loading bar that will represent progress when a new scene is being loaded.
    [SerializeField] Image loadingBar;

    //The array of cameras used in the scene.
    [SerializeField] Camera[] cams;

    //Holds the game options to save onto the hard drive.
    [SerializeField] GameOptions gameOptions;

    //The object that will flash the when entering a new scene.
    [SerializeField] Flasher introFlash;


    //Flash over the entire screen when entering a new scene to smoothen scene transitions.
    //Is called once before the first frame is displayed.
    void Start() { introFlash.Flash(); }


    //Enables an overlay, disables camera rendering, saves selected game options and starts loading the next scene. 
    public void MoveToScene(int nextScene)
    {
        //Enable the loading screen, which is rendered over out everything else on screen.
        loadingOverlay.SetActive(true);

        //Disables each camera in the scene as to save on computational work while loading the next scene.
        for(byte i = 0; i < cams.Length; i++) { cams[i].enabled = false; }

        //Save the game options (like game volume) so that they carry over to the next scene.
        gameOptions.SavePreferences();

        //Start loading the next scene while updating the loading bar.
        StartCoroutine(LoadNewScene(nextScene));
    }


    //Loads the target scene, updating the loading bar as progress is made.
    //Is called whenever a scenario is selected in the menu or when quitting to menu from a scenario.
    IEnumerator LoadNewScene(int next)
    {
        //Load the new scene asynchronously, meaning that the previous one is kept loaded until the new one is ready.
        AsyncOperation loadNew = SceneManager.LoadSceneAsync(next);

        //While the new scene isn't done loading, update the loading bar.
        while (!loadNew.isDone)
        {
            //Update the loading bar to represent the loading process.
            loadingBar.fillAmount = loadNew.progress;
            
            //Pause the coroutine until the next frame as not to block the main thread.
            yield return null;
        }
    }

    //Closes the app and saves game options.
    public void AppQuit()
    {   
        //PlayerPrefs (game options) are automatically saved when quitting.
        Application.Quit();
    }
}
