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
    var submitButton = form.querySelector('button[type="submit"]');
    var values = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      organization: String(formData.get("organization") || "").trim(),
      projectType: String(formData.get("projectType") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      honey: String(formData.get("_honey") || "").trim()
    };

    setError("name", values.name ? "" : "Please enter your name.");
    setError("email", values.email ? "" : "Please enter your email address.");
    setError("project-type", values.projectType ? "" : "Please select a project type.");
    setError("message", values.message ? "" : "Please include a project message.");

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

    if (values.honey) {
      form.reset();
      if (status) {
        status.textContent = "Thank you. Your automotive project inquiry has been received for review.";
      }
      return;
    }

    if (status) {
      status.textContent = "Submitting your inquiry...";
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    fetch(form.getAttribute("data-endpoint"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: values.name,
        email: values.email,
        _replyto: values.email,
        organization: values.organization || "Not provided",
        projectType: values.projectType,
        message: values.message,
        _subject: "New Hall Integrated Systems project inquiry",
        _template: "table",
        _honey: ""
      })
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Form submission failed.");
        }
        return response.json();
      })
      .then(function () {
        form.reset();
        if (status) {
          status.textContent = "Thank you. Your automotive project inquiry has been received for review.";
        }
      })
      .catch(function () {
        if (status) {
          status.textContent = "The form could not send right now. Please email info@hallintegratedsystems.com directly.";
        }
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  });
});
