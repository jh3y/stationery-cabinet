;(function(){
  document.body.className = 'animate';
  const button = document.querySelector('button');
  button.addEventListener('click', function() {
    document.body.className = (document.body.className.indexOf('animate') !== -1) ? '' : 'animate';
  });
})();
