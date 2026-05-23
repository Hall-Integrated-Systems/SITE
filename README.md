# Hall Integrated Systems Website

Public static website for Hall Integrated Systems, LLC, a Florida-based automotive technology startup focused on vehicle electronics integration and prototype automotive component development.

## Purpose

This site supports vendor review, startup credibility, and automotive technology customer inquiries. Content should remain focused on practical vehicle electronics solutions, dashcam integration support, clean wiring, automotive audio integration support, 12V accessory planning, custom mounting concepts, install cleanup, and prototype automotive components.

## Static Site Files

- `index.html` - home page
- `about.html` - company overview and workflow
- `services.html` - automotive electronics service areas
- `products.html` - products and prototype concepts
- `contact.html` - automotive project inquiry form
- `privacy.html` - simple privacy information
- `style.css` - shared site styling
- `script.js` - mobile navigation and contact form handling
- `assets/logo.png` - site logo

## Run Locally

Open `index.html` directly in a browser. No build tools, package installation, or third-party dependencies are required.

For local static-server testing, you can also run:

```powershell
py -m http.server 8080 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8080/index.html`.

## Deployment Notes

Deploy the project as plain static files to any static hosting service. Keep all page links relative so the site works from the domain root or a simple static directory.

Before deployment, confirm that all pages load, the mobile navigation works, and the contact form validation still displays the thank-you message without reloading the page.

## Content Reminder

Keep the website strictly automotive-focused. Do not add smart home, networking, small business IT, home automation, general device setup, or other non-automotive technology services.
