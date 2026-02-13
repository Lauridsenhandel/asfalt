// Data from Excel 'Ark2'
// u = Ukomprimeret (Volumen per 25kg bag)
// k = Komprimeret (Volumen per 25kg bag)
const asphaltTypes = {
    "0-3 mm Hvid": { u: 17500, k: 14900 },
    "0-5 mm Rød": { u: 16500, k: 14000 },
    "0-8 mm Grøn": { u: 15500, k: 13200 },
    "0-11 mm Blå": { u: 15000, k: 12800 },
    "0-16 mm Gul": { u: 14500, k: 12300 }
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

    function calculate() {
        const type = typeSelect.value;
        const length = parseFloat(lengthInput.value) || 0;
        const width = parseFloat(widthInput.value) || 0;
        const depth = parseFloat(depthInput.value) || 0;

        // Calculate Volume in cm3
        // Input is in mm, so (mm * mm * mm) / 1000 = cm3
        const volumeCm3 = (length * width * depth) / 1000;

        if (volumeCm3 <= 0) {
            resetResults();
            return;
        }

        const stats = asphaltTypes[type];
        if (!stats) return;

        // Uncompressed Calculation
        // Logic: Bags = Ceil(Volume / VolumePerBag)
        // Weight = Volume * (25 / VolumePerBag). Wait, checking Excel again.
        // Excel Cell C13 (Weight) = VLOOKUP(...) * Volume / 1000. 
        // VLOOKUP returns a value. Let's look at the sheet again.
        // In Ark2, Column B is "Volumen" (Values like 16500). Wait.
        // Let's re-verify the logic from the Excel dump.

        // "Cell D3: =25/B3". B3 is 17500. So D3 is Density (kg/cm3) maybe? or kg/unit?
        // if B3 is Volume for 25kg. Then Density = 25 / 17500 kg/cm3.

        // Excel Ark1 Formula C13 (Weight):
        // =VLOOKUP(D$4,'Ark2'!$A$2:$E$7,4,FALSE)*$D$7*$D$8*$D$9/1000
        // Parameters:
        // D4 = Type Name
        // Range A2:E7. Col 4 is Column D.
        // Col D in Ark2 is "=25/B" (where B is Volume for 25kg).
        // So Col D is Density (kg/cm3).
        // Formula = Density * (L*W*D)/1000 [Volume cm3].
        // So Weight = Density * Volume_cm3. Correct.

        // Excel Ark1 Formula D13 (Buckets):
        // =ROUNDUP(C13/25,0) -> Ceil(Weight / 25).

        // So my logic:
        const densityUncomp = 25 / stats.u; // kg per cm3
        const densityComp = 25 / stats.k;   // kg per cm3

        const weightUncomp = volumeCm3 * densityUncomp;
        const bucketsUncomp = Math.ceil(weightUncomp / 25);

        const weightComp = volumeCm3 * densityComp;
        const bucketsComp = Math.ceil(weightComp / 25);

        // Update UI
        // Format weight with 1 decimal if needed, or 2. Excel shows whole numbers usually or 2 decimals.
        // Let's use 2 decimals for precision.
        uncompWeightEl.textContent = weightUncomp.toLocaleString('da-DK', { maximumFractionDigits: 2 });
        uncompBucketsEl.textContent = bucketsUncomp;

        compWeightEl.textContent = weightComp.toLocaleString('da-DK', { maximumFractionDigits: 2 });
        compBucketsEl.textContent = bucketsComp;
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
