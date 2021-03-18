'use strict'

var mysql = require('mysql');
var util = require('util');
var Excel = require('exceljs');

exports.queryRates = async function(clientId) {

    const con = mysql.createConnection({
        host: 'localhost',
        port: '5555',
        database: 'whitebox',
        user: 'root',
        password: 'interstella'
    });
    
    con.connect(function(err) {
        if (err) {
            console.error(err);
            return [];
        }
    });
    
    var result = {};
    const asyncQuery = util.promisify(con.query).bind(con);
    await (async () => {
        try
        {
            result = await asyncQuery(`SELECT * FROM rates WHERE client_id='${clientId}'`);
        }
        finally
        {
            con.end();
        }
    })();

    if (result === null || result.length == 0) {
        throw new Error(`No results found for client: ${clientId}`);
    }

    return result;
};

exports.writeToExcel = function (data, filename) {

    var sheetInformation = [
        { name: 'Domestic Standard Rates', speed: 'standard', locale: 'domestic' },
        { name: 'Domestic Expedited Rates', speed: 'expedited', locale: 'domestic' },
        { name: 'Domestic Next Day Rates', speed: 'nextDay', locale: 'domestic' },
        { name: 'International Economy Rates', speed: 'intlEconomy', locale: 'international' },
        { name: 'International Expedited Rates', speed: 'intlExpedited', locale: 'international' },
    ];

    let workbook = new Excel.Workbook();
    sheetInformation.forEach(e => {
        createSheet(
            workbook, 
            e.name, 
            data.filter(d => d.shipping_speed == e.speed && d.locale == e.locale));
    });

    workbook.xlsx.writeFile(filename);
};

function createSheet(wb, name, data) {

    let map = new Map();
    data.forEach(e => {
        
        const key = e.start_weight + "-" + e.end_weight
    
        if (!map.has(key)){ map.set(key, []); }
        map.get(key).push({ zoneId: e.zone, rate: e.rate, colKey: "zone" + e.zone });
    });

    let sheet = wb.addWorksheet(name);

    var columns = [
        { header: 'Start Weight', key: 'startWeight', width: 11.36},
        { header: 'End Weight', key: 'endWeight', width: 11.36 }
    ];

    map.values().next().value.forEach(e => {
        columns.push({ header: 'Zone ' + e.zoneId, key: e.colKey, width: 29.36 });
    });

    sheet.columns = columns

    for (let [key, value] of map) {

        const weights = key.split('-');
        if (weights.length != 2) continue;

        var rowObj = {
            startWeight: parseFloat(weights[0]), 
            endWeight: parseFloat(weights[1]) 
        };

        value.forEach(e => {
            rowObj[e.colKey] = e.rate;
        });

        sheet.addRow(rowObj);
    }
};