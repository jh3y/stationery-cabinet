;(function(){
  const titleMain = document.querySelector('h1');
  const setFont = (e) => {
    const val     = e.target.innerText;
    const first   = val.charAt(0);
    const last    = val.charAt(val.length - 1);
    const fill    = val.substring(1, val.length - 1);
    const content = `<span>${first}</span>${fill}<span>${last}</span>`;
    e.target.innerHTML = content;
  };
  titleMain.addEventListener('blur', setFont);
  console.info(sum);
})();
