import React, { useLayoutEffect } from "react";
import "./LandingPage.scss";
import Button from "@material-ui/core/Button";
import { BottomBorder } from "./BottomBorder/BottomBorder";
import { LandingSvg } from "./LandingSvg/LandingSvg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DataHooks } from "../../utilities/tests/dataHooks";
import { Content } from "../../Common/content";

const buttonStyle = {
  backgroundColor: "#53317e",
  color: "#fbfcfc",
  fontSize: "20px",
  letterSpacing: "-0.5px",
};
const textContent = (
  <div className="content">
    <h1 className="landingpage-header" data-hook={DataHooks.landingPageHeader}>
      {Content.landing_page_header}
    </h1>
    <h3
      className="landingpage-subheader"
      data-hook={DataHooks.landingPageDescription}
    >
      {Content.landing_page_description}
    </h3>
    <div
      style={{ marginTop: "50px" }}
      data-hook={DataHooks.landingPageGetStartedButton}
    >
      <Link to="/register">
        <Button style={buttonStyle} variant="contained">
          {Content.landing_page_get_started}
        </Button>
      </Link>
    </div>
  </div>
);

function LandingPage(props) {
  // @ts-ignore
  const isAuthenticated = useSelector(
    // @ts-ignore
    (state) => state.authReducer.isAuthenticated
  );

  useLayoutEffect(() => {
    if (isAuthenticated) {
      props.history.push("/dashboard");
    }
  }, [isAuthenticated]);
  return (
    <div className="landingPageContainer">
      <div className="textContent">{textContent}</div>
      <div className="landingSvg">
        <LandingSvg />
      </div>
      <div className="footer">
        <BottomBorder />
      </div>
    </div>
  );
}
export default LandingPage;
