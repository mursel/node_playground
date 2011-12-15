var kue = require('kue');

var jobs =  undefined;
var Job = undefined;
var tempData = "> ";
var jobsArray = new Array();

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
        "job_name": 'default_name',
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

    jobsArray.push(opcije["job_name"]);

    if (opcije["data"] == "undefined" || opcije["data"] == null) {
        fn("job_data undefined or empty");
    } else {
        var job_data = opcije["data"];
        if (opcije["delayed"]) {
            zadatak = jobs.create(opcije["job_name"], {
                tip: job_data.tip_racuna,
                partner: job_data.partner,
                items: job_data.items
            }).delay(opcije["seconds"] * 1000);
            jobs.promote();
        } else {
            zadatak = jobs.create(opcije["job_name"], {
                tip: job_data.tip_racuna,
                partner: job_data.partner,
                items: job_data.items
            });
        }

        zadatak.priority(opcije["priority"]);

        if (opcije["removeOnComplete"]) {
            zadatak.on('complete', function () {
                zadatak.remove();
                
                // dodati funkciju uklanjanja job-a iz jobsArray niza

                fn("job #" + zadatak.id + " completed!");
            });
        }

        zadatak.save();

        fn("job added!");
    }
}

exports.process = function (job_name, fn) {
    jobs.process(job_name, 1, function (job, done) {
        fn(job.data);
        done();
    });
}

exports.getJobById = function (id, fn) {
    for (var job in jobs) {
        if (jobs[job].id == id) {
            fn(jobs[job]);
        }
    }
}

exports.delJobById = function (id, fn) {
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