import ComponentDriver from "../../utilities/tests/test-driver";
import RegisterPage from "./RegisterPage";
import { DataHooks } from "../../utilities/tests/dataHooks";

export class RegisterPageDriver extends ComponentDriver {
  constructor() {
    super({ Component: RegisterPage });
  }

  get CopyrightsText() {
    return this.findByDataHook(DataHooks.registerPageCopyrights).first().text();
  }
  get FirstNameText() {
    return this.findByDataHook(DataHooks.registerPageFirstName).first().text();
  }
  get LastNameText() {
    return this.findByDataHook(DataHooks.registerPageLastName).first().text();
  }
  get EmailText() {
    return this.findByDataHook(DataHooks.registerPageEmail).first().text();
  }
  get PasswordText() {
    return this.findByDataHook(DataHooks.registerPagePassword).first().text();
  }
  get PasswordConfirmText() {
    return this.findByDataHook(DataHooks.registerPagePasswordConfirm).first().text();
  }
  get SignUpText() {
    return this.findByDataHook(DataHooks.registerPageSignUp).first().text();
  }
  get SignUpButtonText() {
    return this.findByDataHook(DataHooks.registerPageSignUpButton).first().text();
  }
  get SignInLinkText() {
    return this.findByDataHook(DataHooks.registerPageSignInLink).first().text();
  }
}
