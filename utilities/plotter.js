const fs = require('fs');
const secret_info = JSON.parse(fs.readFileSync('./secret_info.json'));
const plotly = require('plotly')(secret_info['plotly']['username'], secret_info['plotly']['key']);

function plotter(){
    // https://plot.ly/nodejs/getting-started/
    var data = [{x:[0,1,2], y:[3,2,1], type: 'bar'}];
    var layout = {fileopt : "overwrite", filename : "simple-node-example"};

    plotly.plot(data, layout, function (err, msg) {
        if (err) return console.log(err);
        console.log(msg);
    });
}

module.exports = plotter;