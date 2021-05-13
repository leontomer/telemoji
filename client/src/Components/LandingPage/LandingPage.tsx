import React, { useLayoutEffect, useEffect } from "react";
import "./LandingPage.scss";
import Button from "@material-ui/core/Button";
import { BottomBorder } from "./BottomBorder/BottomBorder";
import { LandingSvg } from "./LandingSvg/LandingSvg";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useLoader } from "../../Contexts/LoaderContext";
import lan from "../../Languages/Languages.json";

function LandingPage(props) {
  // @ts-ignore
  const buttonStyle = {
    backgroundColor: "#53317e",
    color: "#fbfcfc",
    fontSize: "20px",
    letterSpacing: "-0.5px",
  };

  const dispatch = useDispatch();
  const [language, setLocalLanguage] = React.useState("En");
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);

  const isAuthenticated = useSelector(
    // @ts-ignore
    (state) => state.authReducer.isAuthenticate
  );

  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);

  const textContent = (
    <div className="content">
      <h1 className="landingpage-header">{lan[language].landing_page_text1}</h1>
      <h3 className="landingpage-subheader">
        {lan[language].landing_page_text2}
      </h3>
      <div style={{ marginTop: "50px" }} data-hook="landing-page-button">
        <Link to="/register">
          <Button style={buttonStyle} variant="contained">
            {lan[language].landing_page_button}
          </Button>
        </Link>
      </div>
    </div>
  );

  const { startLoading, finishLoading } = useLoader();
  useLayoutEffect(() => {
    startLoading();
  }, []);

  useLayoutEffect(() => {
    if (isAuthenticated) {
      props.history.push("/dashboard");
      finishLoading();
    } else if (isAuthenticated !== null) {
      finishLoading();
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return <div className="landingPageContainer"></div>;
  }

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
