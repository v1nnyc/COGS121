// jQuery convention for running when the document has been fully loaded:
$(document).ready(() => {
  $('#recordSpeed').click(() => {
    console.log('recording user internet speed');
    // From: http://learn.jquery.com/ajax/jquery-ajax-methods/
    // Using the core $.ajax() method since it's the most flexible.
    // ($.get() and $.getJSON() are nicer convenience functions)
    $.ajax({
      // all URLs are relative to http://localhost:3000/
      type: 'GET',
      dataType : 'json', // this URL returns data in JSON format
      success: (data) => {
        console.log('You received some data!', data);
      },
    });
  });


  $('#Cancel').click(() => {
    $.ajax({
      type: 'GET',
      dataType : 'json',
      success: (data) => {
        console.log('You received some data!', data);
      },
    });
  });

  var popup = document.getElementById('mypopup');
  // Get the button that opens the modal
  var btn = document.getElementById("recordSpeed");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function() {
      popup.style.display = "block";
  }
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      popup.style.display = "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == popup) {
          popup.style.display = "none";
      }
  }

  // define a generic Ajax error handler:
  // http://api.jquery.com/ajaxerror/
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
});
