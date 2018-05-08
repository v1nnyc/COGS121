// required for reordering list
let listItems = [];
let markers = [];
let map = null;

$(document).ready(() => {
  // When the user clicks contribute, open add speed popup
  $('#contribute').click(() => { 
      $('#add-speed-container').show();
  });

  // When the user clicks on the 'x' or on cancel, close popup
  $('.close-popup, .cancel').click(() => {
      $('.popup-container').hide();
  });

  // function located in js/addSpeed.js
  $('#add-speed').click(addSpeed);

});


// This function gets called when Google maps API 
// finishes checking our API key (passed in through
// the script tag in home.html)
function initMap() {

  // center map around Geisel
  const center = {lat: 32.881214, lng: -117.237449};
  //store map as global variable
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: center
  });

  // add current location marker if current location is available
  checkForCurrentLocation((position) => {
    const marker = new google.maps.Marker({
      position: {lat: position.latitude, lng: position.longitude},
      icon: "images/current-location.png",
      map: map
    });
  }, 
    // TODO: if location is not available should grey out "Closest" filter
    () => {});

  // create internet speed dots on map
  doAjaxGet('/getDots', (dots) => {
    dots.forEach(function(feature) {
      if(feature.lat && feature.lng && feature.speed){
        const marker = new google.maps.Marker({
          position: {lat: feature.lat, lng: feature.lng},
          icon: calcColorIcon(calcColor(feature.speed)),
          map: map
        });
      }
    });
  });

  getListResults();

}

// should only be called once when the initMap function is called
function getListResults() {
  doAjaxGet('/getMarkers', (data) => {
    data.forEach(marker => {
        marker['color'] = calcColor(marker.speed);
        listItems.push(marker);
    });
    // reorderListItems(true);
    createListFromObjs();
    createMarkersFromObjs();
  });
}


function createListFromObjs() {
  const listContainer = $('#list-results');
  for (let i = 0; i < listItems.length; i++) {
    htmlString = '<div class="list-result">' +
                    '<div class="list-pic">' +
                      '<img src="' + listItems[i].image + '" alt="' + listItems[i].name + '"/>' +
                    '</div>' +
                    '<div class="list-result-info">' +
                      '<h2 class="list-result-title">' + (i+1) + '. ' + listItems[i].name + '</h2>' +
                      '<p> average speed: <span class="' + listItems[i].color + '-speed">' + listItems[i].speed + '</span> Mbps</p>' +
                    '</div>' +
                    '<br style="clear: both;" />' +
                  '</div>' +
                  '<br style="clear: left;" />';
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    listContainer.append(div.firstChild);
  }
}


function createMarkersFromObjs() {
  // for now only add first 4 list items as markers
  for (let i = 0; i < 4; i++) {
    const marker = new google.maps.Marker({
      position: {lat: listItems[i].lat, lng: listItems[i].lng},
      icon: ('images/marker-' + (i+1) + '.png'),
      map: map
    });
    markers.push(marker);
  }
}


