﻿var express = require('express');
var scheduler = require('./scheduler');

var app = express.createServer();

app.configure(function () {
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

scheduler.init();

app.post('/jobs/add', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var jso = JSON.parse(req.param("racun"));

    var tempHtml = "<br>" + jso.podaci.tip + "<br>";

    res.send(tempHtml);

    scheduler.add(jso, false, 0, true, function (msg) {
        alert(msg);
    });

    scheduler.process(function (msg) {
        alert(msg);
    });

});

app.listen(5511);