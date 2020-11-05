export default class GeneratePdfBtnComponent {
    constructor() {
        this.container = document.querySelector('#generate-pdf-btn-container');
        if (this.container) {
            this.container.innerHTML = this.render();
        }
    }

    update() {
        if (this.container) {
            this.container.innerHTML = this.render();
        }
        this.afterViewInit();
    }

    generatePDF() {
        const element = document.getElementById('stats');
        html2pdf(element);
    }

    afterViewInit() {
        const downloadBtn = document.querySelector('#download-btn');
        if (downloadBtn != null) {
            downloadBtn.addEventListener('click', () => {
                this.generatePDF();
            });
        }
    }

    render() {
        return `<div class="btn" id="download-btn">
                    <p>Télécharger</p>
                </div>`;
    }
}
