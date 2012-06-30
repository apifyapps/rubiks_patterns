var patternsUrl = "http://apify.heroku.com/api/rubiks_patterns.json?callback=?";
var moveMap = {
  "F": "FS",
  "B": "BS",
  "R": "RM",
  "L": "LM",
  "U": "UE",
  "D": "DE"
};
var patterns = [];
var currentMoveIndex = 0;
var currentMoves = [];

$(function(){
  $.getJSON(patternsUrl, function(dataString){
    patterns = JSON.parse(dataString);
    fillPatterns();
  });

  function fillPatterns(){
    $('#patternName').html('');
    $('#patternName').append('<option>Select Pattern</option>');
    _.each(patterns, function(pattern){
      $('#patternName').append('<option>' + pattern.name + '</option>');
    });
  }

  $('#rotation').click(function(){
    $(this).toggleClass('btn-danger');
  });

  $('#patternName').change(function(){
    var patternName = $(this).val();
    var pattern = _.find(patterns, function(pattern){ return pattern.name == patternName});
    currentMoveIndex = 0;
    currentMoves = pattern.moves.split(' ');
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
    direction = 'left';
    value = value[0];
  }
  console.log(direction);
  var moveSlice = moveMap[value].split('');
  cube._expectingTransition = true;
  cube._doMovement({face: moveSlice[0], slice: moveSlice[1], rotate: direction});
}
