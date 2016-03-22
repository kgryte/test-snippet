'use strict';

// MODULES //

var isObject = require( 'validate.io-object' );
var isString = require( 'validate.io-string-primitive' );
var contains = require( 'validate.io-contains' );
var templates = require( './templates.js' );


// VALIDATE //

/**
* FUNCTION: validate( opts, options )
*	Validates function options.
*
* @param {Object} opts - destination object
* @param {Object} options - function options
* @param {String} [options.template] - template name
* @param {String} [options.title] - title
* @param {String} [options.filename] - test file name
* @returns {Null|Error} null or an error
*/
function validate( opts, options ) {
	if ( !isObject( options ) ) {
		return new TypeError( 'invalid input argument. Options argument must be an object. Value: `' + options + '`.' );
	}
	if ( options.hasOwnProperty( 'template' ) ) {
		opts.template = options.template;
		if ( !isString( opts.template ) ) {
			return new TypeError( 'invalid option. Template option must be a string primitive. Option: `' + opts.template + '`.' );
		}
		if ( !contains( templates, opts.template ) ) {
			return new Error( 'invalid option. Unrecognized template name. Must be one of [' + templates.join( ',' ) + '] Option: `' + opts.template + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'title' ) ) {
		opts.title = options.title;
		if ( !isString( opts.title ) ) {
			return new TypeError( 'invalid option. Title option must be a string primitive. Option: `' + opts.title + '`.' );
		}
	}
	if ( options.hasOwnProperty( 'filename' ) ) {
		opts.filename = options.filename;
		if ( !isString( opts.filename ) ) {
			return new TypeError( 'invalid option. Filename option must be a string primitive. Option: `' + opts.filename + '`.' );
		}
	}
	return null;
} // end FUNCTION validate()


// EXPORTS //

module.exports = validate;
