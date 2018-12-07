slider.addEventListener("input", function () {
    let dataVal = (this.value === undefined) ? 1 : this.value;
    let currentData = data.data[dataVal];
    updateTable(currentData);
}, false);

rangeCB.addEventListener("change", function () {
    if (rangeCB.value === "monthlyData") {
        data = monthlyData;
        timePeriodText.innerText = "Month & Year:";
    } else if (rangeCB.value === "yearlyData") {
        data = yearlyData;
        timePeriodText.innerText = "Year:";
    }

    clearTable();
}, false);

tempTypeCB.addEventListener("change", function () {
    tempRanges = data[this.value];
    clearTable();
}, false);

let updateTable = (currentData) => {
    let color = getColor(currentData.mean_temp, tempRanges.max, tempRanges.min, tempRanges.avg);
    svg.style.fill = 'rgb(' + color.join() + ')';
    yearCell.innerText = currentData.year;
    monthCell.innerText = (rangeCB.value === "monthlyData") ? months[currentData.month] + " " : null;
    maxTempCell.innerText = currentData.max_temp + "°C";
    minTempCell.innerText = currentData.min_temp + "°C";
    avgTempCell.innerText = currentData.mean_temp + "°C";
    totalPrecipCell.innerText = currentData.total_precip + "mm";
};

let clearTable = () => {
    svg.style.fill = 'rgb(215,215,215)';
    yearCell.innerText = "";
    monthCell.innerText = "";
    maxTempCell.innerText = "";
    minTempCell.innerText = "";
    avgTempCell.innerText = "";
    totalPrecipCell.innerText = "";
    slider.max = data.data.length - 1;
    slider.value = data.data.length - 1;
    let currentData = data.data[slider.value];
    updateTable(currentData);
};

(function () {
    if ("month" in data.data[0])
        rangeCB.selectedIndex = 0;
    else rangeCB.selectedIndex = 1;

    svgHolder.addEventListener("load", function () {
        var svgDoc = svgHolder.contentDocument;
        svg = svgDoc.getElementById("windsor_svg");
        clearTable();
    }, false);
}());
