/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	lib = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( '{{{title}}}', function tests() {

	it( 'should export a function', function test() {
		expect( lib ).to.be.a( 'function' );
	});

});
