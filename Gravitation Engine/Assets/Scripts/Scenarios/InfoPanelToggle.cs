using UnityEngine;

//Enables/Disables the info panel and moves/resizes UI elements accordingly.
//Is only used in scenario scenes.
public class InfoPanelToggle : MonoBehaviour
{
    //The script that holds the info panel and that will enable/disable it.
    [SerializeField] UIToggle panelToggle;

    //The array of cameras used in the scene.
    [SerializeField] Camera[] cams;

    //The UI elements that will resized or be moved when enabling/disabling the info panel.
    [SerializeField] RectTransform hud, xyz;


    //Resizes and moves UI elements before activating/deactivating the info panel.
    //Called when 'T' is pressed.
    public void ToggleInfoPanel()
    {
        //If the info panel is already active, set each UI element back to thier original positions.
        if(panelToggle.obj.activeSelf)
        {
            //Resized each camera's display as to take up the entire window.
            for(byte i = 0; i < cams.Length; i++) { cams[i].rect = new Rect(0, 0, 1, 1); }

            //Resize the hud to match the camera's display.
            hud.anchorMax = Vector2.one;
            hud.anchoredPosition = Vector2.zero;

            //Compress the XYZ cross display slightly since it was made wider with the HUD.
            xyz.anchorMin = new Vector2(0.9f, 0.85f);
            xyz.anchoredPosition = Vector2.zero;
        }
        //If the panel is inactive, make space for it by resizing and moving UI element.
        else
        {
            //Resized each camera's display as to take up just over half of the window.
            for(byte i = 0; i < cams.Length; i++) { cams[i].rect = new Rect(0, 0, .55f, 1f); }

            //Resize the hud to match the camera's display.
            hud.anchorMax = new Vector2(0.55f, 1f);
            hud.anchoredPosition = Vector2.zero;

            //Make the XYZ cross slightly display wider since reducing the HUD's width compressed it.
            xyz.anchorMin = new Vector2(0.85f, 0.85f);
            xyz.anchoredPosition = Vector2.zero;
        }

        //Enable/disable the info panel.
        panelToggle.ToggleUIActivity();
    }
}
