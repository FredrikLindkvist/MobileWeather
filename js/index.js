$(document).ready(function(){

	var geo = {}; // for storing geo variables
	var key = ''; // API-Key to wunderground, insert your key here
	var favcity;
	var favCountry;
	
	if(window.localStorage) {
		// getting saved local variables if any
		favCity = JSON.parse(window.localStorage.getItem('favCity'));
		favCountry = JSON.parse(window.localStorage.getItem('favCountry'));
	}

	if(null !== favCity && null !== favCountry){
		// if there is something stored we call the function setFav
		setFav(favCity, favCountry);
	}

	if(navigator.geolocation) {
		// Getting current position
		navigator.geolocation.getCurrentPosition(posSuccess, posError);
	} else {
		alert('Geolocation not supported');
	}

	function posError() {
		alert('Could not find location');
	}

	function posSuccess(position){
		// saving longitude and latitude
		geo.lat = position.coords.latitude;
		geo.lng = position.coords.longitude;
		// constructing API url for weather data
		var weather = 'http://api.wunderground.com/api/' + key + '/geolookup/conditions/q/' + geo.lat + ',' + geo.lng + '.json';

		$.ajax({
			// ajax call to url for weather data
			url: weather,
			dataType: 'jsonp',
			type: 'GET',
			success: function(data) {

				// saving the data we want to display
				var location = data['location']['city'];
				var temp = data['current_observation']['temp_c'];
				var img = data['current_observation']['icon_url'];
				var desc = data['current_observation']['weather'];
				var windDir = data['current_observation']['wind_dir'];
				// wind speed not available in M/S, converting and saving
				var windSpd = (Number(data['current_observation']['wind_kph'])) * 0.27778;
				// limit decimals and constructing string for display
				var wind = windSpd.toFixed(2) + ' M/S from ' + windDir;
				// placing data in html
				$('#location').html(location);
				$('#temp').html(temp);
				$('#desc').html(desc);
				$('#wind').html(wind);
				$('#img').attr('src', img);
			}
		});
	}

	function setFav(city, country){
		// Removes the old fav forecast if there is one
		if($('.forecastFav').length){
			$('.forecastFav').remove();
		}
		// constructing API url for specific city instead of geolocation
		var weatherFav = 'http://api.wunderground.com/api/' + key + '/geolookup/conditions/q/' + country + '/' + city + '.json';

		$.ajax({
			// ajax call to url for weather data
			url: weatherFav,
			dataType: 'jsonp',
			type: 'GET',
			success: function(data) {

				// saving the data we want to display
				var location = data['location']['city'];
				var temp = data['current_observation']['temp_c'];
				var img = data['current_observation']['icon_url'];
				var desc = data['current_observation']['weather'];
				var windDir = data['current_observation']['wind_dir'];
				// wind speed not available in M/S, converting and saving
				var windSpd = (Number(data['current_observation']['wind_kph'])) * 0.27778;
				// limit decimals and constructing string for display
				var wind = windSpd.toFixed(2) + ' M/S from ' + windDir;

				// placing data in html
				$('#locationFav').html(location);
				$('#tempFav').html(temp);
				$('#descFav').html(desc);
				$('#windFav').html(wind);
				$('#imgFav').attr('src', img);

				if(window.localStorage) {
					// setting the stored variables to the most recent search
					window.localStorage.setItem('favCity', JSON.stringify(city));
					window.localStorage.setItem('favCountry', JSON.stringify(country));
				}
			}
		});
		
		// constructing new html for latest search result
		var newFav = '<div class="forecastFav"><h2><span id="locationFav"></span><span id="rightSide">Last search</span></h2><div id="imgdivFav"><img id="imgFav" src=""><span id="tempFav"></span>&deg;C and <span id="descFav"></span></div>Wind: <span id="windFav"></span></div>';

		// adding new html to container
		$('#container').append(newFav);

		// resetting search fields
		$('#searchCountry').val('');
		$('#searchCity').val('');
	}

	$('#search').on('click', function(){
		// getting values in searchfields
		var tempCity = $('#searchCity').val()
		var tempCountry = $('#searchCountry').val()

		if(tempCountry.length <= 0 || tempCity.length <= 0){
			alert('Please provide search variables');
		} else {
			// calling setFav function with provided values
			setFav(tempCity, tempCountry);
		}
		// hiding the search after the button is clicked
		$('#saveFav').hide();
	});

	$('#toggleSearch').on('click', function(){
		// showing the search form on button click
		$('#saveFav').show();
	});

	$(document).mouseup(function (e)
	{
		// this block of code is to close the searchbox if the user taps outside of the inputs or button
	    var container = $("#saveFav");

    	if (!container.is(e.target)
        	&& container.has(e.target).length === 0)
    	{
    		$("#saveFav").unbind( 'click');
        	container.hide();
    	}
	});
});