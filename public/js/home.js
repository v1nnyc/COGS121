$(document).ready(() => {
  // fill list results
  doAjaxGet('/getplaces', (data) => {
    data.forEach(place => {
      //require an image and a speed to add
      if(place.image && place.speed){
        //creating new object
        const obj = {title: place.name,
                    img: place.image,
                    speed: place.speed,
                    color: calcColor(place.speed)};
        $('#list-results').append(createListElementFromObj(obj));
      }
    });
  });

  // When the user clicks contribute, open add speed popup
  $('#contribute').click(() => { 
      $('#add-speed-container').show();
  });

  // When the user clicks on the 'x' or on cancel, close popup
  $('.close-popup, .cancel').click(() => {
      $('.popup-container').hide();
  });

  $('#add-speed').click(addSpeed);

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


function calcColor(x) {
  if(x < 5) return 'red';
  else if(x < 25) return 'yellow';
  else return 'green';
}


// Attempts to add the user's current location and internet speed to database
function addSpeed() {
  // TODO: use a more robust method for getting internet speed
  if (navigator.connection) {
    checkForCurrentLocation(
      //call this fuction if get location successfully
      (position) => {
        const data = {
          lat: position.coords.latitude,
          lng: position.coords.longitude, 
          speed: navigator.connection.downlink
        };

        doAjaxPost('/add', data, (response) => {
          giveConfirmation(response.success, data.speed, '');
        });
      },
      // call this function if failed to get location
      () => {
        giveConfirmation(false, 0, 'Unable to retrieve your location.')
      });
  } else {
    // call this function if we can't get internet speed from browser
    giveConfirmation(false, 0, 'This is not supported by your browser, please use Chrome.');
  }
    
}


// closes the add speed popup, opens the confirmation popup and populates text accordingly
function giveConfirmation(successful, speed, errorMessage) {
  $('#add-speed-container').hide();
  $('#confirmation-container').show();
  if (successful) {
    $('#confirmation-title').text('Success!');
    $('#confirmation-text').text('You data has been added to our map. ' +
      'Your internet speed is currently ' + speed + ' Mbps. Thank you for your help!');
  } else {
    $('#confirmation-title').text('Failed to add your internet speed');
    $('#confirmation-text').text('Error: ' + errorMessage);
  }
}


function createListElementFromObj(listObj) {
  htmlString = '<div class="list-result">' +
                  '<div class="list-pic">' +
                    '<img src="' + listObj.img + '" alt="' + listObj.title + '"/>' +
                  '</div>' +
                  '<div class="list-result-info">' +
                    '<h2 class="list-result-title">' + listObj.title + '</h2>' +
                    '<p> average speed: <span class="' + listObj.color + '-speed">' + listObj.speed + '</span> Mbps</p>' +
                  '</div>' +
                  '<br style="clear: both;" />' +
                '</div>' +
                '<br style="clear: left;" />';
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}


