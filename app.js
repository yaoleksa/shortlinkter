// Enable environment variables
require('dotenv').config();
const http = require('http');
const { Pool } = require('pg');

// Define an id length
const idLength = 4;

// Create an id generator
const ShortUniqueId = require('short-unique-id');
const idGen = new ShortUniqueId({ length: idLength });

// Create an pool to interact with database
const pool = new Pool({
    connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOSTNAME}.${process.env.DB_REGION}.render.com/${process.env.DB_NAME}`,
    ssl: {
        rejectUnauthorized: false
    }
});

// Connect with database
pool.connect().then(() => {
    console.log('connected');
}).catch(err => {
    console.error(err.message);
});

// Initial query to create a table
pool.query(`CREATE TABLE IF NOT EXISTS links (id character(${idLength}) PRIMARY KEY, link TEXT);`).then(() => {
    console.log('table has been created');
}).catch(err => {
    console.error(err.message);
});

http.createServer((req, res) => {
    if(req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        }).on('end', () => {
            try {
                if(!JSON.parse(body)["link"].match(/http[s]{0,1}:\/\/\w+/)) {
                    res.end("ERROR: INVALID URL FORMAT");
                } else {
                    res.end("LINK HAS BEEN SUCCESSFULY SHORTED AND STORED" + "  " + idGen.rnd());
                }
            } catch(err) {
                res.end(err.message);
            }
        });
    } else if(req.method === 'GET' && req.url.toString().match(/\w+/)) {
        res.writeHead(302, {
            'location': 'https://yaoleksa.github.io/tutorial/3.html#chapter6'
        });
    }
}).listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log(`http://${process.env.HOSTNAME}:${process.env.PORT}`);
});