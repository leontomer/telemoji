import { LandingPageDriver } from "./LandingPage.driver";
import { Content } from "../../Common/content";

describe("LandingPage tests:", () => {
  let driver: LandingPageDriver;
  beforeEach(() => {
    driver = new LandingPageDriver();
  });
  it("renders get started button", () => {
    expect(driver.registerPageButtonText).toBe(
      Content.landing_page_get_started
    );
  });
  it("renders header", () => {
    expect(driver.headerText).toBe(Content.landing_page_header);
  });
  it("renders sub-header", () => {
    expect(driver.subHeaderText).toBe(Content.landing_page_description);
  });
});
