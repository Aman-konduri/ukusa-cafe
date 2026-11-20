# UKUSA — Specialty Coffee, Ceremonial Matcha & Sensory Roastery

An interactive, WebGL-driven specialty café experience inspired by the fluid aesthetic and editorial motion design of Lusion.

## Features
- **Interactive Split Preloader:** `0% – 100%` extraction pressure counter with a split-shutter **UKUSA** wordmark reveal.
- **WebGL Liquid Espresso & Crema Playground:** Real-time Three.js custom GLSL shader that ripples, tilts, and distorts with cursor movement and clicks.
- **Custom Dynamic Cursor & Magnetic UI:** Morphing cursor with contextual labels (`RIPPLE`, `EXPLORE`, `DRAG`, `TASTE +`, `ADD +`, `BOOK`, `DISTORT`) and magnetic buttons/navigation.
- **Lusion-Style Scroll & Draggable Photo Stack:** Lenis smooth inertial scrolling, GSAP ScrollTrigger word-by-word illumination, and a tactile 3D photo stack you can grab, drag, and flick away.
- **Interactive Menu, Floating Preview & Live Customizer:** 5 categories, lerped cursor-trailing hover preview images, a live drink/food customizer modal, and a slide-out Order Bag drawer.
- **"Find Your Brew" Algorithmic Sommelier:** Interactive sensory sliders and thermal state toggles that recommend a bespoke drink + pastry bundle with one-click ordering.
- **The Space (Horizontal Scroll Gallery):** GSAP scroll-pinned horizontal architectural gallery.
- **Table Reservation Modal & Physics Wordmark:** Full booking flow above an oversized **UKUSA** wordmark whose individual letters bend and repel away from the cursor.
- **Procedural Web Audio Engine:** Optional ambient sound toggle in the header synthesizing warm vinyl room ambiance and soft UI clicks.

## Running Locally

Serve the directory with any static HTTP server:

```bash
python3 -m http.server 8123
```

Then open `http://localhost:8123` in your browser.
