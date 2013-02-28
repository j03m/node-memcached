var assert = require('assert')
    , fs = require('fs')
    , Memcached = require('../');

var memcached = new Memcached('127.0.1:1234', { retries: 3 })
    , calls = 0;

memcached.get('idontcare', function (err) {
    calls++;

    // it should only be called once
    assert.equal(calls, 1);

    memcached.end();

});