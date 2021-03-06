/* global require, describe, it */
'use strict';

var mpath = './../lib/async.js';


// MODULES //

var chai = require( 'chai' );
var mkdirp = require( 'mkdirp' );
var path = require( 'path' );
var fs = require( 'fs' );
var proxyquire = require( 'proxyquire' );
var cp = require( mpath );


// VARIABLES //

var expect = chai.expect;
var assert = chai.assert;


// TESTS //

describe( 'async', function tests() {

	it( 'should export a function', function test() {
		expect( cp ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided a destination', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			cp();
		}
	});

	it( 'should throw an error if not provided a valid destination directory', function test() {
		var values = [
			5,
			null,
			true,
			undefined,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				cp( value );
			};
		}
	});

	it( 'should throw an error if not provided a valid options argument', function test() {
		var values = [
			'beep',
			5,
			null,
			true,
			undefined,
			NaN,
			[],
			// function(){} // allowed as fcn is variadic
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( TypeError );
			expect( badValue2( values[i] ) ).to.throw( TypeError );
		}
		function badValue1( value ) {
			return function() {
				cp( './beep/boop', value );
			};
		}
		function badValue2( value ) {
			return function() {
				cp( './beep/boop', value, function(){} );
			};
		}
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			5,
			null,
			true,
			undefined,
			NaN,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				cp( './beep/boop', {
					'title': value
				});
			};
		}
	});

	it( 'should throw an error if provided a callback argument which is not a function', function test() {
		var values = [
			'beep',
			5,
			null,
			true,
			undefined,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				cp( './beep/boop', {}, value );
			};
		}
	});

	it( 'should create a file in a specified directory', function test( done ) {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath, onFinish );

		function onFinish( error ) {
			var bool;
			if ( error ) {
				assert.ok( false );
			} else {
				bool = fs.existsSync( path.join( dirpath, 'test.js' ) );

				assert.isTrue( bool );
			}
			done();
		}
	});

	it( 'should create a configured file in a specified directory', function test( done ) {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath, {
			'template': 'mocha',
			'title': 'beep-boop'
		}, onFinish );

		function onFinish( error ) {
			var fpath1;
			var fpath2;
			var f1;
			var f2;

			if ( error ) {
				assert.ok( false );
				done();
				return;
			}
			fpath1 = path.join( dirpath, 'test.js' );
			fpath2 = path.join( __dirname, 'fixtures', 'test.js' );

			f1 = fs.readFileSync( fpath1, {
				'encoding': 'utf8'
			});
			f2 = fs.readFileSync( fpath2, {
				'encoding': 'utf8'
			});

			assert.deepEqual( f1, f2 );
			done();
		}
	});

	it( 'should pass any read errors to a provided callback', function test( done ) {
		var dirpath;
		var cp;

		cp = proxyquire( mpath, {
			'fs': {
				'readFile': function read( path, opts, clbk ) {
					clbk( new Error() );
				}
			}
		});

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		cp( dirpath, onFinish );

		function onFinish( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should pass any write errors to a provided callback', function test( done ) {
		var dirpath;

		// Non-existent directory path:
		dirpath = path.resolve( __dirname, '../build/akjfdlafjd/dafkdajflsd/' + new Date().getTime() );

		cp( dirpath, onFinish );

		function onFinish( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should pass any errors encountered while resolving a destination path to a provided callback', function test( done ) {
		var dirpath;
		var cp;

		cp = proxyquire( mpath, {
			'fs': {
				'stat': function stat( path, clbk ) {
					clbk( new Error() );
				}
			}
		});

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath, onFinish );

		function onFinish( error ) {
			if ( error ) {
				assert.ok( true );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should create a file in a specified directory without requiring a callback', function test( done ) {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath );

		setTimeout( onTimeout, 500 );

		function onTimeout() {
			var bool = fs.existsSync( path.join( dirpath, 'test.js' ) );

			assert.isTrue( bool );
			done();
		}
	});

	it( 'should create a file using a specified template', function test( done ) {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath, {
			'template': 'mocha'
		}, onFinish );

		function onFinish( error ) {
			var bool;
			if ( error ) {
				assert.ok( false );
			} else {
				bool = fs.existsSync( path.join( dirpath, 'test.js' ) );

				assert.isTrue( bool );
			}
			done();
		}
	});

	it( 'should support custom filenames', function test( done ) {
		var filepath;
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );

		filepath = path.join( dirpath, 'test.custom.js' );
		cp( filepath, onFinish );

		function onFinish( error ) {
			var bool;
			if ( error ) {
				assert.ok( false );
			} else {
				bool = fs.existsSync( filepath );

				assert.isTrue( bool );
			}
			done();
		}
	});

	it( 'should support custom filenames (existing filepath)', function test( done ) {
		var filepath;
		var dirpath;
		var cnt;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		filepath = path.join( dirpath, 'test.custom.js' );

		cnt = 0;
		cp( filepath, onFinish );

		function onFinish( error ) {
			var bool;
			if ( error ) {
				assert.ok( false );
			} else {
				bool = fs.existsSync( filepath );

				assert.isTrue( bool );
			}
			if ( ++cnt < 2 ) {
				return cp( filepath, onFinish );
			}
			done();
		}
	});

	it( 'should ignore any unrecognized options', function test( done ) {
		var dirpath;

		dirpath = path.resolve( __dirname, '../build/' + new Date().getTime() );

		mkdirp.sync( dirpath );
		cp( dirpath, {
			'beep': 'boop'
		}, onFinish );

		function onFinish( error ) {
			var bool;
			if ( error ) {
				assert.ok( false );
			} else {
				bool = fs.existsSync( path.join( dirpath, 'test.js' ) );

				assert.isTrue( bool );
			}
			done();
		}
	});

});
