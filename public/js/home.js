$(document).ready(() => {
  console.log("home document is ready");
  // create internet speed markers
  doAjaxGet('/getplaces', (data) => {
    data.forEach(rows => {
      //require an image and a speed to add
      if(rows.image && rows.speed){
        //creating new object
        let obj = {title: rows.name, img: rows.image, speed: rows.speed};
        $('#list-results').append(createListElementFromObj(obj));
      }
    });
  });
});

//old implementation w/o database
/*$(document).ready(() => {
  // fill list results
  doAjaxGet('/getListData', (list_results) => {
    for (var title in list_results) {
      $('#list-results').append(createListElementFromObj(list_results[title]));
    }
  });

});*/


// This function gets called when Google maps API finishes checking our API key
// (passed in through the script tag in home.html)

function initMap() {

  function calcColor(x){
    if(x < 5) return 'red';
    else if(x < 25) return 'yellow';
    else return 'green';
  }

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
  doAjaxGet('/getnetworks', (marker_features) => {
    marker_features.forEach(function(feature) {
      if(feature.lat && feature.lng && feature.speed){
        const marker = new google.maps.Marker({
          position: {lat: feature.lat, lng: feature.lng},
          icon: icons[calcColor(feature.speed)].icon,
          map: map
        });
      }
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
