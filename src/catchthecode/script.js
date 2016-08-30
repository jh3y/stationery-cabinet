;(function(){
  const btn = document.querySelector('button');
  const pen = document.querySelector('.pen');
  const replay = function() {
    pen.className = 'pen';
    setTimeout(function(){
      pen.className = 'pen animated';
    }, 0)
  };
  btn.addEventListener('click', replay);
})();
