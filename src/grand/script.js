;(function(){
  const watch = document.querySelector('.clock');
  const d = new Date();
  watch.setAttribute('start-minutes', d.getMinutes());
  watch.setAttribute('start-hours'  , (d.getHours() > 11) ? d.getHours() - 12 : d.getHours());
})();
