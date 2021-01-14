using UnityEngine;

//If the app and physics are unpaused, on every frame, calculates the gravitational force felt by the Rigidbody and accelerates it accordingly.
//Is only used in scenario scenes.
public class Gravity : MonoBehaviour
{
    //Newton's gravitational constant. Used for computing gravitational acceleration.
    float gravConst = 6.67430f *  Mathf.Pow(10, -11);


    //Mass of the body. Only affects the rate at which other bodies are attracted towards it.
    //Since the mass of RigidBodies is limited to 10^9, a dedicated value is required for higher masses.
    public float mass;

    //Represents the starting velocity of the object and updates whenever paused.
    public Vector3 storedVelocity;

    //Represents the body's physical aspects (apart from mass).
    [HideInInspector] public Rigidbody body;

     //Tracks the acceleration felt by the body for a single fixed frame.
    [HideInInspector] public Vector3 accel;

    //Keeps the mass, position and velocity assigned to the bddy on scene startup. Used to reset to default.
    [HideInInspector] public float defMass;
    [HideInInspector] public Vector3 defVel, defPos;


    //The fixed camera children of the body.
    CamFixed fixedCam;


    //Indicators of the body's motion (velocity and acceleration).
    PhysicsArrows motionArrows;

    //The trail emitted as the body moves.
    TrailRenderer trail;

    //The time it takes for the trail to fade. Stored so that it can be restored after unpausing.
    float trailTime;

    
    //The array of all other gravitational bodies.
    public Gravity[] attr_Mass;
    

    //Assumes the scene and physics don't start on pause.
    //Tracks if physics are paused.
    bool physPause = false;
    //Tracks if the scene is paused via the menu.
    bool menuPause = false;
    //Tracks the paused state of the body (if any of the previous two are true). The body only move if this is false.
    bool isPaused = false; 


    //Basic variables used for loops.
    byte i, j;


    //Gets components, records values as default and applies the stored velocity.
    //Is called once before displaying the first frame.
    void Start()
    {
        //Assume that a rigidbody is already attached to the object.
        body = GetComponent<Rigidbody>();
        //Assume that a fixed camera is alerady children of the object.
        fixedCam = GetComponentInChildren<CamFixed>(true);
        //Assume that a trail is already children of the object.
        trail = GetComponentInChildren<TrailRenderer>();
        //Assume that motion indicators are already children of the object.
        motionArrows = GetComponentInChildren<PhysicsArrows>(true);

        //Never consider the rigidbody as sleeping unless it is perfectly still.
        body.sleepThreshold = 0;

        //Record the values on scene startup as default.
        defPos = body.position;
        defVel = storedVelocity;
        defMass = mass;
        trailTime = trail.time;

        //storedVelocity is used as the initial velocity.
        body.velocity = storedVelocity;
	}


    //Reverses menuPause and checks if the body should be paused/unpaused as a result.
    public void PauseMenu()
    {
        menuPause = !menuPause;
        ApplyPause();
    }

    //Reverses physPause and checks if the body should be paused/unpaused as a result.
    public void PauseGrav()
    {
        physPause = !physPause;
        ApplyPause();
    }
        
    //Checks if the body should be paused/unpaused now that a pause has been activated/deactivated.
    //Is called when 'ESCAPE' or 'SPACE' is pressed.
    void ApplyPause()
    {
        //If any sort of pause is now active and the body wasn't already paused, then pause it by preventing it from moving.
        if(physPause || menuPause)
        {
            if (!isPaused)
            {
                //storedVelocity holds the velocity the body had while its paused.
                storedVelocity = body.velocity;

                //Stop the body from moving.
                body.Sleep();

                //Prevent the trail from fading out while the body is paused.
                trail.time = Mathf.Infinity;

                //Consider the body as being paused.
                isPaused = true;

                //If the user is seeing trough the body's fixed camera, display the stored velocity instead of the live one.
                if (fixedCam.cam.enabled) { fixedCam.UpdateVelText(storedVelocity); }
            }
        }
        //If there now is no pause active and the body was in pause, unpause it by giving it back its previous velocity.
        else if (isPaused)
        {
            //Allow the body to move again.
            body.WakeUp();

            //Give back the velocity the body had before pause.
            body.velocity = storedVelocity;

            //Give back the trail's original time value.
            trail.time = trailTime;

            //Don't consider the body as paused anymore.
            isPaused = false;
        } 
    }

    //Returns if the body is paused or not.
    //Is called when the body editor's 'APPLY' or 'CURRENT' buttons are clicked.
    public bool ReturnPauseState() { return isPaused; }


    //Replaces the position, velocity and mass of the body with the given values and updates text and indicators if necessary.
    //Is called when the body editor's 'APPLY' button is clicked (given correct input values).
    public void ModifyInitial(Vector3 newPosition, Vector3 newVelocity, float newMass)
    {
        //Clears the trail to only leave a line from the body's previous position to its new one. (Shows how it moved.)
        trail.Clear();

        //Move the body to its new position right after the trail was cleared and assign new mass.
        body.position = newPosition;
        mass = newMass;

        //If bodies are paused, replace the stored velocity and update text and indicators.
        if (isPaused)
        {
            //The new velocity should replace the one that will be given on unpause.
            storedVelocity = newVelocity;

            //Update the velocity indicator to show the new velocity.
            motionArrows.UpdateVelArrow(newVelocity);

            //Recalculate the acceleration text and indicator for all other bodies. (Only has an effect if mass has been changed.)
            for (j = 0; j < attr_Mass.Length; j++) { attr_Mass[j].UpdateAcceleration(); }
        }
        //Otherwise, simply apply its velocity to the body.
        //If bodies are unpaused, all indicators will be updated automatically.
        else { body.velocity = newVelocity; }
    }

    //Recalculates the acceleration felt and applies its value to the fixed camera text and indicator.
    //Is called when the editor's 'APPLY' button is clicked (given correct input values).
    public void UpdateAcceleration()
    {
        accel = CalculateGravAccel();
        motionArrows.UpdateAccArrow(accel);
        fixedCam.UpdateAccText(accel);
    }


    //Tracks the partial and total gravitational acceleration for a single fixed frame.
    Vector3 gravPart, gravTotal;

    //Calculates the total acceleration felt by the body. 
    //Is called 60 times per second and when the editor's 'APPLY' button is clicked.
    Vector3 CalculateGravAccel()
    {
        //Reset gravTotal
        gravTotal = Vector3.zero;  

        //Calculates the directional acceleration for each other body present.
        for (i = 0; i < attr_Mass.Length; i++)
        {
            //Temporarily give gravPart the vector going from it to the attracting body.
            //The magnitude of this vector is the distance between both bodies.
            //This vector will also be used to correctly orient the calculated acceleration.
            gravPart = attr_Mass[i].body.position - body.position;

            //Compute gravitational acceleration through Newton's law of Universal Gravitation: F = G * (m1 * m2) / (r^2).
            //Here, we skip adding the attracted body's mass to the equation as it would be canceled by Newton's Second Law: a = F / m1.
            //We orient the acceleration by using the normalized vector from earlier.
            gravPart = gravPart.normalized * (gravConst * attr_Mass[i].mass) / Mathf.Pow(gravPart.magnitude, 2f);

            //Add the accleration to the total.
            gravTotal += gravPart;
        }

        //After all parts have been added, return the total acceleration.
        return gravTotal;
    }

    //If the body isn't paused, acclerates the body towards others and updates fexed cam text and motion indicators.
    //Is called 60 times per second.
    void FixedUpdate()
    {
        if (!isPaused)
        {
            //Calculate the gravitational acceleration and add it to the rigidbody.
            accel = CalculateGravAccel();
            body.AddForce(accel, ForceMode.Acceleration);

            //Update the motion indicators with the new velociy and acceleration.
            motionArrows.UpdateVelArrow(body.velocity);
            motionArrows.UpdateAccArrow(accel);

            //Only update fixedCam's text if the camera itself is in use as not to have mutiple camera's text competing against one another.
            if (fixedCam.cam.enabled) { fixedCam.UpdateAllText(body.position, body.velocity, accel); }
        }
    }
}

//The following code is unfinished and was deemed unnecessary for the final product.
//It's goal was to allow bodies to merge and to combine mass if they passed too close to one another.
/*
    MERGING BODIES
 
    //When two bodies have overlapping colliders
    void OnTriggerStay(Collider other)
    {
        //Only merge if allowed and the center of the smaller body is touching the bounds of the bigger one
        if (allow_Merge && other.transform.position == sphereCollider.ClosestPoint(other.transform.position))
        {
            //Find the index of the body that is merging
            for (bodyIndex = 0; ; )
            {
                if (attr_Rigid[bodyIndex] == other.attachedRigidbody)
                {
                 break;
                }

               bodyIndex++;
            }

           //Get the values of the absorbing body
            Vector3 mainVelocity = rigid.velocity;
            float diameter = rigid.transform.lossyScale.x;

           //Get the values of the merging body
           Vector3 otherVelocity = other.attachedRigidbody.velocity;
           float otherMass = attr_Mass[bodyIndex].bodyMass;
           float otherDiameter = other.transform.lossyScale.x;

           Debug.Log("Diameter of absorbing body is: " + diameter);
           Debug.Log("Diameter of merging body is:" + otherDiameter);

           //Conservation of momentum and addition of masses
           rigid.velocity = (bodyMass * rigid.velocity + attr_Mass[bodyIndex].bodyMass * other.attachedRigidbody.velocity) / (bodyMass + attr_Mass[bodyIndex].bodyMass);
           bodyMass = bodyMass + otherMass;

           //Add the merged radius to the the absorbing body
           //Error currently returning the diameter value as 1
           float newDiameter = (Mathf.Pow(Mathf.Pow(diameter, 3) + Mathf.Pow(otherDiameter, 3), 1/3));
           Debug.Log("New diameter is: " + newDiameter);
           rigid.transform.lossyScale.Set(newDiameter, newDiameter, newDiameter);

           //Remove smaller body
           Destroy(other.gameObject);
         }
     }
*/
