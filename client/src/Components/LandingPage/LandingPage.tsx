import React, { useLayoutEffect } from "react";
import "./LandingPage.scss";
import Button from "@material-ui/core/Button";
import { BottomBorder } from './BottomBorder/BottomBorder';
import { LandingSvg } from './LandingSvg/LandingSvg';
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useLoader } from '../../Contexts/LoaderContext';
import { useSpring, animated } from 'react-spring'

const buttonStyle = {
  backgroundColor: "#53317e",
  color: "#fbfcfc",
  fontSize: "20px",
  letterSpacing: "-0.5px",
};



function LandingPage(props) {
  // @ts-ignore
  const isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);
  const { startLoading, finishLoading } = useLoader();
  useLayoutEffect(() => {
    startLoading()
  }, []);


  const styles = useSpring({
    loop: true,
    to: [
      { opacity: 0, color: '#53317e' },
      { opacity: 1, color: 'white' },
    ],
    from: { opacity: 1, color: 'white' },
    delay: 1000,
  })

  const textContent = (
    <div className="content">
      <animated.div style={{ ...styles }}>
        <h1 className="landingpage-header">
          The only video chat you will ever need
      </h1>
        <h3 className="landingpage-subheader">
          Chat with your friends and get a special experience
      </h3>
      </animated.div>

      <div style={{ marginTop: "50px" }} data-hook="landing-page-button">
        <Link to="/register">
          <Button style={buttonStyle} variant="contained"  >
            Get Started
        </Button>
        </Link>
      </div>
    </div>
  );

  useLayoutEffect(() => {
    if (isAuthenticated) {
      props.history.push("/dashboard");
      finishLoading();
    }
    else if (isAuthenticated !== null) {
      finishLoading();
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return <div className="landingPageContainer"></div>;
  }

  return (
    <div className="landingPageContainer">
      <div className="textContent">
        {textContent}
      </div>
      <div className="landingSvg">
        <LandingSvg />
      </div>
      <div className="footer">
        <BottomBorder />
      </div>
    </div>
  )
}
export default LandingPage;