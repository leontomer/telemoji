import { Content } from '../../Common/content';
import LoginPageDriver from './LoginPage.driver';


describe('Login Page', () => {
    let driver = new LoginPageDriver()
  it('renders content', () => { 
    expect(driver.titleText).toEqual(Content.app_name);
    expect(driver.signInText).toEqual(Content.login_page_sign_in)
    expect(driver.usernameField.exists()).toBe(true)
    expect(driver.passwordField.exists()).toBe(true)
  });
});