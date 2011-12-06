var kue = require('./lib/kue');
var util = require('util');

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

exports.add = function (job_data, isDelayed, seconds, removeOnComplete, fn) {
    if (typeof seconds == undefined) {
        seconds = 1;    // default 1 sekunda
    }
    var zadatak = undefined;
    if (job_data == undefined || job_data == null) {
        fn("job_data undefined or empty");
    } else {
        if (isDelayed) {
            zadatak = jobs.create('job_name', {
                tip: job_data.tip_racuna,
                partner: job_data.partner,
                items: job_data.items
            }).delay(seconds * 1000).save();
            jobs.promote();
        } else {
            zadatak = jobs.create('job_name', {
                tip: job_data.tip_racuna,
                partner: job_data.partner,
                items: job_data.items
            }).save();
        }
        if (removeOnComplete) {
            zadatak.on('complete', function () {
                zadatak.remove();
                fn("job completed!");
            });
        }
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

exports.primjer = function (opcije) {
    var default_opcije = {
        "ime": "Mursel",
        "prezime": "Musabasic"
    }
    for (var i in opcije) {
        if (typeof opcije[i] == undefined) {
            opcije[i] = default_opcije[i];
        }
    }
    for (var j in opcije) {
        console.log(i + "=" + opcije[i]);
    }
}