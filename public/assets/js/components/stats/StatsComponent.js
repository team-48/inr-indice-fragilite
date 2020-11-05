import GeneratePdfBtnComponent from "../generate-pdf-btn/GeneratePdfBtnComponent.js";

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
                this.afterViewInit();
            }
        }, () => {
            this.container.innerHTML = this.render();
        });
    }

    afterViewInit() {
        const showMoreBtn = document.querySelector(`#show-more`);
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => {
                if (document.getElementById('more-stats').style.height === 'auto') {
                    document.getElementById('more-stats').style.height = '0';
                    document.getElementById('show-more-txt').innerText = "En savoir plus";
                } else {
                    document.getElementById('more-stats').style.height = 'auto';
                    document.getElementById('show-more-txt').innerText = "Fermer";
                }

            });
        }

        const explanationTextContainer = document.querySelector('#explanation-text-container');
        const globalScoreBloc = document.querySelector('#globalScore');
        const digitalInterfacesAccessBloc = document.querySelector('#digitalInterfacesAccess');
        const informationAccessBloc = document.querySelector('#informationAccess');
        const administrativeSkillsBloc = document.querySelector('#administrativeSkills');
        const scholarAndDigitalSkills = document.querySelector('#scholarAndDigitalSkills');

        if (globalScoreBloc) {
            globalScoreBloc.addEventListener('click', () => {
                explanationTextContainer.innerHTML = this.getExplanationText('globalScore');
            });
        }
        if (digitalInterfacesAccessBloc) {
            digitalInterfacesAccessBloc.addEventListener('click', () => {
                explanationTextContainer.innerHTML = this.getExplanationText('digitalInterfacesAccess');
            });
        }
        if (informationAccessBloc) {
            informationAccessBloc.addEventListener('click', () => {
                explanationTextContainer.innerHTML = this.getExplanationText('informationAccess');
            });
        }
        if (administrativeSkillsBloc) {
            administrativeSkillsBloc.addEventListener('click', () => {
                explanationTextContainer.innerHTML = this.getExplanationText('administrativeSkills');
            });
        }
        if (scholarAndDigitalSkills) {
            scholarAndDigitalSkills.addEventListener('click', () => {
                explanationTextContainer.innerHTML = this.getExplanationText('scholarAndDigitalSkills');
            });
        }
    }

    loadCity(onCityLoaded, onCityLoadFail) {
        if (this.city === null) {
            onCityLoadFail();
            return;
        }
        if (!localStorage.getItem(this.city.postalCode))
        {
            fetch(`${window.location.href}stats/${this.city.cityCode}`).then(response => {
                response.json().then(result => {
                    this.cityStats = result;
                    localStorage.setItem(this.city.postalCode, JSON.stringify(result));
                    onCityLoaded();
                });
            });
        }
        else
        {
            const result = JSON.parse(localStorage.getItem(this.city.postalCode));
            this.cityStats = result;
            onCityLoaded();
        }
    }

    averageData() {
        let moyenneInterfaceNumeriques = 0;
        let moyenneAccesInfo = 0;
        let moyenneCompetencesAdmin = 0;
        let moyenneCompetencesNumeriquesScolaires = 0;
        let moyenneAcces = 0;
        let moyenneCompetence = 0;
        let moyenneScoreGlobal = 0;
        this.cityStats['cities'].forEach(function(stat) {
            moyenneInterfaceNumeriques += parseFloat(stat['ACCÈS AUX INTERFACES NUMERIQUES region 1']);
            moyenneAccesInfo += parseFloat(stat['ACCES A L\'INFORMATION region 1']);
            moyenneCompetencesAdmin += parseFloat(stat['COMPETENCES ADMINISTATIVES region 1']);
            moyenneCompetencesNumeriquesScolaires += parseFloat(stat['COMPÉTENCES NUMÉRIQUES / SCOLAIRES region 1']);
            moyenneAcces += parseFloat(stat['GLOBAL ACCES region 1']);
            moyenneCompetence += parseFloat(stat['GLOBAL COMPETENCES region 1']);
            moyenneScoreGlobal += parseFloat(stat['SCORE GLOBAL region 1']);
        });
        return {
            'moyenneInterfaceNumerique': moyenneInterfaceNumeriques / this.cityStats['cities'].length,
            'moyenneAccesInfo': moyenneAccesInfo / this.cityStats['cities'].length,
            'moyenneCompetencesAdmin': moyenneCompetencesAdmin / this.cityStats['cities'].length,
            'moyenneCompetencesNumeriquesScolaires': moyenneCompetencesNumeriquesScolaires / this.cityStats['cities'].length,
            'moyenneAcces': moyenneAcces / this.cityStats['cities'].length,
            'moyenneCompetences': moyenneCompetence / this.cityStats['cities'].length,
            'moyenneScoreGlobal': moyenneScoreGlobal / this.cityStats['cities'].length
        }
    }

    colorData(data, max) {
        const med = (max + 100) / 2
        let r = 0, g = 0, b = 0;
        if (data < 100) {
            g = 200;
        } else if (100 <= data < med) {
            r = (data - 100) * 255 / (med - 100);
            g = 200 - (data - 100) * 200 / (med - 100);
        } else {
            g = 200 - (data - med) * 200 / (max - med);
            b = (data - med) * 255 / (max - med);
        }
        return ('rgb(' + r + ', '+ g +', ' + b + ')');
    }

    getExplanationText(data) {
        switch(data) {
            case 'digitalInterfacesAccess':
                return `
                <h3>Accès aux interfaces numériques</h3>
                <p>Identifier des territoires mal couverts par une offre de service d’information ou des populations qui auront des difficultés à comprendre l’information.</p>
                <p>Parmi les difficultés associées, on peut citer :</p>
                <ul>
                    <li>Avoir des difficultés financière à s’équiper, s’abonner</li>
                    <li>Ne pas être équipé en ordinateur</li>
                    <li>Ne pas avoir de FAI<sup>1</sup></li>
                    <li>Ne pas avoir de couverture THD/HD<sup>2</sup></li>
                    <li>Ne pas avoir de couverture mobile</li>
                </ul>
                <div class="bloc-footer">
                    <p><sup>1</sup>: Fournisseur d'Accès Internet</p>
                    <p><sup>2</sup>: Très Haut Débit / Haut Débit</p>
                </div>`;
            case 'informationAccess':
                return `
                <h3>Accès à l'information</h3>
                <p>Identifier des territoires mal couverts par les réseaux ou dans lesquels des populations auront des difficultés financières à y accéder.</p>
                <p>Parmi les difficultés associées, on peut citer :</p>
                <ul>
                    <li>Être isolé</li>
                    <li>Être éloigné d’un point d’information/médiation numérique</li>
                    <li>Être éloigné d’un point d’information ou aide sociale ou administrative</li>
                    <li>Ne pas être locuteur du français</li>
                </ul>`;
            case 'administrativeSkills':
                return `
                <h3>Compétences administratives</h3>
                <p>Identifier des populations parmi lesquelles s'observe une fréquence d'illéctronisme ou difficulté à utiliser Internet.</p>
                <p>Parmi les difficultés associées, on peut citer :</p>
                <ul>
                    <li>Être âgé</li>
                    <li>Être sans diplôme</li>
                    <li>Être en situation de handicap</li>
                </ul>`;
            case 'scholarAndDigitalSkills':
                return `
                <h3>Compétences numériques / scolaires</h3>
                <p>Identifier des populations parmis lesquelles s'observent des difficultés à accomplir des procédures administratives.</p>
                <p>Parmi les difficultés associées, on peut citer :</p>
                <ul>
                    <li>Être jeune</li>
                    <li>Être né à l'étranger</li>
                    <li>Être en situation de précarité</li>
                    <li>Être éloigné d'un lieu de médiation sociale</li>
                </ul>`;
            default:
                return `
                <h3>Score global</h3>
                <p>L’indice de fragilité numérique révèle la probabilité que sur
                    un territoire donné, une partie significative de la population
                    ciblée se trouve en situation d’exclusion numérique. Les
                    indicateurs produits sur la base de cet indice sont donc des
                    projections de risques, qu’il convient, dans la mesure du
                    possible, de recouper par une enquête qualitative ou les
                    données d’enquêtes sociologiques.</p>
                `;
        }
    }

    render() {
        if (this.city !== null && this.cityStats !== null) {
            const averages = this.averageData();
            return `<div id="city_stats_loader_container"></div>
                    <div class="stats-header">
                        <h1>${this.city.cityName} (${this.city.postalCode})</h1>
                        <div class="center-vertically" id="generate-pdf-btn-container"></div>
                    </div>
                    
                    <div class="toolbar">
                        <div class="switch-comparison">
                            <div class="switch-btn">
                                <p>Région</p>   
                            </div>
                            <div class="switch-btn switch-btn-active">
                                <p>Département</p>   
                            </div>
                        </div>
                        <div class="gradient-container">
                            <div class="gradient"></div>
                            <div id="gradient-explanations">
                                <p>?</p>
                            </div>
                            
                            <div class="bloc" id="gradient-explanations-content">
                                <p>
                                Les données sont collorées afin d'indiquer la qualité des indicateurs pour la localité
                                donnée par rapport au département ou à la région : plus un indicateur est rouge, plus
                                il est médiocre en comparaison des autres localités concernées.
                                </p>               
                            </div>
                        </div>
                    </div>
                
                    <div class="top">
                
                        <div class="left">
                            <div class="bloc stat stat-full" id="globalScore">
                                <p><b>Score global</b></p>
                                <h1 class="number" style="color: ${this.colorData(averages['moyenneScoreGlobal'], this.cityStats['scoring']['department'])}">
                                    ${averages['moyenneScoreGlobal'].toFixed(2)}
                                </h1>
                            </div>
                            
                            <div class="bloc stat stat-column">
                                <div class="bloc-header">
                                    <h2>Accès</h2>
                                    <h1 class="number" style="color: ${this.colorData(averages['moyenneAcces'], this.cityStats['scoring']['access'])}">
                                        ${averages['moyenneAcces'].toFixed(2)}
                                    </h1>
                                </div>
                                
                                <div class="bloc stat" id="digitalInterfacesAccess">
                                    <p>Accès aux interfaces numériques</p>
                                    <h1 class="number" style="color: ${this.colorData(averages['moyenneInterfaceNumerique'], this.cityStats['scoring']['digitalInterfacesAccess'])}">
                                        ${averages['moyenneInterfaceNumerique'].toFixed(2)}
                                    </h1>
                                </div>
                    
                                <div class="bloc stat" id="informationAccess">
                                    <p>Accès à l'information</p>
                                    <h1 class="number" style="color: ${this.colorData(averages['moyenneAccesInfo'], this.cityStats['scoring']['informationAccess'])}">
                                        ${averages['moyenneAccesInfo'].toFixed(2)}
                                    </h1>
                                </div>
                                
                            </div>
                
                            <div class="bloc stat stat-column">
                                <div class="bloc-header">
                                    <h2>Compétences</h2>
                                    <h1 class="number" style="color: ${this.colorData(averages['moyenneCompetences'], this.cityStats['scoring']['skills'])}">
                                        ${averages['moyenneCompetences'].toFixed(2)}
                                    </h1>
                                </div>
                                
                                <div class="bloc stat" id="administrativeSkills">
                                    <p>Compétences administratives</p>
                                    <h1 class="number" style="color: ${this.colorData(averages['moyenneCompetencesAdmin'], this.cityStats['scoring']['administrativeSkills'])}">
                                        ${averages['moyenneCompetencesAdmin'].toFixed(2)}
                                    </h1>
                                </div>
                    
                                <div class="bloc stat" id="scholarAndDigitalSkills">
                                    <p>Compétences numériques / scolaires</p>
                                    <h1 class="number" style="color: ${this.colorData(averages['moyenneCompetencesNumeriquesScolaires'], this.cityStats['scoring']['schoolSkills'])}">
                                        ${averages['moyenneCompetencesNumeriquesScolaires'].toFixed(2)}
                                    </h1>
                                </div>
                                
                            </div>
                        </div>
                
                        <div class="right">
                
                            <div class="bloc explain">
                                <div class="bloc-header">
                                    <h2>Comprendre les indicateurs</h2>
                                </div>
                                <div class="grey" id="explanation-text-container">
                                <h3>Score global</h3>
                                <p>L’indice de fragilité numérique révèle la probabilité que sur
                                un territoire donné, une partie significative de la population
                                ciblée se trouve en situation d’exclusion numérique. Les
                                indicateurs produits sur la base de cet indice sont donc des
                                projections de risques, qu’il convient, dans la mesure du
                                possible, de recouper par une enquête qualitative ou les
                                données d’enquêtes sociologiques.</p>
                                </div>
                            </div>
                
                        </div>
                
                    </div>
                    
                    <div class="more-stats" id="more-stats">
                    
                        <h2>Quartiers</h2>
                        <p>Ces statistiques concernent les quartiers de cette agglomération</p> 
                         `+ this.cityStats['cities'].map((bloc, index) => `
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
                                                <td>${parseFloat(bloc['SCORE GLOBAL region 1']).toFixed(2)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>`).join('') +`
                        </div>
                        <div class="show-more" id="show-more">
                            <p class="grey" id="show-more-txt">En savoir plus</p>
                        </div>`;
        } else {
            return `<div class="no-cities">
                        <img src="/assets/images/fogg-203.png" alt="Aucun lieu sélectionné">
                    </div>`;
        }

    }
}
