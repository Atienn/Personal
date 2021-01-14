using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

//Allows the modification of the position, velocity and mass of bodies with Gravity scripts.
//Is only used in scenario scenes.
public class BodyEditor : MonoBehaviour
{
    //The body that will be edited.
    public Gravity targetBody;

    //The text fields where the user can enter values. There are 7 input fields per body.
    //Indexes 0,1,2 are XYZ for position - 3,4,5 are XYZ for velocity, 6 is for mass
    [SerializeField] InputField[] inputFields = new InputField[7];

    //UI element that will confirm the user if the body's properties has been modified. 
    [SerializeField] TMP_Text resultText;

    //The music player of the scene.
    [SerializeField] MusicPlayer musicPlayer;

    //The new position, velocity and mass to give to the targeted body.
    Vector3 newPos, newVel;
    float newMass;

    //Tracks the validity of the input. 
    bool noErrors;
    //Tracks if the result text being displayed (if ShowResultText is running).
    bool coroutineRunning;


    //Tries to convert the content of each input field to get a position, velocity and mass. If there is no error in that process applies those values to the body.
    //Is called when the 'APPLY' button is clicked.
    public void TryModifyInitial()
    {
        //Assume that the input won't contain any errors.
        noErrors = true;

        //Try to convert the contents of fields 0,1,2 into a 3D position vector.
        //If there is no input, default to the bpdy's current position.
        newPos.x = InputToFloat(0, targetBody.transform.position.x);
        newPos.y = InputToFloat(1, targetBody.transform.position.y);
        newPos.z = InputToFloat(2, targetBody.transform.position.z);


        //To prevent division by 0 when calculating gravitational force, we can't allow bodies to occupy the same position.
        //If there are no errors yet, then the new position vector is valid. Otherwise we can't complete this step.
        //(This is done before converting other inputs because here noErrors only tells us if the position is a valid 3D vector).
        if (!noErrors)
        {
            //If the new position is valid, check if it is the same as another.
            for (int i = 0; i < targetBody.attr_Mass.Length; i++)
            {
                //If the position is already taken, update the validity of the input and highlight all fields relating to position.
                if (newPos == targetBody.attr_Mass[i].transform.position)
                {
                    noErrors = false;
                    HighlightField(0);
                    HighlightField(1);
                    HighlightField(2);
                }
            }
        }


        //If the body is currently paused, then try to convert the contents of the fields 3,4,5 to a 3D velocity vector.
        //If there's no input, default to the body's stored vecloity (since its in pause).
        if (targetBody.ReturnPauseState())
        {
            newVel.x = InputToFloat(3, targetBody.storedVelocity.x);
            newVel.y = InputToFloat(4, targetBody.storedVelocity.y);
            newVel.z = InputToFloat(5, targetBody.storedVelocity.z);
        }

        //Otherwise, again try to convert the contents of the fields 3,4,5 to a 3D velocity vector.
        //If there's no input, default to the body's current velocity.
        else
        {
            newVel.x = InputToFloat(3, targetBody.body.velocity.x);
            newVel.y = InputToFloat(4, targetBody.body.velocity.y);
            newVel.z = InputToFloat(5, targetBody.body.velocity.z);
        }

        //Try to convert the content of the field 6 to a float number.
        newMass = InputToFloat(6, targetBody.mass);
        

        //If there hasn't been any error during conversion, then the new position, velocity and mass are all valid and can given to the body.
        //Also, clear all input fields and try to trigger music. 
        if (noErrors)
        {
            //Modify the body's properties with the new values.
            targetBody.ModifyInitial(newPos, newVel, newMass);

            //Clear all input fields and remove any highlight.
            ClearFields();

            //25% chance to trigger music.
            musicPlayer.ChanceToTrigger(0.25f);    
        }

        //If ShowResultText is running, stop it so that it can be properly restarted.
        //We don't need to update coroutineRunning since it's value will be set as ShowResultText starts.
        if (coroutineRunning) { StopAllCoroutines(); }

        //Start or restart the coroutine. Show text informing the user if thier input was applied.
        StartCoroutine(ShowResultText());
    }


    //Tries to convert the text to a number and warns of an error if that's not possible. If there is no input text, returns the fallback.
    //Is called when the 'APPLY' button is clicked.
    float InputToFloat(byte index, float fallback)
    {
        //If the field is empty, then return the fallback value.
        if (inputFields[index].text.Trim() == "") { return fallback; }

        //Otherwise, try to convert the text into a float number and update the input validity if it isn't possible.
        else
        {
            //The non-fallback value to be returned.
            float output;

            //Check if the entered text can be converted to a number and send the processed value to 'output'.
            //The content of the block will be run if the entered text can't be converted.
            if (!float.TryParse(inputFields[index].text, out output))
            {
                //Update the validity of the text (of that hasn't already been done). Warns that there is at least one error in the input.
                noErrors = false;
                //Highlight the input field with an input error in red.
                HighlightField(index);
            }

            //Return the number value whether it has been converted or not.
            //If the input wasn't converted, the returned value (0f) won't be used because the input will be known to be invalid.
            return output;
        }
    }


    //Make the specified input field's color a dark red to show that it contains an error.
    //Is called when the 'APPLY' button is clicked and an error is present within the input.
    void HighlightField(int index) { inputFields[index].image.color = new Color(0.4f, 0, 0); }


    //Shows text within a UI elements telling the player if their input was applied or not for 1.5 seconds.
    //Is called when the 'APPLY' button is clicked.
    IEnumerator<WaitForSeconds> ShowResultText()
    {
        //Consider the coruoutine to have started.
        coroutineRunning = true;

        //If there are no errors upon being called, then values have been applied.
        if (noErrors) { resultText.text = "VALUES APPLIED"; }
        else { resultText.text = "ERROR"; }

        //Wait for 1 and a half second before continuing.
        yield return new WaitForSeconds(1.5f);

        //After that, clear the UI element and consider the coruoutine to be over.
        resultText.text = "";
        coroutineRunning = false;
    }

    
    //Fills the input fields with the currently held paremeters of the target body.
    //Is called when the 'CURRENT' button is clicked.
    public void ReturnCurrentValues()
    {
        //If the body is in pause, return values with the stored velocity.
        if (targetBody.ReturnPauseState()) { FillInputFields(targetBody.body.position, targetBody.storedVelocity, targetBody.mass); }
       
        //Otherwise, return with the current velocity.
        else { FillInputFields(targetBody.body.position, targetBody.body.velocity, targetBody.mass); }
    }

    //Fills the input fields with the default parameters of the target body.
    //Is called when the 'DEFAULT' button is clicked.
    public void ReturnDefaultValues() { FillInputFields(targetBody.defPos, targetBody.defVel, targetBody.defMass); }
    

    //Write the values of the given position, velocity and mass values to the corresponding input fields.
    //Is called when the 'CURRENT' or 'DEFAULT' buttons are clicked.
    void FillInputFields(Vector3 position, Vector3 velocity, float mass)
    {
        //Write the X,Y,Z components of the given position into fields 0,1,2.
        inputFields[0].text = position.x.ToString();
        inputFields[1].text = position.y.ToString();
        inputFields[2].text = position.z.ToString();

        //Write the X,Y,Z components of the given velocity into fields 3,4,5.
        inputFields[3].text = velocity.x.ToString();
        inputFields[4].text = velocity.y.ToString();
        inputFields[5].text = velocity.z.ToString();

        //Write the value of the given mass into field 6.
        inputFields[6].text = mass.ToString();
    }


    //Clear all input fields and remove any highlight.
    //Is called when the 'CLEAR' button is clicked.
    public void ClearFields()
    {
        for (int i = 0; i < inputFields.Length; i++)
        {
            inputFields[i].text = "";
            inputFields[i].image.color = new Color(0, 0, 0);
        }
    }


    //If the result text is displayed as the behaviour is disabled clear it and stop its coroutine.
    //This prevents the ShowResultText coroutine from getting stuck.
    //Is called when 'T' is pressed to close the info panel or when 'J' is pressed to switch tab.
    void OnDisable()
    {
        //If ShowResultText is running, stop it and clear the text.
        if (coroutineRunning)
        {
            resultText.text = "";
            StopAllCoroutines();

            //The coroutine is over since we just stopped it.
            coroutineRunning = false;
        }
    } 
}
