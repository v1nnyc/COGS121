// Attempts to add the user's current location and internet speed to database
function addSpeed() {
  checkForCurrentLocation(
    //call this fuction if we get location successfully
    (position) => {
      doAjaxPost('/add', position, (response) => {
        //pass into giveConfirmation method
        giveConfirmation(response.success, response.speed, '');
      });
    },
    // call this function if failed to get location
    () => {
      giveConfirmation(false, 0, 'Unable to retrieve your location.')
    });
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
