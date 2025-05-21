const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

http.createServer((req, res) => {
    if(req.method === 'POST') {
        res.write('SOME STRANGE LOGIC');
    } else if(req.method === 'GET' && req.url.toString().match(/\w+/)) {
        res.writeHead(302, {
            'location': 'https://yaoleksa.github.io/tutorial/3.html#chapter6'
        });
    }
    res.end();
}).listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});