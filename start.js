const connect = require('connect');
const serveStatic = require('serve-static');
const open = require('open');

 connect()
 .use(serveStatic(__dirname))
 .listen(8080, () => {
    console.log('Example running on 8080...')
    open('http://localhost:8080/examples/layers');
 })