import React, { useLayoutEffect, useEffect } from "react";
import { useGoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from "../../../actions/authActions";
import { refreshTokenSetup } from "./RefreshToken";
import { clientId } from "../../../Common/constants";
import { useLoader } from "../../../Contexts/LoaderContext";
import "./GoogleLogin.scss";
import { setMessage } from "../../../actions/errorsActions";
import { snackbarType } from "../../../Common/dataTypes";
import lan from "../../../Languages/Languages.json";

function GoogleLoginHooks({ goToDashboard }) {
  const [language, setLocalLanguage] = React.useState("En");
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  const { startLoading, finishLoading } = useLoader();
  // @ts-ignore
  const isAuthenticated = useSelector(
    // @ts-ignore

    (state) => state.authReducer.isAuthenticated
  );
  useLayoutEffect(() => {
    if (isAuthenticated) {
      finishLoading();
      goToDashboard();
    }
  }, [isAuthenticated]);

  const dispatch = useDispatch();
  const onSuccess = (res) => {
    try {
      dispatch(loginWithGoogle(res.tokenId));
      refreshTokenSetup(res);
    } catch (error) {
      finishLoading();
      dispatch(setMessage(error.msg, snackbarType.error));
    }
  };
  const onFailure = (res) => {
    dispatch(setMessage(res, snackbarType.error));
    finishLoading();
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: false,
    accessType: "offline",
  });

  return (
    <button
      onClick={() => {
        startLoading();
        signIn();
      }}
      type="button"
      className="login-with-google-btn"
    >
      {lan[language].google_sign_in}
    </button>
  );
}

export default GoogleLoginHooks;
