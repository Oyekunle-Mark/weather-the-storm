let path = require('path');
let express = require('express');
let ForecastIo = require('forecastio');
let fs = require('fs');
let https = require('https');

let app = express();
let weather = new ForecastIo('5329fab057cc706148aa92312cf174d3');

const options = {
	key: fs.readFileSync('certs/client-key.pem'),
	cert: fs.readFileSync('certs/client-cert.pem')
};

app.use(express.static(path.resolve(__dirname, 'public')));

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
	res.render('index');
});

app.get(/^\/([-\d.]+)\/([-\d.]+)$/, function(req, res, next) {
	const latitude = req.params[0];
	const longitude = req.params[1];

	if (!latitude || !longitude) {
		next();
		return;
	}

	weather.forecast(latitude, longitude, function(err, data) {
		if (err) {
			next();
			return;
		}

		res.json({
			summary: data.currently.summary,
			temperature: data.currently.temperature
		});
	});
});

app.use(function(req, res) {
	res.status(404).render('404');
});

https.createServer(options, app).listen(3000, function() {
	console.log('The weather forecast app started on port 3000.');
});
