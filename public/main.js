$(document).ready(function() {
	let $h1 = $('h1');

	$('form').on('submit', function(event) {
		event.preventDefault();

		$h1.text('Loading...');

		function getLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			} else {
				$h1.text('Geolocation is not supported by this browser.');
			}
		}

		function showPosition(position) {
			const latitude = position.coords.latitude;
			const longitude = position.coords.longitude;

			let request = $.ajax({
				url: '/' + latitude + '/' + longitude,
				dataType: 'json'
			});

			request.done(function(data) {
				let temperature = data.temperature;
				let summary = data.summary;

				$h1.html('It is ' + temperature + '&#176;C at your location. ' + '<br />' + 'Summary: ' + summary);
			});

			request.fail(function() {
				$h1.text('Error!');
			});
		}
		
		getLocation();
	});
});
