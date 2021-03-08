import LoginPage from "./LoginPage";
import { DataHook } from "../../Common/DataHooks";
import ComponentDriver from "../../Common/component-driver";

export default class LoginPageDriver extends ComponentDriver {
  constructor() {
    super({ Component: LoginPage });
  }

  get titleText() {
    return this.findByDataHook(DataHook.LoginPageTitle).text();
  }

  get usernameField() {
    return this.findByDataHook(DataHook.LoginPageUsernameTextField);
  }

  get passwordField() {
    return this.findByDataHook(DataHook.LoginPagePasswordTextField);
  }

  get signInText() {
    return this.findByDataHook(DataHook.LoginPageSignInText).text();
  }
}
