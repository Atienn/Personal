using UnityEngine;
using TMPro;

//Allows the user to closely observe a particular body with a camera that moves with it. 
//While in this view, additional information about the body's motion is displayed. 
//Is only used in scenario scenes.
public class CamFixed : MonoBehaviour
{
    //The camera fixed onto the body.
    public Camera cam;
    //The scene's free camera.
    [SerializeField] CamFree freeCam;


    //The axis holding the fixed camera. Is used to rotate the camera around its parent body while always looking at its center.
    Transform camAxis;
    //The body's component responsible of computing gravitational attraction.
    Gravity bodyGrav;

    //The body's motion indicators.
    PhysicsArrows motionArrows;

    //Text elements of the HUD found at the bottom left of the screen. 
    //Used to display position, velocity and acceleration of the parent body.
    [SerializeField] TMP_Text posText, velText, accText;


    //Isn't used in this script, but is required to be public so that the free camera script can access it.
    [HideInInspector] public Collider bodyCollider;
    //Again, isn't used here, but is used by the free camera script and so needs to be public.
    [HideInInspector] public GameObject targetArrows;


    //The multiplier of the camera's rotation. Always stays the same.
    const float rotSpeed = 0.4f;

    //The distance between the fixed camera and the center of its parent body.
    float dist;

    //The maximum distance the fixed camera is allowed to be from its parent body. 
    //Is the same for all camera as their render distance is 10 000.
    const float maxDist = 12500;
    //The minimum distance the fixed camera is allowed to be from the center of its parent body. 
    //Differs for each fixed camera and so can't be defined as a constant.
    [SerializeField] float minDist;
       

    //Tracks if the scenario is paused via the menu. No scene starts on pause.
    bool menuPause = false;
    //Tracks if physics are paused. No scene starts with physics paused.
    bool physPause = false;
    
    //Tracks if the cursor is active. No scenario scene starts with the cursor active.
    bool isCursorActive = false;

    //Tracks if trails can be seen by the camera. No scene starts with trails invisible.
    bool trailsVisible = true;


    //
    //Is called once before the first frame.
    void Start()
    {
        //Get the transform of the camera which is used to rotate the camera around its parent body.
        camAxis = GetComponent<Transform>();
        
        //Assume the fixed camera is a children of a body with gravitational attraction.
        bodyGrav = GetComponentInParent<Gravity>();
        //Assume the body also has a collider to allow it to be targeted by the free camera.
        bodyCollider = GetComponentInParent<Collider>();

        //Assume that the body (parent object) holds a target indicator that might be inactive.
        //Get its gameobject instead of the behaviour to be able to enable/disable the sprite and the script at the same time.
        targetArrows = bodyGrav.GetComponentInChildren<LookAt>(true).gameObject;
        //Assume that the parent body also holds a motion indicators component that might be inactive.
        motionArrows = bodyGrav.GetComponentInChildren<PhysicsArrows>(true);
        
        //Set the camera's distance from the object now that the minimum distance is available.
        dist = 1.5f * minDist;
    }


    //Move the camera according using the current inputs if they should be considered.
    //Is called once per frame.
    void Update()
    {
        //Ignore inputs if viewing from another camera or if the cursor is active.
        if (!menuPause && cam.enabled && !isCursorActive)
        {
            //Rotate the fixed camera around the body using the mouse input.
            camAxis.Rotate(Vector3.forward, Input.GetAxis("Mouse X") * rotSpeed);
            camAxis.Rotate(Vector3.left, Input.GetAxis("Mouse Y") * rotSpeed);
            //Rotate the fixed camera on its own view axis with 'Q' and 'E'.
            camAxis.Rotate(Vector3.down, Input.GetAxis("Roll") * rotSpeed);

            //Modify the distance between the camera and its parent body with 'SHIFT' and 'CTRL'.
            //Multiply the added value by the distance itself to make changes much faster at larger values.
            dist += dist * 0.01f * -Input.GetAxis("Depth");

            //Make sure not to go under the minimal height or over the maximum one.
            if (dist < minDist) { dist = minDist; }
            else if (dist > maxDist) { dist = maxDist; }

            //Move the camera to its new position.
            cam.transform.localPosition = new Vector3(0, dist, 0);
        }
    }


    //Allows/prevents inputs from moving the camera and makes the camera display the body's stored velocity when switching to it.
    //Is called when 'ESCAPE' is pressed or when the pause menu's 'RESUME' button is clicked.
    public void ToggleMenuPause()
    {
        menuPause = !menuPause;
        //if(menuPause && cam.enabled) { infoText2.text = "velocity: " + bodyGrav.storedVelocity; }
    }

    //Makes the camera display the body's stored velocity when switching to it.
    //Is called when 'SPACE' is pressed.
    public void TogglePhysPause()
    {
        physPause = !physPause;
        //if(physPause && cam.enabled) { infoText2.text = "velocity: " + bodyGrav.storedVelocity; }
    }

    //Allows/prevents inputs from moving the camera.
    //Is called when 'ALT' is pressed.
    public void ToggleIsCursorActive() { isCursorActive = !isCursorActive; }


    //Update the velocity text with a new vector to display.
    //Is called when 'SPACE' or 'ESCAPE' are pressed while bodies are in motion.
    public void UpdateVelText(Vector3 velocity) { velText.text = "velocity: " + velocity; }
    
    //Update the acceleration text with a new vector to display.
    //Is called when the body editor's 'APPLY' button is clicked (given correct input values).
    public void UpdateAccText(Vector3 acceleration) { accText.text = "acceleration: " + acceleration; }
    
    //Updates all texts with 3 new vectors to display.
    //Is called 60 times per seconds and when the fixed camera is being switched to while bodies are paused.
    public void UpdateAllText(Vector3 pos, Vector3 vel, Vector3 acc)
    {
        posText.text = "position: " + pos;
        velText.text = "velocity: " + vel;
        accText.text = "acceleration: " + acc;
    }


    //SWITCHING CAMERAS

    //Prepares and enables the camera as well as related components so it can be switched to.
    //Is called when 'TAB' is pressed while observing a body from the free camera.
    public void SwitchTo()
    {
        //Enable trails, regardless of their previous state.
        trailsVisible = true;
        //Translates to "ignore 10th layer and above". 
        //Makes trails (layer 8) and motion indicators (layer 9) visible.
        cam.cullingMask = 0b1111111111;

        //Enables the fixed camera so the user can see through it.
        cam.enabled = true;

        //Enable the motion indicators while viewing from this fixed camera.
        motionArrows.gameObject.SetActive(true);

        //If bodies aren't in motion, the text elements won't be updated on each frame.
        //If switching while bodies are paused, display values that won't be replaced until unpause or switching back.
        if (physPause || menuPause) { UpdateAllText(bodyGrav.body.position, bodyGrav.storedVelocity, bodyGrav.accel); }
    }


    //Switches back to the free camera.
    //Is called when 'TAB' is pressed from this fixed camera.
    public void SwitchOut()
    {
        //Prepares the free camera to be switched to.
        freeCam.SwitchTo();
        //Disable the fixed camera, completing the switch.
        cam.enabled = false;

        //Clear the position text as it's never used by the free camera.
        posText.text = "";

        //Hide the motion indicators so that they aren't seen by other fixed cameras.
        motionArrows.gameObject.SetActive(false);
    }


    //If trails are invisible, makes them visible. Otherwise, makes them invisible.
    //Is called when 'V' is pressed from this fixed camera.
    public void ToggleExtraLayers()
    {
        if (trailsVisible)
        {
            trailsVisible = false;
            //Translates to "ignore 8th layer and above, except 9th". 
            //Makes trails (layer 8) invisible while keeping motion indicators (layer 9) visible.
            cam.cullingMask = 0b1011111111;
        }
        else
        {
            trailsVisible = true;
            //Translates to "ignore 10th layer and above". 
            //Makes trails (layer 8) and motion indicators (layer 9) visible.
            cam.cullingMask = 0b1111111111;
        }
    }
}
