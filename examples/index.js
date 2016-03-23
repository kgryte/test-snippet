'use strict';

var mkdirp = require( 'mkdirp' );
var path = require( 'path' );
var cp = require( './../lib' );

var dirpath = path.resolve( __dirname, '../build/'+(new Date().getTime())+'/test.foo.js' );

mkdirp.sync( dirpath );
cp.sync( dirpath, {
	'template': 'mocha',
	'title': 'beep-boop'
});
