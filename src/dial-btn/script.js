;(function(){
  const CLASSES = {
    BTN   : 'dial-btn',
    ACTIVE: 'dial-btn--active',
    OPTION: 'dial-btn--option'
  };
  var btns = document.querySelectorAll(`.${CLASSES.BTN}:not(.${CLASSES.OPTION})`);
  var toggleActive = function(e) {
    const btn = e.currentTarget;
    var processClick = function(evt) {
      if (e !== evt) {
        btn.classList.remove(CLASSES.ACTIVE);
        btn.IS_ACTIVE = false;
        document.removeEventListener('click', processClick);
      }
    }
    if (!btn.IS_ACTIVE) {
      btn.IS_ACTIVE = true;
      btn.classList.add(CLASSES.ACTIVE);
      document.addEventListener('click', processClick);
    }
  };
  /* Bind primary buttons */
  [].map.call(btns, function(btn) {
    btn.addEventListener('click', toggleActive);
  });
  /* Bind a random listener to ensure underlying action would still be called */
  const randomBtns = document.querySelectorAll(`.${CLASSES.OPTION}`);
  [].map.call(randomBtns, function(btn) {
    btn.addEventListener('click', function(e) {
      console.info(`Clicked ${e.currentTarget.getAttribute('data-option')}`);
    });
  });
})();
