import CityListContainer from "../city-list/city-list.component.js";

export default class SearchInputContainer {
    constructor() {
        this.container = document.querySelector('#search_input_container');

        this.container.innerHTML = this.render();
        this.afterViewInit();
    }

    searchCity(postalCode) {
        fetch(`http://localhost:8080/cities?postalCode=${postalCode}`).then(response => {
            response.json().then(result => {
                new CityListContainer(result)
            });
        })
    }

    afterViewInit() {
        const searchElement = document.querySelector('#search_form');

        searchElement.addEventListener('input', (e) => {
            this.searchCity(e.target.value);
        })
    }

    render() {
        return `<input id="search_form" type="text" placeholder="Rechercher un lieu" class="search-field"/>`;
    }
}
