import ComponentDriver from "../../utilities/tests/test-driver";
import LandingPage from "./LandingPage";
import { DataHooks } from "../../utilities/tests/dataHooks";

export class LandingPageDriver extends ComponentDriver {
  constructor() {
    super({ Component: LandingPage });
  }
  get registerPageButtonText() {
    return this.findByDataHook(DataHooks.landingPageGetStartedButton).text();
  }
  get headerText() {
    return this.findByDataHook(DataHooks.landingPageHeader).text();
  }
  get subHeaderText() {
    return this.findByDataHook(DataHooks.landingPageDescription).text();
  }
}
