/**
 * Created with IntelliJ IDEA.
 * User: jmordetsky
 * Date: 1/24/13
 * Time: 6:33 PM
 * To change this template use File | Settings | File Templates.
 */

var crc32 = require('crc32');
var Membase = require('../');
var m1 = new Membase("127.0.0.1:11211", {poolSize:50});
var m2 = new Membase("127.0.0.1:11212", {poolSize:50});
var m3 = new Membase("127.0.0.1:11213", {poolSize:50});
var m4 = new Membase("127.0.0.1:11214", {poolSize:50});
var m5 = new Membase("127.0.0.1:11215", {poolSize:50});
var m6 = new Membase("127.0.0.1:11216", {poolSize:50});
var m7 = new Membase("127.0.0.1:11217", {poolSize:50});
var m8 = new Membase("127.0.0.1:11218", {poolSize:50});
var m9 = new Membase("127.0.0.1:11219", {poolSize:50});


var membases = [m1,m2,m3,m4,m5];

for (var i =0;i<25;i++){
    setInterval(function(){
        go();
    },0);
}

//go();

//    setInterval(function(){
//        go();
//    },0);



function go(){
    //random key
    var key = GUID();
    var value = key;
    //set
    membases[defaultShard(key)].set(key, value, 60, function(err, result){
        if (err){
            throw new Error(err);
        }
        console.log("SET: " + result);
        membases[defaultShard(key)].get(key, function(err, result){
            if (err){
                throw new Error(err);
            }
            if (key!=result) {
                throw new Error("ru oh");
            }
            console.log("GET: " + key + " " + result);
        });
    } );
}

function defaultShard(key){
    return (((crc32(key) >>> 16) & 0x7fff) % membases.length) || 0;
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