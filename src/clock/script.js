;(function(){
  console.info('Initiating clock');
  const clock = document.querySelector('.clock');
  const d = new Date();
  clock.setAttribute('start-seconds', d.getSeconds());
  clock.setAttribute('start-minutes', d.getMinutes());
  clock.setAttribute('start-hours'  , (d.getHours() > 11) ? d.getHours() - 12 : d.getHours());
})();
