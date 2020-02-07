document.addEventListener("DOMContentLoaded", function() {
  var modalTemplate = document.querySelector("#modal-template").innerHTML;
  var modals = document.querySelectorAll(".modal");

  for (var i = 0; i < modals.length; i++) {
    initializeModal(modals[i], i);
  }

  function initializeModal(modal, modalId) {
    var imageMarkup = modal.querySelector("noscript").innerHTML;
    modal.innerHTML = modalTemplate;
    modal.querySelector(".image-container").innerHTML = imageMarkup;

    var imageElements = modal.querySelectorAll(".image-container img");
    imageElements[0].classList.add("active");

    var currentIndex = 0;

    modal.querySelector(".left").addEventListener("click", changeSlide);
    modal.querySelector(".right").addEventListener("click", changeSlide);

    function changeSlide(e) {
      var direction = e.target.className.includes("left") ? "left" : "right";

      if (direction === "left") {
        if (currentIndex <= 0) {
          currentIndex = imageElements.length - 1;
        } else {
          currentIndex--;
        }
      } else {
        if (currentIndex >= imageElements.length - 1) {
          currentIndex = 0;
        } else {
          currentIndex = currentIndex + 1;
        }
      }

      render(currentIndex);
    }

    function render() {
      for (var i = 0; i < imageElements.length; i++) {
        if (i === currentIndex) {
          (function(i) {
            setTimeout(function() {
              imageElements[i].classList.add("active");
            }, 500);
          })(i);
        } else {
          imageElements[i].classList.remove("active");
        }
      }
    }
  }
});
