using UnityEngine;

//Displays a menu when the scenario is paused and notifies scripts to pause their behaviour or save on computation.
//Is only used in scenario scenes.
public class PauseMenu : MonoBehaviour
{
    //Scripts children of each massive body in the scene.

    //The scripts allowing gravity accleration, a locked on camera, the motion and the target indicators for each body.
    [SerializeField] Gravity[] gravity;
    [SerializeField] CamFixed[] fixedCam;
    [SerializeField] PhysicsArrows[] arrows;
    [SerializeField] LookAt[] lookAt;


    //Scripts related to the menu that pops up on pause.

    //The toggle of the main panel of the menu.
    [SerializeField] UIToggle mainPanel;
    //Scripts of the other panels making the pause menu (controls and settings) with their flasher.
    [SerializeField] GameObject[] extraPanels;
    [SerializeField] Flasher[] extraPanelsFlash;


    //Other independent scripts that also need to noticed of pause.

    //The script responsible for triggering responses to most inputs.
    [SerializeField] InputGather inputs;
    //The scene's free camera.
    [SerializeField] CamFree freeCam;
    //The cross showing the direction of each dimension axis.
    [SerializeField] XYZCross cross;
    //The script responsible for showing/hiding the cursor.
    [SerializeField] CursorMode cursor;


    //Basic variable used for loops.
    byte i;

    
    //Is called whenever 'ESCAPE' or the when the pause menu's 'RESUME' button is pressed.
    public void TogglePausedMenu()
    {
        //Prevents/allows certain inputs from being processed the pause menu has been enabled/disabled. 
        inputs.ToggleMenuPause();

        //Prevents the camera from being moved on pause.
        freeCam.ToggleIsGamePaused();

        //Notifies the scripts of each body to prevent them from moving and to save on useless computation.
        for (i = 0; i < gravity.Length; i++)
        {
            //Prevents the body from moving on pause and stores its velocity so its motion can be resumed.
            gravity[i].PauseMenu();
            //Prevent the camera from being moved on pause.
            fixedCam[i].ToggleMenuPause();
            //Since massive bodies and fixed cameras can't move during pause, motion indicators don't need to be updated.
            arrows[i].ToggleMenuPause();
            //Since massive bodies and the free camera can't move during pause, target indicators don't need to be updated. 
            lookAt[i].ToggleIsPaused();
        }

        //The axis cross doesn't need to be updated in pause since no cameras can move on pause.
        cross.ToggleMenuPause();

        //Notify the cursor, possibly forcing the cursor to be shown or allowing it to be hidden.
        cursor.ToggleIsPaused();

        //Show/removes all panels and show a flash effect for the main one (since it's always shown on pause).
        mainPanel.ToggleUIActivity();

        //Trigger the flash effect for every other panel that was active.
        for(i = 0; i < extraPanels.Length; i++)
        {
            if (extraPanels[i].activeSelf) { extraPanelsFlash[i].Flash(); }
        }
    }
}
