import React from "react";
import { WidgetLoader, Widget } from "react-cloudinary-upload-widget";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { setUserImageAction } from "../../../../actions/usersActions";


function CloudinaryUploadButton() {
  const dispatch = useDispatch();
  async function captureImage(responseObject) {
    try {
      const imageUrl = responseObject.info.secure_url;
      if (imageUrl) {
        console.log(`got img: ${imageUrl}`);
        dispatch(setUserImageAction({ imageAddress: imageUrl }));
        alert(`uploaded! ${imageUrl}`);
      } else {
        console.error("something went wrong in captureImage");
      }
    } catch (error) {}
  }
  return (
    <>
      <Button style={{ height: "25px", width: "200px", padding: 0 }}>
        <WidgetLoader />
        <Widget
          resourceType={"image"}
          cloudName={"dypnevil0"}
          uploadPreset={"ibuffq8i"}
          buttonText={"Upload Profile Picture"}
          style={{
            color: "white",
            border: "none",
            width: "100%",
            backgroundColor: "#3f51b5",
            borderRadius: "4px",
            height: "25px",
          }}
          cropping={false}
          onSuccess={(responseObject) => {
            captureImage(responseObject);
          }}
          onFailure={console.error}
          logging={false}
          eager={"w_400,h_300,c_pad|w_260,h_200,c_crop"}
          use_filename={false}
        />
      </Button>
    </>
  );
}

export default CloudinaryUploadButton;
