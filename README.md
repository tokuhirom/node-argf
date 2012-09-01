Ruby's ARGF for node.js
=======================

ARGF is a stream designed for use in scripts that process files given as command-line arguments, or passed in via STDIN.

ARGF is very useful for comand line utilities.

SYNOPSIS
--------

    var ARGF = require('./index.js');

    var argf = new ARGF();
    argf.forEach(function (line) {
        process.stdout.write('LINE(' + (argf.stream.path || '-') + ") " + line);
    });

