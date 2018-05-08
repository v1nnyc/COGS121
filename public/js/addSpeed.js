// Attempts to add the user's current location and internet speed to database
function addSpeed() {
  // TODO: use a more robust method for getting internet speed
  if (navigator.connection) {
    checkForCurrentLocation(
      //call this fuction if get location successfully
      (position) => {
        const data = {
          lat: position.latitude,
          lng: position.longitude, 
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