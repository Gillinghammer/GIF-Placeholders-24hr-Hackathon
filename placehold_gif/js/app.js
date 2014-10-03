$(function(){
 
 $('#submitButton').on('click', generateUrl);

 $('#submitButton').hover(
  function () {
    $(this).addClass("animated shake");
  },
  function () {
    $(this).removeClass("animated shake");
  }
);

});

var limit = 1000,
    offset = 0,
    requestedHeight,
    requestedWidth,
    searchTerm;

function generateUrl() {
  $('#gif').empty();
  $('#gif').html('<img src="/images/spiffygif_154x154.gif"/>');
  requestedHeight = parseInt($('#height').val());
  requestedWidth = parseInt($('#width').val());
  searchTerm = $('#searchTerm').val();

  var request = getGif(searchTerm, limit, offset);
  console.log('request looks like: ' + request);
  request.done(function(result){
    var gif = findMatchingGif(result['data']);

    if(gif != undefined ){
      //call append html function
      console.log('sucessful gif: ' + gif['images']['original']['url']);
      offset = 0;
      displayGif(gif); 
    } else {
      offset += limit;
      console.log('Here we go again, so far we\'ve looked through ' + offset + " gifs.");
      
      if(offset < 3000) {
      generateUrl();
      } else {
      $('#gif').html("<h5>Terribly sorry, but we weren't able to find a GIF of those dimensions. Please try another category or size.</h5>");
      offset = 0;
      };
    }
    
  });

}

function displayGif(gifElement) {
  console.log('Hello displayGif function');
  $('#gif').html('<a style="text-decoration:none;" href="' + gifElement['images']['original']['url'] +'" target="_blank"><img src="' + gifElement['images']['original']['url'] + '" /></a>');
}

function gifChecker(value) {
  return parseInt(value['images']['original']['height']) == requestedHeight && parseInt(value['images']['original']['width']) == requestedWidth;
};

function getGif(searchTerm, limitResults, offsetBy) {
  console.log("querying api");
  return $.get("http://api.giphy.com/v1/gifs/search?q=" + searchTerm + "&api_key=dc6zaTOxFJmzC&limit="+ limitResults +"&offset=" + offsetBy);
};

function findMatchingGif(gifsArray) {
  console.log('Hello findMatchingGif function')
    var tempArray = gifsArray.filter(function(element){
      return gifChecker(element); 
    });  
    
    return tempArray[0];
};
