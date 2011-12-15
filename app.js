var express = require('express');
var scheduler = require('./scheduler');
var fileio = require('./fileio');

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
    tempHtml += "PartnerPdvBroj: " + jso.podaci.partner.pdv_broj + "<br><br>";

    for (var item in jso.items) {
        tempHtml += "<hr>";
        tempHtml += "ItemId: " + jso.items[item].id + "<br>";
        tempHtml += "ItemDesc: " + jso.items[item].desc + "<br>";
        tempHtml += "ItemQuantity: " + jso.items[item].quantity + "<br>";
        tempHtml += "ItemPrice: " + jso.items[item].price + "<br>";
    }

    res.send(tempHtml);

    scheduler.add({
        "job_name": 'job1',
        "data": jso,
        "removeOnComplete": true
    }, function (msg) {
        console.log(msg);
    });

    scheduler.add({
        "job_name": 'job2',
        "data": jso,
        "removeOnComplete": true
    }, function (msg) {
        console.log(msg);
    });

    scheduler.process("job1", function (data) {
        console.log("Process!");
    });

    scheduler.process("job2", function (data) {
        console.log("Process!");
    });

    fileio.init("test.txt", true, "utf8", function (msg) {
        console.log(msg);
    });

    fileio.write("OVO JE SAMO TEST!");

});

app.listen(5511);