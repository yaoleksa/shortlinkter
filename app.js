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
                const link = JSON.parse(body)["link"];
                if(!link.match(/http[s]{0,1}:\/\/\w+/)) {
                    res.end("ERROR: INVALID URL FORMAT");
                } else {
                    const linkId = idGen.rnd();
                    let fresh = true;
                    pool.query('SELECT * FROM links;').then(response => {
                        response.rows.forEach(item => {
                            if(item.link === link) {
                                console.log(`\nhttp://${req.headers.host}/${item.id}`);
                                fresh = false;
                            }
                        });
                        if(fresh) {
                            pool.query(`INSERT INTO links (id, link) VALUES ('${linkId}', '${link}');`).then(response => {
                                console.log(response);
                            });
                        }
                    });
                    res.end(`LINK HAS BEEN SUCCESFULLY STORED ${linkId}`);
                }
            } catch(err) {
                res.end(err.message);
            }
        });
    } else if(req.method === 'GET' && req.url.toString().match(/\w+/)) {
        pool.query(`SELECT link FROM links WHERE id='${req.url.toString().match(/\w+/)[0]}'`).then(response => {
            console.log(response.rows[0].link);
            res.writeHead(302, {
                'location': response.rows[0].link
            });
            res.end();
        }).catch(err => {
            console.log(err.message);
        });
    } else {
        res.end();
    }
}).listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log(`http://${process.env.HOSTNAME}:${process.env.PORT}`);
});