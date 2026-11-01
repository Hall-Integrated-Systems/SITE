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

    var allowedDiscoveryEvents = [
      "hero_products_click",
      "product_direction_click",
      "founder_about_click"
    ];
    var discoveryEvent = String(link.getAttribute("data-clarity-event") || "");
    if (allowedDiscoveryEvents.indexOf(discoveryEvent) !== -1) {
      trackClarityEvent(discoveryEvent);
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
    function closeNavigation(restoreFocus) {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      if (restoreFocus) {
        navToggle.focus();
      }
    }

    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.addEventListener("click", function (event) {
      if (event.target.tagName === "A") {
        closeNavigation(false);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && navLinks.classList.contains("open")) {
        closeNavigation(true);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && navLinks.classList.contains("open")) {
        closeNavigation(false);
      }
    });
  }

  var form = document.getElementById("contact-form");
  if (!form) {
    return;
  }

  var status = document.getElementById("form-status");
  var submitButton = form.querySelector('button[type="submit"]');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Only accept a customer-initiated handoff from the Studio window that opened this page.
  var studioOrigin = "";
  var isLocalSite = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (window.opener) {
    var receivedStudioDetails = false;
    window.addEventListener("message", function (event) {
      var data = event.data;
      if (receivedStudioDetails || event.source !== window.opener || !data) return;
      var allowedOrigin = event.origin === "https://studio.hallintegratedsystems.com" || (isLocalSite && event.origin === "http://127.0.0.1:5186");
      if (!allowedOrigin) return;
      if (data.type === "his-plate-contact-hello") {
        studioOrigin = event.origin;
        window.opener.postMessage({ type: "his-plate-contact-ready" }, studioOrigin);
        return;
      }
      if (event.origin !== studioOrigin || data.type !== "his-plate-contact-details") return;
      if (typeof data.message !== "string" || !data.message.trim() || data.message.length > 5000 || typeof data.name !== "string" || data.name.length > 120 || typeof data.email !== "string" || data.email.length > 254) return;
      var nameField = form.querySelector('[name="name"]');
      var emailField = form.querySelector('[name="email"]');
      var subjectField = form.querySelector('[name="subject"]');
      var messageField = form.querySelector('[name="message"]');
      if (!nameField || !emailField || !subjectField || !messageField || nameField.value || emailField.value || subjectField.value || messageField.value) return;
      nameField.value = data.name;
      emailField.value = data.email;
      subjectField.value = "Speaker mounting plate inquiry";
      messageField.value = data.message;
      receivedStudioDetails = true;
      if (status) status.textContent = "Your Studio details are ready to review. Nothing has been sent yet.";
      window.opener.postMessage({ type: "his-plate-contact-received" }, studioOrigin);
    });
  }

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

  function getFormFieldValue(fieldName) {
    var field = form.querySelector('[name="' + fieldName + '"]');
    return String(field ? field.value : "").trim();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var values = {
      name: getFormFieldValue("name"),
      email: getFormFieldValue("email"),
      subject: getFormFieldValue("subject"),
      message: getFormFieldValue("message"),
      _honey: getFormFieldValue("_honey")
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

    if (status) {
      status.textContent = "Sending message...";
    }

    if (submitButton) {
      submitButton.disabled = true;
    }

    fetch(form.action, {
      method: (form.method || "POST").toUpperCase(),
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Form submission failed.");
        }
        return response.json().catch(function () {
          return {};
        });
      })
      .then(function () {
        form.reset();
        trackClarityEvent("contact_form_submit_success");

        if (status) {
          status.textContent = "Thank you. Your message has been received.";
        }
      })
      .catch(function () {
        if (status) {
          status.textContent = "Message could not be sent. Please email info@hallintegratedsystems.com directly.";
        }
      })
      .finally(function () {
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
  });
});
