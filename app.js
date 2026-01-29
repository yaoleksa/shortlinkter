// Enable environment variables
require('dotenv').config();
const http = require('http');
const axios = require('axios');

// Define an id length
const idLength = 4;

// Create an id generator
const ShortUniqueId = require('short-unique-id');
const idGen = new ShortUniqueId({ length: idLength });

// Define host and port
const HOST = process.env.HOSTNAME | '127.0.0.1';
const PORT = process.env.PORT | 3000;

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if(req.method === 'POST') {
        const body = [];
        req.on('data', chunk => {
            body.push(chunk);
        }).on('end', () => {
            try {
                const link = JSON.parse(body.join("").replace(/\'/g, "''")).link;
                if(!link.match(/http[s]{0,1}:\/\/\w+/)) {
                    res.end("ERROR: INVALID URL FORMAT");
                } else {
                    let linkId = idGen.rnd();
                    axios.post(`https://script.google.com/macros/s/${process.env.ACTIVATION_ID}/exec`, {
                        id: linkId,
                        link: link
                    }).then(response => {
                        res.end(`https://${req.headers.host}/${response.data}`);
                    }).catch(err => {
                        res.end(`POST.axios.HandledError: ${err.message}`);
                    })
                }
            } catch(err) {
                res.end(`POST.HandledError: ${err.message}`);
            }
        });
    } else if(req.method === 'GET' && req.url.toString().match(/\w+/)) {
        axios.get(`https://script.google.com/macros/s/${process.env.ACTIVATION_ID}/exec`, {
            params: {
                id: req.url.toString().match(/\w+/)[0]
            }
        }).then(response => {
            res.writeHead(302, {
                location: response.data
            });
            res.end();
        }).catch(err => {
            console.error(err.message);
        });
    } else {
        res.writeHead(302, {
            'location': 'https://yaoleksa.github.io/shortlinkter/'
        });
        res.end();
    }
}).listen(PORT, HOST, () => {
    console.log(`http://${HOST}:${PORT}`);
});