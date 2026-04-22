# Fast Food Restaurant Website

A reusable, mobile-first restaurant website built with HTML, CSS, and vanilla JavaScript. It is optimized for online orders, WhatsApp orders, click-to-call traffic, and quick menu browsing.

## Files

- `index.html` - page structure and SEO tags
- `assets/css/styles.css` - responsive UI, animations, dark mode, sticky CTAs
- `assets/js/main.js` - JSON loading, menu rendering, cart, WhatsApp checkout
- `data/restaurant.json` - restaurant name, menu, prices, images, offers, reviews, contact details

## Customize For A New Restaurant

1. Open `data/restaurant.json`.
2. Change `name`, `slogan`, `phone`, `whatsapp`, `address`, `hours`, and `mapQuery`.
3. Replace `heroImage` and menu item `image` URLs with restaurant food photos.
4. Edit `categories`, `menu`, `offers`, `benefits`, and `reviews`.
5. Update the SEO description in `index.html` if you want a fully customized search preview.

## Image Notes

The demo uses optimized remote Unsplash image URLs. For production, replace them with compressed local WebP or AVIF images in an `assets/images` folder for maximum speed and ownership.

## WhatsApp Checkout

The cart builds a ready-to-send WhatsApp message with item quantities, total price, customer name, and notes. Set the `whatsapp` value in `data/restaurant.json` using international format, for example `+15551234567`.

## Running Locally

Because the site loads JSON with `fetch`, run it with a local server instead of opening the HTML file directly.

Example:

```bash
npm start
```

Then open:

```text
http://127.0.0.1:4173
```

You can also use any static server from this folder.
