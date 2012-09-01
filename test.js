var ARGF = require('./index.js');

var argf = new ARGF();
argf.forEach(function (line) {
    process.stdout.write('LINE(' + (argf.stream.path || '-') + ") " + line);
});

