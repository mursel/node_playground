var fs = require('fs');

var fileStream = undefined;

exports.init = function (fileName, append, enc, fn) {
    encoding = (enc == undefined) ? 'utf8' : enc;
    if (append) {
        fileStream = fs.createWriteStream(fileName, { 'flags': 'a', 'encoding': '" + encoding+"' });
    } else {
        fileStream = fs.createWriteStream(fileName, { 'encoding': '" + encoding+"' });
    }

    fn("File created!");
}

exports.write = function (msg) {
    fileStream.write(msg);
}

