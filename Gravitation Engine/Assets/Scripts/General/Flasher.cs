using UnityEngine;

//Allows a UI element to gain 100% opacity instantly and to lose it gradually, making a 'flash' effect.
//Used both in the menu and in scenario scenes.
public class Flasher : MonoBehaviour
{
    //The UI element that will briefly 'flash'.
    public CanvasGroup effect;

    //The rate at which the effect should lose opacity (or alpha).
    [SerializeField] float fadeSpeed;

    //Tracks if the UI element is losing opacity.
    bool isFading;


    //Sets the effect's alpha value to 100% and starts the fading process.
    //Is called by  on key presses like 'ESCAPE', 'T' or 'SPACE'.
    public void Flash()
    {
        effect.alpha = 1f;
        isFading = true;
    }


    //Moves the effect's alpha value towards 0 if it's fading.
    //Is called once per fixed amount of time (0.1667 seconds) as to make the fade smoother.
    void FixedUpdate()
    {
        //If the effect is fading, move its alpha value towards 0.
        if (isFading)
        {
            effect.alpha = Mathf.MoveTowards(effect.alpha, 0f, fadeSpeed);

            //If the alpha of the effect is now 0, stop the fading process.
            if (effect.alpha == 0f) { isFading = false; }
        }
    }
}