;(function(){
  const $seconds = document.querySelectorAll('.watch__seconds .digit');
  const $minutes = document.querySelectorAll('.watch__minutes .digit');
  const $hours   = document.querySelectorAll('.watch__hours .digit');
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
    updateEl($seconds, d.getSeconds());
    updateEl($minutes, d.getMinutes());
    updateEl($hours  , d.getHours());
  };
  setInterval(update, 1000);
})();
