;(function(){
  const watch = document.querySelector('.watch');
  const d = new Date();
  watch.setAttribute('start-seconds', d.getSeconds());
  watch.setAttribute('start-minutes', d.getMinutes());
  watch.setAttribute('start-hours'  , (d.getHours() > 11) ? d.getHours() - 12 : d.getHours());
})();
