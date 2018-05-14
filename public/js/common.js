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
  return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
}

// define a generic Ajax error handler:
// http://api.jquery.com/ajaxerror/
$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});
