function createListElementFromObj(listObj) {
  htmlString = '<div class="list-result">' +
                  '<div class="list-pic">' +
                    '<img src="' + listObj.img + '" alt="' + listObj.title + '"/>' +
                  '</div>' +
                  '<div class="list-result-info">' +
                    '<h2 class="list-result-title">' + listObj.title + '</h2>' +
                    '<p> average speed: <span class="green-speed">' + listObj.speed + '</span></p>' +
                  '</div>' +
                  '<br style="clear: both;" />' +
                '</div>' +
                '<br style="clear: left;" />';


  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

$(document).ready(() => {

  console.log('making ajax request to: /getData');

  // From: http://learn.jquery.com/ajax/jquery-ajax-methods/
  // Using the core $.ajax() method since it's the most flexible.
  // ($.get() and $.getJSON() are nicer convenience functions)
  $.ajax({
    // all URLs are relative to http://localhost:3000/
    url: '/getListData',
    type: 'GET',
    dataType : 'json', // this URL returns data in JSON format
    success: (data) => {
      console.log('You received some data!', data);
      for (var title in data) {
        if (data) {
          console.log("got data");
          $('#list-results').append(createListElementFromObj(data[title]));
        } else {
          console.log('Failed to get list data!');
        }
      }
    },
  });

  // define a generic Ajax error handler:
  // http://api.jquery.com/ajaxerror/
  $(document).ajaxError(() => {
    $('#status').html('Error: unknown ajaxError!');
  });
});
