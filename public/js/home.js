// required for reordering list
const filter = {
  CLOSEST: 0,
  FASTEST: 1
};
const filterId = {
  0: '#closest',
  1: '#fastest'
};
let listItems = [];
let markers = [];
let currentFilter = filter.FASTEST; // default filter is fastest
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

  $('#fastest').click(() => filterClicked(filter.FASTEST));

  $('#closest').click(() => filterClicked(filter.CLOSEST));

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
  }, () => {});

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
    // initially list will be ordered by fastest.
    // don't need to use the callback
    reorderListItems(filter.FASTEST, () => {});
  });
}

// calls the callback with true for success or false for failure
// will only fail when filtering by closest and location data not
// available
function reorderListItems(filterBy, callback) {
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
        callback(true);
      }, 
      // call this function if unable to get current location
      () => {
        callback(false);
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
    callback(true);
  }
}

function filterClicked(filter) {
  // don't do anything if filter clicked is already selected
  if (filter != currentFilter) {
    // TODO: start loading animation
    reorderListItems(filter, (success) => {
      if (success) {
        const toDeHighlight = filterId[currentFilter];
        const toHighlight = filterId[filter];
        currentFilter = filter; // update the current filter
        $(toDeHighlight).addClass('deHighlighted');
        $(toDeHighlight).removeClass('highlighted');
        $(toHighlight).addClass('highlighted');
        $(toHighlight).removeClass('deHighlighted');

        //TODO: end loading animation
      } else {
        // TODO: VINCENT this is where we should display a pop up saying you
        // can't order by closest if your location data isn't available!!!
      }
    });
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


