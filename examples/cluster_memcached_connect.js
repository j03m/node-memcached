var nMemcached = require( '../' ),
	assert = require('assert'),
	memcached;

// connect to our memcached server on host 127.0.0.1, port 11211
memcached = new nMemcached( ["127.0.0.1:11211","127.0.0.1:11212","127.0.0.1:11213"] );
memcached.set( "hello_world", "greetings from planet node", 1000, function( err, success ){

	// check if the data was stored
	assert.equal( success, true, "Successfully stored data" )

	memcached.get( "hello_world", function( err, success ){
		assert.equal( success, "greetings from planet node", "Failed to fetched data" )
		process.stdout.write( success );
		memcached.end()
	});
});
