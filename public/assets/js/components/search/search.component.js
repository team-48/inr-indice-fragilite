import CityListContainer from "../city-list/city-list.component.js";

export default class SearchInputContainer {
    constructor() {
        this.container = document.querySelector('#search_input_container');
        this.cityComponent = new CityListContainer();

        this.container.innerHTML = this.render();
        this.afterViewInit();
    }

    searchCity(postalCode) {
        const url = window.location.href;
        fetch(url +`cities?postalCode=${postalCode}`).then(response => {
            response.json().then(result => {
                this.cityComponent.update(result);
            });
        })
    }

    afterViewInit() {
        const searchElement = document.querySelector('#search_form');

        searchElement.addEventListener('input', (e) => {
            if (e.target.value === "") {
                this.cityComponent.update([]);
                return;
            }
            this.searchCity(e.target.value);
        });
    }

    render() {
        return `<input id="search_form" type="text" placeholder="Rechercher un lieu" class="search-field"/>`;
    }
}
