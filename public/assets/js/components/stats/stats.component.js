import GeneratePdfBtnComponent from "../generate-pdf-btn/generate-pdf-btn.component.js";

export default class CityStatsContainer {
    constructor() {
        this.container = document.querySelector('#city_statistic_container');
        this.cityStats = null

        this.update();
    }

    update(city = null) {
        this.city = city;
        this.loadCity(() => {
            this.container.innerHTML = this.render();
            if (this.city != null) {
                this.generatePDFBtn = new GeneratePdfBtnComponent();
                this.generatePDFBtn.update();
            }
        });
    }

    loadCity(onCityLoaded) {
        if (this.city === null) {
            return;
        }

        fetch(`${window.location.href}stats/${this.city.cityCode}`).then(response => {
            response.json().then(result => {
                this.cityStats = result;
                onCityLoaded();
            })
        })
    }

    averageData() {
        let moyenneInterfaceNumeriques = 0;
        let moyenneAccesInfo = 0;
        let moyenneCompetencesAdmin = 0;
        let moyenneCompetencesNumeriquesScolaires = 0;
        let moyenneAcces = 0;
        let moyenneCompetence = 0;
        let moyenneScoreGlobal = 0;
        this.cityStats.forEach(function(stat) {
            moyenneInterfaceNumeriques += parseFloat(stat['ACCÈS AUX INTERFACES NUMERIQUES region 1']);
            moyenneAccesInfo += parseFloat(stat['ACCES A L\'INFORMATION region 1']);
            moyenneCompetencesAdmin += parseFloat(stat['COMPETENCES ADMINISTATIVES region 1']);
            moyenneCompetencesNumeriquesScolaires += parseFloat(stat['COMPÉTENCES NUMÉRIQUES / SCOLAIRES region 1']);
            moyenneAcces += parseFloat(stat['GLOBAL ACCES region 1']);
            moyenneCompetence += parseFloat(stat['GLOBAL COMPETENCES region 1']);
            moyenneScoreGlobal += parseFloat(stat['SCORE GLOBAL region * ']);
        });
        return {
            'moyenneInterfaceNumerique': moyenneInterfaceNumeriques / this.cityStats.length,
            'moyenneAccesInfo': moyenneAccesInfo / this.cityStats.length,
            'moyenneCompetencesAdmin': moyenneCompetencesAdmin / this.cityStats.length,
            'moyenneCompetencesNumeriquesScolaires': moyenneCompetencesNumeriquesScolaires / this.cityStats.length,
            'moyenneAcces': moyenneAcces / this.cityStats.length,
            'moyenneCompetences': moyenneCompetence / this.cityStats.length,
            'moyenneScoreGlobal': moyenneScoreGlobal / this.cityStats.length
        }
    }

    render() {
        const averages = this.averageData();

        if (this.city !== null && this.cityStats !== null) {
            return `

    <div class="stats-header">
        <h1>${this.city.cityName} (${this.city.postalCode})</h1>
        <div class="center-vertically" id="generate-pdf-btn-container"></div>
    </div>

    <div class="top">

        <div class="left">
            <div class="bloc stat">
                <p>Accès aux interfaces numériques</p>
                <h1 class="number">${averages['moyenneInterfaceNumerique'].toFixed(2)}</h1>
            </div>

            <div class="bloc stat">
                <p>Accès à l'information</p>
                <h1 class="number">${averages['moyenneAccesInfo'].toFixed(2)}</h1>
            </div>

            <div class="bloc stat">
                <p>Compétences administratives</p>
                <h1 class="number">${averages['moyenneCompetencesAdmin'].toFixed(2)}</h1>
            </div>

            <div class="bloc stat">
                <p>Compétences numériques / scolaires</p>
                <h1 class="number">${averages['moyenneCompetencesNumeriquesScolaires'].toFixed(2)}</h1>
            </div>

            <div class="bloc stat">
                <p>Accès</p>
                <h1 class="number">${averages['moyenneAcces'].toFixed(2)}</h1>
            </div>

            <div class="bloc stat">
                <p>Compétences</p>
                <h1 class="number">${averages['moyenneCompetences'].toFixed(2)}</h1>
            </div>

            <div class="bloc stat">
                <p>Score global</p>
                <h1 class="number">${averages['moyenneScoreGlobal'].toFixed(2)}</h1>
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
