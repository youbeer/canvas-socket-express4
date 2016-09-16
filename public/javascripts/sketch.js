$(function(){
  var $canvas = $('#canvas');
  var fromX;
  var fromY;
  var isDraw = false;

  $canvas.attr('width', $(window).innerWidth());
  $canvas.attr('height', $(window).innerHeight());

  /** 消えちゃう **/
  // $(window).on('resize', function(){
  //   $canvas.attr('width', $(window).innerWidth());
  //   $canvas.attr('height', $(window).innerHeight());
  // }).trigger('resize');

  var context = $canvas.get(0).getContext('2d');

  context.lineWidth = 5;
  context.strokeStyle = '#9eala3';

  var socket = io.connect();

  socket.on('draw_from_server', function(data) {
    context.strokeStyle = data.color;
    context.beginPath();
    context.moveTo(data.fx, data.fy);
    context.lineTo(data.tx, data.ty);
    context.stroke();
    context.closePath();
  });

  socket.on('clear_from_server', function(data) {
    context.clearRect(0, 0, $canvas.attr('width'), $canvas.attr('height'));
  });

  function draw(e) {
    var toX = e.clientX;
    var toY = e.clientY;

    context.beginPath();
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
    context.closePath();

    socket.json.emit('draw_from_client', { fx:fromX, fy:fromY, tx:toX, ty:toY, color:context.strokeStyle });
    fromX = toX;
    fromY = toY;
  }

  $canvas.on('mousedown touchstart', function(e){
  // $canvas.on('touchstart', function(e){
    console.log('start');
    isDraw = true;
    fromX = e.clientX;
    fromY = e.clientY;

    // return false;
  });

  $canvas.on('mousemove touchmove', function(e){
  // $canvas.on('touchmove', function(e){
    console.log('move');
    // debugger
    if (isDraw) draw(e);
  });

  $canvas.on('mouseup mouseleave touchend', function(e){
  // $canvas.on('touchend', function(e){
    console.log('end');
    isDraw = false;
  });

  $('.color').on('click', function(e){
    context.strokeStyle = $(this).css('background-color');
  });

  $('#clear').on('click', function() {
    socket.emit('clear_from_client');
    context.clearRect(0, 0, $canvas.attr('width'), $canvas.attr('height'));
  });

  $('#save').on('click', function() {
   var d = $canvas[0].toDataURL('image/png');
   d = d.replace('image/png', 'image/octet-stream');
   window.open(d, 'save');
  });
});