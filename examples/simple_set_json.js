var	nMemcached = require( '../' ),
	memcached;

// connect to our memcached server on host 127.0.0.1, port 11211
memcached = new nMemcached( "127.0.0.1:11211" );

memcached.set( "hello_json", {javascript:'objects',are:['no','problem', 4], nMemcached:true }, 10000, function( err, result ){
	if( err ) console.error( err );
	
	console.dir( result );
	memcached.end(); // as we are 100% certain we are not going to use the connection again, we are going to end it
});