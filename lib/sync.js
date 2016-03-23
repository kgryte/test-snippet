'use strict';

// MODULES //

var isString = require( 'validate.io-string-primitive' );
var merge = require( 'utils-merge2' );
var mustache = require( 'mustache' );
var path = require( 'path' );
var fs = require( 'fs' );
var defaults = require( './defaults.js' );
var validate = require( './validate.js' );


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
	var tmpl = 'tape';
	var opts = {};
	var fpath;
	var dpath;
	var out;
	var err;

	if ( !isString( dest ) ) {
		throw new TypeError( 'invalid input argument. First argument must be a string primitive. Value: `' + dest + '`.' );
	}
	if ( arguments.length > 1 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	opts = merge( {}, defaults[ tmpl ], opts );
	tmpl = opts.template || tmpl;

	fpath = path.join( __dirname, tmpl, opts._filename );

	// TODO: check if directory
	dpath = path.join( dest, opts.filename );

	out = fs.readFileSync( fpath, {
		'encoding': 'utf8'
	});
	out = mustache.render( out, opts );

	fs.writeFileSync( dpath, out );
} // end FUNCTION cp()


// EXPORTS //

module.exports = cp;
