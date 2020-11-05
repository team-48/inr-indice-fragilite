import CityStatsContainer from "../stats/StatsComponent.js";

export default class CityListContainer {
    constructor() {
        this.container = document.querySelector('#search_result_container');
        this.cities = [];
        this.cityStatsComponent = new CityStatsContainer();

        this.container.innerHTML = this.render();
        this.afterViewInit();
    }

    afterViewInit() {
        this.cities.forEach((city, index) => {
            const cityElement = document.querySelector(`#city-${index}`);

            cityElement.addEventListener('click', () => {
                this.update();
                this.cityStatsComponent.update(city);
                document.querySelector('#search_form').value = "";
            });
        })
    }

    update(cities = []) {
        this.cities = cities;
        this.container.innerHTML = this.render();
        this.afterViewInit();
    }

    render() {
        if (this.cities.length > 0) {
            return `<div class="search-results">` + this.cities.map((city, index) => `
            <div class="result" id="city-${index}">
                <p class="name">${city.cityName}</p>
                <p class="postal-code grey">${city.postalCode}</p>
            </div>`).join('') + `</div>`;
        }
        return ``;
    }
}
