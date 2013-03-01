/**
 * Created with IntelliJ IDEA.
 * User: jmordetsky
 * Date: 1/24/13
 * Time: 6:33 PM
 * To change this template use File | Settings | File Templates.
 */

var Membase = require('../');
var m1 = new Membase("10.80.81.242:11211", {poolSize:10});



var membases = [m1];
var start = new Date().getTime();
for (var i =0;i<50;i++){
    setInterval(function(){
        go();
    },0);
}

var count = 0;
setInterval(function(){
    var end = new Date().getTime();
    var diff = (end-start)/1000;
    var rps = count/diff;
    console.log(rps + "rps");
    count = 0;
    start = new Date().getTime();
},1000);


function go(){
    //random key
    var key = GUID();
    var value = key;
    //set
    m1.set(key, value, 60, function(err, result){
        count++;
        if (err){
            throw new Error(err);
        }

        m1.get(key, function(err, result){
            count++;
            if (err){
                throw new Error(err);
            }
            if (key!=result) {
                throw new Error("ru oh");
            }
        });
    } );

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
