#!/usr/bin/env node
var osmPbfParser = require('osm-pbf-parser');
var dat = require('dat');
var through2 = require('through2');

var repo = dat(process.argv[2] || ".", {}, ready);
function ready(err) {
    if (err) return console.error(err);

    process.stdin
        .pipe(osmPbfParser())
        .pipe(through2.obj(function (chunk, enc, callback) {
            chunk.forEach(function(item) {
                item.version = item.info.version;
                this.push(item);
            }.bind(this));
            callback();
        }))
        .pipe(repo.createWriteStream({
            primary: 'id',
            primaryFormat: function(val) {
                return val.toString();
            }
        }));
}
