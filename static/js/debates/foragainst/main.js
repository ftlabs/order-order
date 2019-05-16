/* eslint-env browser */

function initStickyHeader() {
  if (document.querySelector('.sticky')) {
    window.addEventListener('scroll', forAgainstStickyHeader);
  }
}

function forAgainstStickyHeader() {
  var stickyElement = document.querySelector('.sticky');
  var previousSiblingHeight = getHeightOfSiblings(stickyElement, 0);
  var y = window.scrollY;

  console.log(y);

  if (previousSiblingHeight > y) {
    stickyElement.classList.add('hide');
  } else {
    if (stickyElement.classList.contains('hide')) {
      stickyElement.classList.remove('hide');
    }
  }
}

function getHeightOfSiblings(sibling, height) {
  if (sibling.previousElementSibling !== null) {
    height = height + sibling.previousElementSibling.offsetHeight;
    height = getHeightOfSiblings(sibling.previousElementSibling, height);
  }
  return height;
}

initStickyHeader();
