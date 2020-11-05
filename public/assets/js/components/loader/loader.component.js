
export default class LoaderComponent {
    constructor(id, loaderId = null) {
        this.container = document.querySelector('#' + id);
        this.id = id;
        this.loaderId = loaderId;
        this.container.innerHTML = this.render();
    }

    display(display = true) {
        console.log("display " + this.loaderId + "  : " + display);
        if (document.getElementById(this.loaderId)) {
            document.getElementById(this.loaderId).style.display = display ? 'block' : 'none';
        }
    }

    render() {
        return `<div class='loader-spiner' id='${this.loaderId ? this.loaderId : ''}'></div>`;
    }
}
