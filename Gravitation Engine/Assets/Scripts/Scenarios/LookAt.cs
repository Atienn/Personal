using UnityEngine;

//Rotates the parent gameObject towards the designated source ('looks' at the source object). Used as indicators of which massive object is being oberved.
//Is only used in scenario scenes.
public class LookAt : MonoBehaviour
{
    //The gameObject to rotate the parent gameObject towards.
    [SerializeField] Transform source;

    //Tracks if the game is paused.
    bool menuPause = false;

    //Orients the parent gameObject if the game isn't paused.
    //Is called once per frame after regular Update functions as to orient the object after its source moved.
    void LateUpdate()
    {
        //If the game isn't paused, make the parent gameObject face the source by giving it the same rotation.
        if (!menuPause) { transform.rotation = source.rotation; }
    }


    //Switches the value of isGamePaused.
    //Is called whenever 'ESCAPE' is pressed.
    public void ToggleIsPaused() { menuPause = !menuPause; }
}
