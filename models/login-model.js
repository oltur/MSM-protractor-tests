class LoginModel {
    constructor() {
        this.iframeForm = "iframeForm";
        this.Email = "Email";
        this.PasswordLogin = "PasswordLogin";
        this.SignInButton = "SignInButton";
        this.ContinueButton = "ContinueButton";
        this.StartShoppingBtn = "StartShoppingBtn";
    }
}
exports.getInstance = () => new LoginModel();