window.addEventListener('load', resizeCheck); 
window.addEventListener('resize', resizeCheck);

//additional function to help resize charts properly in mobile view - charts from time to time resize differently than is set in css settings
function resizeCheck() {
    const myWidth = this.innerWidth;
    if (myWidth < 769) {
        for (let i in Chart.instances) {
            Chart.instances[i].resize(this.innerWidth, this.innerHeight);
        }
    }
} 

//managing data for charts and printing charts
function printCharts(props) {
    const data = props;

    const bar = document.getElementById('barChart');
    const pie = document.getElementById('pieChart');

    Chart.defaults.color = "#000000bf";
    Chart.defaults.font.family = "Open Sans";

    //BAR CHART
    //data for x scale
    let dates = [];
    
    for (let i in data.transactions) {
        dates.push(data.transactions[i].date);
    }

    //preparing data for y scale
    //array of objects containing date and value for transaction, reverse to get serve data chronologiccally
    const transactionCopy = data.transactions;
    const arrToSumAmounts = transactionCopy.map(el => ({'date': el.date, 'value': el.amount})).reverse();
    //empty object to put daily sums
    let daylySums = {};
    //filling object with date: sum of transactions for the date
    arrToSumAmounts.forEach((item) => {
        if (daylySums[item.date]) {
            daylySums[item.date].value += item.value;
        } else {
            daylySums[item.date] = item;
        }
    });
    //final data for y scale
    const summary = Object.values(daylySums).map(el=>el.value);
    //colors array for the bars
    colors = summary.map(el => el >= 0 ? "rgba(0, 228, 124, 0.7)" : "rgba(255, 10, 20, 0.7)");

    //PRINT BAR CHART
    new Chart(bar, {
        type: 'bar',
        data: {
            //data for x scale taken from dates array - we need only one item for each day so we take 'new Set' 
            //reverse to get serve data chronologiccally
            labels: [...new Set(dates)].reverse(),
            datasets: [{
                label: 'Saldo operacji',
                data: summary,
                borderWidth: 1,
                backgroundColor: colors
            }]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxRotation: 60,
                        minRotation: 5
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: (context) => {
                            if(context.tick.value === 0) {
                                return "rgba(0, 0, 0, 0.8)"
                            }
                            return "rgba(0, 0, 0, 0.1)"
                        },
                        lineWidth: (context) => {
                            if(context.tick.value === 0) {
                                return 2
                            }
                            return 1
                        }
                    }
                }
            },
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Saldo operacji',
                    font: {
                        size: 16
                    } 
                },
                legend: {
                    display: false
                }
            }
        }
    });

    //PIE CHART
    let types = [];
    let countObj = {};
    let percentTypes = [];

    //fill array with transaction types
    for (let i in data.transactions) {
        types.push(data.transactions[i].type)
    }
    //object counting number of times specific type appears in types array (type: number of times in array)
    types.forEach(type => {
        countObj[type] = ++countObj[type] || 1;
    })
    //data for pie chart - counting percentage of types appearance
    for (let i in countObj) {
        percentTypes.push(((countObj[i] / data.transactions.length)*100).toFixed(1))
    }
    
    //PRINT PIE CHART
    new Chart(pie, {
        type: 'pie',
        data: {
            //countObj keys and db transctionTypes keys represent same data (countObj holds type: number of times type appeared,  while transctionTypes holds type: description)
            //therefore data for pie chart labels is taken from it
            labels: Object.values(data.transacationTypes),
            datasets: [{
                label: '% udział operacji',
                data: percentTypes,
                borderWidth: 1,
                borderColor: 'rgba(0, 0, 0, 0.3)',
                backgroundColor: ["rgba(0, 228, 124, 0.7)", "rgba(255, 75, 20, 0.7)", "rgba(0, 250, 80, 0.7)", "rgba(255, 10, 20, 0.7)"]
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Procentowy udział operacji',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}
