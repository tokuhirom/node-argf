var fs = require('fs'),
    EventEmitter = require('events').EventEmitter;

function ARGF(args) {
    if (arguments.length === 0) {
        args = process.argv.splice(2);
    }
    this.files    = args.slice();
    this.bufsiz   = 4096;
    this.encoding = 'utf-8';
}
ARGF.prototype = new EventEmitter();

/**
 * read line from ARGF.
 */
ARGF.prototype.forEach = function (callback) {
    var self = this;

    var buffer = '';
    this.openFirstStream();
    var stream = this.createStream();
    stream.on('data', function (chunk) {
        buffer += chunk;

        var b = true;
        while (b) {
            b = false;
            buffer = buffer.replace(/^([^\n]*\n)/, function (line) {
                callback(line);
                b = true;
                return '';
            });
        }
    });
    stream.on('end', function () {
        if (buffer.length > 0) {
            callback(buffer);
        }
        buffer = '';
    });
};
ARGF.prototype.forEachChar = function (callback) {
    var self = this;

    this.openFirstStream();
    var stream = this.createStream();
    stream.on('data', function (chunk) {
        for (var i=0, l=chunk.length; i<l; ++i) {
            callback(chunk[i]);
        }
    });
};
ARGF.prototype.createStream = function () {
    var func;
    var self = this;
    var stream = new EventEmitter();
    func = function () {
        self.stream.resume();
        self.stream.setEncoding(self.encoding);
        self.stream.on('data', function (chunk) {
            stream.emit('data', chunk);
        });

        self.stream.on('end', function () {
            stream.emit('end');

            if (self.files.length > 0) {
                self.filename = self.files.shift();
                self.stream = fs.createReadStream(self.filename);
                func();
            } else {
                self.emit('finished');
            }
        });
    };
    func();
    return stream;
};
ARGF.prototype.openFirstStream = function () {
    if (this.files.length === 0) {
        this.stream = process.stdin;
    } else {
        this.filename = this.files.shift();
        this.stream = fs.createReadStream(this.filename);
    }
};

module.exports = ARGF;

