
const hoursInput = document.getElementById("in-hours");
const tierInput = document.getElementById("in-tier");

const pxOutput = document.getElementById("out-px");
const dollarsOutput = document.getElementById("out-dollar");
const reOutput = document.getElementById("out-re");

// Enums for T1-T4
const { T1, T2, T3, T4 } = { T1: 1, T2: 2, T3: 3, T4: 4 };

function REtoPxPerHour(re) {
    // Magic formula for conversion rate between RE and px
    // Just basic mx + b linear equation where 
    // m = (9/1250) and b = 50
    return (9 * re) / 1250 + 50;
}

function pxToDollars(px) {
    // Conversion rate is $0.07 per px
    return 0.07 * px;
}

function dollarsToPX(dollars) {
    // Conversion rate is $0.07 per px
    return dollars / 0.07;
}

// Return the LUT value for a given tier
function lookUpFromTier(tier) {
    let rePerHour = 0.0;
    let bonusPerHour = 0.0;

    switch (tier) {
        // Look up table for re per hour and bonus based on tier
        case (T1):
            rePerHour = 5.0;
            bonusPerHour = 0.0;
            break;
        case (T2):
            rePerHour = 10.0;
            bonusPerHour = 0.5;
            break;
        case (T3):
            rePerHour = 15.0;
            bonusPerHour = 1.0;
            break;
        case (T4):
            rePerHour = 25.0;
            bonusPerHour = 1.5;
            break;
        default:
            // Base case should never exist
            throw new Error(`Passed an invalid tier: ${tier}.`);
            break;
    }

    return { rePerHour, bonusPerHour }
} 

// Calculates expected px from hours and tier
function calculatePoints(hours, tier) {
    const { rePerHour, bonusPerHour } = lookUpFromTier(tier);
    const projectRE = rePerHour * hours;

    // Halving the RE beforehand is equivilant to averaging with 0 (the start amount)
    const averagedRE = projectRE / 2;
    const pxPerHour = REtoPxPerHour(averagedRE);
    
    // Clamp to max of 40 bonus hours
    const bonusHours = Math.min(hours, 40);
    const bonusDollars = bonusPerHour * bonusHours;
    
    const totalPX = (pxPerHour * hours) + dollarsToPX(bonusDollars);
    const totalDollars = pxToDollars(totalPX);

    return { totalPX, totalDollars, totalRE: projectRE };
}

function updateValues() {
    let hours = +hoursInput.value;
    let tier = +tierInput.value;

    console.log(typeof hours)

    // Check for invalid data
    if (hours < 0 || isNaN(hours)) {
        throw new Error(`Passed an invalid hour amount: ${hours}.`);
    }
    if (tier < 1 || tier > 4) {
        throw new Error(`Passed an invalid tier: ${tier}.`);
    }

    const { totalPX, totalDollars, totalRE } = calculatePoints(hours, tier);

    pxOutput.textContent = `~${Math.round(totalPX)}px`;
    dollarsOutput.textContent = `~$${totalDollars.toFixed(2)}`;
    reOutput.textContent = `~${Math.round(totalRE)}RE`;
}

hoursInput.addEventListener("input", updateValues);
tierInput.addEventListener("input", updateValues);



