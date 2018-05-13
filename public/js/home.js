/* required for reordering list */
const filter = {
  CLOSEST: 0,
  FASTEST: 1
};
const filterId = {
  0: '#closest',
  1: '#fastest'
};

/* required for changing between networks */
const network = {
  PROTECTED: 0,
  GUEST: 1,
  RESNET: 2
};
const networkId = {
  0: '#protected',
  1: '#guest',
  2: '#resnet'
};

let listItems = [];
let markers = [];
let dots = [];
// default filter is fastest
let currentFilter = filter.FASTEST;
// default network is UCSD protected
let currentNetwork = network.PROTECTED;




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

  // changing the filter
  $('#fastest').click(() => filterClicked(filter.FASTEST));
  $('#closest').click(() => filterClicked(filter.CLOSEST));

  // changing the network
  $('#protected').click(() => networkClicked(network.PROTECTED));
  $('#guest').click(() => networkClicked(network.GUEST));
  $('#resnet').click(() => networkClicked(network.RESNET));

});


// This function gets called when Google maps API
// finishes checking our API key (passed in through
// the script tag in home.html)
function initMap() {

  // center map around Geisel
  const center = {lat: 32.881214, lng: -117.237449};
  //store map as global variable
  const map = new google.maps.Map(document.getElementById('map'), {
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
  }, () => {}); // do nothing if no location information

  // create internet speed dots on map
  doAjaxGet('/getDots', (data) => {
    data.forEach(function(dot) {
      if(dot.lat && dot.lng && dot.speed){
        const marker = new google.maps.Marker({
          position: {lat: dot.lat, lng: dot.lng},
          icon: calcColorIcon(calcColor(dot.speed)),
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
    listItems = data;
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

    // sort by function that compares currentNetwork speed, largest speed first
    listItems.sort(function(a, b) {
      return a.speeds[currentNetwork] == b.speeds[currentNetwork]
          ? 0
          : (a.speeds[currentNetwork] < b.speeds[currentNetwork] ? 1 : -1);
    });
    // add back the new list and markers
    createListFromObjs();
    repositionMarkersFromObjs();
    callback(true);
  }
}

function filterClicked(newFilter) {
  // don't do anything if the filter clicked is already selected
  if (newFilter != currentFilter) {
    // TODO: start loading animation
    reorderListItems(newFilter, (success) => {
      if (success) {
        currentFilter = newFilter; // update the current filter
      } else {
        if (newFilter == filter.CLOSEST) {
          $('#locationDataModal').modal();
        }

        // Move the selected radio button back to original
        const toSelect = filterId[currentFilter];
        const toDeselect = filterId[newFilter];
        $(toSelect).addClass('active');
        $(toDeselect).removeClass('active focus');
      }

      //TODO: end loading animation
    });
  }
}

function networkClicked(newNetwork) {
  // don't do anything if the network clicked is already selected
  if (newNetwork != currentNetwork) {
    // TODO: start loading animation

    oldNetwork = currentNetwork;
    currentNetwork = newNetwork;

    // reorder list and markers based on currentNetwork
    reorderListItems(currentFilter, (success) => {
      if (success) {
        // TODO: should call repositionDots here
      } else {
        // change currentNetwork back to original
        currentNetwork = oldNetwork;
        // Move the selected radio button back to original
        const toSelect = networkId[currentNetwork];
        const toDeselect = filterId[newNetwork];
        $(toSelect).addClass('active');
        $(toDeselect).removeClass('active focus');
      }

      //TODO: end loading animation
    });
  }
}

function createListFromObjs() {
  const listContainer = $('#list-results');
  for (let i = 0; i < listItems.length; i++) {
    htmlString = ' <div class="card">' +

                    '<div class="list-pic">' +
                      '<img src="' + listItems[i].image + '" alt="' + 
                          listItems[i].name + '" class="float-left img-responsive"/>' +
                    '</div>' +
                    '<div class="list-result-info">' +
                      '<h2 class="list-result-title padding-top-10">' + (i+1) + '. ' + listItems[i].name + '</h2>' +
                      '<p>Best WiFi Network: </p>' +
                      '<div class="row no-gutters padding-top-10">' +
                      '<div class="col-8"><p>Avg Speed:</p>' + 
                          ' <span class="' + calcColor(listItems[i].speeds[currentNetwork]) + 
                          '-speed">•</span>' + listItems[i].speeds[currentNetwork] + ' Mbps</div>' +
                      '<div class="col-4"><p>Distance: </p> 500ft</div>' +
                      '</div>' +
                      '<p class="padding-top-10 grey"> Last updated: Today at 3:21PM</p>' +
                    '</div>' +
                    //'<br style="clear: both;" />' +
                  '</div>';
                  //'<br style="clear: left;" />';
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    listContainer.append(div.firstChild);
  }
}


function repositionMarkersFromObjs() {
  // move the markers to match the first four list
  // items, and make sure they're visible
  for (let i = 0; i < 4; i++) {
    markers[i].setPosition({
      lat: listItems[i].lat, 
      lng: listItems[i].lng});
    markers[i].setVisible(true);
  }
}
