import React, { useEffect } from "react";
import { WidgetLoader, Widget } from "react-cloudinary-upload-widget";
import { useDispatch, useSelector } from "react-redux";
import { setUserImageAction } from "../../../../actions/usersActions";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

function CloudinaryUploadButton() {
  const dispatch = useDispatch();

  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  async function captureImage(responseObject) {
    try {
      const imageUrl = responseObject.info.secure_url;
      if (imageUrl) {
        dispatch(setUserImageAction({ imageAddress: imageUrl }));
      } else {
        console.error("something went wrong in captureImage");
      }
    } catch (error) {}
  }
  return (
    <>
      <div
        style={{
          height: "30px",
          width: "30px",
          padding: 0,
          borderRadius: "30px",
        }}
      >
        <WidgetLoader />
        <Widget
          resourceType={"image"}
          cloudName={"dypnevil0"}
          uploadPreset={"ibuffq8i"}
          buttonText={<AddAPhotoIcon fontSize="small" />}
          style={{
            color: "white",
            border: "none",
            width: "100%",
            backgroundColor: "#3f51b5",
            borderRadius: "30px",
            height: "30px",
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
      </div>
    </>
  );
}

export default CloudinaryUploadButton;
