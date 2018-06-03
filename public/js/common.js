/* this file is used if multiple js files use the same method so that we can
* keep the code cleaner. It is responsible for:
* 1) getting the location of the user and returning lng/lat coordinates
* 2) getting the distance between and item and a user (so like markers)
* 3) ajax get and post calls
* 4) calculating the color of the dots for the map
* 5) getting the best network with the highest network speed
*/
// Call successFunction, passing in the current location,
// if we're able to get current location.
function checkForCurrentLocation(successFunction, failureFunction) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Got position data: Lat = " + position.coords.latitude +
                    ", Lng = " + position.coords.longitude);
        successFunction({lat: position.coords.latitude,
                        lng: position.coords.longitude});
      },
      // This function will be called if permission is denied.
      (error) => {
        console.log("Failed to get current location information.");
        failureFunction();
    });
  }
  // this will be called if the browser doesn't support geolocation
  else {
    console.log("Failed to get current location information.");
    failureFunction();
  }
}

function getDist(item, callback){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let dist = Math.sqrt(Math.pow(position.coords.latitude - item.lat, 2) +
        Math.pow(position.coords.longitude - item.lng, 2));
        console.log("Got position data: Lat = " + dist);
        callback(item, Math.sqrt(Math.pow(position.coords.latitude - item.lat, 2) +
        Math.pow(position.coords.longitude - item.lng, 2)));
      },
      // This function will be called if permission is denied.
      (error) => {
        console.log("Failed to get current location information.");
        callback(item, '-');
    });
  }
  // this will be called if the browser doesn't support geolocation
  else {
    console.log("Failed to get current location information.");
    callback(item, '-');
  }
}

// From: http://learn.jquery.com/ajax/jquery-ajax-methods/
// Using the core $.ajax() method since it's the most flexible.
// ($.get() and $.getJSON() are nicer convenience functions)
function doAjaxGet(url, callbackFunc) {
  $.ajax({
    url: url,
    type: 'GET',
    dataType : 'json',
    success: (data) => {
      console.log('You received some data!', data);
      callbackFunc(data);
    },
  });
}

function doAjaxPost(url, data, callbackFunc) {
  $.ajax({
    url: url,
    type: 'POST',
    dataType : 'json',
    data: data,
    success: (response) => {
      console.log('You received some data!', response);
      callbackFunc(response);
    },
  });
}

// TODO: update this to be more reasonable
function calcColor(x) {
  if (x < 5) return 'red';
  else if (x < 25) return 'yellow';
  else return 'green';
}

function calcColorIcon(c) {
  switch (c) {
    case 'red':
      return 'images/red-marker.png';
    case 'yellow':
      return 'images/yellow-marker.png';
    default:
      return 'images/green-marker.png';
  };
}

function getBestNetwork(speeds) {
  let max = 0;
  let index = -1;
  for (let i = 0; i < speeds.length; i++) {
    if (speeds[i] > max) {
      max = speeds[i];
      index = i;
    }
  }
  switch (index) {
    case 0:
      return 'UCSD Protected';
    case 1:
      return 'UCSD Guest';
    case 2:
      return 'RESNET';
    default:
      return '--'; // if all the speeds are 0, return '--'
  }
}

// javascript objects x and y must have fields lat and lng defined
function calcDist(a, b) {
  return calcCrow(a,b);
  //return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
}

function calcCrow(a, b) {
  var R = 6371; // km
  var dLat = toRad(b.lat-a.lat);
  var dLon = toRad(b.lng-a.lng);
  var lat1 = toRad(a.lat);
  var lat2 = toRad(b.lat);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return d;
}

function toRad(Value) {
  return Value * Math.PI / 180;
}

// define a generic Ajax error handler:
// http://api.jquery.com/ajaxerror/
$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});
