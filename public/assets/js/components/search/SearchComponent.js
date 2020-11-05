import CityListContainer from "../city-list/CityListComponent.js";
import LoaderComponent from "../loader/LoaderComponent.js";

export default class SearchInputContainer {
    constructor() {
        this.container = document.querySelector('#search_input_container');
        this.cityComponent = new CityListContainer();
        this.container.innerHTML = this.render();
        this.afterViewInit();
        this.loader = new LoaderComponent('#search_form_loader', 'search-field-loader');
    }

    searchCity(postalCode) {
        if (postalCode.length >= 3)
        {
            this.loader.display();
            fetch( window.location.href +`cities?postalCode=${postalCode}`).then(response => {
                response.json().then(result => {
                    this.loader.display(false);
                    this.cityComponent.update(result);
                });
            })
        }
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
        return `<input id="search_form" type="number" placeholder="Rechercher par code postal" class="search-field"/>
                <div id="search_form_loader"></div>`;
    }
}
