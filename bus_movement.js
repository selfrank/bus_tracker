mapboxgl.accessToken = 'your access key here'

var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/dark-v10',
	center: [-71.089191,42.350247],
	zoom: 12
}) ;
var markers = [];
console.log('Markers Array'+ markers) 


// load map
function init(){
	addMarkers();

}


// Add bus markers to map
async function addMarkers(){
	// get bus data
	var locations = await getBusLocations();
	console.log(new Date());
	console.log(locations);


	// loop through data, add bus markers
	locations.forEach(function(bus){
		var marker = getMarker(bus.attributes.label);		
		if (marker){
			moveMarker(marker,bus);
			console.log('Move: '+bus.attributes.longitude+' '+ bus.attributes.latitude+' '+marker._element.id)
			console.log('Move: '+marker._element.id)	
		}
		else{
			addMarker(bus);	
			console.log('Add: '+bus.attributes.longitude+' '+ bus.attributes.latitude+' '+bus.attributes.label)		
		}
	});

	// timer
	setTimeout(addMarkers,15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	var url = 'https://api-v3.mbta.com/vehicles?api_key=ca34f7b7ac8a445287cab52fb451030a&filter[route]=1&include=trip';	
	var response = await fetch(url);
	var json     = await response.json();
	return json.data;
}

function addMarker(bus){
	var marker = new mapboxgl.Marker({
		"properties":{
			"id": bus.attributes.label}})
	marker._element.id = bus.attributes.label
	marker.setLngLat([bus.attributes.longitude,bus.attributes.latitude])
	markers.push(marker)
	marker.addTo(map)
	console.log('Markers Array in Function' +marker)
		};


function moveMarker(marker,bus) {
	// move icon to new lat/lon
	marker.setLngLat([bus.attributes.longitude,bus.attributes.latitude])
	.addTo(map)
	console.log('moveMarker: '+marker)
}
	

function getMarker(label){
	var marker = markers.find(
		function(item){
	console.log('getMaker '+item._element.id)
		return item._element.id ===label;
	}); 
	console.log('GetMaker'+marker)
	return marker;
}	

window.onload = init;
