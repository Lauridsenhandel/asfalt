// Data from Excel 'Ark2'
const asphaltTypes = {
    "0-3 mm Hvid": { u: 17500, k: 14900 },
    "0-5 mm Rød": { u: 16500, k: 14000 },
    "0-8 mm Grøn": { u: 15500, k: 13200 },
    "0-11 mm Blå": { u: 15000, k: 12800 },
    "0-16 mm Gul": { u: 14500, k: 12300 }
};

const productData = {
    "0-3 mm Hvid": {
        sku: "490840503",
        link: "https://www.lhi.dk/produkter/kloak/reparationsasfalt/reparationsasfalt/reparationsasfalt-0-3-mm-hvid",
        img: "images/490840503.png",
        name: "Reparationsasfalt 0-3 mm (hvid)"
    },
    "0-5 mm Rød": {
        sku: "490840505",
        link: "https://www.lhi.dk/produkter/kloak/reparationsasfalt/reparationsasfalt/reparationsasfalt-0-5-mm-roed",
        img: "images/490840505.png",
        name: "Reparationsasfalt 0-5 mm (rød)"
    },
    "0-8 mm Grøn": {
        sku: "490840508",
        link: "https://www.lhi.dk/produkter/kloak/reparationsasfalt/reparationsasfalt/reparationsasfalt-0-8-mm-groen",
        img: "images/490840508.png",
        name: "Reparationsasfalt 0-8 mm (grøn)"
    },
    "0-11 mm Blå": {
        sku: "490840511",
        link: "https://www.lhi.dk/produkter/kloak/reparationsasfalt/reparationsasfalt/reparationsasfalt-0-11-mm-blaa",
        img: "images/490840511.png",
        name: "Reparationsasfalt 0-11 mm (blå)"
    },
    "0-16 mm Gul": {
        sku: "490840516",
        link: "https://www.lhi.dk/produkter/kloak/reparationsasfalt/reparationsasfalt/reparationsasfalt-0-16-mm-gul",
        img: "images/490840516.png",
        name: "Reparationsasfalt 0-16 mm (gul)"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Inputs
    const typeSelect = document.getElementById('asphaltType');
    const lengthInput = document.getElementById('length');
    const widthInput = document.getElementById('width');
    const depthInput = document.getElementById('depth');

    // Outputs
    const uncompWeightEl = document.getElementById('uncomp-weight');
    const uncompBucketsEl = document.getElementById('uncomp-buckets');
    const compWeightEl = document.getElementById('comp-weight');
    const compBucketsEl = document.getElementById('comp-buckets');

    // Product Display Elements
    const productDisplaySection = document.getElementById('product-display');
    const productImg = document.getElementById('product-img');
    const productTitle = document.getElementById('product-title');
    const productId = document.getElementById('product-id');
    const productLink = document.getElementById('product-link');

    function calculate() {
        const type = typeSelect.value;
        const length = parseFloat(lengthInput.value) || 0;
        const width = parseFloat(widthInput.value) || 0;
        const depth = parseFloat(depthInput.value) || 0;

        // Update Product Display
        updateProductDisplay(type);

        const volumeCm3 = (length * width * depth) / 1000;

        if (volumeCm3 <= 0) {
            resetResults();
            return;
        }

        const stats = asphaltTypes[type];
        if (!stats) return;

        // Density Calc
        const densityUncomp = 25 / stats.u; // kg per cm3
        const densityComp = 25 / stats.k;   // kg per cm3

        const weightUncomp = volumeCm3 * densityUncomp;
        const bucketsUncomp = Math.ceil(weightUncomp / 25);

        const weightComp = volumeCm3 * densityComp;
        const bucketsComp = Math.ceil(weightComp / 25);

        // Update UI
        uncompWeightEl.textContent = weightUncomp.toLocaleString('da-DK', { maximumFractionDigits: 2 });
        uncompBucketsEl.textContent = bucketsUncomp;

        compWeightEl.textContent = weightComp.toLocaleString('da-DK', { maximumFractionDigits: 2 });
        compBucketsEl.textContent = bucketsComp;
    }

    function updateProductDisplay(type) {
        const data = productData[type];
        if (data) {
            productDisplaySection.style.display = 'flex';
            productImg.src = data.img;
            productTitle.textContent = data.name;
            productId.textContent = data.sku;
            productLink.href = data.link;
        } else {
            productDisplaySection.style.display = 'none';
        }
    }

    function resetResults() {
        uncompWeightEl.textContent = "0";
        uncompBucketsEl.textContent = "0";
        compWeightEl.textContent = "0";
        compBucketsEl.textContent = "0";
    }

    // Add event listeners
    [typeSelect, lengthInput, widthInput, depthInput].forEach(el => {
        el.addEventListener('input', calculate);
    });

    // Initial calculation
    calculate();
});
