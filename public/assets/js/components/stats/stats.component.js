import GeneratePdfBtnComponent from "../generate-pdf-btn/generate-pdf-btn.component.js";

export default class CityStatsContainer {
    constructor() {
        this.container = document.querySelector('#city_statistic_container');
        this.update();
    }

    update(city = null) {
        this.city = city;
        this.container.innerHTML = this.render();
        if (this.city != null) {
            this.generatePDFBtn = new GeneratePdfBtnComponent();
            this.generatePDFBtn.update();
        }
    }

    render() {
        if (this.city != null) {
            return `

    <div class="stats-header">
        <h1>${this.city.cityName} (${this.city.postalCode})</h1>
        <div class="center-vertically" id="generate-pdf-btn-container"></div>
    </div>

    <div class="top">

        <div class="left">
            <div class="bloc stat">
                <p>Accès aux interfaces numériques</p>
                <h1 class="number">21</h1>
            </div>

            <div class="bloc stat">
                <p>Accès à l'information</p>
                <h1 class="number">71</h1>
            </div>

            <div class="bloc stat">
                <p>Compétences administratives</p>
                <h1 class="number">122</h1>
            </div>

            <div class="bloc stat">
                <p>Compétences numériques / scolaires</p>
                <h1 class="number">46</h1>
            </div>

            <div class="bloc stat">
                <p>Accès</p>
                <h1 class="number">46</h1>
            </div>

            <div class="bloc stat">
                <p>Compétences</p>
                <h1 class="number">82</h1>
            </div>

            <div class="bloc stat">
                <p>Score global</p>
                <h1 class="number">64</h1>
            </div>
        </div>

        <div class="right">

            <div class="bloc map">
                <div class="bloc-header">
                    <h2>Carte</h2>
                </div>
                <img src="/assets/images/map.png"/>
            </div>

        </div>

    </div>

    <div class="show-more">
        <p class="grey">En savoir plus</p>
    </div>`;
        } else {
            return `
            <div class="no-cities">
                <img src="/assets/images/fogg-203.png" alt="Aucun lieu sélectionné">
            </div>`;
        }

    }
}
