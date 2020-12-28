let lat, lon;
if(!navigator.geolocation) {
    // Log an error to the console if geolocation is NOT supported
    console.log('Geolocation is not supported by your browser');
} else {
    // If geolocation is supported, run some stuff
    console.log('Geolocation is supported!');

    navigator.geolocation.getCurrentPosition(async position => {
        let lat, lon, weather, air;

        try {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            console.log(position);

            // Create a data object that can be sent to the server in a POST function
            const data = { lat, lon };

            // POST the request to our server and save the response
            const api_url = `/weather/${lat},${lon}`;
            const response = await fetch(api_url);
            const json = await response.json(); // Convert the response to JSON format
            weather = json.weather;
            air = json.air_quality.results[0].measurements[0];
            console.log(json); // Console log the formatted response

            document.getElementById('latitude').textContent = lat.toFixed(2);
            document.getElementById('longitude').textContent = lon.toFixed(2);
            document.getElementById('location').textContent = json.air_quality.results[0].location;
            document.getElementById('temp').textContent = json.weather.temp.value.toFixed(0);
            document.getElementById('context').textContent = json.weather.weather_code.value;
            document.getElementById('pm25_value').textContent = json.air_quality.results[0].measurements[0].value;

            document.getElementById('spinner').style['display'] = 'none';
        } catch (error) {
            console.log(error);
            air = { value: -1 };
            document.getElementById('pm25_value').textContext = 'NO READING';
        }

        const db_data = { lat, lon, weather, air };
        const db_options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(db_data)
        };
        const db_response = await fetch('/api', db_options);
        const db_json = await db_response.json();
        console.log(db_json);
    });
}
