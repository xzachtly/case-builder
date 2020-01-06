var express = require('express');
const http = require('http');
var app = express();
var path = require('path');
const webServerConfig = require('./config/web-server.js');

let httpServer;

// viewed at http://localhost:8080
/*app.set({
    'Content-Type': 'text/html'
});
app.use(express.static(__dirname));
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});*/

app.listen(8080);

function initialize() {

    return new Promise((resolve, reject) => {
        const app = express();
        const bodyParser = require('body-parser');

        httpServer = http.createServer(app);

        app.set({
            'Content-Type': 'text/html'
        });

        app.use(bodyParser.urlencoded({
            extended: true
          })
        )
        
        app.use(bodyParser.json())

        app.use(express.static('public'));

        app.get('/', function(req, res) {
            res.sendFile(path.join(__dirname + '/index.html'));
        });

        app.post('/name', function(req, res) {
            console.log(req)
            res.json({name: "New Name"});
        });

        app.post('/get-order', function(req, res) {
            'use strict';
            const fs = require('fs');
            let rawdata = fs.readFileSync(req.body.order + '.json');
            let student = JSON.parse(rawdata);
            res.json(student);
        });

        app.post('/update-order', function(req, res) {
            'use strict';
            
            const fs = require('fs');
            let order = req.body

            let data = JSON.stringify(student, null, 2);
            fs.writeFileSync(req.body.orderName + '.json', data);

            res.send('Order Updsated Successfully');
        })

        httpServer.listen(webServerConfig.port).on('listening', () => {
            console.log(`Web server listening on localhost:${webServerConfig.port}`);
            resolve();
        }).on('error', err => {
            reject(err);
        });
    })
}

module.exports.initialize = initialize;