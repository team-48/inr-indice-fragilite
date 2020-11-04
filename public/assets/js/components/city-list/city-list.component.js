import CityStatsContainer from "../stats/stats.component.js";

export default class CityListContainer {
    constructor(cities) {
        this.container = document.querySelector('#search_result_container');
        this.cities = cities;

        this.container.innerHTML = this.render();
        this.afterViewInit();
    }

    afterViewInit() {
        this.cities.forEach((city, index) => {
            const cityElement = document.querySelector(`#city-${index}`);

            cityElement.addEventListener('click', () => {
                new CityStatsContainer(city);
            })
        })
    }

    render() {
        return this.cities.map((city, index) => `<li id="city-${index}">${city.cityName}</li>`).join('')
    }
}
