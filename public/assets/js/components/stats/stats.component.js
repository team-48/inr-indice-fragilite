import GeneratePdfBtnComponent from "../generate-pdf-btn/generate-pdf-btn.component.js";

export default class CityStatsContainer {
    constructor() {
        this.container = document.querySelector('#city_statistic_container');
        this.cityStats = null

        this.update();
    }

    newTest(geojson){
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        var svg = d3.select('#map').append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleLinear().range([0, 500]);
            var y = d3.scaleLinear().range([500, 0]);
        
        x.domain([0, 50]);
        y.domain([0, 50]);
        
        var point = {"x": 24, "y": 31}
        
        var poly = [{"x":10, "y":50},
                {"x":20,"y":20},
                {"x":50,"y":10},
                {"x":30,"y":30}];
        
        // console.log("==================================================================================");
        // console.log(geojson.coordinates)
        // console.log("==================================================================================");
        svg.selectAll("polygon")
            .data(geojson.coordinates)
        .enter().append("polygon")
            .attr("points",function(d) { 
                console.log("==================================================================================");
                console.log(d)
                console.log("==================================================================================");
                return d.map(function(d) {
                    console.log([x(d[0]),y(d[1])].join(","))

                    return [x(d[0]),y(d[1])].join(",");
                }).join(" ");
            });
        
        svg.append("circle")
            .attr("r", 4)
            .attr("cx", x(point.x))
            .attr("cy", y(point.y))
        
            // add the X Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y));
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
        });
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
        console.log(this.cityStats[0]["Geo Shape"]);
        const frimo = {
            type: "Polygon",
            coordinates: [[[2.186690144719194, 48.869027280709375], [2.186720343127883, 48.86892675774901], [2.186787614432625, 48.86618956389059], [2.186907420603295, 48.86602489547758], [2.186742083254524, 48.86604985357489], [2.186656084092235, 48.866057363419614], [2.185504986209498, 48.86304116832668], [2.18341463615303, 48.8624756133261], [2.183397439138298, 48.862442219505766], [2.183273588034174, 48.86251692093491], [2.181860687137993, 48.86334367872085], [2.180464776569315, 48.86412736642945], [2.179398058531254, 48.864692951302295], [2.17934874885903, 48.86470790236218], [2.179301981034295, 48.864734562549884], [2.179270008091639, 48.864773915258986], [2.179262626250835, 48.86480983914981], [2.179272949589076, 48.8648467838196], [2.179294248006098, 48.86487930693539], [2.180281342850003, 48.866342139022855], [2.182123052529826, 48.86755718411669], [2.184248644497048, 48.86840899428386], [2.184451873766759, 48.868489522857416], [2.185049381588601, 48.86872562736165], [2.185611776648615, 48.868940804638285], [2.186170185278823, 48.86914965658412], [2.186235517721356, 48.86915639630057], [2.186311966024082, 48.86914972117342], [2.186357244665478, 48.86913114245347], [2.186620315748868, 48.86904659207977], [2.186690144719194, 48.869027280709375]]]
        }
        const geojson = {
            "type": "FeatureCollection", 
            "features": [
                {"geometry": {
                    "type": "GeometryCollection", 
                    "geometries": [
                        frimo
                    ]
                }, 
                "type": "Feature",
                "properties": {}}
            ]
        };

        // JSON.parse(frimo)

        this.newTest(frimo)
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
    </div>
`;
        } else {
            return `
            <div class="no-cities">
                <img src="/assets/images/fogg-203.png" alt="Aucun lieu sélectionné">
            </div>`;
        }

    }
}
