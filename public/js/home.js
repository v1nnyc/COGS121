$(document).ready(() => {

  // fill list results
  doAjaxGet('/getListData', (list_results) => {
    for (var title in list_results) {
      $('#list-results').append(createListElementFromObj(list_results[title]));
    }
  });

});


// This function gets called when Google maps API finishes checking our API key
// (passed in through the script tag in home.html)
function initMap() {
  // center around the location of Geisel 
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

  // add current location marker if current location is available
  checkForCurrentLocation((position) => {
    const marker = new google.maps.Marker({
      position: {lat: position.coords.latitude, lng: position.coords.longitude},
      icon: "images/current-location.png",
      map: map
    });
  });
  

  // create internet speed markers
  doAjaxGet('/getMapData', (marker_features) => {
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