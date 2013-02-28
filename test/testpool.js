var assert = require('assert');

//init
var Daddypool = require('../lib/daddypool.js');
var address = '127.0.0.1';
var port = 11211;
var poolSize =10;
var daddyPool = new Daddypool(address, port, poolSize);
var RESPONSE = "ERROR\r\n";
var COMMAND = "blablabladearmembasekellyclarksonblablablabla\n";
describe("test the connection pool", function() {
    /**
     * Make sure that adding a key which already exists returns an error.
     */
    it("lets you get a connection", function(done) {
        daddyPool.get(function(err, socket){
            assert.equal(daddyPool.getAvailableCount(),9);
            //verify the socket it open
            assert.equal(socket.readyState, 'open');
            socket.release();
            assert.equal(daddyPool.getAvailableCount(),10);
            //verify the socket it open - release does not close
            assert.equal(socket.readyState, 'open');
            socket = null;
            done();
        });
    });

    it("lets you get two connections", function(done) {
        daddyPool.get(function(err, socket){
            assert.equal(daddyPool.getAvailableCount(),9);
            daddyPool.get(function(err, socket2){
                assert.equal(daddyPool.getAvailableCount(),8);
                socket.release();
                assert.equal(daddyPool.getAvailableCount(),9);
                socket2.release();
                assert.equal(daddyPool.getAvailableCount(),10);
                //calling release a second time has no effect
                socket.release();
                assert.equal(daddyPool.getAvailableCount(),10);
                socket = null;
                done();
            });
        });
    });


    it("lets you get a connection you can talk to", function(done) {
        daddyPool.get(function(err, socket){
            socket.on('data', function(data){
                assert.equal(data.toString(), RESPONSE); //assuming membase is listening, change accordingly
                socket.release();
                socket = null;
                done();
            });
            socket.write(COMMAND);
        });
    });

    it("lets you get a multiple connections you can talk to", function(done) {
        var save = [];
        var ids = {};
        var count = 0;
        daddyPool.get(function(err, socket, id){
            save.push(socket);
            assert.equal(ids[id],undefined);
            ids[id]=id;
            socket.on('data', function(data){
                assert.equal(data.toString(), RESPONSE); //assuming membase is listening, change accordingly
                pulse();
            });
            socket.write(COMMAND);

        });

        daddyPool.get(function(err, socket2, id2){
            save.push(socket2);
            assert.equal(ids[id2],undefined);
            ids[id2]=id2;
            socket2.on('data', function(data){
                assert.equal(data.toString(), RESPONSE); //assuming membase is listening, change accordingly
                pulse();
            });
            socket2.write(COMMAND);
        });

        daddyPool.get(function(err, socket3,id3){
            save.push(socket3);
            assert.equal(ids[id3],undefined);
            ids[id3]=id3;
            socket3.on('data', function(data){
                assert.equal(data.toString(), RESPONSE); //assuming membase is listening, change accordingly
                assert.equal(daddyPool.getAvailableCount(),7);
                pulse();

            });
            socket3.write(COMMAND);
        });

        function pulse(){
            if (!count){
                count = 1;
            }
            else{
                count++;
            }
            if(count == 3){
                assert.equal(daddyPool.getAvailableCount(),7);
                save[0].release();
                save[1].release();
                save[2].release();
                save = null;
                done();
            }
        }
    });

    it("it queues up request once satured and gets to them all eventually using process.nexttick", function(done) {
        var count = 0;
        var once = 0;
        for(var i =0; i< poolSize*10; i++){
            daddyPool.get(function(err, socket3){
                socket3.on('data', function(data){
                    console.log('saturations testing....request:' + count + " conns:" +daddyPool.getAvailableCount());
                    assert.equal(data.toString(), RESPONSE); //assuming membase is listening, change accordingly
                    if (count == (poolSize*10)){
                        if (once==0){
                            once++;
                            done();
                        }

                    }
                    socket3.release();
                });
                socket3.write(COMMAND);
                count++;
            });
        }
    });

    it("it performs under duress", function(done) {
        var count = 0;

        this.timeout(1200000);
        var id = setInterval(function(){
            //get a socket ever 0 interval until we've pulled or queued 10 million sockets
            daddyPool.get(function(err, socket3){
                socket3.on('data', function(data){
                    console.log('duress testing....Available connections: '+daddyPool.getAvailableCount() + " - total requests complete:" + count);
                    assert.equal(data.toString(), RESPONSE); //assuming membase is listening, change accordingly
                    setTimeout(function(aSocket){
                        return function(){
                            aSocket.release();
                        }
                    }(socket3),Math.floor(Math.random()*100) );
                    count++;
                    if (count == 50000){
                        clearInterval(id)
                        done();
                    }
                });
                socket3.write(COMMAND);
            });
        }, 0);
    });

});
