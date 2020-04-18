function setBox({ boxId, title, elements, canvasId }) {
    const box = document.getElementById(boxId);

    box.innerHTML = `
    <h5>${title}</h5>
    <ul style="list-style-type:none;">
        ${elements.map(e => `<li>${e}</li>`).reduce((acc, curr) => acc + curr, "")}
    </ul>
    <button onclick="location.href='#${canvasId}'">go to time series</button>
  `;
}

function setBox1({ boxId, title, elements, canvasId }) {
    const box = document.getElementById(boxId);

    box.innerHTML = `
    <h5>${title}</h5>
    <ul style="list-style-type:none;">
        ${elements.map(e => `<li>${e}</li>`).reduce((acc, curr) => acc + curr, "")}
    </ul>
    
  `;
}

function setCBox({ boxId, title, elements, cb }) {
    const box = document.getElementById(boxId);

    box.children[0].innerHTML = `
    <h5>${title}</h5>
    <ul style="list-style-type:none;">
        ${elements.map(e => `<li>${e}</li>`).reduce((acc, curr) => acc + curr, "")}
    </ul>
    <p class="chartTitle">Doubling time: <span style="color: rgb(255, 165, 0);">New infections</span> & <span style="color: rgb(255, 0, 0);">deaths</span></p>
  `;

    cb(box.children[1].getContext("2d"));
}

function setTopBox({ boxId, title }) {
    const box = document.getElementById(boxId);

    box.innerHTML = `
    <h5 style="margin-bottom: 0; text-align: center;">${title}</h5>
    `;
}

// -------------------------------------------------------------------------------------------------

const URL_CONFIRMED =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";
const URL_DEATHS =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv";
const URL_RECOVERED =
    "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_recovered_global.csv";

const ctx1 = document.getElementById("myChart1").getContext("2d");
const ctx2 = document.getElementById("myChart2").getContext("2d");
const ctx3 = document.getElementById("myChart3").getContext("2d");
const ctx4 = document.getElementById("myChart4").getContext("2d");
const ctx5 = document.getElementById("myChart5").getContext("2d");
const ctx6 = document.getElementById("myChart6").getContext("2d");
const ctx7 = document.getElementById("myChart7").getContext("2d");
const ctx8 = document.getElementById("myChart8").getContext("2d");
const ctx9 = document.getElementById("myChart9").getContext("2d");
const ctx10 = document.getElementById("myChart10").getContext("2d");
const ctx11 = document.getElementById("myChart11").getContext("2d");
const ctx12 = document.getElementById("myChart12").getContext("2d");
const ctx13 = document.getElementById("myChart13").getContext("2d");
const day = ["day 1", "day 2", "day 3", "day 4", "day 5", "day 6", "day 7", "day 8", "day 9", "day 10", "day 11", "day 12", "day 13",
    "day 14", "day 15", "day 16", "day 17", "day 18", "day 19", "day 20", "day 21", "day 22", "day 23", "day 24", "day 25", "day 26",
    "day 27", "day 28", "day 29", "day 30", "day 31", "day 32", "day 33", "day 34", "day 35", "day 36", "day 37", "day 38", "day 39",
    "day 40", "day 41", "day 42", "day 43", "day 44", "day 45", "day 46", "day 47", "day 48", "day 49", "day 50", "day 51", "day 52",
    "day 53", "day 54", "day 55", "day 56", "day 57", "day 58", "day 59", "day 60", "day 61", "day 62", "day 63", "day 64", "day 65",
    "day 66", "day 67", "day 68", "day 69", "day 70", "day 71", "day 72", "day 73", "day 74", "day 75", "day 76", "day 77", "day 78",
    "day 79", "day 80", "day 81", "day 82", "day 83", "day 84", "day 85", "day 86", "day 87", "day 88", "day 89", "day 90", "day 91"];

Papa.parse(URL_CONFIRMED, {
    download: true,
    dynamicTyping: true,
    complete: function (confirmed) {
        Papa.parse(URL_DEATHS, {
            download: true,
            dynamicTyping: true,
            complete: function (deaths) {
                Papa.parse(URL_RECOVERED, {
                    download: true,
                    dynamicTyping: true,
                    complete: function (recovered) {
                        run(
                            confirmed.data[0].slice(4),
                            confirmed.data.slice(1),
                            deaths.data.slice(1),
                            recovered.data.slice(1)
                        );
                    }
                });
            }
        });
    }
});

function country_data_with_options({ data, country, inhabitants, min, doubling_rate }) {
    let cdata = country_data(data, country);

    if (min !== undefined) {
        let reached_min = false;

        cdata = cdata.filter(e => {
            if (reached_min) return true;
            if (e >= min) {
                reached_min = true;
                return true;
            } else {
                return false;
            }
        });
    }

    if (doubling_rate === "p") {
        let cdata_doubling_rate = [];
        for (let i = 1; i < cdata.length; i++) {
            const d = 1 / ((cdata[i] - cdata[i - 1]) / cdata[i - 1]);
            cdata_doubling_rate.push(d);
        }
        cdata = cdata_doubling_rate;
    } else if (doubling_rate === "l") {
        let cdata_doubling_rate = [];
        for (let i = 1; i < cdata.length; i++) {
            const val = cdata[i];

            for (let w = 0; w <= i; w++) {
                const h = val / 2;
                if (cdata[w] > h) {
                    if (w === 0) {
                        cdata_doubling_rate.push(1);
                    } else {
                        const a = Math.abs(cdata[w] - cdata[w - 1]);
                        const d =
                            (Math.abs(w - 1 - i) * Math.abs(cdata[w] - h)) / a +
                            (Math.abs(w - i) * Math.abs(cdata[w - 1] - h)) / a;
                        cdata_doubling_rate.push(d);
                    }

                    break;
                }
            }
        }
        cdata = cdata_doubling_rate;
        cdata = cdata.map(e => Math.round(e * 10) / 10);
    }

    if (inhabitants !== undefined) cdata = cdata.map(e => Math.round((e / inhabitants) * 10) / 10);

    return cdata;
}

function country_data(data, country, inhabitants) {
    let res = null;

    for (let row of data) {
        if (row[1] == country) {
            const rowData = row.slice(4);
            if (res == null) {
                res = rowData;
            } else {
                res = res.map((e, i) => e + rowData[i]);
            }
        }
    }
    if (inhabitants !== undefined) res = res.map(e => Math.round((e / inhabitants) * 10) / 10);
    return res;
}

function get_current(data, country, doubling) {
    let res = null;
    if (doubling !== undefined) {
        cdata = country_data_with_options({
            data: data,
            country: country,
            //min: 10,
            doubling_rate: doubling
        });
        res = cdata[cdata.length - 1];
    } else {
        res = country_data(data, country)[country_data(data, country).length - 1];
    }
    return res;
}

function country_diff(data, country) {
    let con = country_data(data, country);
    let conFixed = [0].concat(con);
    return conFixed.map((e, i) => -e + conFixed[i + 1]).slice(1);
    //return con.map((e, i) => e - (rec[i] + dea[i]));
}

function country_actual1(confirmed, recovered, deaths, country) {
    let con = country_data(confirmed, country);
    let rec = country_data(recovered, country);
    let dea = country_data(deaths, country);

    return dea.map((e, i) => e * 142); //- (rec[i] + dea[i]));
}

function country_actual2(confirmed, recovered, deaths, country, multi) {
    let con = country_data(confirmed, country);
    let rec = country_data(recovered, country);
    let dea = country_data(deaths, country);

    return con.map((e, i) => e * multi); //- (rec[i] + dea[i]));
}

function boxDraw(dates, graphs, ytype, ctx) {
    graphs.sort((a, b) => b.data[b.data.length - 1] - a.data[a.data.length - 1]);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: graphs.map((g, idx) => {
                return {
                    label: g.label,
                    data: g.data,
                    borderColor: `rgba(${g.color.r},${g.color.g},${g.color.b},1)`,
                    backgroundColor: `rgba(${g.color.r},${g.color.g},${g.color.b},0)`,
                    pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
                    pointRadius: 0,
                    pointHoverRadius: 7,
                    fill: idx === graphs.length - 1 ? true : "+1"
                };
            })
        },
        options: {
            legend: {
                display: false,
                labels: {
                    boxWidth: 0
                    //fontColor: 'rgb(255, 99, 132)'
                }
            },
            title: {
                display: false,
                text: 'Doubling time (new infections (y) & deaths (r))'
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: false
                        },
                        id: "left-y-axis",
                        type: ytype
                    }
                ]
            },
            plugins: {
                filler: {
                    propagate: false
                }
            },
            tooltips: {
                mode: "index",
                intersect: false
            },
            hover: {
                mode: "index",
                intersect: false
            }
        },
        annotation: {
            annotations: [
                {
                    type: "line",
                    mode: "horizontal",
                    scaleID: "y-axis-0",
                    value: 18,
                    borderColor: "white",
                    borderWidth: 0,
                    label: {
                        //xAdjust: 5,
                        fontSize: 66,
                        fontColor: "black",
                        backgroundColor: "white",
                        content: "+20%",
                        enabled: true
                    }
                }
            ]
            //drawTime: 'beforeDatasetsDraw'
        }
    });
}

function draw(dates, graphs, ytype, ctx) {
    graphs.sort((a, b) => b.data[b.data.length - 1] - a.data[a.data.length - 1]);

    new Chart(ctx, {
        type: "line",
        data: {
            labels: dates,
            datasets: graphs.map((g, idx) => {
                return {
                    label: g.label,
                    data: g.data,
                    borderColor: `rgba(${g.color.r},${g.color.g},${g.color.b},1)`,
                    backgroundColor: `rgba(${g.color.r},${g.color.g},${g.color.b},0)`,
                    pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
                    pointRadius: 2,
                    pointHoverRadius: 7,
                    fill: idx === graphs.length - 1 ? true : "+1"
                };
            })
        },
        options: {
            legend: {
                display: true,
                labels: {
                    //fontColor: 'rgb(255, 99, 132)'
                }
            },
            title: {
                display: false,
                text: 'Doubling time (new infections (y) & deaths (r))'
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: false
                        },
                        id: "left-y-axis",
                        type: ytype
                    }
                ]
            },
            plugins: {
                filler: {
                    propagate: false
                }
            },
            tooltips: {
                mode: "index",
                intersect: false
            },
            hover: {
                mode: "index",
                intersect: false
            }
        },
        annotation: {
            annotations: [
                {
                    type: "line",
                    mode: "horizontal",
                    scaleID: "y-axis-0",
                    value: 18,
                    borderColor: "white",
                    borderWidth: 0,
                    label: {
                        //xAdjust: 5,
                        fontSize: 66,
                        fontColor: "black",
                        backgroundColor: "white",
                        content: "+20%",
                        enabled: true
                    }
                }
            ]
            //drawTime: 'beforeDatasetsDraw'
        }
    });
}

function draw_bar(dates, graphs, ctx) {
    graphs.sort((a, b) => b.data[b.data.length - 1] - a.data[a.data.length - 1]);

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: dates,
            datasets: graphs.map((g, idx) => {
                return {
                    label: g.label,
                    data: g.data,
                    borderColor: `rgba(${g.color.r},${g.color.g},${g.color.b},1)`,
                    backgroundColor: `rgba(${g.color.r},${g.color.g},${g.color.b},1)`,
                    pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
                    pointRadius: 2,
                    pointHoverRadius: 7,
                    fill: idx === graphs.length - 1 ? true : "+1",
                    value: true
                };
            })
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true
                        }
                    }
                ]
            },
            plugins: {
                filler: {
                    propagate: false
                }
            }
        }
    });
}

/**
 * returns an array with moving average of the input array
 * @param array - the input array
 * @param count - the number of elements to include in the moving average calculation
 * @param qualifier - an optional function that will be called on each
 *  value to determine whether it should be used
 * example call: movingAvg(values, 5, function(val){ return val != 0; })
 */
function movingAvg(array, count, qualifier) {
    // calculate average for subarray
    var avg = function (array, qualifier) {
        var sum = 0,
            count = 0,
            val;
        for (var i in array) {
            val = array[i];
            if (!qualifier || qualifier(val)) {
                sum += val;
                count++;
            }
        }

        return sum / count;
    };

    var result = [],
        val;

    // pad beginning of result with null values
    for (var i = 0; i < count - 1; i++) result.push(null);

    // calculate average for each subarray and add to result
    for (var i = 0, len = array.length - count; i <= len; i++) {
        val = avg(array.slice(i, i + count), qualifier);
        if (isNaN(val)) result.push(null);
        else result.push(Math.round(val));
    }

    return result;
}

function run(dates, confirmed, deaths, recovered) {
    var i;
    setTopBox({
        boxId: "box0",
        title: "Current status as of ".concat(dates[dates.length - 1]),
    });
    setCBox({
        boxId: "box1",
        title: "United States",
        elements: [
            `Infections: <b>${get_current(confirmed, "US").toString()}</b>,
            doubles every <b>${get_current(confirmed, "US", "l").toString()} days</b>`,
            `Deaths: <b>${get_current(deaths, "US").toString()}</b>,
            doubles every <b>${get_current(deaths, "US", "l").toString()} days</b>`,
            `Mortality rate: <b>${Math.round(get_current(deaths, "US") / get_current(confirmed, "US") * 100 * 10) / 10} %</b>`
        ],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "US",
                min: 100,
                doubling_rate: "l"
            });

            boxDraw(
                day.slice(0, cd.length),
                [
                    {
                        label: "Infections doubling time",
                        data: country_data_with_options({
                            data: confirmed,
                            country: "US",
                            min: 100,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 165, b: 0 }
                    },
                    {
                        label: "Deaths doubling time",
                        data: country_data_with_options({
                            data: deaths,
                            country: "US",
                            min: 10,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 0, b: 0 }
                    }
                ],
                "linear",
                context
            );
        }
    });
    setCBox({
        boxId: "box2",
        title: "Italy",
        elements: [
            `Infections: <b>${get_current(confirmed, "Italy").toString()}</b>,
            doubles every <b>${get_current(confirmed, "Italy", "l").toString()} days</b>`,
            `Deaths: <b>${get_current(deaths, "Italy").toString()}</b>,
            doubles every <b>${get_current(deaths, "Italy", "l").toString()} days</b>`,
            `Mortality rate: <b>${Math.round(get_current(deaths, "Italy") / get_current(confirmed, "Italy") * 100 * 10) / 10} %</b>`
        ],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "Italy",
                min: 100,
                doubling_rate: "l"
            });

            boxDraw(
                day.slice(0, cd.length),
                [
                    {
                        label: "Infections doubling time",
                        data: country_data_with_options({
                            data: confirmed,
                            country: "Italy",
                            min: 100,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 165, b: 0 }
                    },
                    {
                        label: "Deaths doubling time",
                        data: country_data_with_options({
                            data: deaths,
                            country: "Italy",
                            min: 10,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 0, b: 0 }
                    }
                ],
                "linear",
                context
            );
        }
    });
    setCBox({
        boxId: "box3",
        title: "Spain",
        elements: [
            `Infections: <b>${get_current(confirmed, "Spain").toString()}</b>,
            doubles every <b>${get_current(confirmed, "Spain", "l").toString()} days</b>`,
            `Deaths: <b>${get_current(deaths, "Spain").toString()}</b>,
            doubles every <b>${get_current(deaths, "Spain", "l").toString()} days</b>`,
            `Mortality rate: <b>${Math.round(get_current(deaths, "Spain") / get_current(confirmed, "Spain") * 100 * 10) / 10} %</b>`
        ],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "Spain",
                min: 100,
                doubling_rate: "l"
            });

            boxDraw(
                day.slice(0, cd.length),
                [
                    {
                        label: "Infections doubling time",
                        data: country_data_with_options({
                            data: confirmed,
                            country: "Spain",
                            min: 100,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 165, b: 0 }
                    },
                    {
                        label: "Deaths doubling time",
                        data: country_data_with_options({
                            data: deaths,
                            country: "Spain",
                            min: 10,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 0, b: 0 }
                    }
                ],
                "linear",
                context
            );
        }
    });
    setCBox({
        boxId: "box4",
        title: "Germany",
        elements: [
            `Infections: <b>${get_current(confirmed, "Germany").toString()}</b>,
            doubles every <b>${get_current(confirmed, "Germany", "l").toString()} days</b>`,
            `Deaths: <b>${get_current(deaths, "Germany").toString()}</b>,
            doubles every <b>${get_current(deaths, "Germany", "l").toString()} days</b>`,
            `Mortality rate: <b>${Math.round(get_current(deaths, "Germany") / get_current(confirmed, "Germany") * 100 * 10) / 10} %</b>`,
            `Length diff: <b>${country_diff(confirmed, "Germany").length} </b>`,
            `Length avgdiff: <b>${movingAvg(country_diff(confirmed, "Germany"), 7).length} </b>`
        ],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "Germany",
                min: 100,
                doubling_rate: "l"
            });

            boxDraw(
                day.slice(0, cd.length),
                [
                    {
                        label: "Infections doubling time",
                        data: country_data_with_options({
                            data: confirmed,
                            country: "Germany",
                            min: 100,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 165, b: 0 }
                    },
                    {
                        label: "Deaths doubling time",
                        data: country_data_with_options({
                            data: deaths,
                            country: "Germany",
                            min: 10,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 0, b: 0 }
                    }
                ],
                "linear",
                context
            );
        }
    });
    setCBox({
        boxId: "box5",
        title: "France",
        elements: [
            `Infections: <b>${get_current(confirmed, "France").toString()}</b>,
            doubles every <b>${get_current(confirmed, "France", "l").toString()} days</b>`,
            `Deaths: <b>${get_current(deaths, "France").toString()}</b>,
            doubles every <b>${get_current(deaths, "France", "l").toString()} days</b>`,
            `Mortality rate: <b>${Math.round(get_current(deaths, "France") / get_current(confirmed, "France") * 100 * 10) / 10} %</b>`
        ],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "France",
                min: 100,
                doubling_rate: "l"
            });

            boxDraw(
                day.slice(0, cd.length),
                [
                    {
                        label: "Infections doubling time",
                        data: country_data_with_options({
                            data: confirmed,
                            country: "France",
                            min: 100,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 165, b: 0 }
                    },
                    {
                        label: "Deaths doubling time",
                        data: country_data_with_options({
                            data: deaths,
                            country: "France",
                            min: 10,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 0, b: 0 }
                    }
                ],
                "linear",
                context
            );
        }
    });
    setCBox({
        boxId: "box6",
        title: "United Kingdom",
        elements: [
            `Infections: <b>${get_current(confirmed, "United Kingdom").toString()}</b>,
            doubles every <b>${get_current(confirmed, "United Kingdom", "l").toString()} days</b>`,
            `Deaths: <b>${get_current(deaths, "United Kingdom").toString()}</b>,
            doubles every <b>${get_current(deaths, "United Kingdom", "l").toString()} days</b>`,
            `Mortality rate: <b>${Math.round(get_current(deaths, "United Kingdom") / get_current(confirmed, "United Kingdom") * 100 * 10) / 10} %</b>`
        ],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "United Kingdom",
                min: 100,
                doubling_rate: "l"
            });

            boxDraw(
                day.slice(0, cd.length),
                [
                    {
                        label: "Infections doubling time",
                        data: country_data_with_options({
                            data: confirmed,
                            country: "United Kingdom",
                            min: 100,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 165, b: 0 }
                    },
                    {
                        label: "Deaths doubling time",
                        data: country_data_with_options({
                            data: deaths,
                            country: "United Kingdom",
                            min: 10,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 0, b: 0 }
                    }
                ],
                "linear",
                context
            );
        }
    });

    setCBox({
        boxId: "box7",
        title: "Japan",
        elements: [
            `Infections: <b>${get_current(confirmed, "Japan").toString()}</b>,
            doubles every <b>${get_current(confirmed, "Japan", "l").toString()} days</b>`,
            `Deaths: <b>${get_current(deaths, "Japan").toString()}</b>,
            doubles every <b>${get_current(deaths, "Japan", "l").toString()} days</b>`,
            `Mortality rate: <b>${Math.round(get_current(deaths, "Japan") / get_current(confirmed, "Japan") * 100 * 10) / 10} %</b>`
        ],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "Japan",
                min: 100,
                doubling_rate: "l"
            });

            boxDraw(
                day.slice(0, cd.length),
                [
                    {
                        label: "Infections doubling time",
                        data: country_data_with_options({
                            data: confirmed,
                            country: "Japan",
                            min: 100,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 165, b: 0 }
                    },
                    {
                        label: "Deaths doubling time",
                        data: country_data_with_options({
                            data: deaths,
                            country: "Japan",
                            min: 10,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 0, b: 0 }
                    }
                ],
                "linear",
                context
            );
        }
    });

    setCBox({
        boxId: "box8",
        title: "Singapore",
        elements: [
            `Infections: <b>${get_current(confirmed, "Singapore").toString()}</b>,
            doubles every <b>${get_current(confirmed, "Singapore", "l").toString()} days</b>`,
            `Deaths: <b>${get_current(deaths, "Singapore").toString()}</b>,
            doubles every <b>${get_current(deaths, "Singapore", "l").toString()} days</b>`,
            `Mortality rate: <b>${Math.round(get_current(deaths, "Singapore") / get_current(confirmed, "Singapore") * 100 * 10) / 10} %</b>`
        ],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "Singapore",
                min: 100,
                doubling_rate: "l"
            });

            boxDraw(
                day.slice(0, cd.length),
                [
                    {
                        label: "Infections doubling time",
                        data: country_data_with_options({
                            data: confirmed,
                            country: "Singapore",
                            min: 100,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 165, b: 0 }
                    },
                    {
                        label: "Deaths doubling time",
                        data: country_data_with_options({
                            data: deaths,
                            country: "Singapore",
                            min: 1,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 0, b: 0 }
                    }
                ],
                "linear",
                context
            );
        }
    });

    setCBox({
        boxId: "box9",
        title: "Austria",
        elements: [
            `Infections: <b>${get_current(confirmed, "Austria").toString()}</b>,
            doubles every <b>${get_current(confirmed, "Austria", "l").toString()} days</b>`,
            `Deaths: <b>${get_current(deaths, "Austria").toString()}</b>,
            doubles every <b>${get_current(deaths, "Austria", "l").toString()} days</b>`,
            `Mortality rate: <b>${Math.round(get_current(deaths, "Austria") / get_current(confirmed, "Austria") * 100 * 10) / 10} %</b>`
        ],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "Austria",
                min: 100,
                doubling_rate: "l"
            });

            boxDraw(
                day.slice(0, cd.length),
                [
                    {
                        label: "Infections doubling time",
                        data: country_data_with_options({
                            data: confirmed,
                            country: "Austria",
                            min: 100,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 165, b: 0 }
                    },
                    {
                        label: "Deaths doubling time",
                        data: country_data_with_options({
                            data: deaths,
                            country: "Austria",
                            min: 10,
                            doubling_rate: "l"
                        }),
                        color: { r: 255, g: 0, b: 0 }
                    }
                ],
                "linear",
                context
            );
        }
    });

    setBox1({
        boxId: "box10",
        title: "Death data comparison",
        elements: [],
        cb: context => {
            const cd = country_data_with_options({
                data: confirmed,
                country: "United Kingdom",
                min: 100,
                doubling_rate: "l"
            });
        }
    });

    draw_bar(dates, [
        {
            label: "Germany new incidents avg of 7 days",
            data: movingAvg(country_diff(confirmed, "Germany"), 7),
            color: { r: 0, g: 100, b: 100 }
        }
    ],
        //"linear",
        ctx1);

    /*draw_bar(dates.slice(30), [
        {
            label: "Germany new deaths avg of 7 days",
            data: movingAvg(country_diff(deaths, "Germany").slice(30), 7),
            color: { r: 255, g: 0, b: 0 }
        }
    ],
        //"linear",
        ctx2);*/

    draw_bar(dates, [
        {
            label: "Germany new incidents",
            data: country_diff(deaths, "Germany"),
            color: { r: 255, g: 0, b: 0 }
        }
    ],
        //"linear",
        ctx2);

    /*draw(
        dates.slice(31),
        [
            {
                label: "Germany New Incidents",
                data: country_diff(confirmed, "Germany").slice(30),
                color: { r: 0, g: 0, b: 255 }
            }
        ],
        "linear",
        ctx2
    );*/


    draw_bar(
        dates.slice(31),
        [
            {
                label: "Germany New Infections",
                data: country_diff(confirmed, "Germany").slice(30),
                color: { r: 255, g: 215, b: 0 }
            },
            {
                label: "US New Infections",
                data: country_diff(confirmed, "US").slice(30),
                color: { r: 255, g: 0, b: 0 }
            },
            {
                label: "Italy New Infections",
                data: country_diff(confirmed, "Italy").slice(30),
                color: { r: 0, g: 0, b: 255 }
            }
        ],
        ctx9
    );

    draw_bar(
        dates.slice(31),
        [
            {
                label: "Germany New Deaths",
                data: country_diff(deaths, "Germany").slice(30),
                color: { r: 255, g: 215, b: 0 }
            },
            {
                label: "US New Deaths",
                data: country_diff(deaths, "US").slice(30),
                color: { r: 255, g: 0, b: 0 }
            },
            {
                label: "Italy New Deaths",
                data: country_diff(deaths, "Italy").slice(30),
                color: { r: 0, g: 0, b: 255 }
            }
        ],
        ctx10
    );

    /*draw(dates, [
          {
              label: "Italy new deaths avg of 3 days",
              data: movingAvg(country_diff(deaths, "Italy").slice(30), 3),
              color: { r: 0, g: 0, b: 0 }
          }
      ], ctx10);*/

    day.length = country_data(deaths, "Iran").slice(33).length;

    //Inhabitants
    //US = 332639102, DE = 83019213, IT = 60262701, ESP = 46722980,
    //UK = 66435550, FR = 66993000, CH = 8544527, IR = 81800269

    draw(
        day,
        [
            {
                label: "Italy deaths",
                data: country_data_with_options({
                    data: deaths,
                    country: "Italy",
                    //inhabitants: 60.262701,
                    min: 10
                }),
                color: { r: 0, g: 0, b: 255 }

                //.slice(32)
            },
            {
                label: "Germany deaths",
                data: country_data_with_options({
                    data: deaths,
                    country: "Germany",
                    //inhabitants: 83.019213,
                    min: 10
                }),
                color: { r: 255, g: 215, b: 0 }
                //.slice(39)
            },
            {
                label: "UK deaths",
                data: country_data_with_options({
                    data: deaths,
                    country: "United Kingdom",
                    //inhabitants: 66.435550,
                    min: 10
                }),
                color: { r: 255, g: 0, b: 255 }
                //.slice(43)
            },
            {
                label: "Spain deaths",
                data: country_data_with_options({
                    data: deaths,
                    country: "Spain",
                    //inhabitants: 46.722980,
                    min: 10
                }),
                color: { r: 255, g: 255, b: 0 }
                //.slice(40)
            },
            {
                label: "France deaths",
                data: country_data_with_options({
                    data: deaths,
                    country: "France",
                    //inhabitants: 66.993000,
                    min: 10
                }),
                color: { r: 0, g: 255, b: 255 }
                //.slice(38)
            },
            {
                label: "US deaths",
                data: country_data_with_options({
                    data: deaths,
                    country: "US",
                    //inhabitants: 332.639102,
                    min: 10
                }),
                color: { r: 255, g: 0, b: 0 }
                //.slice(41)
            },
            {
                label: "Iran deaths",
                data: country_data_with_options({
                    data: deaths,
                    country: "Iran",
                    //inhabitants: 81.800269,
                    min: 10
                }),
                color: { r: 0, g: 255, b: 127 }
                //.slice(35)
            },
            {
                label: "CH deaths",
                data: country_data_with_options({
                    data: deaths,
                    country: "Switzerland",
                    //inhabitants: 8.544527,
                    min: 10
                }),
                color: { r: 131, g: 111, b: 255 }
                //.slice(43)
            }
        ],
        "logarithmic",
        ctx11
    );

    draw(
        day,
        [
            /*{
                  label: "Italy deaths doubling rate p",
                  data: country_data_with_options({
                      data: deaths,
                      country: "Italy",
                      min: 100,
                      doubling_rate: "p"
                  }),
                  color: { r: 100, g: 100, b: 255 }
              },*/
            {
                label: "Italy deaths doubling rate",
                data: country_data_with_options({
                    data: deaths,
                    country: "Italy",
                    min: 10,
                    doubling_rate: "l"
                }),
                color: { r: 0, g: 0, b: 255 }
            },
            {
                label: "Spain deaths doubling rate",
                data: country_data_with_options({
                    data: deaths,
                    country: "Spain",
                    min: 10,
                    doubling_rate: "l"
                }),
                color: { r: 255, g: 255, b: 0 }
            },
            {
                label: "France deaths doubling rate",
                data: country_data_with_options({
                    data: deaths,
                    country: "France",
                    min: 10,
                    doubling_rate: "l"
                }),
                color: { r: 0, g: 255, b: 255 }
            },
            {
                label: "UK deaths doubling rate",
                data: country_data_with_options({
                    data: deaths,
                    country: "United Kingdom",
                    min: 10,
                    doubling_rate: "l"
                }),
                color: { r: 255, g: 0, b: 255 }
            },
            /*{
                  label: "Germany deaths doubling rate p",
                  data: country_data_with_options({
                      data: deaths,
                      country: "Germany",
                      min: 100,
                      doubling_rate: "p"
                  }),
                  color: { r: 255, g: 245, b: 100 }
              },*/
            {
                label: "Germany deaths doubling rate",
                data: country_data_with_options({
                    data: deaths,
                    country: "Germany",
                    min: 10,
                    doubling_rate: "l"
                }),
                color: { r: 255, g: 215, b: 0 }
            },
            {
                label: "US deaths doubling rate",
                data: country_data_with_options({
                    data: deaths,
                    country: "US",
                    min: 10,
                    doubling_rate: "l"
                }),
                color: { r: 255, g: 0, b: 0 }
            }
        ],
        "linear",
        ctx12
    );

    draw(
        day,
        [
            {
                label: "Italy infections doubling rate",
                data: country_data_with_options({
                    data: confirmed,
                    country: "Italy",
                    min: 100,
                    doubling_rate: "l"
                }),
                color: { r: 0, g: 0, b: 255 }
            },
            {
                label: "Spain infections doubling rate",
                data: country_data_with_options({
                    data: confirmed,
                    country: "Spain",
                    min: 100,
                    doubling_rate: "l"
                }),
                color: { r: 255, g: 255, b: 0 }
            },
            {
                label: "France infections doubling rate",
                data: country_data_with_options({
                    data: confirmed,
                    country: "France",
                    min: 100,
                    doubling_rate: "l"
                }),
                color: { r: 0, g: 255, b: 255 }
            },
            {
                label: "UK infections doubling rate",
                data: country_data_with_options({
                    data: confirmed,
                    country: "United Kingdom",
                    min: 100,
                    doubling_rate: "l"
                }),
                color: { r: 255, g: 0, b: 255 }
            },
            {
                label: "Germany infections doubling rate",
                data: country_data_with_options({
                    data: confirmed,
                    country: "Germany",
                    min: 100,
                    doubling_rate: "l"
                }),
                color: { r: 255, g: 215, b: 0 }
            },
            {
                label: "US infections doubling rate",
                data: country_data_with_options({
                    data: confirmed,
                    country: "US",
                    min: 100,
                    doubling_rate: "l"
                }),
                color: { r: 255, g: 0, b: 0 }
            }
        ],
        "linear",
        ctx13
    );
}
