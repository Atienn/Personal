using UnityEngine;

//Orients an 'axis cross' object projected to the UI that shows the relative direction towards each of the 3 dimensions (X, Y and Z) from the user.
//Is only used in scenario scenes.
public class XYZCross : MonoBehaviour
{
    //The camera that the user is currently viewing from.
    [SerializeField] Transform userCam;

    //The 'axis cross' object to rotate relative to the user's camera.
    [SerializeField] Transform cross;

    //The axis labels to orient so that they can always be readable.
    [SerializeField] Transform[] labels;

    //Tracks if the scene is paused via the menu. No scene starts on pause.
    bool menuPause = false;


    //If not on pause, orients the cross and makes labels face the camera projecting to the canvas.
    //Is called once per frame update.
    void Update()
    {
        if(!menuPause)
        {
            Orient();
            FaceObserver();
        }
    }


    //Offsets the cross's rotation by the inverse of the camera's so that from its perspective, it points towards each dimension axis.
    //Is once per frame update.
    void Orient() { cross.rotation = Quaternion.Inverse(userCam.rotation); }


    //Make every axis label face the camera projecting to a UI element.
    //Is called once per frame update.
    void FaceObserver()
    {
        //Give the identity quaternion (0,0,0 in vector form) as a rotation to match the one of the projecting camera.
        for (int i = 0; i < labels.Length; i++) { labels[i].rotation = Quaternion.identity; }
    }


    //Updates the reference of the object the user is viewing from.
    //Is called whenever the user switches from the free camera to a fixed one or vice-versa.
    public void GetCamReference(Transform newCam) { userCam = newCam; }


    //Reverses the pause tracker.
    //Is called whenever the game is paused or unpaused (whenever 'ESCAPE' is pressed).
    public void ToggleMenuPause() { menuPause = !menuPause; }
}
