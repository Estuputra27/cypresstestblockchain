import data from "../support/json_objects/login/login.json"

class LoginObject {
    inputEmail = () => cy.get('input[type="email"][name="identifier"]')
    nextButton = () => cy.contains('button', 'Next')
    inputPassword = () => cy.get('input[type="password"][name="Passwd"]')
    warningButton = () => cy.get('div[jsname="B34EJ"]')
    navigateLoginPage(){
      cy.visit(data.baseURL)
    }

    inputValidEmail(){
      this.inputEmail().clear().type(data.validEmail)
    }

    inputInvalidEmail(){
      this.inputEmail().clear().type(data.invalidEmail)
    }

    inputInvalidPhone(){
      this.inputEmail().clear().type(data.invalidPhoneNumber)
    }

    inputEmptyEmail(){
      this.inputEmail().clear().type(data.emptyEmail)
    }

    inputValidPassword(){
      this.inputPassword().clear().type(data.validPassword)
    }

    inputInvalidPassword(){
      this.inputPassword().clear().type(data.invalidPassword)
    }

    clickNext(){
      this.nextButton().click()
    }

    isShouldExistWarningButton(message) {
      this.warningButton().should('be.visible')
      this.warningButton().contains(message)
    }

    verifySuccessLogin() {
      cy.get('h1').should('contain', 'Welcome')
    }
}

const login = new LoginObject();

describe('Login into Gmail', () => {
  Cypress.on('uncaught:exception', (err) => {
    if (/ResizeObserver loop limit exceeded/.test(err.message)) {
      // returning false here prevents Cypress from
      // failing the test
      return false
    }
  })

    beforeEach(() => {
    cy.clearCookies();
    });

  it('Login with Invalid Credentials (Phone Number)', () => {
    login.navigateLoginPage()
    login.inputInvalidPhone()
    login.clickNext()
    login.isShouldExistWarningButton("Couldn't find your Google Account. Try using your email address instead.")
  })

  it('Login with Empty Credentials', () => {
    login.navigateLoginPage()
    login.inputEmptyEmail()
    login.clickNext()
    login.isShouldExistWarningButton("Enter an email or phone number")
  })

  it('Login with valid email but invalid password', () => {
    login.navigateLoginPage()
    login.inputValidEmail()
    login.clickNext()
    login.inputInvalidPassword()
    login.clickNext()
    login.isShouldExistWarningButton("Wrong password. Try again or click Forgot password to reset it.")
  })

  it('Login with Valid Credentials (Email)', () => {
    login.navigateLoginPage()
    login.inputValidEmail()
    login.clickNext()
    sleep(2000)
    login.inputValidPassword()
    login.clickNext()
    sleep(2000)
    login.verifySuccessLogin()
  })
  
})

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}