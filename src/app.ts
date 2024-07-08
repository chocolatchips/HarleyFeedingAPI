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
        'IsFed':harleyMorning,
        'type':req.method,
    });
})
.post('/api/harley/evening', (req: Request, res: any) => {
    harleyEvening = true;
    res.json({
        'IsFed':harleyEvening,
        'type':req.method
    });
});

app
.get('/api/harley/evening', (req: Request, res: any) => {
    res.json({
        'evening':harleyEvening,
        'type':req.method
    });
})
.post('/api/harley/morning', (req: Request, res: any) => {
    harleyMorning = true;
    res.json({
        'morning':harleyMorning,
        'type':req.method
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
