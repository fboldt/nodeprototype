const neatCsv = require('neat-csv');
const fs = require('fs');
const skmeans = require("skmeans");

module.exports = function (csvfilename) { 
    fs.readFile(csvfilename, async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        makeclusters(await neatCsv(data));
    })
};

function makeclusters(rawdata) {
    points = [];
    rawdata.forEach(sample => {
        point = [parseFloat(sample["metadata.lng"]),parseFloat(sample["metadata.lat"])];
        points.push(point);
    });
    let n_clusters = 100;
    if ( points.length < n_clusters) { n_clusters = points.length; }
    let kmeansModel = skmeans(points, n_clusters);
    console.log(kmeansModel);
}
