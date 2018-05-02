$(document).ready(() => {
  console.log('ready!');
  $('#view').click(() => {
    console.log('clicked on view button!');
    window.location.href("http://localhost:3000/home");
  });


});
  // redirect to home page if clicked on view button
