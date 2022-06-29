port = 3003

// require libraries
const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const compression = require('compression')

// setup clients
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression())

settings = JSON.parse(fs.readFileSync("Settings.json", 'utf8'))

const pool = mysql.createPool({
    host: settings.DB.host,
    password: settings.DB.password,
    user: settings.DB.username,
    database: 'badminton',
    port: settings.DB.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");

    if (settings.debug) {
        console.log(new Date().toString()+" "+req.originalUrl)
        if (Object.keys(req.body).length > 0) {
            console.log("req.body: " + JSON.stringify(req.body))
        }
        if (Object.keys(req.query).length > 0) {
            console.log("req.query: " + JSON.stringify(req.query))
        }
    }{}
    next();
});

app.use(express.static('static'))

app.get('/getHistory', async (req, res) => {
    let [games, metadata] = await pool.query('SELECT * FROM `games`')
    res.send(JSON.stringify(games))
});

app.post('/reportGame', async (req, res) => {
    await pool.query('INSERT INTO games (team1Name, team2Name, team1Score, team2Score, winner) VALUES (?,?,?,?,?)', [req.body.team1Name, req.body.team2Name, req.body.team1Score, req.body.team2Score, req.body.winner])
    let [games, metadata] = await pool.query('SELECT * FROM `games`')
    res.send(JSON.stringify(games))
});

app.listen(settings.port, () => {
    console.log('server started at localhost:' + settings.port);
})