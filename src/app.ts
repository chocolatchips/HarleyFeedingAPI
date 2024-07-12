var http = require('http');
var express = require('express');
var schedule = require('node-schedule');

const app = express();

var harleyMorning: boolean = false;
var harleyEvening: boolean = false;

var port: number = 3000;

app.use(express.json());

app
.get('/api/harley/morning', (req: Request, res: any) => {
    console.log('morning GET');
    res.json({
        'IsFed':harleyMorning
    });
})
.post(
    '/api/harley/morning', (req: Request, res: any) => {
    harleyMorning = true;
    console.log("morning POST")
    res.json({
        'IsFed':harleyMorning
    });
});

app
.get('/api/harley/evening', (req: Request, res: any) => {
    console.log("evening GET");
    res.json({
        'IsFed':harleyEvening
    });
})
.post('/api/harley/evening', (req: Request, res: any) => {
    harleyEvening = true;
    console.log("evening POST");
    res.json({
        'IsFed':harleyEvening
    });
});

app.post('/api/harley/reset', (req: Request, res: any) =>{
    harleyMorning = false;
    harleyEvening = false;
    res.json({
        'reset':true,
        'morning':harleyMorning,
        'evening':harleyEvening
    });
});

schedule.scheduleJob('59 59 23 * * *', function(){
    harleyMorning = false;
    harleyEvening = false;
});

const server = http.createServer(function(req:Request, res:any) {
    app(req, res);
});

server.listen(port, () => {
    console.log(`Running on http on port: ${port}`);
});


server.on('error', (error: { code: string; }) => {
    if (error.code === 'EADDRINUSE'){
        console.error(`Port ${port} is already in use`);
    }
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server gracefully closed');
        process.exit(0);
    });
});
