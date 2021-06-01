import React, { useState, useEffect } from "react";
import "./WelcomeBanner.scss";
import welcomeBannerSvg from "../../../svgs/welcomeBannerSvg.svg";
import sunSvg from "../../../svgs/sun.svg";
import nightSvg from "../../../svgs/night.svg";
import morningSvg from "../../../svgs/morning.svg";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import lan from "../../../Languages/Languages.json";

const WelcomeBanner = () => {
  // @ts-ignore
  const firstName = useSelector((state) => state.authReducer.user.firstName);

  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  var today = new Date();
  var curHr = today.getHours();
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [welcomeImage, setWelcomeImage] = useState("");
  const styles = useSpring({
    loop: true,
    from: { rotateZ: 0 },
    to: { rotateZ: 360 },
    delay: 2000,
  });

  useEffect(() => {
    if (curHr < 12) {
      setWelcomeMessage(lan[language].dashboard_morning_message);
      setWelcomeImage(morningSvg);
    } else if (curHr < 18) {
      setWelcomeMessage(lan[language].dashboard_afternoon_message);
      setWelcomeImage(sunSvg);
    } else {
      setWelcomeMessage(lan[language].dashboard_evening_message);
      setWelcomeImage(nightSvg);
    }
  }, [language]);

  return (
    <div className="WelcomeBannerContainer">
      <div style={{ color: "white", display: "flex", alignItems: "center" }}>
        <div>
          {firstName && (
            <h1>
              {welcomeMessage},{" "}
              {firstName.charAt(0).toUpperCase() + firstName.slice(1)}
            </h1>
          )}
          {welcomeMessage && (
            <p className="subTitle">
              {lan[language].dashboard_secondary_message}
            </p>
          )}
        </div>
        <div style={{ marginLeft: 50 }} className="rotating-image">
          <img src={welcomeImage} height="100px" />
        </div>
      </div>

      <animated.div
        style={{
          ...styles,
        }}
        className="rotating-image"
      >
        <img src={welcomeBannerSvg} height="120px" />
      </animated.div>
    </div>
  );
};

export default WelcomeBanner;
