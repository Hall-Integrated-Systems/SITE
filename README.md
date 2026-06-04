# Hall Integrated Systems Website

Public static website for Hall Integrated Systems, LLC, a Florida-based automotive technology startup focused on 3D-printed automotive audio installation hardware, 12V electronics installation components, and prototype automotive component development.

## Purpose

This site supports vendor review, startup credibility, Autodesk Fusion Startup review, and automotive product-development inquiries. Content should remain focused on practical vehicle electronics hardware, car audio installation hardware, clean wiring, 12V accessory planning, custom mounting concepts, installation layout correction, and prototype automotive components.

## Static Site Files

- `index.html` - home page
- `about.html` - company overview and workflow
- `design-fabrication.html` - Design & Fabrication page for prototype hardware development
- `products.html` - products and prototype concepts
- `products/his-ca-001a-cable-comb.html` - HIS-CA-001A product concept detail page
- `contact.html` - automotive project inquiry form
- `privacy.html` - simple privacy information
- `sitemap.xml` - production sitemap for search engines
- `robots.txt` - crawler access file pointing to the sitemap
- `style.css` - shared site styling
- `script.js` - mobile navigation and contact form handling
- `assets/logo-h-circuit-nohalo.png` - finalized H circuit logo used in the header and temporary favicon/touch icon
- `assets/his-product-lineup-banner.jpg` - default product lineup banner used as a visual credibility asset
- `assets/his-product-lineup-banner_text_friendly.jpg` - text-safe product lineup banner reserved for layouts with direct text overlay
- `assets/his-product-lineup-banner.png` - large master/reference banner asset retained in the project but not used as the default website image
- `assets/products/his-ca-001a/` - expected location for HIS-CA-001A product concept renders

## Run Locally

Open `index.html` directly in a browser. No build tools, package installation, external fonts, CDNs, or third-party dependencies are required.

For local static-server testing, you can also run:

```powershell
py -m http.server 8080 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8080/index.html`.

## Deployment Notes

Deploy the project as plain static files to any static host. Keep all page links relative so the site works from the domain root or a simple static directory.

Before deployment, confirm that all pages load, `sitemap.xml` and `robots.txt` are reachable, the mobile navigation works, and the contact form validation still displays the thank-you message without reloading the page.

## Product Images

The HIS-CA-001A product image lives at `assets/products/his-ca-001a/UPSCALED_HIS-CA-001A_AIConcept_03_FinalDirection_ProductShot.png`.

Images on the site are concept visualizations for product-development planning only. They should not be described as finished inventory, production products, tested products, or available product unless that status is explicitly true and documented.

## Content Reminder

Keep the website strictly automotive-focused. Do not add smart home, networking, small business IT, home automation, general device setup, or other non-automotive technology offerings. Do not claim prototype products are tested, shipped, or available as production products unless that is explicitly true and documented.
