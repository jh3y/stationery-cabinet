const CLASSES = {
  LAYOUT: 'layout',
  LAYOUT_ACTIVE: 'layout--active',
  MODULE: 'layout-module',
  CONTENT: 'layout-module__content',
  CONTENT_ACTIVE: 'layout-module__content--active',
  CLOSE: 'layout-module__close',
  CLOSE_ACTIVE: 'layout-module__close--active',
  ACTIVE: 'layout-module--active',
  CLOSING: 'layout-module--closing'
};

const layout = document.querySelector(`.${CLASSES.LAYOUT}`);

const deactivateModule = function(e) {
  const current = document.querySelector(`.${CLASSES.ACTIVE}`);
  const closer  = current.querySelector(`.${CLASSES.CLOSE}`);
  const content = current.querySelector(`.${CLASSES.CONTENT}`);
  const reset = function(e) {
    // remove active class and tidy up event listeners.
    current.addEventListener('click', activateModule, false);
    current.removeEventListener('animationend', reset);
    current.removeEventListener('webkitAnimationEnd', reset);
    closer.removeEventListener('click', deactivateModule);
    closer.className = CLASSES.CLOSE;
    current.className = CLASSES.MODULE;
    layout.className = `${CLASSES.LAYOUT} ${CLASSES.LAYOUT_ACTIVE}`;
  }
  const closeModule = function() {
    closer.removeEventListener('transitionend', closeModule);
    closer.removeEventListener('webkitTransitionEnd', closeModule);
    current.addEventListener('animationend', reset);
    current.addEventListener('webkitAnimationEnd', reset);
    current.className += ` ${CLASSES.CLOSING}`;
  }
  closer.addEventListener('transitionend', closeModule);
  closer.addEventListener('webkitTransitionEnd', closeModule);
  closer.className = CLASSES.CLOSE;
  content.className = CLASSES.CONTENT;
}

const onOpen = function(e) {
  const clicked = e.target;
  const closer = clicked.querySelector(`.${CLASSES.CLOSE}`);
  const content = clicked.querySelector(`.${CLASSES.CONTENT}`);
  closer.addEventListener('click', deactivateModule, false);
  closer.className += ` ${CLASSES.CLOSE_ACTIVE}`;
  content.className += ` ${CLASSES.CONTENT_ACTIVE}`;
  clicked.removeEventListener('animationend', onOpen);
  clicked.removeEventListener('webkitAnimationEnd', onOpen);
}

const activateModule = function(e) {
  const clicked = e.currentTarget;
  clicked.className = `${CLASSES.MODULE} ${CLASSES.ACTIVE}`;
  layout.className = CLASSES.LAYOUT;
  clicked.removeEventListener('click', activateModule);
  clicked.addEventListener('animationend', onOpen);
  clicked.addEventListener('webkitAnimationEnd', onOpen);
}

const modules = layout.querySelectorAll(`.${CLASSES.MODULE}`);
[].map.call(modules, function(module) {
  module.addEventListener('click', activateModule);
})
