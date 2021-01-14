using UnityEngine;

//Represents bright green indicators of the direction and magnitude of the velocity and acceleration of the body.
//Is only displayed when locked onto a body and when the HUD is enabled.
//Depite the name, the indicators aren't arrow-shaped, but look more like elongated capsules.
//Is only used in scenario scenes.
public class PhysicsArrows : MonoBehaviour
{
    //Holds the position and scale of the game objects creating an arrow representing the body's velocity. 
    [SerializeField] Transform velArrow, velCylinder, velTopSphere, velText;
    //The scaling of the velocity arrow, useful for making very small velocities noticeable.
    [SerializeField] float velMultiplier;
    
    
    //Holds the position and scale of the game objects creating an arrow representing the body's acceleration. 
    [SerializeField] Transform accArrow, accCylinder, accTopSphere, accText;
    //The scaling of the acceleraion arrow, useful for making very small accelerations noticeable.
    [SerializeField] float accMultiplier;

    //The fixed camera related to the the body. Only this camera will be able to see the arrows.
    [SerializeField] Transform fixedCam;

    //Tracks if the scene is paused via the menu. No scene starts on pause.
    bool menuPause = false;


    //Updates the rotation of each arrow's text.
    //Is called once per frame after regular Update functions as to orient the labels after the camera moved.
    void LateUpdate()
    {
        //If the game isn't paused, rotate the arrow letters to face the camera.
        if (!menuPause)
        {
            velText.rotation = fixedCam.rotation;
            accText.rotation = fixedCam.rotation;
        }
    }

    //Updates the acceleration arrow to represent the given 3D vectors.
    //Is called once per frame for each Gravity script if the game isn't paused.
    public void UpdateVelArrow(Vector3 newVelocity)
    {
        //Scales the y component (length) of the arrow's cylinder (body) by the magnitude of the given vector and the arrow length multiplier.
        velCylinder.localScale = new Vector3(velCylinder.localScale.x, newVelocity.magnitude * velMultiplier, velCylinder.localScale.z);


        velCylinder.localPosition = new Vector3(0, velCylinder.localScale.y, 0);
        //Position the arrow's top sphere (tip) to be at the end of the body.
        velTopSphere.localPosition = velCylinder.localPosition * 2f;

        //Position the arrow's text ('v') to be slightly farther than the tip.
        velText.localPosition = new Vector3(0, velTopSphere.localPosition.y + 0.25f, 0);

        //Orient the arrow so that it faces towards the direction of the given vector.
        velArrow.up = newVelocity.normalized;
    }


    //Updates the acceleration arrow to represent the given 3D vector.
    //Is called once per frame for each Gravity script if the game isn't paused.
    public void UpdateAccArrow(Vector3 newAcceleration)
    {
        //Scales the y component (length) of the arrow's cylinder (body) by the magnitude of the given vector and the arrow length multiplier.
        accCylinder.localScale = new Vector3(accCylinder.localScale.x, newAcceleration.magnitude * accMultiplier, accCylinder.localScale.x);

        //Position the arrow's cylinder (body) so that it extends from the body's center.
        accCylinder.localPosition = new Vector3(0, accCylinder.localScale.y, 0);
        //Position the arrow's top sphere (tip) to be at the end of the body.
        accTopSphere.localPosition = accCylinder.localPosition * 2f;

        //Position the arrow's text ('a') to be slightly farther than the tip.
        accText.localPosition = new Vector3(0, accTopSphere.localPosition.y + 0.25f, 0);

        //Orient the arrow so that it faces towards the direction of the given vector.
        accArrow.up = newAcceleration.normalized;
    }

    //Reverses the pause tracker.
    //Is called whenever the game is paused or unpaused (whenever 'ESCAPE' is pressed).
    public void ToggleMenuPause() { menuPause = !menuPause; }
}
