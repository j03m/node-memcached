/**
 * Created with IntelliJ IDEA.
 * User: jmordetsky
 * Date: 1/24/13
 * Time: 6:33 PM
 * To change this template use File | Settings | File Templates.
 */

var Membase = require('../');
var membases = [];
var numClients = 1;
for(var i=0;i<numClients;i++){
    membases.push(new Membase("127.0.0.1:11211", {poolSize:10}));
	//membases.push(new Membase("10.80.81.242:11211", {poolSize:10}));
}

var start = new Date().getTime();
for (var i =0;i<500;i++){
    setInterval(function(){
        go();
    },0);
}

var count = 0;
function sum(){
    var end = new Date().getTime();
    var diff = (end-start)/1000;
    var rps = count/diff;
    console.log("*********************************"+rps + "rps");
    count = 0;
    start = new Date().getTime();
}

function go(){
    //random key
    var key = GUID();
    var value = key;
    for(var ii=0;ii<numClients;ii++){
        setGet(membases[ii]);
    }

    //set
    function setGet(m){
        m.set(key, value, 60, function(err, result){
            if (err){
                throw new Error(err);
            }

            m.get(key, function(err, result){
                count++;
                if (err){
                    throw new Error(err);
                }
                if (key!=result) {
		    console.log("*BAD: key:" + key + " result: " + result);
                    throw new Error("ru oh");
                }
                if (count>1000){
                    sum();
                }

            });
        } );
    }
}


function S4()
{
    return Math.floor(
        Math.random() * 0x10000 /* 65536 */
    ).toString(16);
}

function GUID ()
{
    return (
        S4() + S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + "-" +
            S4() + S4() + S4()
        );
};
