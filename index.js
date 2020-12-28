// Import 'Express' and save it to a variable
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

// Create an app to run my Express server
const app = express();

const Datastore = require('nedb');

// Tell my server to listen at port:3000
app.listen(3000, () => console.log('Listening at port:3000'));

// **** OBJECTIVE: Serve web page - index.html
// ***************************************************
// We don't need to specify 'index.html' because it is assumed in blank paths
app.use(express.static('public'));
app.use(express.json({limit: '1mb' }));

const database = new Datastore('database.db');
database.loadDatabase();


// **** OBJECTIVE: Setup a route (GET)
// ***************************************************
app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            reture;
        } else {
            response.json(data);
        }
    });
});


// **** OBJECTIVE: Setup a route (POST)
// ***************************************************
app.post('/api', (request, response) => {
    console.log('I got a request!');
    console.log(request.body);
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;

    database.insert(data);
    response.json(data);
});


// **** OBJECTIVE: GET weather and air quality
// ***************************************************
app.get('/weather/:latlon', async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(',');
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    const api_key = process.env.API_KEY;

    const weather_response = await fetch(`https://api.climacell.co/v3/weather/realtime?lat=${lat}&lon=${lon}&unit_system=si&fields=temp%2Cweather_code%2Cprecipitation&apikey=${api_key}`, {
        'method': 'GET',
        'headers': {}
    });
    const weather_data = await weather_response.json();

    const aq_url = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
    const aq_response =  await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = {
        weather: weather_data,
        air_quality: aq_data
    };

    console.log(data);

    response.json(data);
});


// **** OBJECTIVE: Save to database
// ***************************************************



// **** OBJECTIVE: Authentication
// ***************************************************
