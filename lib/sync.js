'use strict';

// MODULES //

var isString = require( 'validate.io-string-primitive' );
var merge = require( 'utils-merge2' );
var mustache = require( 'mustache' );
var path = require( 'path' );
var fs = require( 'fs' );
var exists = require( 'utils-fs-exists' ).sync;
var defaults = require( './defaults.js' );
var validate = require( './validate.js' );


// VARIABLES //

var TMPL = 'tape';


// COPY //

/**
* FUNCTION: cp( dest[, opts ] )
*	Synchronously creates a file.
*
* @param {String} dest - file destination directory
* @param {Object} [opts] - function options
* @param {String} [opts.template="tape"] - snippet template to use
* @param {String} [opts.title=""] - title
* @returns {Void}
*/
function cp( dest, options ) {
	var fpath;
	var dpath;
	var stats;
	var opts;
	var tmpl;
	var out;
	var err;

	if ( !isString( dest ) ) {
		throw new TypeError( 'invalid input argument. First argument must be a string primitive. Value: `' + dest + '`.' );
	}
	opts = {};
	if ( arguments.length > 1 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	tmpl = opts.template || TMPL;
	opts = merge( {}, defaults[ tmpl ], opts );

	fpath = path.join( __dirname, '..', 'templates', tmpl, opts._filename );

	if ( exists( dest ) ) {
		stats = fs.statSync( dest );
		if ( stats.isDirectory() ) {
			dpath = path.join( dest, opts._filename );
		}
	}
	if ( dpath === void 0 ) {
		// Assume provided an absolute filepath:
		dpath = dest;
	}
	out = fs.readFileSync( fpath, {
		'encoding': 'utf8'
	});
	out = mustache.render( out, opts );

	fs.writeFileSync( dpath, out );
} // end FUNCTION cp()


// EXPORTS //

module.exports = cp;
