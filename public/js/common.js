// Call successFunction, passing in the current location, if we're able to get current location.
function checkForCurrentLocation(successFunction) {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Got position data: Lat = " + position.coords.latitude + 
                    ", Lng = " + position.coords.longitude);
        successFunction(position);
      });
  } else {
        // Can change this to call a failure function if necessary.
        console.log("Failed to get current location information.");
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

// define a generic Ajax error handler:
// http://api.jquery.com/ajaxerror/
$(document).ajaxError(() => {
  $('#status').html('Error: unknown ajaxError!');
});