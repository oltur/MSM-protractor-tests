class MainPageModel {
    constructor() {
    }

    get ListTitle() {return "ListTitle"};
}
exports.getInstance = () => new MainPageModel();