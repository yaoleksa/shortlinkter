const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

http.createServer((req, res) => {
    if(req.method === 'POST') {
        res.write('SOME STRANGE LOGIC');
    } else {
        if(req.url.toString().length > 1) {
            res.write('Do something absolutely different');
        } else {
            res.write('Use standart path');
        }
    }
    res.end();
}).listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});