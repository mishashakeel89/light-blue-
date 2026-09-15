# Royal Reveal

"I have uploaded my Final Invitation Image. I want this to be the core visual asset. Please rebuild the app using these precise engineering instructions:

1. THE GATEWAY (Initial State):

Use the Royal Gate Image as the landing screen.

Center a 'Gold Unlock' button. When clicked, split the gate image into two halves (Left/Right) and animate them sliding off-screen to reveal the invitation.

2. THE INVITATION SCENE (The Background):

Once the gate is gone, show the Final Invitation Image (the one with the roses) as the global background-image for the entire app.

Set background-size: cover and background-position: center.

Constraint: Do not add any extra color gradients, filters, or overlays. The image must look exactly like the high-quality file I uploaded.

3. TEXT OVERLAY (Precision):

Do not render text inside the image. Overlay the following text on top of the image in the exact positions relative to the floral layout.

Use the following text (Strictly NO dashes or hyphens, use pipes |):

بسم الله الرحمن الرحيم

We joyfully invite you to the Valima Ceremony of

Aiman Zaffar | Muhammad Adeel (Use 'Pinyon Script' Gold)

The Invitation | The Grande Banquet

Sunday | 12 May | 2026

At 7 PM | Dinner to follow at 8 PM

Typography: Use the Gold and Ivory color palette from the original image for the text. Use text-shadow or drop-shadow for readability.

4. THE 'DIAMOND DUST' INTERACTION:

Retain the global 'click-to-firework' interaction over the invitation.

Visuals: Pure white, diamond-dust sparks. No colors.

Physics: Particles must burst from the click point, have a 'flash' at the center, trailing tails, and slow gravity.

Layering: Fireworks must render BEHIND the Guestbook overlay but IN FRONT of the invitation image.

5. GUESTBOOK & UTILITY:

Add an elegant 'Guestbook' button at the bottom.

When opened: Add a 'Backdrop Dimmer' (bg-black/60).

Add a close 'X' icon in the top right.

Clicking the dimmed background must close the Guestbook overlay.

Guestbook logic: Use Supabase to show 10 messages per page with a 'View More' button.

6. RESPONSIVENESS & CENTERING:

All text and containers must be centered using mx-auto and max-w-[92%].

The 'Invitation Image' must be fully responsive, ensuring no white space on the sides and that the floral details remain visible.

This must be a polished, cinematic experience where the 'Gate' opens into a luxury, static invitation page

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://gate-to-glory-invite.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4733ae21-2a77-4e68-bb6c-3290ea618dc6).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
