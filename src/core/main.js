export default class Lively {

    constructor() {
        this.t = Date.now();
        this.managers = [];

        this.step();
    }

    static get() {
        if (!window.Lively) window.Lively = new Lively();

        return window.Lively;
    }

    step() {
        const t = Date.now();

        for (const manager of this.managers) manager.step((t - this.t) / 1000);

        this.t = t;
        requestAnimationFrame(this.step.bind(this));
    }

    add(manager) {
        this.managers.push(manager);
    }

    remove(manager) {
        this.managers.splice(this.managers.indexOf(manager), 1);
    }

}