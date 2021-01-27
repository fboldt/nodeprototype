const fs = require('fs');
const neatCsv = require('neat-csv');
const skmeans = require("skmeans");

module.exports = async (csvfilename) => {
    fs.readFile(csvfilename, async (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        let jsonarray = await makeclusters(await neatCsv(data));
        return jsonarray;
    });
};

async function makeclusters(rawdata) {
    let points = [];
    rawdata.forEach(sample => {
        point = [parseFloat(sample["metadata.lng"]), parseFloat(sample["metadata.lat"])];
        points.push(point);
    });
    let n_clusters = 100;
    if (points.length < n_clusters) { n_clusters = points.length; }
    let kmeansModel = skmeans(points, n_clusters);
    let counts = new Array(n_clusters).fill(0);
    kmeansModel.idxs.forEach(cluster => {
        counts[cluster] += 1;
    })
    let jsonarray = []
    for (let i = 0; i < n_clusters; i++) {
        jsonarray.push({
            'lng': kmeansModel.centroids[i][0],
            'lat': kmeansModel.centroids[i][1],
            'count': counts[i]
        });
    }
    fs.writeFile("public/clusters.json", JSON.stringify(jsonarray), function (err) {
        if (err) { console.log(err); }
    });
    return jsonarray;
}
