var test = require('tap').test,
    ARGF = require('../index.js');

test(function (t) {
    var lines = [];
    var argf = new ARGF(['dat/foo']);
    argf.forEach(function (line) {
        lines.push(line);
    });
    argf.on('finished', function () {
        t.equivalent(lines, ['aaa\n', 'bbb\n', 'ccc\n']);
        t.end();
    });
});

test(function (t) {
    var lines = [];
    var argf = new ARGF(['dat/foo', 'dat/foo']);
    argf.forEach(function (line) {
        lines.push(line);
    });
    argf.on('finished', function () {
        t.equivalent(lines, ['aaa\n', 'bbb\n', 'ccc\n', 'aaa\n', 'bbb\n', 'ccc\n']);
        t.end();
    });
});

test(function (t) {
    var lines = [];
    var argf = new ARGF(['dat/foo']);
    argf.forEachChar(function (line) {
        lines.push(line);
    });
    argf.on('finished', function () {
        t.equivalent(lines, ['a', 'a','a','\n', 'b','b','b','\n', 'c','c','c','\n']);
        t.end();
    });
});
