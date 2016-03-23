'use strict';

var mkdirp = require( 'mkdirp' );
var path = require( 'path' );
var cp = require( './../lib' );

var dirpath = path.resolve( __dirname, '../build/'+(new Date().getTime()) );
mkdirp.sync( dirpath );

var filepath = path.join( dirpath, 'test.foo.js' );
cp.sync( filepath, {
	'template': 'mocha',
	'title': 'beep-boop'
});
