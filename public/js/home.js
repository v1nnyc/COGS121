// required for reordering list
let listItems = [];
let markers = [];
let map = null;
const filter = {
  CLOSEST: 0,
  FASTEST: 1
};

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
  checkForCurrentLocation((currentLoc) => {
    const marker = new google.maps.Marker({
      position: currentLoc,
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

  // create 4 invisible markers to be used for list results
  // in future we can add more or less markers
  for (let i = 1; i < 5; i++) {
    const marker = new google.maps.Marker({
      position: center,
      icon: 'images/marker-' + i + '.png',
      map: map,
      visible: false,
    });
    markers.push(marker);
  }

  getListResults();

}

// should only be called once when the initMap function is called
function getListResults() {
  doAjaxGet('/getMarkers', (data) => {
    data.forEach(marker => {
        marker['color'] = calcColor(marker.speed);
        listItems.push(marker);
    });
    // initially list will be ordered by fastest
    reorderListItems(filter.FASTEST);
  });
}

// This should not be called with a value of 
// CLOSEST if location data is not available
function reorderListItems(filterBy) {
  // reorder by CLOSEST
  if (filterBy == filter.CLOSEST) {
    checkForCurrentLocation(
      // call this function on success, we have current location information
      (currentLoc) => {
        // remove all children from list-results
        $('#list-results').empty();
        // sort by function that compares to current location,
        // smallest distance first
        listItems.sort(function(a, b) {
          const aDist = calcDist(a, currentLoc);
          const bDist = calcDist(b, currentLoc);
          return aDist == bDist
              ? 0
              : (aDist > bDist ? 1 : -1);
        });
        // add back the new list and markers
        createListFromObjs();
        repositionMarkersFromObjs();
      }, 
      // call this function if unable to get current location
      // TODO: throw an error?
      () => {
        console.log("Unable to sort by closest without current location information.");
    });

  // Reorder by FASTEST
  } else {
    // remove all children from list-results
    $('#list-results').empty();

    // sort by function that compares speed, largest speed first
    listItems.sort(function(a, b) {
      return a.speed == b.speed
          ? 0 
          : (a.speed < b.speed ? 1 : -1);
    });
    // add back the new list and markers
    createListFromObjs();
    repositionMarkersFromObjs();
  }
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


function repositionMarkersFromObjs() {
  // move the markers to match the first four list
  // items, and make sure they're visible
  for (let i = 0; i < 4; i++) {
    markers[i].setPosition({lat: listItems[i].lat, lng: listItems[i].lng});
    markers[i].setVisible(true);
  }
}


