function trackClarityEvent(eventName) {
  if (typeof window.clarity === "function") {
    window.clarity("event", eventName);
  }
}

function setClarityTag(key, value) {
  if (typeof window.clarity === "function") {
    window.clarity("set", key, value);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setClarityTag("site_type", "public_marketing");
  setClarityTag("business", "hall_integrated_systems");
  setClarityTag("hostname", window.location.hostname);
  setClarityTag("path", window.location.pathname);

  var pagePath = window.location.pathname.toLowerCase();
  var pageName = pagePath.split("/").pop();

  if (pagePath.indexOf("/products/") !== -1 && pageName && pageName !== "products.html") {
    trackClarityEvent("product_page_view");
  }

  if (pageName === "design-fabrication.html") {
    trackClarityEvent("design_fabrication_view");
  }

  if (pageName === "404.html") {
    trackClarityEvent("not_found_view");
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!target || typeof target.closest !== "function") {
      return;
    }

    var link = target.closest("a[href]");
    if (!link) {
      return;
    }

    var rawHref = String(link.getAttribute("href") || "").trim();
    var lowerHref = rawHref.toLowerCase();

    if (lowerHref.indexOf("mailto:") === 0) {
      trackClarityEvent("email_click");
      return;
    }

    if (lowerHref.indexOf("tel:") === 0) {
      trackClarityEvent("phone_click");
      return;
    }

    var destination;
    try {
      destination = new URL(link.href, window.location.href);
    } catch (error) {
      return;
    }

    var hostname = destination.hostname.toLowerCase();
    var isHallHostname = hostname === "hallintegratedsystems.com" || hostname.endsWith(".hallintegratedsystems.com");

    if (hostname === "studio.hallintegratedsystems.com") {
      trackClarityEvent("studio_launch_click");
      return;
    }

    if (
      /(^|\/)contact(?:\.html)?(?:$|[?#])/i.test(rawHref) ||
      destination.hash.toLowerCase().indexOf("contact") !== -1
    ) {
      trackClarityEvent("contact_click");
    }

    if ((destination.protocol === "http:" || destination.protocol === "https:") && !isHallHostname) {
      trackClarityEvent("external_link_click");
    }
  });

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
