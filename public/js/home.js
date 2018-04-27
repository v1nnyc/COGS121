$(document).ready(() => {

  // fill list results
  makeAjaxCall('/getListData', (list_results) => {
    for (var title in list_results) {
      $('#list-results').append(createListElementFromObj(list_results[title]));
    }
  });

});

function initMap() {
  const uluru = {lat: 32.881214, lng: -117.237449};
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: uluru
  });

  const icons = {
    red: {icon: 'images/red-marker.png'},
    yellow: {icon: 'images/yellow-marker.png'},
    green: {icon: 'images/green-marker.png'}
  };

  // create markers
  makeAjaxCall('/getMapData', (marker_features) => {
    marker_features.forEach(function(feature) {
      const marker = new google.maps.Marker({
        position: feature.position,
        icon: icons[feature.color].icon,
        map: map
      });
    });
  });

}


function createListElementFromObj(listObj) {
  htmlString = '<div class="list-result">' +
                  '<div class="list-pic">' +
                    '<img src="' + listObj.img + '" alt="' + listObj.title + '"/>' +
                  '</div>' +
                  '<div class="list-result-info">' +
                    '<h2 class="list-result-title">' + listObj.title + '</h2>' +
                    '<p> average speed: <span class="green-speed">' + listObj.speed + '</span></p>' +
                  '</div>' +
                  '<br style="clear: both;" />' +
                '</div>' +
                '<br style="clear: left;" />';
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

// From: http://learn.jquery.com/ajax/jquery-ajax-methods/
// Using the core $.ajax() method since it's the most flexible.
// ($.get() and $.getJSON() are nicer convenience functions)
function makeAjaxCall(url, callbackFunc) {
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

