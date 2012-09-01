var fs = require('fs');

function ARGF(args) {
    if (arguments.length === 0) {
        args = process.argv.splice(2);
    }
    this.files    = args.slice();
    this.bufsiz   = 4096;
    this.buffer   = '';
    this.encoding = 'utf-8';
}

/**
 * read line from ARGF.
 */
ARGF.prototype.forEach = function (callback) {
    var self = this;

    this._openFirstStream();
    this._forEachStream(function () {
        // can you write better code?
        var b = true;
        while (b) {
            b = false;
            self.buffer = self.buffer.replace(/^([^\n]*\n)/, function (line) {
                callback(line);
                b = true;
                return '';
            });
        }
    }, function () {
        callback(self.buffer);
        self.buffer = '';
    });
};
ARGF.prototype.forEachChar = function (callback) {
    var self = this;

    this._openFirstStream();
    this._forEachStream(function () {
        for (var i=0, l=self.buffer.length; i<l; ++i) {
            callback(self.buffer[i]);
        }
        self.buffer = '';
    }, function () {
        for (var i=0, l=self.buffer.length; i<l; ++i) {
            callback(self.buffer[i]);
        }
        self.buffer = '';
    });
};
ARGF.prototype._forEachStream = function (onData, onEnd) {
    var func;
    var self = this;
    func = function () {
        self.stream.resume();
        self.stream.setEncoding(self.encoding);
        self.stream.on('data', function (chunk) {
            self.buffer += chunk;
            onData();
        });

        self.stream.on('end', function () {
            if (self.buffer.length > 0) {
                onEnd();
            }
            if (self.files.length > 0) {
                self.filename = self.files.shift();
                self.stream = fs.createReadStream(self.filename);
                func();
            }
        });
    };
    func();
};
ARGF.prototype._openFirstStream = function () {
    if (this.files.length === 0) {
        this.stream = process.stdin;
    } else {
        this.filename = this.files.shift();
        this.stream = fs.createReadStream(this.filename);
    }
};

module.exports = ARGF;

