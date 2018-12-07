// Create variables to hold and manipulate current data and set defaults
let data = yearlyData;
let tempRanges = data["mean_temp"];

// Create months enumerator. Leaving [0] blank for easier use.
const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

let changeTheme = (requestedMode) => {
    if (requestedMode === "dark") {
        document.body.style.color = "#eee";
        document.body.style.background = "#222";
    } else {
        document.body.style.color = "initial";
        document.body.style.background = "initial";
    }
};

// Function getColors calls getColor() multiple times and stores all values in an array
let getColors = (array, max, min, avg) => {
    let retArray = [];

    array.forEach(element => {
        let colors = getColor(element, max, min, avg);
        retArray.push(colors);
    });

    return retArray;
};

// Function getColor to know which color to apply from current data
let getColor = (current, max, min, avg) => {
    // Define a hot-to-cold color gradient scale
    var gradient = [
        [0, [0, 175, 255]], // Blue
        [50, [255, 215, 0]], // Yellow
        [100, [255, 30, 0]] // Red
    ];

    //Get the two closest colors and ranges
    let firstColor = undefined;
    let secondColor = undefined;
    let localmin = undefined;
    let localmax = undefined;

    if (current < avg) {
        firstColor = gradient[1][1];
        secondColor = gradient[0][1];
        localmin = min;
        localmax = avg;
    } else if (current > avg) {
        firstColor = gradient[2][1];
        secondColor = gradient[1][1];
        localmin = avg;
        localmax = max;
    } else return [255, 215, 0];

    // Calculate percentage value of given avg temperature in range
    let weight = ((current - localmin)) / (localmax - localmin);

    return pickHex(firstColor, secondColor, weight);
};

// Helper function for getColor()
let pickHex = (color1, color2, weight) => {
    // Calculate both weights
    var w1 = weight;
    var w2 = 1 - w1;

    // Magic math to get a custom RGB value
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)
    ];

    return rgb;
};

let getUniqueItems = (array, key) => {
    let uniqueItems = [];
    array.forEach(element => {
        if (uniqueItems.find(item => item === element[key]) === undefined) {
            uniqueItems.push(element[key]);
        }
    });

    return uniqueItems;
};

let numberSorter = (a, b) => {
    if (a < b) return -1;
    else if (a > b) return 1;
    else return 0;
};

let keySorter = (a, b, key) => {
    if (a[key] < b[key]) return -1;
    else if (a[key] > b[key]) return 1;
    else return 0;
};

let emptyElement = element => {
    while (element.firstChild)
        element.removeChild(element.firstChild);
};

let getValuesAsArray = (array, key) => {
    let retArray = [];
    array.forEach(element => retArray.push(element[key]));
    return retArray;
};

let getLabelsFromData = (array) => {
    let retArray = [];
    array.forEach(item => {
        let str = ("month" in item) ? months[item["month"]] + " " : "";
        str += item["year"];
        retArray.push(str);
    });
    return retArray;
};

let getIdFromKeys = (array, keys, values) => {
    for (let i = 0; i < array.length; i++) {
        let element = array[i];
        let retId = true;
        for (let i = 0; i < keys.length; i++) {
            retId = (retId && (element[keys[i]] == values[i]));
        }
        if (retId) return i;
    }
};
