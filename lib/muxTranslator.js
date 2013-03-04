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
        if (!this.client){
            this.client = net.connect({path: '/Users/jmordetsky/mcmux/mcmux.sock'}, function(err, res){
                console.log("MuxTrans err: " + JSON.stringify(err));
                console.log("MuxTrans res: " + JSON.stringify(res));
                self.client.on('data', function(data) {
                    console.log("MuxTrans data:" + JSON.stringify(data));
                    self.emit('data',data);
                });

                if (err){
                    ready(err, null);
                }else{
                    self.isReady = true;
                    ready(null, self.client);
                }
            });
            this.client.oldWrite = this.client.write;
            this.client.write = write.bind(this);
        }
    }
}

//write
function write(data){
    return this.client.oldWrite('A:'+this.address+":"+this.port+" "+data);
}

module.exports = MuxTrans;