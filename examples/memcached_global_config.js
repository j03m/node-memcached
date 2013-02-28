var nMemcached = require( '../' ),
	memcached1,
	memcached2;

// Set a global configuration
nMemcached.config.poolSize = 25;

memcached2 = new nMemcached( "127.0.0.1:11211" );
memcached1 = new nMemcached( "127.0.0.1:11212" );

process.stdout.write( memcached1.poolSize ); // 25
process.stdout.write( memcached2.poolSize == memcached1.poolSize ); // true
