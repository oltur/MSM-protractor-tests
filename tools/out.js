class Out {

    constructor() {
        this.shift = 0;
        this.lastGroup = "";
    }

    log() {
        let prefix = 
            Array(this.shift * 2).join(" ") + 
        new Date().toISOString();
        Array.prototype.unshift.call(arguments, prefix);
        console.log.apply(this, arguments);
    }

    group(name) {
        this.lastGroup = name || "";
        this.log(`Entering group ${this.lastGroup}`);
        this.shift++;
    }

    groupEnd() {
        this.shift--;
        this.log(`Exiting group`);
        this.lastGroup = "";
    }

}

exports.instance = new Out();