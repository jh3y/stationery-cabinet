(function(){
  const $shutter = document.getElementById('shutter'),
        $booth = document.querySelector('.booth');
  $shutter.addEventListener('click', function() {
    $booth.className = 'booth';
    setTimeout(function() {
      $booth.className += ' booth--shooting';
    }, 500);

  });

}());