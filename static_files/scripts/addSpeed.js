// jQuery convention for running when the document has been fully loaded:
$(document).ready(() => {
  $('#recordSpeed').click(() => {
    console.log('recording user internet speed');
    // From: http://learn.jquery.com/ajax/jquery-ajax-methods/
    // Using the core $.ajax() method since it's the most flexible.
    // ($.get() and $.getJSON() are nicer convenience functions)
    // $.ajax({
    //   // all URLs are relative to http://localhost:3000/
    //   type: 'GET',
    //   dataType : 'json', // this URL returns data in JSON format
    //   success: (data) => {
    //     console.log('You received some data!', data);
    //   },
    // });
  });


  $('#Cancel').click(() => {
    document.getElementById("Cancel").onclick = function () {
        location.href = "/";
    };
  });

  // define a generic Ajax error handler:
  // http://api.jquery.com/ajaxerror/
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
});
