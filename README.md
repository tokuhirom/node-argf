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

CLASSES
-------

### ARGF

#### var argf = new ARGF([Array files])

Create a new instance of ARGF. You can pass a argv by yourself.
By default, ARGF uses process.argv as a file list.

If files.length is 0, ARGF reads data from stdin.

#### argf.forEach(function (line) { ... })

This iterates over each line.

#### argf.forEachChar(function (line) { ... })

This iterates over each char.

#### argf.bufsiz

This is a buffer size to read file. Default value is 4096 bytes.

#### argf.stream

Current stream object. You can get a current file path by `argf.stream.path`.

#### argf.encoding

This is a file encoding. It's `utf-8` by default.

LICENSE
-------

http://tokuhirom.mit-license.org/

