var	nMemcached = require( '../' ),
	fs = require('fs'),
	memcached;

// connect to our memcached server on host 127.0.0.1, port 11211
memcached = new nMemcached( "127.0.0.1:11211" );

fs.readFile( __dirname + '/binary/hotchicks.jpg', function( err, data ){
	if( err ) console.error( err );
	
	memcached.get( "hello_binary", function( err, result ){
		if( err ) console.error( err );
		
		console.log( result.toString() == data.toString() );
		memcached.end(); // as we are 100% certain we are not going to use the connection again, we are going to end it
	});	
});