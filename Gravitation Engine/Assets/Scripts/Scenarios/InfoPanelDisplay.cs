using UnityEngine;
using UnityEngine.UI;
using TMPro;

//Allows page navigation and switching from the info tab to the editor and back.
//Is only used in scenario scenes.
public class InfoPanelDisplay : MonoBehaviour
{
    //UI element holding the text for a specific page.
    [SerializeField] TMP_Text bodyText;
    //UI element holding the page number of the current page.
    [SerializeField] TMP_Text pageText;


    //The text to write on each page.
    [TextArea] [SerializeField] string[] textValues;
    //The text to write on the editor tab.
    [TextArea] [SerializeField] string textInspector;


    //The height the text area should be at when on the editor tab (to make space for the input fields and buttons).
    [Range(.075f, 0.9f)] [SerializeField] float textYAnchorOnInspector;
        
    //The next and previous arrows at full flash intensity.
    [SerializeField] Image arrowLFull, arrowRFull;
    //If the arrows are fading.
    bool arrowLFade, arrowRFade;

    //The arrow buttons to move between pages.
    [SerializeField] GameObject prevButton, nextButton;
    //The info and editor tab buttons.
    [SerializeField] Button infoButton, inspecButton;


    //The two following arrays always need to have the same length. Each element within objectsForText is linked to one in objectIndexes. 
    //Linked elements are at the same index position in their respective array. This allows us to only display specific objects on certain pages.

    [Header("//These are displayed to accompany text")]
    //Any UI element that needs to be displayed on a specific pags.
    [SerializeField] GameObject[] objectsForText;
    //The page index that each element in objectsForText should appear on.
    public int[] objectIndexes;


    [Header("//These get displayed/removed for the inspector tab")]
    //Any UI elments that needs to be displayed on the editor menu.
    [SerializeField] GameObject[] objectsForEditing;

    //The index of the current page (starting from 0).
    byte pageIndex = 0;
    //Basic variable used for loops
    byte i;

    //If the panel is currently in the info tab. No scenario start on the editor tab.
    [HideInInspector] public bool isAtInfo = true;


    //Updates to display the first page.
    //Is called once before thr first frame.
    void Start() { UpdatePage(); }


    //Deactivates objects not required for the current page and activates the ones that are needed. 
    //Is called if 'M', 'N' or 'TAB' are pressed or if the arrow buttons or the 'INFO'/'EDITOR' buttons are clicked.
    void UpdatePage()
    {
        //Cycle through all objects. If the object's index matches the page's, activate it. Otherwise, deactivate it.
        for (i = 0; i < objectIndexes.Length; i++)
        {
            if (pageIndex == objectIndexes[i]) { objectsForText[i].SetActive(true); }
            else { objectsForText[i].SetActive(false); }
        }

        //Write the text with index matching the page's within the panel.
        bodyText.text = textValues[pageIndex];

        //Update the text displaying the page number.
        pageText.text = $"page: {pageIndex + 1}/{textValues.Length}";
    }


    //Sets all objects in the array to be either active or inactive depending on the given state value.
    //Is called when 'TAB' is pressed or if the panel's 'INFO' or 'EDITOR' buttons are clicked.
    void SetActiveStateAll(GameObject[] gameObjects, bool state)
    {
        for (i = 0; i < gameObjects.Length; i++) { gameObjects[i].SetActive(state); }
    }


    //Enables the contents of the info or editor and disables the ones of the other.
    //Is called when 'TAB' is pressed or if the panel's 'INFO' or 'EDITOR' buttons are clicked.
    public void SwitchTab()
    {
        //If at the info tab, enable the editor.
        if (isAtInfo)
        {
            //Resize the text area so that input fields and buttons can be displayed atop of it.
            bodyText.rectTransform.anchorMax = new Vector2(0.97f, textYAnchorOnInspector);
            //Write the text needed for the editor tab.
            bodyText.text = textInspector;

            //Enable all objects needed for the editor and disable all that are used in the info tab.
            SetActiveStateAll(objectsForEditing, true);
            SetActiveStateAll(objectsForText, false);

            //Disable the next page and previous page buttons.
            prevButton.SetActive(false);
            nextButton.SetActive(false);
            //Disable the text showing the page number.
            pageText.gameObject.SetActive(false);

            //Allow the 'INFO' button to be clicked to switch tabs again.
            infoButton.interactable = true;
            //Prevent the 'EDITOR' button from switching tab since it's the tab that is 'selected'.
            inspecButton.interactable = false;
        }
        //If at the editor tab, enable the info.
        else
        {
            //Set the text area back to it's original size and position.
            bodyText.rectTransform.anchorMax = new Vector2(0.97f, 0.925f);

            //Disable all objects needed for the editor and enable the ones used in the current page.
            SetActiveStateAll(objectsForEditing, false);
            UpdatePage();

            //Enable the next page and previous page buttons.
            prevButton.SetActive(true);
            nextButton.SetActive(true);
            //Enable the text showing the page number.
            pageText.gameObject.SetActive(true);

            //Prevent the 'INFO' button from switching tab since it's the tab that is 'selected'.
            infoButton.interactable = false;
            //Allow the 'EDITOR' button to be clicked to switch tabs again.
            inspecButton.interactable = true;
        }

        //Update the tab tracker.
        isAtInfo = !isAtInfo;
    }


    //Moves to the previous page and updates the page.
    //Is called when 'N' is pressed or if the left arrow button is clicked.
    public void PrevPage()
    {
        //If not currently on the starting page, lower the page index and update the page.
        if (pageIndex > 0)
        {
            pageIndex--;
            UpdatePage();
        }

        //Make the left arrow flash.
        arrowLFade = true;
        arrowLFull.color = new Color(1, 1, 1, 1);
    }
    
    //Moves to the next page and updates the page.
    //Is called when 'M' is pressed or if the right arrow button is clicked.
    public void NextPage()
    {
        //If not currently on the last page, up the page index and update the page.
        if (pageIndex < (textValues.Length - 1))
        {
            pageIndex++;
            UpdatePage();
        }

        //Make the right arrow flash.
        arrowRFade = true;
        arrowRFull.color = new Color(1, 1, 1, 1);
    }


    //Fades out arrows when they need to.
    //Is called every sixtieth of a second.
    void FixedUpdate()
    {
        //If left arrow is fading, steadily decrease its alpha value without going under 0.
        if (arrowLFade)
        {
            //Since alpha can't be modified directly, create a new color with the desired alpha.
            arrowLFull.color = new Color(1, 1, 1, Mathf.MoveTowards(arrowLFull.color.a, 0, 0.1f));

            //If the image's alpha is now 0, stop the fading process.
            if (arrowLFull.color.a == 0) { arrowLFade = false; }
        }

        //If right arrow is fading, steadily decrease its alpha value without going under 0.
        if (arrowRFade)
        {
            //Since alpha can't be modified directly, create a new color with the desired alpha.
            arrowRFull.color = new Color(1, 1, 1, Mathf.MoveTowards(arrowRFull.color.a, 0, 0.1f));

            //If the image's alpha is now 0, stop the fading process.
            if (arrowRFull.color.a == 0) { arrowRFade = false; }
        }
    }
}
