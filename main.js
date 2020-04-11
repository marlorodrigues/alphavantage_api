//https://www.alphavantage.co/documentation/
//https://www.reddit.com/r/investimentos/comments/9r3hmo/bovespa_alpha_vantage/
/*
    Chave da API 

    Time_Series

        Intradia       -> TIME_SERIES_INTRADAY
        Diario         -> TIME_SERIES_DAILY
        Ajuste Diario  -> TIME_SERIES_DAILY_ADJUSTED
        Semanal        -> TIME_SERIES_WEEKLY
        Ajuste Semanal -> TIME_SERIES_WEEKLY_ADJUSTED
        Serie Mensal   -> MTIME_SERIES_MONTHLY
        Ajuste Mensal  -> TIME_SERIES_MONTHLY_ADJUSTED
        Quote Endpoint -> GLOBAL_QUOTES
        Symbol Quote   -> SYMBOL_SEARCH (Example: https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=sony&apikey=demo)

    Time
        1min, 5min, 15min, 20min, 30min, 60min    
*/

//Function for API use
const intradia = "TIME_SERIES_INTRADAY";
const diario = "TIME_SERIES_DAILY";
const ajusteDiario = "TIME_SERIES_DAILY_ADJUSTED";
const semanal = "TIME_SERIES_WEEKLY";
const ajusteSemanal = "TIME_SERIES_WEEKLY_ADJUSTED";
const mensal = "MTIME_SERIES_MONTHLY";
const ajusteMensal = "TIME_SERIES_MONTHLY_ADJUSTED";
const searchQuote = "SYMBOL_SEARCH";
const myKey = ""; //Chave de acesso

//Globais
var final_result = [];
var listElement = document.getElementById("results");

function currentData() {
    // Obtém a data/hora atual
    var tmp = new Date();
    var dia = tmp.getDate();
    var mes = tmp.getMonth() + 1;
    var ano = tmp.getFullYear();

    (mes < 10) ? mes = "0" + mes : mes;

    var dataAtual = ano + "-" + mes + "-" + dia;

    return dataAtual;
}

function search() {

    console.log("Inicio");

    var stock = document.getElementById("stockName").value;
    var interval = document.getElementById("stockTime").value;
    var series = document.getElementById("stockDataInterval").value;

    series = setSerie(series);
    getQuote(stock, series, interval)
}

function getQuote(stock, time_Series, timeInterval) {

    var url = "https://www.alphavantage.co/query?function=" + time_Series + "&symbol=" + stock + "&interval=" + timeInterval + "min&apikey=" + myKey;

    axios.get(url)
        .then(function (response) {

            var data = [];

            data.push(response.data["Meta Data"]["2. Symbol"]);
            data.push(response.data["Meta Data"]["3. Last Refreshed"]);

            // var tmp = currentData();

            tmp = "2020-04-08";

            data.push(response.data["Time Series (Daily)"][tmp]["1. open"]);
            data.push(response.data["Time Series (Daily)"][tmp]["2. high"]);
            data.push(response.data["Time Series (Daily)"][tmp]["3. low"]);
            data.push(response.data["Time Series (Daily)"][tmp]["4. close"]);
            data.push(response.data["Time Series (Daily)"][tmp]["5. volume"]);

            // console.log(data);
            postResult(data)


        }).catch(function (err) {
            console.log(err);
        });

}

//0 - Symbol 1 - Last Refreshed 2 - Open 3 - High 4 - Low 5 - Close 6 - Volume
function postResult(param) {

    for (let i = 0; i < 7; i++) {

        var name = organizeDataString(i);
        var txtData = param[i];
        (i === 0 || i === 1) ? txtData : txtData = organizeValues(txtData);

        var result = document.createElement("li");
        result.setAttribute("id", "item" + i);

        var text = document.createTextNode(name + " : " + txtData.toUpperCase());

        result.appendChild(text);
        listElement.appendChild(result);

    }
}
function organizeValues(params) {

    params = params / 1;
    params = params.toLocaleString('pt-BR');
    return "U$ " + params;
}


function organizeDataString(i) {
    switch (i) {
        case 0:
            return "Ticket";
        case 1:
            return "Last Refreshed";
        case 2:
            return "Open";
        case 3:
            return "High";
        case 4:
            return "Low";
        case 5:
            return "Close";
        case 6:
            return "Volume";
    }
}


function setSerie(params) {
    if (params === "diario") {
        return diario;
    }
}
