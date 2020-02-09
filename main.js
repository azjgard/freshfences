document.addEventListener("DOMContentLoaded", function() {
  var modalTemplate = document.querySelector("#modal-template").innerHTML;
  var modals = document.querySelectorAll(".modal");
  for (var i = 0; i < modals.length; i++) {
    initializeModal(modals[i]);
  }

  var viewWorkLinks = document.querySelectorAll(".view-work");
  for (var i = 0; i < viewWorkLinks.length; i++) {
    initializeViewWorkLink(viewWorkLinks[i]);
  }

  /**
   * Handle closing modals
   */
  document.body.addEventListener("click", function(e) {
    if (
      e.target.className.includes("modal") ||
      e.target.className.includes("close")
    ) {
      document.querySelector(".modal.open").classList.remove("open");
    }
  });

  initializeForm();

  function initializeModal(modal) {
    var imageMarkup = modal.innerHTML;
    modal.innerHTML = modalTemplate;
    modal.querySelector(".image-container").innerHTML = imageMarkup;

    var imageElements = modal.querySelectorAll(".image-container img");
    if (imageElements[0]) {
      imageElements[0].classList.add("active");
    }

    modal.querySelector(".slide-tracker .total").innerHTML =
      imageElements.length;

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

      modal.querySelector(".slide-tracker .current").innerHTML =
        currentIndex + 1;
    }
  }

  function initializeViewWorkLink(link) {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      var customerName = (link.dataset || {}).customerName;
      var modal = document.getElementById(customerName);
      if (modal) {
        modal.classList.add("open");

        var imageElements = modal.querySelectorAll(
          ".modal.open .image-container img"
        );

        var tallestImage = -1;
        for (var i = 0; i < imageElements.length; i++) {
          if (imageElements[i].clientHeight > tallestImage) {
            tallestImage = imageElements[i].clientHeight;
          }
        }

        modal.querySelector(".inner-modal").style.height = tallestImage + "px";
      }

      return false;
    });
  }
});

function initializeForm() {
  var form = document.getElementsByTagName("form")[0];

  var inputName = document.getElementById("name");
  var inputPhone = document.getElementById("phone/email");
  var inputNote = document.getElementById("note");

  form.addEventListener("submit", handleFormSubmit);

  function clearForm() {
    inputName.value = "";
    inputPhone.value = "";
    inputNote.value = "";
  }

  var formEnabled = true;

  function handleFormSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    ga("send", "event", "Form", "submission");

    console.log("Latest build deployed");

    if (!formEnabled) {
      return;
    }

    formEnabled = false;

    var data = {
      name: inputName.value,
      phone: inputPhone.value,
      note: inputNote.value
    };

    if (!inputName.value) {
      ga("send", "event", "Form", "submission", "missing-name");
      alert("Please enter a name; we need to know what to call you!");
      formEnabled = true;
      return;
    }

    if (!inputPhone.value) {
      ga("send", "event", "Form", "submission", "missing-phone-email");
      alert(
        "Please input a phone number or email; we need a way to contact you!"
      );
      formEnabled = true;
      return;
    }

    ga("send", "event", "Form", "submission", "success");
    sendPost(data);

    return false;
  }

  function sendPost(data) {
    var http = new XMLHttpRequest();

    http.open("POST", form.action, true);
    http.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    http.send(JSON.stringify(data));

    http.onreadystatechange = function() {
      if (http.readyState == 4) {
        switch (http.status) {
          case 200:
            alert(
              "Thank you! We received your request and will be in touch soon!"
            );
            clearForm();
            break;
          default:
            alert(
              "It looks like something went wrong! Please send us an email at contact@freshfences.com, or leave us a message at (480) 492-5279."
            );
            clearErrors();
            break;
        }

        formEnabled = true;
      }
    };
  }
}
