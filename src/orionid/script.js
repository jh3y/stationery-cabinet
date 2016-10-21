(function() {
  var reset = function(e) {
    e.target.className = '';
    setTimeout(function() {
      e.target.className = 'shard';
    }, 0);
  };
  var shards = document.querySelectorAll('.shard');
  for(var i = 0; i < shards.length; i++) {
    shards[i].addEventListener('animationend', reset);
  }
}());
