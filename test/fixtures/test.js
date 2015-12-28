/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' );
var lib = require( './../lib' );


// VARIABLES //

var expect = chai.expect;
var assert = chai.assert;


// TESTS //

describe( 'beep-boop', function tests() {

	it( 'should export a function', function test() {
		expect( lib ).to.be.a( 'function' );
	});

});
