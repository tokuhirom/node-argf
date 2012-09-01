var fs = require('fs');

function ARGF(args) {
    if (arguments.length === 0) {
        args = process.argv.splice(2);
    }
    this.files = args.slice();
    this.bufsiz = 4096;
    this.buffer = '';
    this.encoding = 'utf-8';
}

/**
 * read line from ARGF.
 */
ARGF.prototype.forEach = function (code) {
    if (this.files.length === 0) {
        this.stream = process.stdin;
    } else {
        this.filename = this.files.shift();
        this.stream = fs.createReadStream(this.filename);
    }
    this._forEachStream(code);
};
ARGF.prototype._forEachStream = function (code) {
    var self = this;
    this.stream.resume();
    this.stream.setEncoding(this.encoding);
    this.stream.on('data', function (chunk) {
        self.buffer += chunk;
        var b = true;
        while (b) {
            b = false;
            self.buffer = self.buffer.replace(/^([^\n]*\n)/, function (line) {
                code(line);
                b = true;
                return '';
            });
        }
    });

    this.stream.on('end', function () {
        if (self.buffer.length > 0) {
            code(self.buffer);
            self.buffer = '';
        }
        if (self.files.length > 0) {
            self.filename = self.files.shift();
            self.stream = fs.createReadStream(self.filename);
            self._forEachStream(code);
        }
    });
};

module.exports = ARGF;

