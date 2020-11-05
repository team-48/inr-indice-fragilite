
export default class LoaderComponent {
    constructor(container, loaderId = null) {
        this.container = document.querySelector(container);
        this.loaderId = loaderId;
        if (this.container) {
            this.container.innerHTML = this.render();
        }
    }

    display(display = true) {
        if (document.getElementById(this.loaderId)) {
            document.getElementById(this.loaderId).style.display = display ? 'block' : 'none';
        }
    }

    render() {
        return `<div class='loader-spiner' id='${this.loaderId ? this.loaderId : ''}'></div>`;
    }
}
