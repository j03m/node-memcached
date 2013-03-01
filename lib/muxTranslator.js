var events = require('events');
var net = require('net');
var sys = require('sys');
var util   = require('util');


function MuxTrans(address, port){
    this.address = address;
    this.isReady = false;
    this.port = port;
    this.client = null;
    if(false === (this instanceof MuxTrans)) {
        return new MuxTrans();
    }

    events.EventEmitter.call(this);
}

sys.inherits(MuxTrans, events.EventEmitter);


MuxTrans.prototype.get= function get(ready){
    if (this.isReady){
        ready(null, this.client);
    }else{
        var self = this;
        this.client = net.connect({path: '/var/run/mcmux/mcmux.sock'}, function(err, res){
            console.log("MuxTrans err: " + err);
            console.log("MuxTrans res: " + res);
            this.client.on('data', function(data) {
                self.emit('data',data);
            });
            if (err){
                ready(err, null);
            }else{
                this.isReady = true;
                ready(null, this.client);
            }
        });
        this.client.oldWrite = this.client.write;
        this.client.write = write.bind(this.client);

    }
}

//write
function write(data){
    return this.owrite('A:'+address+":"+port+" "+data);
}

module.exports = MuxTrans;