let path = require('path');
let express = require('express');
let ForecastIo = require('forecastio');
let fs = require('fs');

let app = express();
let weather = new ForecastIo('API KEY');

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
			summary: data.currently.drizzle,
			temperature: data.currently.temperature
		});
	});
});

app.use(function(req, res) {
	res.status(404).render('404');
});

app.listen(3000, function() {
	console.log('The weather forecast app started on port 3000.');
});
