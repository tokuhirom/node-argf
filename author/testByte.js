var ARGF = require('./index.js');

var argf = new ARGF();
argf.forEachChar(function (line) {
    process.stdout.write('BYTE(' + (argf.stream.path || '-') + ") " + line + "\n");
});

