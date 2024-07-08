var express = require('express');
var schedule = require('node-schedule');

const app = express();

let harleyMorning: boolean = false;
let harleyEvening: boolean = false;

let port: number = 3000;


app.use(express.json());

app
.get('/api/harley/morning', (req: Request, res: any) => {
    console.log('morning GET');
    res.json({
        'morning':harleyMorning,
        'type':req.method,
    });
})
.post('/api/harley/evening', (req: Request, res: any) => {
    harleyEvening = true;
    res.json({
        'evening':harleyEvening,
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


const server = app.listen(port, () =>{
    console.log(`Running on port ${port}`);
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