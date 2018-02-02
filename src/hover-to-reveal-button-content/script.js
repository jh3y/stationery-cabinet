const scrollrs = document.querySelectorAll('.scrollr');
for (let i = 0; i < scrollrs.length; i++) {
  let scrollr = scrollrs[i];
  let scrollrStyle = window.getComputedStyle(scrollr);
  let offset = scrollr.offsetWidth - (parseInt(scrollrStyle.paddingLeft, 10) + parseInt(scrollrStyle.paddingRight, 10));
  let inner = scrollr.querySelector('.scrollr__inner');
  inner.style.width = (inner.offsetWidth - offset) + 'px';
}