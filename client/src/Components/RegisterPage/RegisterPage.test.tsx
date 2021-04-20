import { RegisterPageDriver } from "./RegisterPage.driver";
import { Content } from "../../Common/content";
import { htmlText } from "../../utilities/tests/testUtils";

describe("LandingPage tests:", () => {
  let driver: RegisterPageDriver;
  beforeEach(() => {
    driver = new RegisterPageDriver();
  });
  it("renders CopyrightsText", () => {
    const expectedCopyrightsText = [
      Content.copyright,
      Content.app_name,
      " ",
      new Date().getFullYear().toString(),
      ".",
    ].join("");
    expect(driver.CopyrightsText).toBe(expectedCopyrightsText);
  });

  it("renders FirstNameText", () => {
    expect(htmlText(driver.FirstNameText)).toBe(
      asField(Content.register_page_first_name)
    );
  });

  it("renders LastNameText", () => {
    expect(htmlText(driver.LastNameText)).toBe(
      asField(Content.register_page_last_name)
    );
  });

  it("renders EmailText", () => {
    expect(htmlText(driver.EmailText)).toBe(
      asField(Content.register_page_email_address)
    );
  });

  it("renders PasswordText", () => {
    expect(htmlText(driver.PasswordText)).toBe(
      asField(Content.register_page_password)
    );
  });

  it("renders PasswordConfirmText", () => {
    expect(htmlText(driver.PasswordConfirmText)).toBe(
      asField(Content.register_page_confirm_password)
    );
  });

  it("renders SignUpText", () => {
    expect(driver.SignUpText).toBe(Content.register_page_sign_up);
  });

  it("renders SignUpButtonText", () => {
    expect(driver.SignUpButtonText).toBe(Content.register_page_sign_up);
  });

  it("renders SignInLinkText", () => {
    expect(driver.SignInLinkText).toBe(Content.register_page_sign_in);
  });

  function asField(field: string) {
    return `${field} *${field} *`;
  }
});
