// ==========================================
// 1. CONVERTER CONFIGURATION & LOGIC
// ==========================================

const units = {
    length: ['Meters', 'Kilometers', 'Feet', 'Inches', 'Yards', 'Miles', 'Nautical Miles', 'Centimeters', 'Millimeters'],
    area: ['Square Meters', 'Square Feet', 'Square Yards', 'Acres', 'Hectares', 'Square Kilometers', 'Square Miles'],
    volume: ['Cubic Meters', 'Liters', 'Gallons (US)', 'Cubic Feet', 'Cubic Yards', 'Milliliters', 'Fluid Ounces'],
    weight: ['Kilograms', 'Grams', 'Pounds', 'Ounces', 'Tonnes', 'Stone'],
    temperature: ['Celsius', 'Fahrenheit', 'Kelvin'],
    speed: ['Meters/Second', 'Kilometers/Hour', 'Miles/Hour', 'Knots'],
    time: ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks', 'Years'],
    pressure: ['Pascal', 'Bar', 'PSI', 'Atmosphere', 'Torr'],
    power: ['Watts', 'Kilowatts', 'Horsepower', 'Milliwatts'],
    energy: ['Joules', 'Kilojoules', 'Calories', 'Kilocalories', 'Watt-hours', 'Kilowatt-hours'],
    digital: ['Bytes', 'Kilobytes', 'Megabytes', 'Gigabytes', 'Terabytes', 'Petabytes']
};

// Conversion Factors (Normalized to Base Unit)
const factors = {
    // Base: Meters
    length: {
        'Meters': 1, 'Kilometers': 1000, 'Centimeters': 0.01, 'Millimeters': 0.001,
        'Feet': 0.3048, 'Inches': 0.0254, 'Yards': 0.9144, 'Miles': 1609.34, 'Nautical Miles': 1852
    },
    // Base: Square Meters
    area: {
        'Square Meters': 1, 'Square Kilometers': 1e6, 'Square Miles': 2589988,
        'Square Feet': 0.092903, 'Square Yards': 0.836127, 
        'Acres': 4046.86, 'Hectares': 10000
    },
    // Base: Cubic Meters
    volume: {
        'Cubic Meters': 1, 'Liters': 0.001, 'Milliliters': 1e-6,
        'Gallons (US)': 0.00378541, 'Fluid Ounces': 0.0000295735,
        'Cubic Feet': 0.0283168, 'Cubic Yards': 0.764555
    },
    // Base: Kilograms
    weight: {
        'Kilograms': 1, 'Grams': 0.001, 'Tonnes': 1000,
        'Pounds': 0.453592, 'Ounces': 0.0283495, 'Stone': 6.35029
    },
    // Base: Meters/Second
    speed: {
        'Meters/Second': 1, 'Kilometers/Hour': 0.277778, 
        'Miles/Hour': 0.44704, 'Knots': 0.514444
    },
    // Base: Seconds
    time: {
        'Seconds': 1, 'Minutes': 60, 'Hours': 3600, 
        'Days': 86400, 'Weeks': 604800, 'Years': 31536000
    },
    // Base: Pascal
    pressure: { 'Pascal': 1, 'Bar': 100000, 'PSI': 6894.76, 'Atmosphere': 101325, 'Torr': 133.322 },
    // Base: Watts
    power: { 'Watts': 1, 'Kilowatts': 1000, 'Milliwatts': 0.001, 'Horsepower': 745.7 },
    // Base: Joules
    energy: { 'Joules': 1, 'Kilojoules': 1000, 'Calories': 4.184, 'Kilocalories': 4184, 'Watt-hours': 3600, 'Kilowatt-hours': 3.6e6 },
    // Base: Bytes (Binary 1024)
    digital: { 'Bytes': 1, 'Kilobytes': 1024, 'Megabytes': 1048576, 'Gigabytes': 1.074e9, 'Terabytes': 1.1e12, 'Petabytes': 1.126e15 }
};

// DOM Elements
const categorySelect = document.getElementById('category');
const fromSelect = document.getElementById('fromUnit');
const toSelect = document.getElementById('toUnit');
const inputVal = document.getElementById('inputVal');
const outputVal = document.getElementById('outputVal');

function updateCategory() {
    const category = categorySelect.value;
    const options = units[category];
    
    // Clear dropdowns
    fromSelect.innerHTML = '';
    toSelect.innerHTML = '';
    
    // Populate new options
    options.forEach(unit => {
        fromSelect.add(new Option(unit, unit));
        toSelect.add(new Option(unit, unit));
    });

    // Defaults: Select 2nd option for "To" so units differ
    toSelect.selectedIndex = 1; 
    inputVal.value = '';
    outputVal.value = '';
}

function convert() {
    const category = categorySelect.value;
    const from = fromSelect.value;
    const to = toSelect.value;
    const value = parseFloat(inputVal.value);

    if (isNaN(value)) {
        outputVal.value = '';
        return;
    }

    let result;

    if (category === 'temperature') {
        result = convertTemperature(value, from, to);
    } else {
        // Standard Linear Conversion
        const toBase = value * factors[category][from];
        result = toBase / factors[category][to];
    }

    // Smart Formatting: 
    // If very small (but not 0), use scientific notation.
    // Otherwise, round to 6 decimals and remove trailing zeros.
    if (Math.abs(result) < 0.000001 && result !== 0) {
        outputVal.value = result.toExponential(4); 
    } else {
        outputVal.value = Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
    }
}

function convertTemperature(val, from, to) {
    if (from === to) return val;

    let celsius;
    // Step 1: Convert everything to Celsius
    if (from === 'Fahrenheit') celsius = (val - 32) * 5/9;
    else if (from === 'Kelvin') celsius = val - 273.15;
    else celsius = val;

    // Step 2: Convert Celsius to Target
    if (to === 'Fahrenheit') return (celsius * 9/5) + 32;
    if (to === 'Kelvin') return celsius + 273.15;
    return celsius;
}

function swapUnits() {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    convert();
}

// Initialize App
updateCategory();


// ==========================================
// 2. SCIENTIFIC CALCULATOR LOGIC
// ==========================================

const calcDrawer = document.getElementById('calcDrawer');
const calcBackdrop = document.getElementById('calcBackdrop');
const calcDisplay = document.getElementById('calcDisplay');

function toggleCalculator() {
    // Toggle visibility classes
    calcDrawer.classList.toggle('open');
    calcBackdrop.classList.toggle('open');
}

function appendCalc(val) {
    calcDisplay.value += val;
}

function appendFunc(val) {
    calcDisplay.value += val;
}

function clearCalc() {
    calcDisplay.value = '';
}

function deleteChar() {
    calcDisplay.value = calcDisplay.value.slice(0, -1);
}

// --- Math Helper Functions for eval() ---
// These must be in the global scope for eval() to find them easily.
// We use Degrees instead of Radians for user friendliness.

function sin(deg) { 
    return Math.sin(deg * Math.PI / 180); 
}

function cos(deg) { 
    return Math.cos(deg * Math.PI / 180); 
}

function tan(deg) { 
    return Math.tan(deg * Math.PI / 180); 
}

function sqrt(num) { 
    return Math.sqrt(num); 
}

function calculateResult() {
    try {
        let expression = calcDisplay.value;
        if(expression) {
            // 1. Handle Power operator: 2^3 becomes 2**3
            expression = expression.replace(/\^/g, '**');
            
            // 2. Handle Percentage: 50% becomes (50/100)
            expression = expression.replace(/(\d+)%/g, '($1/100)');
            
            // 3. Evaluate (Safe for this context as inputs are controlled by buttons)
            const result = eval(expression); 
            
            // 4. Format Result (Fix floating point errors like 0.1 + 0.2 = 0.3000000004)
            // We handle integers separately to avoid unnecessary decimals.
            if (Number.isInteger(result)) {
                calcDisplay.value = result;
            } else {
                // Limit to 8 decimals to keep display clean
                calcDisplay.value = parseFloat(result.toFixed(8));
            }
        }
    } catch (e) {
        calcDisplay.value = 'Error';
        // Auto-clear error after 1.5 seconds
        setTimeout(() => { if(calcDisplay.value === 'Error') clearCalc(); }, 1500);
    }
}
