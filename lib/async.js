'use strict';

// MODULES //

var isObject = require( 'validate.io-object' );
var isString = require( 'validate.io-string-primitive' );
var isFunction = require( 'validate.io-function' );
var fs = require( 'fs' );
var path = require( 'path' );
var exists = require( 'utils-fs-exists' );
var mustache = require( 'mustache' );
var merge = require( 'utils-merge2' );
var noop = require( '@kgryte/noop' );
var validate = require( './validate.js' );
var defaults = require( './defaults.js' );


// VARIABLES //

var TMPL = 'tape';


// COPY //

/**
* FUNCTION: cp( dest[, opts ][, clbk ] )
*	Asynchronously creates a file.
*
* @param {String} dest - file destination directory
* @param {Object} [opts] - function options
* @param {String} [opts.template="tape"] - snippet template to use
* @param {String} [opts.title=""] - title
* @param {Function} [clbk] - callback to invoke upon attempting to create a file
* @returns {Void}
*/
function cp() {
	var options;
	var nargs;
	var fpath;
	var dpath;
	var tmpl;
	var opts;
	var dest;
	var clbk;
	var args;
	var err;
	var flg;

	args = arguments;
	nargs = args.length;
	if ( !nargs ) {
		throw new Error( 'insufficient input arguments. Must provide a file destination.' );
	}
	dest = args[ 0 ];
	if ( !isString( dest ) ) {
		throw new TypeError( 'invalid input argument. First argument must be a string primitive. Value: `' + dest + '`.' );
	}
	if ( nargs === 1 ) {
		clbk = noop;
	}
	else if ( nargs === 2 ) {
		if ( isObject( args[ 1 ] ) ) {
			options = args[ 1 ];
			clbk = noop;
			flg = true;
		}
		else if ( isFunction( args[ 1 ] ) ) {
			clbk = args[ 1 ];
		}
		else {
			throw new TypeError( 'invalid input argument. Second argument must either be an options object or a callback. Value: `' + args[ 1 ] + '`.' );
		}
	}
	else {
		options = args[ 1 ];
		clbk = args[ 2 ];
		flg = true;
		if ( !isFunction( clbk ) ) {
			throw new TypeError( 'invalid input argument. Callback argument must be a function. Value: `' + clbk + '`.' );
		}
	}
	opts = {};
	if ( flg ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	tmpl = opts.template || TMPL;
	opts = merge( {}, defaults[ tmpl ], opts );

	fpath = path.join( __dirname, '..', 'templates', tmpl, opts._filename );

	exists( dest, onExists );

	/**
	* FUNCTION: onExists( bool )
	*	Callback invoked upon checking a path's existence.
	*
	* @private
	* @param {Boolean} bool - boolean indicating whether a path exists
	* @returns {Void}
	*/
	function onExists( bool ) {
		if ( bool ) {
			return fs.stat( dest, onStat );
		}
		readFile();
	}

	/**
	* FUNCTION: onStat( error, stats )
	*	Callback invoked upon getting a path's stats.
	*
	* @private
	* @param {Error|Null} error - error object
	* @param {Object} stats - path stats
	* @returns {Void}
	*/
	function onStat( error, stats ) {
		if ( error ) {
			return clbk( error );
		}
		if ( stats.isDirectory() ) {
			dpath = path.join( dest, opts._filename );
		}
		readFile();
	}

	/**
	* FUNCTION: readFile()
	*	Reads a template file.
	*
	* @private
	* @returns {Void}
	*/
	function readFile() {
		fs.readFile( fpath, {'encoding':'utf8'}, onRead );
	}

	/**
	* FUNCTION: onRead( error, file )
	*	Callback invoked upon reading a file.
	*
	* @private
	* @param {Error} error - error object
	* @param {String} file - file contents
	* @returns {Void}
	*/
	function onRead( error, file ) {
		var out;
		if ( error ) {
			return clbk( error );
		}
		if ( dpath === void 0 ) {
			// Assume originally provided an absolute filepath:
			dpath = dest;
		}
		out = mustache.render( file, opts );
		fs.writeFile( dpath, out, onWrite );
	}

	/**
	* FUNCTION: onWrite( error )
	*	Callback invoked upon writing a file.
	*
	* @private
	* @param {Error} error - error object
	* @returns {Void}
	*/
	function onWrite( error ) {
		if ( error ) {
			return clbk( error );
		}
		clbk();
	}
} // end FUNCTION cp()


// EXPORTS //

module.exports = cp;
