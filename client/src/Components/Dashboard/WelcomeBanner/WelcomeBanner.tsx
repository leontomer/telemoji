import React from "react";
import "./WelcomeBanner.scss";
import welcomeBannerSvg from "../../../svgs/welcomeBannerSvg.svg";
const WelcomeBanner = () => {
  return (
    <div className="WelcomeBannerContainer">
      <div style={{ color: "white", fontSize: 30 }}>
        <h1>Good evening, Alex </h1>
      </div>
      <div style={{ marginLeft: 1200 }}>
        <img src={welcomeBannerSvg} height="120px" />
      </div>
    </div>
  );
};

export default WelcomeBanner;
