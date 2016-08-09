;(function(){
  const $milli   = document.querySelectorAll('.milliseconds__digit');
  const $seconds = document.querySelectorAll('.seconds__digit');
  const $minutes = document.querySelectorAll('.minutes__digit');
  const $hours   = document.querySelectorAll('.hours__digit');
  const set      = (measure, value) => {
    measure[0].setAttribute('data-digit', value[0]);
    measure[1].setAttribute('data-digit', value[1])
  };
  const updateEl = (el, value) => {
    if (value < 10) {
      set(el, '0' + value);
    } else {
      set(el, value.toString());
    }
  };
  const update   = () => {
    var d = new Date();
    updateEl($milli  , Math.floor(d.getMilliseconds() / 10));
    updateEl($seconds, d.getSeconds());
    updateEl($minutes, d.getMinutes());
    updateEl($hours  , d.getHours());
  };
  setInterval(update, 10);
})();
