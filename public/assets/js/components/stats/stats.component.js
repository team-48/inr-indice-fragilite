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
            if (this.city != null) {
                this.container.innerHTML = this.render();
                this.generatePDFBtn = new GeneratePdfBtnComponent();
                this.generatePDFBtn.update();
                this.afterViewInit();
            }
        });
        this.container.innerHTML = this.render();
    }

    afterViewInit() {
        const showMoreBtn = document.querySelector(`#show-more`);
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => {
                document.getElementById('more-stats').classList.add("more-stats-expanded");
            });
        }
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

    colorData(data) {
        const max = 120;
        const step = (max - 100) / 4;
        if (data <= 100 + step) {
            return '#40b01e';
        } else if (data > 100 + step && data <= 100 + 2 * step) {
            return '#a4ab27';
        } else if (data > 100 + 2 * step && data <= 100 + 3 * step) {
            return '#d19e11';
        } else if (data > 100 + 3 * step && data <= 100 + 4 * step) {
            return '#d16b11';
        } else {
            return '#d11111';
        }
    }

    render() {
        if (this.city !== null && this.cityStats !== null) {
            const averages = this.averageData();
            return `<div class="stats-header">
                        <h1>${this.city.cityName} (${this.city.postalCode})</h1>
                        <div class="center-vertically" id="generate-pdf-btn-container"></div>
                    </div>
                    
                    <div class="switch-comparison">
                        <div class="switch-btn">
                            <p>Région</p>   
                        </div>
                        <div class="switch-btn switch-btn-active">
                            <p>Département</p>   
                        </div>
                    </div>
                
                    <div class="top">
                
                        <div class="left">
                            <div class="bloc stat">
                                <p>Accès aux interfaces numériques</p>
                                <h1 class="number" style="color: ${this.colorData(averages['moyenneInterfaceNumerique'])}">
                                    ${averages['moyenneInterfaceNumerique'].toFixed(2)}
                                </h1>
                            </div>
                
                            <div class="bloc stat">
                                <p>Accès à l'information</p>
                                <h1 class="number" style="color: ${this.colorData(averages['moyenneAccesInfo'])}">
                                    ${averages['moyenneAccesInfo'].toFixed(2)}
                                </h1>
                            </div>
                
                            <div class="bloc stat">
                                <p>Compétences administratives</p>
                                <h1 class="number" style="color: ${this.colorData(averages['moyenneCompetencesAdmin'])}">
                                    ${averages['moyenneCompetencesAdmin'].toFixed(2)}
                                </h1>
                            </div>
                
                            <div class="bloc stat">
                                <p>Compétences numériques / scolaires</p>
                                <h1 class="number" style="color: ${this.colorData(averages['moyenneCompetencesNumeriquesScolaires'])}">
                                    ${averages['moyenneCompetencesNumeriquesScolaires'].toFixed(2)}
                                </h1>
                            </div>
                
                            <div class="bloc stat">
                                <p>Accès</p>
                                <h1 class="number" style="color: ${this.colorData(averages['moyenneAcces'])}">
                                    ${averages['moyenneAcces'].toFixed(2)}
                                </h1>
                            </div>
                
                            <div class="bloc stat">
                                <p>Compétences</p>
                                <h1 class="number" style="color: ${this.colorData(averages['moyenneCompetences'])}">
                                    ${averages['moyenneCompetences'].toFixed(2)}
                                </h1>
                            </div>
                
                            <div class="bloc stat">
                                <p>Score global</p>
                                <h1 class="number" style="color: ${this.colorData(averages['moyenneScoreGlobal'])}">
                                    ${averages['moyenneScoreGlobal'].toFixed(2)}
                                </h1>
                            </div>
                        </div>
                
                        <div class="right">
                
                            <div class="bloc explain">
                                <div class="bloc-header">
                                    <h2>Comprendre les indicateurs</h2>
                                </div>
                                <p class="grey">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris ut enim at orci elementum iaculis viverra in libero. Ut sed ligula eget magna tristique laoreet sed nec metus. Aliquam erat volutpat. Aenean quam eros, ornare in pharetra ac, rutrum quis sapien. Aliquam vitae facilisis sapien. Nulla viverra et purus in pellentesque. Donec luctus ipsum in est hendrerit, vitae consectetur ipsum pulvinar. Etiam viverra mauris vel mauris sagittis consectetur. Donec ac sem neque. Donec lacinia urna condimentum neque imperdiet, id posuere elit fringilla. Quisque tristique diam quam, feugiat dignissim sapien molestie et. Nam condimentum hendrerit dictum.
                                </br></br>
                                Etiam eu faucibus massa. Praesent convallis suscipit eros. Integer sollicitudin ex vel nunc varius pellentesque in et velit. Suspendisse potenti. Proin ornare tempor odio, eget vulputate eros bibendum pellentesque. Quisque sit amet luctus lectus. Morbi vestibulum posuere risus dignissim lacinia. In eu nulla nec velit tempor malesuada vel et ipsum. Aliquam sit amet ipsum vel dolor porttitor feugiat in vitae quam. Mauris faucibus diam vel auctor lobortis.
                                </p>
                            </div>
                
                        </div>
                
                    </div>
                    
                    <div class="more-stats" id="more-stats">
                    
                        <h2>Quartiers</h2>
                        <p>Ces statistiques concernent les quartiers de cette agglomération</p> 
                         `+ this.cityStats.map((bloc, index) => `
                            <div class="bloc">
                                <div class="bloc-header">
                                    <h2>${bloc['Nom Iris']}</h2>
                                </div>
                                <div class="bloc-content">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>Code Iris</td>
                                                <td>${bloc['Iris']}</td>
                                            </tr>
                                            <tr>
                                                <td>Type Iris</td>
                                                <td>${bloc['Type Iris']}</td>
                                            </tr>
                                            <tr>
                                                <td>Accès à l'information</td>
                                                <td>${parseFloat(bloc['ACCES A L\'INFORMATION region 1']).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Accès aux interfaces numériques</td>
                                                <td>${parseFloat(bloc['ACCÈS AUX INTERFACES NUMERIQUES region 1']).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Compétences administratives</td>
                                                <td>${parseFloat(bloc['COMPETENCES ADMINISTATIVES region 1']).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Compétences numériques et scolaires</td>
                                                <td>${parseFloat(bloc['COMPÉTENCES NUMÉRIQUES / SCOLAIRES region 1']).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Score global accès</td>
                                                <td>${parseFloat(bloc['GLOBAL ACCES region 1']).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Score global compétences</td>
                                                <td>${parseFloat(bloc['GLOBAL COMPETENCES region 1']).toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td>Score global</td>
                                                <td>${parseFloat(bloc['SCORE GLOBAL region * ']).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>`).join('') +`
                        </div>
                        <div class="show-more" id="show-more">
                            <p class="grey">En savoir plus</p>
                        </div>`;
        } else {
            return `<div class="no-cities">
                        <img src="/assets/images/fogg-203.png" alt="Aucun lieu sélectionné">
                    </div>`;
        }

    }
}
