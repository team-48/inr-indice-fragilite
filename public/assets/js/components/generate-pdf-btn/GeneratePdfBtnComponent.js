export default class GeneratePdfBtnComponent {
    constructor(cityName) {
        this.container = document.querySelector('#generate-pdf-btn-container');
        this.cityName = cityName;
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
        const scriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            document.body.appendChild(script);
            script.onload = resolve;
            script.onerror = reject;
            script.async = true;
            script.src = `${window.location.href}assets/js/html2pdf.node.js`;
        });

        scriptPromise.then(() => {
            const element = document.getElementById('stats');
            const opt = {
                filename:     `inr-${this.cityName}.pdf`,
                html2canvas:  {
                    scale: 2,
                    windowWidth: 950},
                jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        });
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
