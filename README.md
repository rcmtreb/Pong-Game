# Simple Pong Game 

Welcome! This is a very small Pong-style game you can open in your browser and tinker with — no prior web experience required.

What this project is
- A tiny pong clone using HTML, CSS and JavaScript.
- Works on desktop and mobile (mouse/touch).
- Simple code so you can learn by changing things.

Files you care about
- index.html — page structure and menus (change the welcome message here).
- style.css — looks and layout (change colors and sizes here).
- game.js — game code (controls, ball speed, pause, and game loop).

How to run (two easy ways)
1. Double-click
   - Put the three files in one folder and double-click index.html to open it in your browser.
2. Local web server (recommended for mobile testing)
   - Open a terminal in the project folder and run:
     - Python 3: python -m http.server 8000
     - Then open http://localhost:8000 in your browser.

Basic controls
- Start: Click Start on the main menu.
- Move left paddle: Move the mouse over the canvas (or drag on mobile).
- Pause / Resume: Press Space on desktop, or tap the floating button on mobile.
- Retry / Quit: Use the Game Over or Pause overlay.

Small edits you can make right away (where to change things)
- Change the welcome text:
  - Open index.html and edit the paragraph with class="menu-welcome".
- Change how fast the ball speeds up:
  - Open game.js and edit:
    - speedRatePerSecond — how fast the game gets harder over time (default ~0.015).
    - maxSpeedFactor — cap for how fast it can get (default 3.0).
- Stop footer year being automatic:
  - The footer year is set by game.js (new Date().getFullYear()). Remove or edit that code if you want a fixed year.

Tips for learning
- Make one small change at a time and reload the page to see the effect.
- Use console.log(...) in game.js to print values (like currentSpeedFactor) while you test.
- If something breaks, open the browser DevTools (F12) and check the Console for error messages.

Want help adding something?
- I can add a difficulty selector in the menu, a simple score counter, or short inline comments in game.js to explain each function. Tell me which one and I’ll update the files.

Enjoy exploring — small edits are the fastest way to learn web games!
