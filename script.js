document.addEventListener("DOMContentLoaded", function () {
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  var status = document.getElementById("form-status");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(fieldId, message) {
    var error = document.getElementById(fieldId + "-error");
    var field = document.getElementById(fieldId);
    if (error) {
      error.textContent = message;
    }
    if (field) {
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var formData = new FormData(form);
    var values = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      subject: String(formData.get("subject") || "").trim(),
      message: String(formData.get("message") || "").trim()
    };

    setError("name", values.name ? "" : "Please enter your name.");
    setError("email", values.email ? "" : "Please enter your email address.");
    setError("subject", values.subject ? "" : "Please enter a subject.");
    setError("message", values.message ? "" : "Please include a message.");

    if (values.email && !emailPattern.test(values.email)) {
      setError("email", "Please enter a valid email address.");
    }

    var hasErrors = form.querySelectorAll('[aria-invalid="true"]').length > 0;
    if (hasErrors) {
      if (status) {
        status.textContent = "Please correct the highlighted fields before submitting.";
      }
      return;
    }

    console.log("Hall Integrated Systems contact message:", values);
    form.reset();

    if (status) {
      status.textContent = "Thank you. Your message has been received.";
    }
  });
});
