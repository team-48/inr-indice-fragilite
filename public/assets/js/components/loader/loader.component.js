
export default class LoaderComponent {
    constructor(container) {
        this.container = document.querySelector(container);
        this.container.innerHTML = this.render();
    }

    update(display) {
        document.getElementById(this.container).css('display', display ? 'block' : 'none');
    }

    render() {
        return `<div class='loader-spiner'></div>`;
    }
}
