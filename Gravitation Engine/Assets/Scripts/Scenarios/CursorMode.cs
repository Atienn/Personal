using UnityEngine;

//Allows displaying of the cursor only when desired (as not to show it while controlling the camera). Also swithces the displayed texture of the cursor when hovering over a text box.
//Sometimes, the operating system can force the cursor to become visible. So, we can't refer to the Cursor object directly for a consistent behaviour.
//Is only used in scenario scenes.
public class CursorMode : MonoBehaviour
{
    //Tracks if the game is paused. No scene starts on pause.
    bool isMenuPause = false;
    //Tracks if the cursor is hovering over a text box. Assume the cursor won't start over one.
    bool isTextCursor = false;
    //Tracks if the user wishes to display the cursor. No scenario scene starts with the cursor enabled.
    bool showCursor = false;
    
    
    //The texture of the general purpose cursor.
    [SerializeField] Texture2D arrowCursor;

    //The texture of the cursor used when hovering over text that can be edited.
    [SerializeField] Texture2D textCursor;


    //Sets the cursor in its inital state where it isn't displayed.
    //Is called once before the first frame update.
    void Start()
    {
        //Sets the cursor to be invisible and restrained to the center of the screen.
        Cursor.visible = false;
        Cursor.lockState = CursorLockMode.Locked;
    }


    //Updates the value of isGamePaused and re-determines if the cursor should be displayed.
    //Is called whenever 'ESCAPE' is pressed.
    public void ToggleIsPaused()
    {
        isMenuPause = !isMenuPause;

        //Determine if the cursor should be now shown/hidden with this value change.
        ApplyCursorMode();
    }


    //Updates the desire of the user to display/hide the cursor and re-determines if it should be displayed.
    //Is called whenever 'ALT' is pressed and the game isn't paused.
    public void ToggleShowCursor()
    {
        showCursor = !showCursor;

        //Determine if the cursor should be now shown/hidden with this value change.
        ApplyCursorMode();
    }

    //Determines if the cursor should be displayed and updates its values accordingly.
    //Is called whenever 'ESCAPE' is pressed or when 'ALT' is pressed when the game isn't paused.
    void ApplyCursorMode()
    {
        //If the game is paused or the user demands it, unlock and display the cursor.
        if (isMenuPause || showCursor)
        {
            Cursor.visible = true;
            Cursor.lockState = CursorLockMode.None;
        }
        //Otherwise, make the cursor invisible and locked in the middle of the window.
        else
        {
            Cursor.visible = false;
            Cursor.lockState = CursorLockMode.Locked;
        }
    }


    //Switches the cursor's display to a typical text cursor centered from the middle.
    public void ChangeToTextCursor()
    {
        Cursor.SetCursor(textCursor, new Vector2(50, 50), UnityEngine.CursorMode.Auto);
        isTextCursor = true;
    }


    //Switches the cursor's display to an arrow similar to the cursor of most operating systems centered from the top-left.
    public void ChangeToGeneralCursor()
    {
        Cursor.SetCursor(arrowCursor, new Vector2(0, 0), UnityEngine.CursorMode.Auto);
        isTextCursor = false;
    }


    //Returns the state of the cursor's texture. False: General, True: Text.
    public bool ReturnIsTextCursor() { return isTextCursor; }
}
