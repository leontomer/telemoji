import * as React from "react";
import "./LandingPage.css";
import Button from "@material-ui/core/Button";

function LandingPage() {
  return <Frame1 {...frame1Data} />;
}
export default LandingPage;

function Frame1(props: any) {
  const { undrawWorkChatReQes41 } = props;
  const svgBorder = (
    <div className="custom-shape-divider-bottom">
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
          className="shape-fill"
        ></path>
      </svg>
    </div>
  );

  const buttonStyle = {
    backgroundColor: "#53317e",
    color: "#fbfcfc",
    fontSize: "20px",
    letterSpacing: "-0.5px",
  };
  const textContent = (
    <div className="content">
      <h1 className="landingpage-header">
        The only video chat you will ever need
      </h1>
      <h3 className="landingpage-subheader">
        Chat with your friends and get a special experience
      </h3>
      <div style={{ marginTop: "50px" }}>
        <Button style={buttonStyle} variant="contained">
          Get Started
        </Button>
      </div>
    </div>
  );

  const chatPeopleSVG = (
    <div className="landingpage-svg">
      <img src={undrawWorkChatReQes41} alt="" />
    </div>
  );
  return (
    <>
      <div
        className="container"
        style={{ position: "relative", height: "90vh" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          {textContent}
          {chatPeopleSVG}
        </div>
      </div>
      {svgBorder}
    </>
  );
}
const frame1Data = {
  undrawWorkChatReQes41:
    "https://anima-uploads.s3.amazonaws.com/projects/601875c44e1284ba2cadffa4/releases/6018762c23ef6c8e95d11c27/img/undraw-work-chat-re-qes4-1@1x.svg",
};
