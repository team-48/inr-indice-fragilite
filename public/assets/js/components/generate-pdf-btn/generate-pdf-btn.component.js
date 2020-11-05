export default class GeneratePdfBtnComponent {
    constructor() {
        this.container = document.querySelector('#generate-pdf-btn-container');
        this.container.innerHTML = this.render();
    }

    update() {
        this.container.innerHTML = this.render();
        this.afterViewInit();
    }

    generatePDF() {
        alert("PDF");
        const element = document.querySelector('#stats');
        html2pdf(element);
    }

    afterViewInit() {
        const downloadBtn = document.querySelector('#download-btn');
        downloadBtn.addEventListener('click', () => {
            this.generatePDF();
        })
    }

    render() {
        return `<div class="btn" id="download-btn">
                    <p>Télécharger</p>
                </div>`;
    }
}
