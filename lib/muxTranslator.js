var events = require('events');
var net = require('net');
var sys = require('sys');
var util   = require('util');

function MuxTrans(address, port){
    this.address = address;
    this.port = port;
    this.client = null;
    if(false === (this instanceof MuxTrans)) {
        return new MuxTrans();
    }

    events.EventEmitter.call(this);
}

sys.inherits(MuxTrans, events.EventEmitter);

MuxTrans.prototype.get= function get(ready){
    if (this.client){
        ready(this);
    }else{
        var self = this;
        this.client = net.connect({path: '/var/run/mcmux/mcmux.sock'}, function(err, res){
            console.log("MuxTrans err: " + err);
            console.log("MuxTrans res: " + res);
            this.client.on('data', function(data) {
                self.emit('data',data);
            });
            ready(this);
        });
    }
}

//write
MuxTrans.prototype.write= function write(data){
    return this.client.write('A:'+address+":"+port+" "+data);
}

//end
MuxTrans.prototype.end= function end(){
    return this.client.end();
}

module.exports = MuxTrans;