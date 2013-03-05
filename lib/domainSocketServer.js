var net = require('net');
var server = net.createServer(function(c) { //'connection' listener
    console.log('client connected');
    c.on('end', function() {
        console.log('server disconnected');
    });

    c.on('data', function (data) {
        console.log("data:"+data);
        c.write('END\r\n')

    });

});
server.listen('/Users/jmordetsky/mcmux/mcmux.sock', function() { //'listening' listener
    console.log('server bound');
});