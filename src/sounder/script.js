;(function(){
  const playSound = (e) => {
    switch(e.keyCode) {
      case 37:
        const b = new Audio('./record1.wav');
        b.playbackRate = 2;
        b.play();
        break;
      case 39:
        const a = new Audio('./record1.wav');
        a.playbackRate = 2;
        a.play();
        break;
      default:
        return;
    }
  };

  document.body.addEventListener('keydown', playSound, false);

})();
