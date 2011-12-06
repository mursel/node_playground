var express = require('express');
var scheduler = require('./scheduler');

var app = express.createServer();

app.configure(function () {
    app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

scheduler.init(false, function (msg) {
    console.log(msg);
});

app.post('/jobs/add', function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var jso = JSON.parse(req.param("racun"));

    var tempHtml = "Tip računa: " + jso.podaci.tip + "<br>";
    tempHtml += "PartnerId: " + jso.podaci.partner.id + "<br>";
    tempHtml += "PartnerDesc: " + jso.podaci.partner.desc + "<br>";
    tempHtml += "PartnerPdvBroj: " + jso.podaci.partner.pdv_broj + "<br>";

    res.send(tempHtml);

    scheduler.add({
        "data": jso,
        "removeOnComplete": true
    }, function (msg) {
        console.log(msg);
    });

    scheduler.process(function (msg) {
        console.log(msg);
    });

});

app.listen(5511);