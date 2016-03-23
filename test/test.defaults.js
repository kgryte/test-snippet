/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' );
var defaults = require( './../lib/defaults.js' );


// VARIABLES //

var expect = chai.expect;
var assert = chai.assert;


// TESTS //

describe( 'snippet template defaults', function tests() {

	it( 'should export an object', function test() {
		expect( defaults ).to.be.an( 'object' );
		assert.ok( Object.keys( defaults ) );
		expect( defaults[ 'mocha' ] ).to.be.an( 'object' );
	});

});
