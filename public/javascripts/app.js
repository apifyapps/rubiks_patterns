var patternsUrl = "http://apify.heroku.com/api/rubiks_cube_patterns.json?callback=?";
var moveMap = {
  "F": "FS",
  "B": "BS",
  "R": "RM",
  "L": "LM",
  "U": "UE",
  "D": "DE"
};
var patterns = [];
var moves = [];
var currentMoveIndex = 0;
var currentMoves = [];

$(function(){
  $.getJSON(patternsUrl, function(dataString){
    var patternNamesAndMoves = JSON.parse(dataString);
    patterns = _.map(_.filter(patternNamesAndMoves, function(e,i){return (i%2 == 0);}), function(obj){return obj.pattern});
    moves = _.map(_.filter(patternNamesAndMoves, function(e,i){return (i%2 != 0);}), function(obj){
      return obj.pattern.replace(/\n\s+/,' ')
        .replace(/(.)2/g,'$1 $1')
        .split(/\s+/);
    });
    fillPatterns();
  });

  function fillPatterns(){
    $('#patternName').html('');
    $('#patternName').append('<option>Select Pattern</option>');
    _.each(patterns, function(pattern, index){
      $('#patternName').append('<option value="'+index+'">' + pattern + '</option>');
    });
  }

  $('#rotation').click(function(){
    $(this).toggleClass('btn-danger');
  });

  $('#patternName').change(function(){
    var index = $(this).val();
    var pattern = patterns[index];
    currentMoveIndex = 0;
    currentMoves = moves[index];
    displayCurrentMoves();
  });

  $('.play').click(function(){
    if(currentMoveIndex < currentMoves.length){
      move(currentMoves[currentMoveIndex]);
      resetActiveMove();
      $('.moves span:nth-child(' + (currentMoveIndex + 1) + ')').addClass('active');
      currentMoveIndex++;
    }
    if(currentMoveIndex == currentMoves.length){
      $(this).removeClass('btn-success');
    }
  });

  function displayCurrentMoves(){
    resetActiveMove();
    $('.moves').html('');
    _.each(currentMoves, function(move){
      $('.moves').append('<span>' + move + '</span>');
    });
    $('.play').addClass('btn-success');
  }

  function resetActiveMove(){
    $('.moves .active').removeClass('active');
  }
});

function move(value){
  var direction = 'right';
  if(typeof(value[1]) != 'undefined'){
    if(value[1] == "'"){
      direction = 'left';
    }
    value = value[0];
  }
  var moveSlice = moveMap[value].split('');
  cube._expectingTransition = true;
  cube._doMovement({face: moveSlice[0], slice: moveSlice[1], rotate: direction}, false);
}
