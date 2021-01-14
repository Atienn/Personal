using UnityEngine;

//Activates/Deactivates a UI element with a flashing effect is 'doFlash' is enabled.
//Used both in the menu and in scenario scenes.
public class UIToggle : MonoBehaviour
{
    //The UI element to activat/deactivate.
    public GameObject obj;
    
    //(OPTIONAL) The Flahser component of the UI element that will flash on activation/deactivation.
    [SerializeField] Flasher flasher;

    //Tracks if a flash should trigger when activating.
    [SerializeField] bool doflash;
    

    //Switch the active state of the UI element and flash if 'doFlash' is active.
    //Called on key presses like 'ESCAPE', 'T', 'H', or 'SPACE'.
    public void ToggleUIActivity()
    {
        obj.SetActive(!obj.activeSelf);

        if (doflash) { flasher.Flash(); }
    }
}
