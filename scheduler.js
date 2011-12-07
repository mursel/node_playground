var kue = require('./lib/kue');

var jobs =  undefined;
var Job = undefined;
var tempData = "> ";

exports.init = function (showGUI, fn) {
    jobs = kue.createQueue(),
            Job = kue.Job;

    if (jobs == null) {
        fn("Problem creating queue!");
    } else {
        fn("Queue created!");
    }
    if (showGUI) {
        kue.app.listen(3000);
        fn("GUI available on port 3000");
    }
}

exports.add = function (opcije, fn) {

    var default_opcije = {
        "data": {},
        "priority": 'normal',
        "delayed": false,
        "seconds": 1,
        "removeOnComplete": false
    }

    for (var arg in default_opcije) {
        if (typeof opcije[arg] == "undefined")
            opcije[arg] = default_opcije[arg];
    }

    var zadatak = undefined;

    if (opcije["data"] == "undefined" || opcije["data"] == null) {
        fn("job_data undefined or empty");
    } else {
        var job_data = opcije["data"];
        if (opcije["delayed"]) {
            zadatak = jobs.create('job_name', {
                tip: job_data.tip_racuna,
                partner: job_data.partner,
                items: job_data.items
            }).delay(opcije["seconds"] * 1000);
            jobs.promote();
        } else {
            zadatak = jobs.create('job_name', {
                tip: job_data.tip_racuna,
                partner: job_data.partner,
                items: job_data.items
            });
        }

        if (opcije["priority"] != "undefined") {
            zadatak.priority(opcije["priority"]);
        }

        if (opcije["removeOnComplete"]) {
            zadatak.on('complete', function () {
                zadatak.remove();
                fn("job completed!");
            });
        }

        zadatak.save();
        
        fn("job added!");
    }
}

exports.process = function (fn) {
    jobs.process('job_name', 1, function (job, done) {
        var data = job.data;
        setTimeout(function () {
            done();
            fn("process func!");
        }, 5000);
    });
}

exports.removeById = function (id, fn) {
    Job.get(id, function (err, job) {
        if (err) {
            fn("Error removing job: " + id + "\nError:" + err);
            return;
        }
        job.remove(function (err) {
            if (err) {
                fn(err);
                return;
            }
            fn("job '" + id + "' removed!");
        });
    });
}