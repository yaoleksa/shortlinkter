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
                    let fresh;
                    pool.query('SELECT * FROM links;').then(response => {
                        response.rows.forEach(item => {
                            if(item.link === link) {
                                fresh = item.id;
                            }
                        });
                        if(!fresh) {
                            pool.query(`INSERT INTO links (id, link) VALUES ('${linkId}', '${link}');`).then(response => {
                                res.end(`LINK WAS SUCCESSFULY SHORTED AND SAVED WITH: http://${req.headers.host}/${linkId}`);
                            });
                        } else {
                            res.end(`LINK ALREADY EXISTS: http://${req.headers.host}/${fresh}`);
                        }
                    });
                }
            } catch(err) {
                res.end(err.message);
            }
        });
    } else if(req.method === 'GET' && req.url.toString().match(/\w+/)) {
        pool.query(`SELECT link FROM links WHERE id='${req.url.toString().match(/\w+/)[0]}'`).then(response => {
            res.writeHead(302, {
                'location': response.rows[0].link
            });
            res.end();
        }).catch(err => {
            res.end(err.message);
        });
    } else {
        res.writeHead(302, {
            'location': 'https://yaoleksa.github.io/shortlinkter/'
        });
        res.end();
    }
}).listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log(`http://${process.env.HOSTNAME}:${process.env.PORT}`);
});