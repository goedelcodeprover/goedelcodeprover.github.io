window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  if (!image) return;
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  var wrapper = document.getElementById('interpolation-image-wrapper');
  if (wrapper) { wrapper.innerHTML = ''; wrapper.appendChild(image); }
}

$(document).ready(function() {
  $(".navbar-burger").click(function() {
    $(".navbar-burger").toggleClass("is-active");
    $(".navbar-menu").toggleClass("is-active");
  });

  var options = {
    slidesToScroll: 1,
    slidesToShow: 3,
    loop: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 3000,
  };

  if (typeof bulmaCarousel !== 'undefined') {
    var carousels = bulmaCarousel.attach('.carousel', options);
    for (var i = 0; i < carousels.length; i++) {
      carousels[i].on('before:show', function(state) {});
    }
  }

  var element = document.querySelector('#my-element');
  if (element && element.bulmaCarousel) {
    element.bulmaCarousel.on('before-show', function(state) {});
  }

  preloadInterpolationImages();
  var slider = document.getElementById('interpolation-slider');
  if (slider) {
    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(parseInt(this.value, 10));
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);
  }

  if (typeof bulmaSlider !== 'undefined') bulmaSlider.attach();
});
