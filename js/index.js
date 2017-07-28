var periods = {
  session: 25 * 60,
  break: 5 * 60
};
var colors = {
  session: '#42f769',
  break: '#f74141',
  pause: '#fff132'
}
var initial = true;
var isRunning = false;
var c = 0;
var attr = 'session';
var progress;
var change = true

/* Capitalize function by Steve Hansell in http://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
  /**------------------------------------------------------**/
Number.prototype.formatSecs = function() {
  return (this>0)?('0' + Math.floor(this / 60) + ':0' + this % 60).replace(/0(?=\d{2})/g, ''):'00:00';
}

$('input').on('input', function() {
  var value = {session :$('#session').val(),
               break: $('#break').val()}
  if (isRunning === false) {
    periods.session = Number(value.session) * 60;
    periods.break = Number(value.session) * 60;
    $('#state').text(this.id.capitalize())
    $('#text').text(periods[this.id].formatSecs());
    initial = true
    $('.path').css('transition', 'stroke-dashoffset 0.1s linear').css('stroke-dashoffset', '1099')
  }
  $('.' + this.id).html(value[this.id.replace(/#/,'')]);
});

$('.path, #timer div').on('click', function() {
  if (initial === true) {
    $('#state').text('Session')
    attr = 'session'
  }
  $('.path').css('stroke', colors[attr])
  if (isRunning === false) {
    $('.slide').slideUp();
    initial = false;
    $('.path').css('stroke-dashoffset', '0').css('transition', 'stroke-dashoffset ' + (periods[attr] + 1) + 's linear')
    c = setInterval(function() {
      exec()
    }, 1000);
    isRunning = true;
  } else {
    $('.slide').slideDown();
    progress = $('.path').css('stroke-dashoffset')
    $('.path').removeAttr("style").css('stroke-dashoffset', progress).css('stroke', colors.pause)
    clearInterval(c);
    isRunning = false;
  }
});

function exec() {
  if (periods[attr] >= 0 && isRunning === true) {
    periods[attr]--;
    $('#text').text(periods[attr].formatSecs());
    if (change === true) {
      $('.path').css('stroke-dashoffset', '0').css('transition', 'stroke-dashoffset ' + (periods[attr] + 1) + 's linear')
      change = false
    }
  } else {
    if (attr === 'session') {
      attr = 'break'
    } else {
      attr = 'session'
    }
    periods[attr] = Number($('.' + attr).html()) * 60;
    $('#text').text(periods[attr].formatSecs());
    $('#state').text(attr.capitalize())
    $('.path').removeAttr("style")
    change = true
  }
  $('.path').css('stroke', colors[attr]) 
}