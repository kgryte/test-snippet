'use strict';

// MODULES //

var isString = require( 'validate.io-string-primitive' ),
	merge = require( 'utils-merge2' )(),
	mustache = require( 'mustache' ),
	path = require( 'path' ),
	fs = require( 'fs' ),
	defaults = require( './defaults.js' ),
	validate = require( './validate.js' );


// COPY //

/**
* FUNCTION: cp( dest[, opts ] )
*	Synchronously creates a snippet.
*
* @param {String} dest - snippet destination directory
* @param {Object} [opts] - function options
* @param {String} [opts.template="mocha"] - snippet template to use
* @param {String} [opts.title=""] - title
* @returns {Void}
*/
function cp( dest, options ) {
	var tmpl = 'mocha',
		opts = {},
		fpath,
		dpath,
		out,
		err;

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
	dpath = path.join( dest, opts._filename );

	out = fs.readFileSync( fpath, {
		'encoding': 'utf8'
	});
	out = mustache.render( out, opts );

	fs.writeFileSync( dpath, out );
} // end FUNCTION cp()


// EXPORTS //

module.exports = cp;
