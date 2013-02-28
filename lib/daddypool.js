//sometimes you have to wear your daddy pants. err, I mean daddy pool

var net = require('net');
var Socket = net.Socket;

function Daddypool(address, port, size){
//init the daddy pool, make N sockets
    this.availablePool = [];
    this.address = address;
    this.port = port;
    this.pendingRequests = [];
    this.stop = false;
    if (!size || size <= 0){
        throw new Error("DaddyPool: Howdy - initializing a pool with a size of less then or = to 0 is not so good. Stopping.");
    }

    for (var i=0; i<size; i++){
        this.availablePool.push({'status':1, 'socket':new Socket(), 'id':i, 'pool':this});
        var entry = this.availablePool[this.availablePool.length-1];
        var socket = entry.socket;
        socket.release = release.bind(entry);
    }
    //process.nextTick(this.checkPending.bind(this));
}


function release(){
    this.socket.removeAllListeners();
    //this.pool.checkPending();
    
    // if pending give it "this"
    var request = this.pool.pendingRequests.shift()
    if(request) {
       this.pool.doConnectAndCallback(this, request);
    } else {
      this.status = 1;
    }; //get next person in line

}

//get
Daddypool.prototype.get = function get(callback){
    if (this.availablePool.length <=0){
        throw new Error("DaddyPool: Hi - connection cool length is 0. Something is wrong, did you call init?");
    }
    if (typeof callback === 'function'){
        var connection = this.nextAvailableConnection();
        if (connection){
            connection.status = 0; //not available;
            this.doConnectAndCallback(connection, {'callback':callback});
        } else{
          this.pendingRequests.push({'callback':callback});
        }
    }else{
        throw new Error("DaddyPool: What you've passed into get is not a function. It must be a function. ")
    }

}

Daddypool.prototype.bye = function bye(){
    for (var i=0; i<this.availablePool.length; i++){
        this.availablePool[i].status = 0
        this.availablePool[i].socket.end();
    }
    this.stop = true;
}

Daddypool.prototype.getAvailableCount = function getAvailableCount(){
    var count = 0;
    for (var i=0; i<this.availablePool.length; i++){
        if (this.availablePool[i].status == 1){
            count++;
        }
    }
    return count;
}

Daddypool.prototype.nextAvailableConnection= function(){
    for (var i=0; i<this.availablePool.length; i++){
        if (this.availablePool[i].status == 1){
            return this.availablePool[i];
        }
    }
    //we ain't found shit
    return null;
}

//Daddypool.prototype.checkPending = function(){
//    //get the next pending request for a socket
//    var connection = this.nextAvailableConnection();
//    if (connection){
//        connection.status = 0; //not available;
//        var request = this.pendingRequests.shift(); //get next person in line
//        if (!request){//if not one is on line, then well clean up.
//            connection.status = 1;
//            return; //no pending requests
//        }else{
//            //life is good, do your thing, make some connections
//            //check if the connection has already been establisted
//            this.doConnectAndCallback(connection, request);
//        }
//    }
//}

Daddypool.prototype.doConnectAndCallback = function doConnAndCall(connection, request){
    if (this.isConnected(connection.socket)){
        request.callback(null, connection.socket, connection.id);
    }else{
        connection.socket.connect(this.port,this.address);
        connection.socket.on('connect', function(inRequest, inConnection){
                return function(){
                    //console.log('DaddyPool:  connect');
                    inRequest.callback(null, inConnection.socket, inConnection.id);
                }
            }(request, connection)).on('close',function(){
                //console.log('DaddyPool:  close');
            }).on('data', function(data) {
                //console.log('DaddyPool:  data: ' + data);
            }).on('end', function() {
                //console.log('DaddyPool: end' ); //todo: what should I do here?
            }).on('error', function(inRequest, inConnection){
                return function(err){
                    //console.log('DaddyPool:  connect');
                    inRequest.callback(err, null, null);
                }}(request,connection));
    }
}

Daddypool.prototype.isConnected = function(socket){
    if(socket.readyState == 'open'){
        return true;
    }else{
        return false;
    }
}

module.exports = Daddypool;