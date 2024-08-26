import express from 'express'
import cors from 'cors'
import mysql from 'mysql';
import { Receiver } from 'codesys-client';
import iec from 'iec-61131-3';
import { getStatus, getTempData, getHomeData } from './database.js';
import util from 'util';

let isServerRunning = true;
const PORT = 12020;
let NVL = {};
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "plc"
});

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173' // Allow requests from react server
}));

const status = [];
//Setting up new receiver
const receiver = new Receiver({
    //LocalAddress:'10.208.98.74',  //IP address of Laptop or system on which Program will run
    ListeningPort: PORT //UDP port defined in PLC (see above)
});

con.connect(function (err) {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');

    NVL = iec.STRUCT({
        ONPB: iec.BOOL,
        STOPPB: iec.BOOL,
        Light1: iec.BOOL,
        Light2: iec.BOOL,
        Light3: iec.BOOL,
        Light4: iec.BOOL,
        Light5: iec.BOOL,
        Medium1: iec.BOOL,
        Medium2: iec.BOOL,
        Medium3: iec.BOOL,
        Medium4: iec.BOOL,
        Medium5: iec.BOOL,
        Heavy1: iec.BOOL,
        Heavy2: iec.BOOL,
        Heavy3: iec.BOOL,
        Heavy4: iec.BOOL,
        Heavy5: iec.BOOL,
        temp: iec.INT,
        alarm: iec.BOOL,
        power: iec.BOOL,

    });

    //Adding data handler(s)
    receiver.addHandler(12, NVL, (data) => {
        console.log(new Date(), `Data Recieved`, util.inspect(data, false, 999));

        //data is now as object that matches ST_DataToSend
        //Using util.inspect to display the whole object for demo purposes

        // Prepare data for insertion
        var sql = "INSERT INTO scada (status) VALUES (?)";
        var values = [JSON.stringify(data)];
        con.query(sql, values, function (err, result) {
            if (err) {
                console.error('Error inserting data:', err);
                return;
            }
            console.log('Inserted rows:', result.affectedRows);
            status.length = 0;
            console.log('Status array cleared:', status);
        });
    });
});

//Starting to listen for incoming data
receiver.listen()
    .then(res => console.log(`Listening UDP now to:`, res))
    .catch(err => console.log(`Failed to start listening. Error:`, err));

// let status = {
//     light1: false,      //true: object detected
//     light2: false,      //false: no object detected
//     light3: true,
//     light4: false,
//     light5: false,
//     medium1: false,
//     medium2: false,
//     medium3: false,
//     medium4: false,
//     medium5: false,
//     heavy1: false,
//     heavy2: true,
//     heavy3: false,
//     heavy4: false,
//     heavy5: false,
//     temp: 30,
//     alarm: false,
//     power: false,
// }

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.get('/', async (req, res) => {
    console.log('Getting request /')
    try {
        console.log('Requesting Status Data')
        let status = await getHomeData();
        // console.log('Status Data successfully Retrieved')
        setTimeout(() => {
            res.send(status);
            // console.log(status);
        }, 1000);

    } catch (error) {
        res.status(500).send('Error retrieving status');
    }
});

app.get('/home', async (req, res) => {
    console.log('Getting request /home')
    try {
        let status = await getHomeData();
        // console.log(status)
        setTimeout(() => {
            res.send(status);
        }, 500);

    } catch (error) {
        res.status(500).send('Error retrieving status');
    }
});

app.get('/temperature', async (req, res) => {
    console.log('Getting request /temperature')
    // res.send(status);
    try {
        let tempd = await getTempData();
        tempd = tempd.reverse();
        const labels = tempd.map(item => item.date);
        const tempData = tempd.map(item => item.temp);
        const LineData = {
            labels: labels,
            datasets: [
                {
                    label: 'Temperature',
                    data: tempData,
                }
            ]
        }

        setTimeout(() => {
            res.send(LineData);
        }, 500);

    } catch (error) {
        res.status(500).send('Error retrieving status');
    }


});

app.get("/records", async (req, res) => {
    console.log('Getting request /records')
    try {
        let data = await getStatus();
        data = data.reverse();
        // Extract data for chart
        const labels = data.map(item => item.date);
        const lightData = data.map(item => item.light);
        const mediumData = data.map(item => item.medium);
        const heavyData = data.map(item => item.heavy);
        // Create chart configuration
        const barData = {
            labels: labels,
            datasets: [
                {
                    label: 'Lightweight',
                    data: lightData,
                    backgroundColor: 'rgba(255, 206, 86, 0.5)'
                },
                {
                    label: 'Medium-weight',
                    data: mediumData,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)'
                },
                {
                    label: 'Heavyweight',
                    data: heavyData,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                }
            ]
        }

        // Send HTML with embedded chart
        setTimeout(() => {
            res.send(barData);
        }, 500)

    } catch (error) {
        res.status(500).send('Error retrieving status');
    }
});


app.listen(8080, () => {
    console.log('Listening on port 8080')
})

// Turn off apache 2 server in terminal
// sudo systemctl stop apache2

// Turn on xampp in terminal
// sudo /opt/lampp/./manager-linux-x64.run

// Start the server
function startServer() {
    if (!isServerRunning) {
        receiver.addHandler(12, NVL, (data) => {
            console.log(new Date(), `Data Recieved`, util.inspect(data, false, 999));
    
            //data is now as object that matches ST_DataToSend
            //Using util.inspect to display the whole object for demo purposes
    
            // Prepare data for insertion
            var sql = "INSERT INTO scada (status) VALUES (?)";
            var values = [JSON.stringify(data)];
            con.query(sql, values, function (err, result) {
                if (err) {
                    console.error('Error inserting data:', err);
                    return;
                }
                console.log('Inserted rows:', result.affectedRows);
                status.length = 0;
                console.log('Status array cleared:', status);
            });
        });
        receiver.listen()
        .then(res => console.log('Server has started listening on port', PORT))
        .catch(err => console.log('Error while starting the server:', err));
        isServerRunning = true;
    };
}


// Stop the server
function stopServer() {
    if (isServerRunning) {
        receiver.close()
        .then(res => console.log('Server has stopped listening on port', res))
        .catch(err => console.log('Error while stopping the server:', err));
        isServerRunning = false;
    }
}

app.post('/home/start', (req, res) => {
    console.log('Getting request post /home/start')
    startServer();
    res.send('Server is starting...');
})

app.post('/home/stop', (req, res) => {
    console.log('Getting request post /home/stop')
    stopServer();
    res.send('Server is stopping...');
})
