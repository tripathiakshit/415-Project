// TODO: Get data depending on parameters

Chart.defaults.global.elements.point.radius = 2;
Chart.defaults.global.elements.point.hoverRadius = 3;
Chart.defaults.global.elements.point.borderWidth = 1;

let chart = undefined;
let subsetData = data;
let yearFrom = compFromYear.value;
let yearTo = compToYear.value;
let monthFrom = compFromMonth.value;
let monthTo = compToMonth.value;

const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
        yAxes: [{
            stacked: false,
            gridLines: {
                display: true,
                color: "rgba(0,0,0,0.25)"
            }
        }],
        xAxes: [{
            label: "Temperature (°C)",
            gridLines: {
                display: false
            }
        }]
    }
};

const labels = {
    "max_temp": "Max Temp",
    "min_temp": "Min Temp",
    "mean_temp": "Avg Temp",
    "total_rain": "Total Rain",
    "total_snow": "Total snow",
    "total_precip": "Total Precipitation"
};

const colors = {
    "max_temp": "rgba(255, 100, 0, 0.4)",
    "min_temp": "rgba(0, 100, 255, 0.4)",
    "mean_temp": "rgba(255, 215, 0, 0.4)",
    "total_rain": "rgba(59, 169, 241, 0.7)",
    "total_snow": "rgba(96, 125, 139, 0.7)",
    "total_precip": "rgba(33, 150, 243, 0.4)"
}

let chartData = {
    labels: [],
    datasets: [{
        label: "Max Temp",
        borderColor: "rgba(255, 163, 17, 0.4)",
        borderWidth: 2,
        type: "line",
        fill: false,

        pointBackgroundColor: "rgb(255, 163, 17)",
        data: []
    }, {
        label: "Min Temp",
        borderColor: "rgba(17, 167, 255, 0.4)",
        borderWidth: 2,
        fill: false,
        cubicInterpolationMode: 'default',
        pointBackgroundColor: "rgb(17, 167, 255)",

        type: "line",
        data: []
    }]
};

let findItemByYear = (element) => {
    let retVal = (element.year >= yearFrom) && (element.year <= yearTo);
};

let getSubsetData = (fromYear, fromMonth, toYear, toMonth) => {
    subsetData = data;
    let fromId, toId;
    let tempData = [];

    if (fromMonth !== undefined) {
        fromId = getIdFromKeys(data.data, ["month", "year"], [fromMonth, fromYear]);
        toId = getIdFromKeys(data.data, ["month", "year"], [toMonth, toYear]);
    } else {
        fromId = getIdFromKeys(data.data, ["year"], [fromYear]);
        toId = getIdFromKeys(data.data, ["year"], [toYear]);
    }

    tempData = data.data.slice(fromId, toId);
    subsetData.data = tempData;
};

let prepareChartData = () => {
    // Get data as array
    let dataCollection1 = getValuesAsArray(subsetData.data, comparator1.value);
    let dataCollection2 = getValuesAsArray(subsetData.data, comparator2.value);

    // Get colors as array
    let colorCollection1 = getColors(
        dataCollection1,
        subsetData[comparator1.value].max,
        subsetData[comparator1.value].min,
        subsetData[comparator1.value].avg
    );

    let colorCollection2 = getColors(
        dataCollection2,
        subsetData[comparator2.value].max,
        subsetData[comparator2.value].min,
        subsetData[comparator2.value].avg
    );

    // Get labels
    let labelCollection = getLabelsFromData(subsetData.data);

    // Set all data
    chartData.datasets[0].pointBackgroundColor = [];
    chartData.datasets[1].pointBackgroundColor = [];
    chartData.datasets[0].pointBorderColor = [];
    chartData.datasets[1].pointBorderColor = [];
    colorCollection1.forEach(color => {
        chartData.datasets[0].pointBackgroundColor.push("rgba(" + color.join() + ", 1)");
        chartData.datasets[0].pointBorderColor.push("rgba(" + color.join() + ", 0.4)");
    });

    colorCollection2.forEach(color => {
        chartData.datasets[1].pointBackgroundColor.push("rgba(" + color.join() + ", 1)");
        chartData.datasets[1].pointBorderColor.push("rgba(" + color.join() + ", 0.4)");
    });

    chartData.datasets[0].borderColor = colors[comparator1.value];
    chartData.datasets[1].borderColor = colors[comparator2.value];
    chartData.datasets[0].label = labels[comparator1.value];
    chartData.datasets[1].label = labels[comparator2.value];
    chartData.datasets[0].data = dataCollection1;
    chartData.datasets[1].data = dataCollection2;
    chartData.labels = labelCollection;
};

let populateFilters = () => {
    let fromYears = getUniqueItems(data.data, "year").sort(numberSorter);
    let toYears = getUniqueItems(subsetData.data, "year").sort(numberSorter);
    let monthNumbers = getUniqueItems(subsetData.data, "month").sort(numberSorter);

    fromYears.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.innerText = item;
        compFromYear.appendChild(option);
    });

    toYears.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.innerText = item;
        compToYear.appendChild(option);
    });

    if (subsetData.data[0].hasOwnProperty("month")) {
        monthNumbers.forEach(item => {
            let option1 = document.createElement("option");
            option1.value = item;
            option1.innerText = months[item];
            option2 = option1.cloneNode();
            option2.innerText = months[item];
            compFromMonth.appendChild(option1);
            compToMonth.appendChild(option2);
        });
    }

    compFromYear.selectedIndex = 0;
    compFromMonth.selectedIndex = 0;
    compToYear.selectedIndex = toYears.length - 1;
    compToMonth.selectedIndex = monthNumbers.length - 1;
};

let updateChart = () => {
    if (chart !== undefined)
        chart.destroy();
    
    getSubsetData(yearFrom, monthFrom, yearTo, monthTo);
    prepareChartData();

    chart = new Chart(chartElement, {
        type: "line",
        options: options,
        data: chartData
    });

    chart.update();
};

let updateFilters = () => {
    populateFilters(subsetData);
};

function rangeCBInputHandler() {
    if (rangeCB.value === "monthlyData") {
        data = monthlyData;
        compFromMonth.style.display = "initial";
        compToMonth.style.display = "initial";
        monthFrom = compFromMonth.value;
        monthTo = compToMonth.value;
    } else if (rangeCB.value === "yearlyData") {
        data = yearlyData;
        compFromMonth.style.display = "none";
        compToMonth.style.display = "none";
        monthFrom = undefined;
        monthTo = undefined;
    }
    
    emptyElement(compFromYear);
    emptyElement(compFromMonth);
    emptyElement(compToYear);
    emptyElement(compToMonth);
    updateFilters();
    updateChart();
}

function comparatorInputHandler() {
    updateChart();
}

function rangeFilterHandler() {
    subsetData = data;
    yearFrom = compFromYear.value;
    yearTo = compToYear.value;

    if ("month" in subsetData.data[0]) {
        monthFrom = compFromMonth.value;
        monthTo = compToMonth.value;
    }

    updateChart();
}

rangeCB.addEventListener("input", rangeCBInputHandler, false);
comparator1.addEventListener("input", comparatorInputHandler, false);
comparator2.addEventListener("input", comparatorInputHandler, false);
compFromYear.addEventListener("input", rangeFilterHandler, false);
compFromMonth.addEventListener("input", rangeFilterHandler, false);
compToYear.addEventListener("input", rangeFilterHandler, false);
compToMonth.addEventListener("input", rangeFilterHandler, false);

(function () {
    if ("month" in subsetData.data[0]) {
        rangeCB.selectedIndex = 0;
        compFromMonth.style.display = "initial";
        compToMonth.style.display = "initial";
    } else {
        rangeCB.selectedIndex = 1;
        compFromMonth.style.display = "none";
        compToMonth.style.display = "none";
    }
    rangeCBInputHandler();
}());
