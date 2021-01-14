using UnityEngine;

//Acts as a central script that gathers inputs (except some like camera control) and triggers thier response.
//Such a structure is useful because a lot of interactions between scripts over a single input can be acted out here.
//Is only used in scenario scenes.
public class InputGather : MonoBehaviour
{
    //Inputs that aren't defined within an input axis. 
    //Currently, control re-mapping isn't supported so these keycodes are contants.
    const KeyCode
    pauseGameKey = KeyCode.Escape,      //The key to bring up the pause menu.
    pausePhysKey = KeyCode.Space,       //The key to pause/resume physics.
    camSwitchKey = KeyCode.Tab,         //The key to switch to a fixed camera and back.
    camToggleTrails = KeyCode.V,        //The key to show/hide trails.
    cursorDemand = KeyCode.LeftAlt,     //The key to show/hide the cursor.
    infoPanelKey = KeyCode.T,           //The key to bring up the info panel.
    infoModifyKey = KeyCode.J,          //The key to switch to switch tab within the info panel.
    hudToggleKey = KeyCode.G,           //The key to show/hide the HUD.
    infoNextKey = KeyCode.M,            //The key to move to the next page within the info panel.
    infoBackKey = KeyCode.N;            //The key to move to the previous page within the info panel.
    

    [Header("//Camera-related scripts")]
    //The free cam of the scene.
    [SerializeField] CamFree freeCam;
    //Each camera fixed to a body in the scene.
    [SerializeField] CamFixed[] fixedCams;


    [Header("//Body-related scripts")]
    //Each massive body's gravitation script.
    [SerializeField] Gravity[] gravBodies;
    //The gameobject holding both the motion and target indicator scripts (PhysicsArrow and LookAt). 
    [SerializeField] GameObject[] bodyVisuals;


    [Header("//UI-related scripts")]

    //The script responsible for showing/hiding the cursor on demand.
    [SerializeField] CursorMode cursor;
    //UI element spanning over the entire screen holding a reticle, text and xyz cross.
    [SerializeField] UIToggle hud;

    //Script responsible for showing/hiding the info panel and accomodating other UI elements for the space it takes.
    [SerializeField] InfoPanelToggle infoToggle;
    //Script allowing UI elements to be displayed on the info panel and permitting movement between pages and tabs.
    [SerializeField] InfoPanelDisplay infoDisplay;

    //UI element holing a 'play' symbol that flashes and fades when resuming physics.
    [SerializeField] Flasher playSymbolFlash;
    //UI element holding a 'pause' symbol that is displayed when physics are paused.
    [SerializeField] UIToggle pauseSymbolToggle;


    [Header("//Other scripts")]
    //Script resposible of notifying scripts when the paused menu is enables/disabled.
    [SerializeField] PauseMenu pauseMenu;
    //Script responsible for starting and playing music.
    [SerializeField] MusicPlayer musicPlayer;


    //Tracks if a new scene is being loaded. 
    bool isLoading = false;
    //Tracks if the paused menu is active.
    bool menuPause = false;
    //Tracks if physics are paused.
    bool physPause = false;
    //Tracks if the user is currently typing in an input field.
    bool isTyping = false;


    //Baisc variable used for loops.
    byte i;


    //Allows/prevents further inputs from being registered.
    //Is called when the pause menu's 'QUIT TO MENU' button is clicked.
    public void ToggleIsLoading() { isLoading = true; }


    //Allows/prevents most inputs from being registered (depending if the pause menu is enabled or disabled).
    //Is called whenever 'ESCAPE' is pressed or the when the pause menu's 'RESUME' button is clicked.
    public void ToggleMenuPause() { menuPause = !menuPause; }


    //Prevents most input from being processed since the user might use input keys while typing.
    //Is called when the user clicks an input field.
    public void InputFieldSelected() { isTyping = true; }

    //Allows most inputs to be processed again since the user is no longer typing.
    //Is called when the user clicks elsewhere when an input field is selected.
    public void InputFieldDeselected() { isTyping = false; }


    //If they need to be processed, checks for inputs and executes their behaviour accordingly.
    //This script always uses Input.GetKeyDown instead of Input.GetKey to prevent double inputs.
    //Is called once per frame.
    void Update()
    {
        //No inputs should be procesed while a new scene is being loaded.
        if (!isLoading)
        {
            //If 'ESCAPE' is pressed, notify which will in turn notify other scripts.
            //This will also affect if other inputs are processed.
            if (Input.GetKeyDown(pauseGameKey)) { pauseMenu.TogglePausedMenu(); }

            //All other inputs should be ignored if the pause menu is active or if the user is typing in an input field.
            if (!menuPause && !isTyping)
            {
                //If left 'ALT' is pressed, shows/hides the cursor and diables/enables mouse control for cameras.
                if (Input.GetKeyDown(cursorDemand))
                {
                    cursor.ToggleShowCursor();

                    //Prevents cameras from being rotated while the cursor is unlocked and visible.
                    freeCam.ToggleIsCursorActive();
                    for (i = 0; i < fixedCams.Length; i++) { fixedCams[i].ToggleIsCursorActive(); }
                }

                //If 'SPACE' is pressed, bodies should be paused, fixed cameras should display stored velocity and a pause symbol should be displayed.
                if (Input.GetKeyDown(pausePhysKey))
                {
                    for (i = 0; i < gravBodies.Length; i++) { gravBodies[i].PauseGrav(); }
                    for (i = 0; i < fixedCams.Length; i++) { fixedCams[i].TogglePhysPause(); }

                    pauseSymbolToggle.ToggleUIActivity();

                    //If physics are currently on pause, then flash the play symbol and have a 10% chance to trigger music as they unpause.
                    if (physPause)
                    {
                        playSymbolFlash.Flash();
                        musicPlayer.ChanceToTrigger(0.1f);
                    }

                    //Update the physics pause tracker.
                    physPause = !physPause;
                }

                //If 'TAB' is pressed, then switch camera, if possible.
                if (Input.GetKeyDown(camSwitchKey))
                {
                    //If the free camera is in use, check if a body is being observed and try to switch camera.
                    if (freeCam.mainCam.enabled) { freeCam.TrySwitch(); }

                    //If not, then a fixed camera currently is in use.
                    else
                    {
                        //Find the camera that is currently in use and send the user back to the free camera from there.
                        for (i = 0; i < fixedCams.Length; i++)
                        {
                            if (fixedCams[i].cam.enabled)
                            {
                                fixedCams[i].SwitchOut();
                                break; //If the camera in used was found, then no others need to be checked.
                            }
                        }
                    }
                } 

                //If 'V' is pressed, then enable/disable trails for the camera in use.
                if (Input.GetKeyDown(camToggleTrails))
                {
                    //If the free camera is in use, check if a body is being observed and try to switch camera.
                    if (freeCam.mainCam.enabled) { freeCam.ToggleExtraLayers(); }
                    
                    //If not, then a fixed camera currently is in use.
                    else
                    {
                        //Find the camera that is currently in use and disable trails for it.
                        for (i = 0; i < fixedCams.Length; i++)
                        {
                            if (fixedCams[i].cam.enabled)
                            {
                                fixedCams[i].ToggleExtraLayers();
                                break; //If the camera in used was found, then no others need to be checked.
                            }
                        }
                    }
                    //As trails are enabled/disabled for the camera in use, have a 5% chance to trigger music.
                    musicPlayer.ChanceToTrigger(0.05f);
                }

                //If 'G' is pressed, then enable/disable the HUD and the visuals of each body.
                if (Input.GetKeyDown(hudToggleKey))
                {
                    hud.ToggleUIActivity();
                    for(i = 0; i < bodyVisuals.Length; i++) { bodyVisuals[i].SetActive(!bodyVisuals[i].activeSelf); }
                }

                //If 'T' is pressed, then enable/disable the info panel.
                if (Input.GetKeyDown(infoPanelKey))
                {
                    infoToggle.ToggleInfoPanel();

                    //If the cursor was hovering over an input field, switch its sprite to the general one while since the info panel was just disabled.
                    if (cursor.ReturnIsTextCursor()) { cursor.ChangeToGeneralCursor(); }
                }

                //These inputs should only be processed if the info panel is active.
                if(infoDisplay.isActiveAndEnabled)
                {
                    //If 'J' is pressed, switch the current tab, and change back to the general cursor if necessary.
                    if (Input.GetKeyDown(infoModifyKey))
                    {
                        infoDisplay.SwitchTab();

                        //If the cursor was hovering over an input field, switch its sprite to the general one while since the tab was switched.
                        if (cursor.ReturnIsTextCursor()) { cursor.ChangeToGeneralCursor(); }
                    }

                    //'M' and 'N' presses should only be registered the panel is at the info tab.
                    if (infoDisplay.isAtInfo)
                    {
                        //If 'N' is pressed, go back to the last page.
                        if (Input.GetKeyDown(infoBackKey)) { infoDisplay.PrevPage(); }
                        //If 'M' is pressed, advance to the next page.
                        if (Input.GetKeyDown(infoNextKey)) { infoDisplay.NextPage(); }
                    }
                }
            }
        }
    }
}
