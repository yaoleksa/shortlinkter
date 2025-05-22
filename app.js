// Enable environment variables
require('dotenv').config();
const http = require('http');
const { Pool } = require('pg');

// Create an pool to interact with database
const pool = new Pool({
    connectionString: `postgresql://${process.env.DBuser}:${process.env.DBpassword}@${process.env.DBhost}.${process.env.DBregion}.render.com/${process.env.DBname}`,
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
pool.query('CREATE TABLE IF NOT EXISTS links (id character(5) PRIMARY KEY, link TEXT)').then(() => {
    console.log('table has been created');
}).catch(err => {
    console.error(err.message);
})

const hostname = '127.0.0.1';
const port = process.env.DBport;

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