

//init
var assert = require('assert');
var Daddypool = require('../lib/daddypool.js');
var address = '127.0.0.1';
var port = 11211;
var daddyPool = new Daddypool(address, port, 10);
var RESPONSE = "ERROR\r\n";
var COMMAND = "blablabladearmembasekellyclarksonblablablabla\n";


daddyPool.get(function(err, socket){
    console.log(daddyPool.getAvailableCount());
    socket.release();
    console.log(daddyPool.getAvailableCount());
});


daddyPool.get(function(err, socket){
    socket.on('data', function(data){
        assert.equal(data.toString(), RESPONSE); //assuming membase is listening, change accordingly
        assert.equal(daddyPool.getAvailableCount(),7);
        socket = null; //hmm.

    });
    socket.write(COMMAND);
});

daddyPool.get(function(err, socket2){
    socket2.on('data', function(data){
        assert.equal(data.toString(), RESPONSE); //assuming membase is listening, change accordingly
        assert.equal(daddyPool.getAvailableCount(),7);
        socket2 = null; //hmm.

    });
    socket2.write(COMMAND);
});

daddyPool.get(function(err, socket3){
    socket3.on('data', function(data){
        assert.equal(data.toString(), RESPONSE); //assuming membase is listening, change accordingly
        assert.equal(daddyPool.getAvailableCount(),7);
        socket3 = null; //hmm.

    });
    socket3.write(COMMAND);
});

         console.log("");