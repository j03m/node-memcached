var	nMemcached = require( '../' ),
	memcached;

// connect to our memcached server on host 127.0.0.1, port 11211
memcached = new nMemcached( [ "127.0.0.1:11211", "127.0.0.1:11212", "127.0.0.1:11213" ], { redundancy: 2 });

memcached.set( "hello_redundancy", "pew pew", 10000, function( err, result ){
	if( err ) console.error( err );
	
	// I just happen to know that the key "hello_redundancy" was assigned to server 127.0.0.1:11211. So now we can
	// just check the other servers for results. 
	memcached.command(function(){ return {
		callback: function( err, res ){ 
			if( res ) console.log( "I have a propper result: %s. From server %s.", res, '127.0.0.1:11212' )
		},
		
		command: 'get hello_redundancy'
	}}, '127.0.0.1:11212' );
	
	memcached.command(function(){ return {
		callback: function( err, res ){ 
			if( res ) console.log( "I have a propper result: %s. From server %s.", res, '127.0.0.1:11213' )
		},
		
		command: 'get hello_redundancy'
	}}, '127.0.0.1:11213' );
	
	memcached.end(); // as we are 100% certain we are not going to use the connection again, we are going to end it
});