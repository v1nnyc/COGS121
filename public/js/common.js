// Call successFunction, passing in the current location, if we're able to get current location.
function checkForCurrentLocation(successFunction, failureFunction) {
  const lat = window.localStorage.getItem("latitude");
  const lng = window.localStorage.getItem("longitude");
  if (lat && lng) {
    successFunction({latitude: parseFloat(lat), longitude: parseFloat(lng)});
  }
  else {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Got position data: Lat = " + position.coords.latitude + 
                    ", Lng = " + position.coords.longitude);
        window.localStorage.setItem("latitude", position.coords.latitude);
        window.localStorage.setItem("longitude", position.coords.longitude);
        successFunction({latitude: position.coords.latitude, 
                        longitude: position.coords.longitude});
      });
    } else {
      console.log("Failed to get current location information.");
      failureFunction();
    }
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

// define a generic Ajax error handler:
// http://api.jquery.com/ajaxerror/
$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});