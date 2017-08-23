class LoginModel {
    constructor() {
    }

    get iframeForm() { return "iframeForm" };
    get Email() { return "Email" };
    get PasswordLogin() { return "PasswordLogin" };
    get SignInButton() { return "SignInButton" };
    get ContinueButton() { return "ContinueButton" };
    get StartShoppingBtn() { return "StartShoppingBtn" };
}
exports.getInstance = () => new LoginModel();