using UnityEngine;
using UnityEngine.UI;
using TMPro;

//Allows customization of certain setting like volume, screen display type and if the app should run in the background.
//Is used in all scenes.
public class GameOptions : MonoBehaviour
{
    //VOLUME

    //Slider affecting the app's music volume.
    public Slider sliderMusicVolume;
    //UI text showing the value of the volume slider.
    [SerializeField] TMP_Text sliderAmount;
    
    //Updates the text next to the slider to reflect its value.
    //Is called whenever the volume slider is dragged.
    public void UpdateSliderTextPercent(float newValue) { sliderAmount.text = $"{newValue}%"; }

    //DISPLAY TYPE

    //Dropdown affecting the app's display type.
    [SerializeField] TMP_Dropdown dropdownDisplayType;
    //UI text describing the display type selected. 
    [SerializeField] TMP_Text displayDescriptionText;

    //Descriptions for both display types available (FullscreenWindow and Windowed).
    string[] displayDescriptions = { "window covering the whole screen", "standard non-maximized window" };

    //Writes a description to match the selected display type.
    //Is called when a new value is selected in the display dropdown.
    public void ChangeDisplayDescription()  { displayDescriptionText.text = $"a " + displayDescriptions[dropdownDisplayType.value]; }

    //Sets the selected value in the dropdown as the new display mode.
    //Since the dropdown only has 2 options, adding .5 and multiplying by 2 casts the chosen option (0 or 1) to 1 and 3 (FullscreenWindow or Windowed).
    //Is called when the setting's 'APPLY' button is clicked.
    public void ApplyDisplayType() { Screen.fullScreenMode = (FullScreenMode)((dropdownDisplayType.value + 0.5) * 2); }


    //RUN IN BACKGROUND

    //Toggle affecting if the app runs in the backgound.
    [SerializeField] Toggle toggleBackgroundRun;
    //UI text stating if the app will run in the background.
    [SerializeField] TMP_Text backgroundRunDesc;

    //Allows/prevents the app from running when not in focus and updates the description to reflect the change.
    //Is called whenever the toggle is activated/deactivated.
    public void ChangeRunInBackground()
    {
        Application.runInBackground = toggleBackgroundRun.isOn;
        
        if (Application.runInBackground) { backgroundRunDesc.text = "the app will keep running in the background"; }
        else { backgroundRunDesc.text = "the app will halt if not in focus"; }
    }


    //The following requires that the music player script's Start function has already been executed.
    //Otherwise, setting the volume slider causes an audio source to be used when it has yet to be defined.
    //This means that this script must be later in the execution order.

    //Retrieves the saved settings from memory and applies them. If they don't exist yet, create them with default values.
    //Is called once before the first frame.
    void Start()
    {
        //If the key "MusicVolume" doesn't already exist, create it with a value of 10%.
        sliderMusicVolume.value = PlayerPrefs.GetFloat("MusicVolume", 0.1f) * 100f;

        //If the key "RunInBackground" doesn't already exist, create it with a value of 0 (false for our purposes).
        toggleBackgroundRun.isOn = PlayerPrefs.GetInt("RunInBackground", 0) == 1;

        //Check if the app is in windowed mode to set the dropdown value. If it isn't, then its in Fullscreen window.
        dropdownDisplayType.value = (Screen.fullScreenMode == FullScreenMode.Windowed) ? 1 : 0;
    }


    //Saves current settings to memory so they can be retrieved on next scene startup.
    //Is called when moving between scenes.
    public void SavePreferences()
    {
        PlayerPrefs.SetFloat("MusicVolume", sliderMusicVolume.value * 0.01f);
        PlayerPrefs.SetInt("RunInBackground", toggleBackgroundRun.isOn ? 1 : 0);
        PlayerPrefs.Save();
    }
}
