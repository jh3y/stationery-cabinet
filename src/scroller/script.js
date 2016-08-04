;(function(){
  var scroller = document.querySelector('.scrolled__container');
  var scrolled = 0;
  var LIMIT = scroller.scrollHeight;
  var SCROLLER = setInterval(function() {
    scrolled++;
    scroller.scrollTop = scrolled;
    if (scrolled === LIMIT) clearInterval(SCROLLER);
  }, 50);
})();
