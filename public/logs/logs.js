// Making a map and tiles
const mymap = L.map('weatherMap').setView([0, 0], 1);
const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl,{ attribution });
tiles.addTo(mymap);

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data);

    for (item of data) {

        const marker = L.marker([item.lat, item.lon]).addTo(mymap);

        let txt = `<p class="message">
            <b>My current location is:<br>
            latitude: ${item.lat}&deg;<br>
            longitude: ${item.lon}&deg;
        </p>

        <p class="message">
            <b>The weather here is: </b><br>
            ${item.weather.temp.value}&deg;C and ${item.weather.weather_code.value}.
        </p>`;

        if (item.air.value < 0) {
            txt += 'No air quality reading.';
        } else {
            txt += `<p class="message">
                <b>Concetration of particulate matter: </b><br>
                ${item.air.value} <span id="pm25_unit">µg/m³</span>
            </p>`;
        }

        marker.bindPopup(txt);

    //     const root = document.createElement('div');
    //     const username = document.createElement('div');
    //     const geo = document.createElement('div');
    //     const date = document.createElement('div');
    //     const image = document.createElement('img');
    //
    //     username.textContent = `Username: ${item.username}`;
    //     geo.textContent = `${item.lat}°, ${item.lon}°`;
    //     const dateString = new Date(item.timestamp).toLocaleString();
    //     date.textContent = dateString;
    //     image.src = item.image64;
    //     image.alt = item.username;
    //
    //     root.append(username, geo, date, image);
    //     document.body.append(root);
    }
}
getData();
