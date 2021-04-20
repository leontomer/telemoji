import React, { useLayoutEffect } from "react";
import { useGoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from "../../../actions/authActions";
import { refreshTokenSetup } from "./RefreshToken";
import { clientId } from "../../../Common/constants";
import { useLoader } from '../../../Contexts/LoaderContext';
import "./GoogleLogin.scss";

function GoogleLoginHooks({ goToDashboard }) {
  const { startLoading, finishLoading } = useLoader();
  // @ts-ignore
  const isAuthenticated = useSelector((state) => state.authReducer.isAuthenticated);
  useLayoutEffect(() => {
    if (isAuthenticated) {
      finishLoading();
      goToDashboard();
    }
  }, [isAuthenticated]);

  const dispatch = useDispatch();
  const onSuccess = (res) => {
    dispatch(loginWithGoogle(res.tokenId));
    refreshTokenSetup(res);

  };
  const onFailure = (res) => {
    console.error("login failed: res:", res);
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
        signIn()
      }}
      type="button"
      className="login-with-google-btn"
    >
      Sign in with Google
    </button>
  );
}

export default GoogleLoginHooks;
