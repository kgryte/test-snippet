'use strict';

// MODULES //

var tape = require( 'tape' );
var lib = require( './../lib' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( true, __filename );
	t.equal( typeof lib, 'function', 'main export is a function' );
	t.end();
});
