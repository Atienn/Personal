using UnityEngine;
using TMPro;

//Allows the user to observe the scene from any angle with a camera that can be freely controlled. 
//The user can switch to a fixed camera by looking at a certain body an pressing 'TAB'.
//Is only used in scenario scenes.
public class CamFree : MonoBehaviour
{
    //The camera the user sees through.
    [HideInInspector] public Camera mainCam;
    //All body-related cameras within the scene.
    [SerializeField] CamFixed[] fixedCams;
    //The cross showing the direction of each dimension axis.
    [SerializeField] XYZCross xyzCross;

    //Text elements of the HUD text found at the bottom left of the screen.
    [SerializeField] TMP_Text lookText, keyToSwitchText, targetPosText, obsPosText, obsSpeed;
    //The reticle at the middle of the screen when the HUD is active.
    [SerializeField] GameObject hudReticle;

    //The scene's music source.
    [SerializeField] MusicPlayer musicSource;


    //The potential raycast hit when checking if the camera is directly looking at a certain body.
    RaycastHit hit;

    //The amount to translate the camera for a single frame.
    Vector3 camMovement;

    //The multiplier of the camera's translation.
    float speed = 0.5f;
    //The multiplier of the camera's rotation. Always stays the same.
    const float rotSpeed = 0.4f;


    //The index of the body being observed in the fixedCams array.
    byte observedIndex;
    //Basic variable used for loops.
    byte i;

    //Tracks if a camera switch is possible.
    bool canSwitch;
    //Tracks if trails can be seen by the camera. All scenarios start with trails visible.
    bool trailsVisible = true;

    //Tracks if the scenario is paused or not. No scene starts on pause.
    bool menuPause = false;
    //Tracks if the cursor is active (if mouse inputs should be processed). No scenario scene starts with the cursor active.
    bool isCursorActive = false; 


    //Sets the camera component and updates HUD text.
    //Is called once before the first frame.
    void Start()
    {
        //Assume there is a camera component attached to the object.
        mainCam = GetComponent<Camera>();

        //Update the HUD text to reflect the starting values.
        obsPosText.text = "observer position: " + transform.position.ToString(); 
        obsSpeed.text = $"observer speed: { (speed * 100f).ToString("F0")}%";
    }


    //Move the camera and check if a valid body is being observed.
    //Is called once per frame.
    void Update()
    {
        //Don't process inputs and don't check if for a new observed body if on pause or if viewing from another camera.
        if (!menuPause && mainCam.enabled)
        {
            //MOVING THE CAMERA
            
            /* Input axes
            mouseX = Mouse X-axis
            mouseY = Mouse Y-axis

            roll = Q, E
            vertical = Up, down
            horizontal = Left, Right
            depth = Shift, Ctrl
            */

            //If the cursor is active, the camera shouldn't move with it.
            //For consistency, don't process other inputs either.
            if (!isCursorActive)
            {
                //Adjust the translative speed of the camera when the mouse is scrolled.
                if (Input.GetAxis("Mouse Scrollwheel") != 0)
                {
                    //Only shift the speed by increments of 0.05.
                    speed += Input.GetAxis("Mouse Scrollwheel") * 0.5f;

                    //Prevent the speed from going under 0.05 and over 1.
                    if (speed < 0.05f) { speed = 0.05f; }
                    else if (speed > 1f) { speed = 1f; }

                    //Update the HUD text to reflect the new value.
                    obsSpeed.text = $"observer speed: { (speed * 100f).ToString("F0")}%";
                }

                //Rotate the camera with 'Q', 'E' and the mouse input.
                transform.Rotate(-Input.GetAxis("Mouse Y") * rotSpeed, Input.GetAxis("Mouse X") * rotSpeed, Input.GetAxis("Roll") * rotSpeed);

                //Get the camera translation for the next frame from 'W', 'A', 'S', 'D', 'SHIFT' and 'CONTROL'
                camMovement = (transform.forward * Input.GetAxis("Depth")) + (transform.right * Input.GetAxis("Horizontal")) + (transform.up * Input.GetAxis("Vertical"));

                //Only update the camera position and HUD text if the camera movement is non-zero.
                if (camMovement != Vector3.zero)
                {
                    transform.position = transform.position + (camMovement.normalized * speed);
                    obsPosText.text = "observer position: " + transform.position.ToString();
                }
            }


            //SWITCHING CAMERAS
            
            //Assume that no body is being observed which means that no switch can be made.
            canSwitch = false;

            //Clear all target arrows to match our assumption.
            for (i = 0; i < fixedCams.Length; i++) { fixedCams[i].targetArrows.SetActive(false); }


            //Fire a ray where the camera is looking of max length 10 000 (the camera's render disance).
            if (Physics.Raycast(mainCam.transform.position, transform.forward, out hit, 10000)) //10,000 is the cam's renderdistance
            {
                //If the ray hits something, check if the collider belongs to a body with a fixed camera.
                for (observedIndex = 0; observedIndex < fixedCams.Length; observedIndex++)
                {
                    //If the instance ID is the same for both colliders, they are the same collider.
                    if (hit.collider.GetInstanceID() == fixedCams[observedIndex].bodyCollider.GetInstanceID())
                    {
                        //Correct the assumption since a recognized body is being observed.
                        canSwitch = true;

                        //Enable the target arrows of the body being observed.
                        fixedCams[observedIndex].targetArrows.SetActive(true);

                        //When a body is observed, display its name and position as well as the key to switch cameras. 
                        lookText.text = "looking at: " + hit.transform.name;
                        targetPosText.text = $"target position: {hit.transform.position}";
                        keyToSwitchText.text = $"press 'TAB' to lock on";

                        //If the matching collider has been found, then we don't need to check any other.
                        break;
                    }
                    //If observed object doesn't have a recognized fixed camera, then only print its position. 
                    //Normally, this code will never be executed as all scenes only have recognized bodies.
                    else
                    {
                        lookText.text = "looking at: " + hit.transform.name;
                        targetPosText.text = $"target position: {hit.transform.position}";
                    }
                }
            }
            //If nothing is being observed (if the ray doesn't hit anything), then clear all text. 
            else
            {
                lookText.text = "";
                targetPosText.text = "";
                keyToSwitchText.text = "";
            }
        }
    }


    //Allows/prevents inputs from moving the camera and bodies from being observed.
    //Is called whenever 'ESCAPE' is pressed or the pause menu's 'RESUME' is clicked.
    public void ToggleIsGamePaused() { menuPause = !menuPause; }

    //Allows/prevents inputs from moving the camera.
    //Is called when 'ALT' is pressed.
    public void ToggleIsCursorActive() { isCursorActive = !isCursorActive; }

    

    //Switches to a fixed camera if possible.
    //Is called if 'TAB' is pressed from the free camera view.
    public void TrySwitch()
    {
        //If a camera switch is possible, 
        if (canSwitch)
        {
            //Make the axes cross' new offset the camera being switched to.
            xyzCross.GetCamReference(fixedCams[observedIndex].cam.transform);

            //Disable the observed body's target indicator.
            fixedCams[observedIndex].targetArrows.SetActive(false);

            //Disable the reticle at the center of the screen as not to obstruct view on the motion indicators.
            hudReticle.SetActive(false);

            //Prepare and enable the camera of the body being observed so it can be switched to.
            fixedCams[observedIndex].SwitchTo();
            //Disable the free camera, completing the switch.
            mainCam.enabled = false;

            //Set text that won't be changed until the next camera switch.
            lookText.text = "locked on: " + hit.collider.name;
            targetPosText.text = "";
            keyToSwitchText.text = $"press 'TAB' to switch back";

            //Give a 15% chance to trigger music on a successful camera switch.
            musicSource.ChanceToTrigger(0.15f);
        }
    }


    //Prepares and enables the camera as well as related components so it can be switched to.
    //Is called if 'TAB' is pressed from a fixed camera. 
    public void SwitchTo()
    {
        //Make the axes cross' new offset the camera being switched to.
        xyzCross.GetCamReference(transform);

        //Enable the reticle again to show the center of the screen (where the ray for observing bodies is cast).
        hudReticle.SetActive(true);

        //Set trails to be enabled, regardless of thier previous state.
        trailsVisible = true;
        //Translates to "ignore 9th layer and above". Makes trails (layer 8) visible.
        mainCam.cullingMask = 0b111111111;

        //Enables the free camera to allow the user to see through it.
        mainCam.enabled = true;

        //Update the HUD text to reflect the free camera's values.
        obsPosText.text = "observer position: "+ transform.position.ToString();
        obsSpeed.text = $"observer speed: { (speed * 100f).ToString("F0")}%";
    }


    //If trails are invisible, makes them visible. Otherwise, makes them invisible.
    //Is called when 'V' is pressed from the free camerad.
    public void ToggleExtraLayers()
    {
        if (trailsVisible)
        {
            trailsVisible = false;
            //Translates to "ignore 8th layer and above". Makes trails (layer 8) invisible.
            mainCam.cullingMask = 0b11111111;
        }
        else
        {
            trailsVisible = true;
            //Translates to "ignore 9th layer and above". Makes trails (layer 8) visible.
            mainCam.cullingMask = 0b111111111;
        }
    }
}
