/* This is the client side javascript for the home page. It is responsible for:
* 1) getting the contents from the database that are needed for the homepage
* 2) initiating the google map
* 3) calculating the distances from the user to the markers
* 4) displaying the list of markers (and reordering them based on chosen filter)
*/
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

// reference to original marker data
let listItems = [];
// references to the map marker objects
let markers = [];
// reference to the original dot data
let dotsList = [];
// references to the map dot objects
let dots = [];
// default filter is fastest
let currentFilter = filter.FASTEST;
// default network is UCSD protected
let currentNetwork = network.PROTECTED;
// indicates if loader is visible
let loading = false;

let currentPosition;

$(document).ready(() => {

  // When the user clicks contribute, open add speed popup
  $('#contribute').click(() => {
      $('#add-speed-container').show();
  });

  // When the user clicks on the 'x' or on cancel, close popup
  $('.close-popup, .cancel, #close').click(() => {
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

  // change marker color on mouseover
  $('body').on('mouseover', '.list-card', function () {
     highlightMarker(parseInt($(this).attr('id')));
  });
  $('body').on('mouseout', '.list-card', function () {
     deHighlightMarker(parseInt($(this).attr('id')));
  });


  $('#list-results').height($('#map').height());
  $(window).resize(() => $('#list-results').height($('#map').height()));

});


// This function gets called when Google maps API
// finishes checking our API key (passed in through
// the script tag in home.html)
function initMap() {

  // start loading animation
  toggleLoading();

  // center map around Geisel
  const center = {lat: 32.881214, lng: -117.237449};
  //store map as global variable
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: center
  });

  // add current location marker if current location is available
  checkForCurrentLocation((currentLoc) => {
    const marker = new google.maps.Marker({
      position: currentLoc,
      icon: "images/current-location.png",
      map: map
    });
    updateDistances(currentLoc);
  }, () => {}); // do nothing if no location information

  // create internet speed dots on map
  doAjaxGet('/getDots', (data) => {
    dotsList = data;
    // find network with the most dots
    let maxDotCount = 0;
    dotsList.forEach(list => {
      if (list.length > maxDotCount) {
        maxDotCount = list.length;
      }
    });

    // create enough dots for largest network, make them invisible
    for (let i = 0; i < maxDotCount; i++) {
      const dot = new google.maps.Marker({
        position: center,
        icon: 'images/green-marker.png',
        map: map,
        visible: false
      });
      dots.push(dot);
    }
    repositionDotsFromObjs();
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

function updateDistances(currentLoc){
  for(var count in listItems){
    let distance = ((calcDist(currentLoc, listItems[count]) * 3280.84) / 5280);
    //if less than 0.5 miles away convert to ft
    if(distance < 0.3){
      distance = (distance * 5280).toFixed(2) + " ft";

    } else {
      distance = distance.toFixed(2) + "mi";
    }
    listItems[count].distance = distance;
  }
  createListFromObjs();
}

// should only be called once when the initMap function is called
function getListResults() {
  doAjaxGet('/getMarkers', (data) => {
    listItems = data;
    // initially list will be ordered by fastest.
    // don't need to use the callback
    reorderListItems(filter.FASTEST, () => {});

    // end loading animation
    toggleLoading();
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
    // start loading animation
    toggleLoading();
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

      // end loading animation
      toggleLoading();
    });
  }
}

function networkClicked(newNetwork) {
  // don't do anything if the network clicked is already selected
  if (newNetwork != currentNetwork) {
    // start loading animation
    toggleLoading();

    oldNetwork = currentNetwork;
    currentNetwork = newNetwork;

    // reorder list and markers based on currentNetwork
    reorderListItems(currentFilter, (success) => {
      if (success) {
        repositionDotsFromObjs();
      } else {
        // change currentNetwork back to original
        currentNetwork = oldNetwork;
        // Move the selected radio button back to original
        const toSelect = networkId[currentNetwork];
        const toDeselect = filterId[newNetwork];
        $(toSelect).addClass('active');
        $(toDeselect).removeClass('active focus');
      }

      // end loading animation
      toggleLoading();
    });
  }
}

// uses the current ordering of listItems to recreate the list results
// in the correct order
function createListFromObjs() {
  const listContainer = $('#list-results');
  listContainer.empty();
  for (let i = 0; i < listItems.length; i++) {
    const color = calcColor(listItems[i].speeds[currentNetwork]);
    const bestNetwork = getBestNetwork(listItems[i].speeds);
    htmlString = ' <div class="card list-card" id="' + i + '">' +
                    '<div class="list-pic">' +
                      '<img src="' + listItems[i].image + '" alt="' +
                          listItems[i].name + '" class="float-left img-responsive"/>' +
                    '</div>' +
                    '<div class="list-result-info">' +
                      '<h2 class="list-result-title padding-top-10">' + (i+1) + '. ' + listItems[i].name + '</h2>' +
                      '<p>Best WiFi Network: ' + bestNetwork + '</p>' +
                      '<div class="row no-gutters padding-top-10">' +
                      '<div class="col-8"><p>Avg Speed:</p>' +
                          ' <span class="' + color +
                          '-speed">•</span>' + listItems[i].speeds[currentNetwork] + ' Mbps</div>' +
                      '<div class="col-4"><p>Distance: </p>' + listItems[i].distance + '</div>' +
                      '</div>' +
                      '<p class="padding-top-10 grey"> Last updated: '+ listItems[i].date +'</p>' +
                    '</div>' +
                  '</div>';
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    listContainer.append(div.firstChild);
  }
}

// uses the current ordering of ListItems to reposition the numbered icons
// to match the list results
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

// uses currentNetwork to determine which dots should appear on the map
function repositionDotsFromObjs() {
  for (let i = 0; i < dots.length; i++) {
    // show the dot based on list of dots for currentNetwork
    if (i < dotsList[currentNetwork].length) {
      const lat = dotsList[currentNetwork][i].lat;
      const lng = dotsList[currentNetwork][i].lng;
      dots[i].setPosition({lat: lat, lng: lng});
      dots[i].setIcon(calcColorIcon(
        calcColor(dotsList[currentNetwork][i].speed)));
      dots[i].setVisible(true);
    } else { // this is an extra dot, don't show
      dots[i].setVisible(false);
    }
  }
}

function highlightMarker(ind) {
  if (ind < 4) {
    markers[ind].setIcon('images/marker-' + (ind + 1) + '-highlighted.png');
  }
}

function deHighlightMarker(ind) {
  if (ind < 4) {
    markers[ind].setIcon('images/marker-' + (ind + 1) + '.png');
  }
}

function toggleLoading() {
  if (!loading) {
    $('#overlay').css('width', '100%');
    $('.loader').css('display', 'block');
    loading = true;
  } else {
    $('#overlay').css('width', '0%');
    $('.loader').css('display', 'none');
    loading = false;
  }
}
