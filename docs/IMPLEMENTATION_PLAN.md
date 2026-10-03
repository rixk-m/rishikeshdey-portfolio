# PORTFOLIO — IMPLEMENTATION PLAN

## PROJECT STATUS

This is a premium personal portfolio for a creative developer and
cinematographer.

The website should feel like a combination of:
- Apple-inspired minimalism
- Samsung One UI-inspired interaction principles
- Premium editorial design
- Cinematic photography
- Experimental frontend development
- Sophisticated motion design

The final result must NOT feel like a generic developer portfolio.

It should feel highly intentional, premium, modern, cinematic and interactive.

---

# 1. EXISTING PROJECT STRUCTURE

PORTFOLIO ANTIGRAVITY/

├── docs/
├── public/
│   └── assets/
│       ├── cinematography/
│       ├── icons/
│       ├── personal/
│       ├── projects/
│       └── references/
└── src/
    ├── animations/
    ├── components/
    ├── data/
    ├── lib/
    ├── sections/
    └── styles/

IMPORTANT:
- Do NOT delete existing folders.
- Do NOT rename existing folders.
- Do NOT move existing assets unless absolutely necessary.
- Do NOT create duplicate folder structures.
- Use the existing architecture.

---

# 2. ASSET ORGANIZATION

All visual assets are located inside:

public/assets/

## cinematography/
Contains photography thumbnails and one showreel video.
Use the actual files in the Cinematography section.

## icons/
Currently empty.
Do not populate it with unnecessary assets.

## personal/
Contains:
- hero photograph
- CK0 photograph
- CK2 photograph

Use the hero photograph as the primary personal visual identity.
Use CK0 and CK2 where appropriate in About/Personal storytelling.

## projects/
Currently intentionally empty.
Keep it empty until real project assets are supplied.
Do NOT invent project screenshots or fake project content.

## references/
Contains the work-scroll reference video.
Use it as inspiration for interaction and motion, not as copied content.

---

# 3. CORE DESIGN PHILOSOPHY

Combine:
- Apple-inspired clarity, whitespace, premium typography and cinematic presentation
- Samsung One UI-inspired comfortable spacing, clear hierarchy and tactile interaction
- Experimental creative-web interactions and cinematic motion

Do not copy Apple or Samsung directly.

Avoid:
- generic SaaS layouts
- generic portfolio cards
- excessive glassmorphism
- excessive gradients
- neon overload
- unnecessary 3D
- excessive rounded cards
- huge amounts of text
- template-like layouts
- random animations

---

# 4. VISUAL LANGUAGE

The visual language should be:
- premium
- cinematic
- minimal
- editorial
- modern
- slightly experimental
- sophisticated
- highly polished

---

# 5. TYPOGRAPHY

Use premium editorial typography:
- large display typography for major statements
- clean readable body typography
- strong hierarchy
- controlled letter spacing
- responsive typography

Prefer one primary font family or a maximum of two when justified.

---

# 6. COLOR SYSTEM

Create a centralized design system.

Base direction:
- deep black / near-black
- warm or neutral white
- subtle gray tones
- carefully selected accent if necessary

Keep colors restrained and consistent.

---

# 7. RESPONSIVE DESIGN

Design intentionally for:
- desktop
- laptop
- tablet
- mobile

Do not simply shrink desktop.

Pay special attention to:
- navigation
- hero composition
- typography
- photography
- horizontal sections
- video
- touch interactions
- performance

---

# 8. MAIN SITE STRUCTURE

Final portfolio should contain:
1. Navigation
2. Hero
3. About / Introduction
4. Selected Work / Projects
5. Cinematography
6. Experimental / Creative section
7. Contact
8. Footer

---

# 9. NAVIGATION

Create a premium navigation system:
- minimal
- responsive
- accessible
- smooth navigation
- desktop and mobile versions
- active section awareness where useful
- subtle entrance animation

On mobile, use a polished compact menu.

---

# 10. HERO SECTION

Use the real hero photograph from public/assets/personal/.

Communicate:
Creative Developer
+
Cinematographer
+
Frontend / Digital Experience Creator

Use:
- strong headline
- short supporting statement
- subtle interaction
- scroll indicator
- refined navigation
- hero image treatment
- entrance animation

Keep it cinematic and concise.

---

# 11. ABOUT SECTION

Create a concise About / Introduction section communicating:
- creative development
- frontend engineering
- interaction design
- visual storytelling
- cinematography

Use CK0 and/or CK2 where appropriate.

Do not write a huge biography.

Use scroll-triggered reveals and image transitions.

---

# 12. SELECTED WORK / PROJECTS

The projects directory is currently empty.

Do NOT invent projects, screenshots, or fake project information.

Build architecture for:
- project data
- project presentations
- project detail navigation
- image support
- technology metadata
- GitHub link
- live demo link
- future expansion

The empty state should look intentional.

Real projects will be added later.

---

# 13. CINEMATOGRAPHY SECTION

Use the actual files from public/assets/cinematography/.

Make it feel like a cinematic photography experience rather than a basic grid.

Possible structure:
- introductory statement
- large photography sequence
- horizontal/cinematic scrolling
- image transitions
- captions where appropriate
- showreel
- visual storytelling

Use the actual showreel video.

Possible effects:
- horizontal movement
- scale transitions
- parallax
- opacity transitions
- clipping/masking
- text reveals

---

# 14. SHOWREEL

Give the showreel an important visual placement.

Possible presentation:
- large cinematic video
- scroll-triggered reveal
- muted autoplay only where appropriate
- clear controls
- mobile-friendly behavior

Respect browser autoplay restrictions and performance.

---

# 15. EXPERIMENTAL / CREATIVE SECTION

Create one section demonstrating frontend creativity.

Possible elements:
- interactive typography
- cursor-reactive elements
- magnetic buttons
- scroll-linked transformations
- experimental layout
- visual transitions

Keep effects sophisticated and purposeful.

---

# 16. CONTACT SECTION

Create a simple premium contact experience:
- short invitation to collaborate
- email/contact method
- social links if provided
- strong typography
- subtle interaction

Avoid unnecessary contact forms unless useful.

---

# 17. FOOTER

Minimal footer containing:
- name
- copyright
- social links
- contact
- small navigation if appropriate

---

# 18. MOTION SYSTEM

Use src/animations/ for reusable animation definitions/utilities when appropriate.

Potential motion:
- page entrance
- staggered text reveal
- image reveal
- section reveal
- parallax
- scale transitions
- opacity transitions
- hover interaction
- magnetic interaction
- smooth navigation
- cinematic video reveal

Motion must be smooth, purposeful, performant and responsive.

Support reduced motion.

---

# 19. COMPONENT ARCHITECTURE

Use src/components/ for reusable UI components.

Possible components:
- Navigation
- Button
- MagneticButton
- SectionHeading
- ImageReveal
- MediaFrame
- ProjectCard
- SocialLinks
- CursorInteraction
- VideoPlayer
- LoadingScreen

Only create components when reuse/separation genuinely makes sense.

---

# 20. SECTION ARCHITECTURE

Use src/sections/ for major sections.

Possible structure:
- Hero
- About
- Projects
- Cinematography
- Creative
- Contact
- Footer

---

# 21. DATA ARCHITECTURE

Use src/data/ for structured content:
- site information
- navigation
- social links
- project data
- cinematography metadata
- contact information

Do not hardcode repeated content throughout components.

---

# 22. LIB

Use src/lib/ for reusable utilities:
- helper functions
- media utilities
- scroll utilities
- formatting functions
- device helpers only when genuinely necessary

---

# 23. STYLES

Use src/styles/ for:
- CSS variables
- typography
- colors
- spacing
- global resets
- reusable visual utilities

Centralize repeated design values.

---

# 24. ACCESSIBILITY

The final site must have:
- semantic HTML
- keyboard navigation
- accessible buttons
- meaningful alt text
- proper focus states
- sufficient contrast
- reduced-motion support
- accessible video controls
- sensible heading hierarchy

---

# 25. PERFORMANCE

Optimize:
- image loading
- lazy loading
- video loading
- animation performance
- layout stability
- unnecessary JavaScript
- excessive DOM elements

Prefer transform/opacity-based animation where possible.

---

# 26. BROWSER / DEVICE QUALITY

Check:
- Chrome
- Safari
- mobile browser behavior
- desktop viewport
- mobile viewport
- touch interaction

Do not rely on hover for essential functionality.

---

# 27. IMPLEMENTATION PHASES

Implement one phase at a time. Never implement all phases in one request.

## PHASE 0 — PROJECT AUDIT

Goal: understand the existing project.

Tasks:
- inspect framework
- inspect dependencies
- inspect source
- inspect assets
- inspect configuration
- inspect current run/build state

Do not build the portfolio yet.

---

## PHASE 1 — FOUNDATION

Build:
- global CSS
- typography system
- color system
- spacing system
- responsive foundation
- base layout
- smooth scrolling foundation if appropriate
- reduced-motion foundation

Do not build major sections yet.

---

## PHASE 2 — CORE COMPONENTS

Build reusable components:
- navigation
- buttons
- typography components
- media components
- section wrappers
- interaction primitives

---

## PHASE 3 — HERO

Build the complete Hero experience using the actual personal hero image.

Implement:
- typography
- layout
- navigation integration
- entrance animation
- image animation
- scroll indicator
- responsive behavior

---

## PHASE 4 — ABOUT

Build the About / Introduction section using real personal images where appropriate.

Implement:
- editorial layout
- concise content
- image transitions
- scroll reveals
- responsive layout

---

## PHASE 5 — CINEMATOGRAPHY

Build the major cinematography experience using real assets.

Implement:
- cinematic gallery
- scroll interaction
- photography transitions
- showreel
- responsive behavior
- media optimization

---

## PHASE 6 — PROJECT ARCHITECTURE

Build the Projects system without inventing projects.

Create:
- project data structure
- project presentation components
- project section
- empty state
- future image support
- GitHub/live links support

---

## PHASE 7 — CREATIVE INTERACTION

Build the experimental frontend section.

Implement selected:
- magnetic interactions
- cursor interactions
- typography interactions
- scroll transformations
- advanced image transitions

Only use effects that improve the experience.

---

## PHASE 8 — CONTACT + FOOTER

Build:
- contact section
- social links
- footer
- closing visual experience

---

## PHASE 9 — RESPONSIVE POLISH

Review every section on:
- desktop
- tablet
- mobile

Fix:
- spacing
- typography
- image sizing
- navigation
- touch interaction
- video behavior
- overflow
- horizontal scrolling

---

## PHASE 10 — PERFORMANCE + ACCESSIBILITY

Audit:
- performance
- loading behavior
- image optimization
- video behavior
- accessibility
- keyboard navigation
- reduced motion
- semantic HTML
- console errors

---

## PHASE 11 — FINAL VISUAL POLISH

Perform final design pass:
- spacing consistency
- typography
- visual hierarchy
- animation timing
- transitions
- hover states
- mobile polish
- cinematic feel
- overall consistency

Do not redesign unnecessarily. Polish what exists.

---

# 28. IMPORTANT CLAUDE WORKFLOW

Claude must follow these rules for EVERY phase:

1. Read this file before beginning a phase.
2. Inspect the current implementation before changing anything.
3. Continue from the existing implementation.
4. Do not recreate completed work.
5. Do not delete existing assets.
6. Do not rename existing assets.
7. Do not create fake content.
8. Do not invent projects.
9. Do not unnecessarily install dependencies.
10. Reuse existing dependencies when possible.
11. Keep the architecture clean.
12. After implementing a phase:
    - run the project
    - check for errors
    - fix errors caused by the implementation
    - verify the phase works
13. Do not start the next phase automatically.
14. After completing the requested phase, STOP and report:
    - files created
    - files modified
    - functionality implemented
    - dependencies added, if any
    - errors fixed
    - anything needing user input

Then wait for the next phase prompt.

---

# 29. PROJECT CONTENT RULE

Never fabricate:
- projects
- achievements
- clients
- companies
- job titles
- statistics
- testimonials
- awards
- professional claims

If information is not provided, create architecture but leave content configurable.

---

# 30. ASSET RULE

Always inspect actual asset filenames before referencing them.

Never assume a filename.

Never write code using a guessed asset filename.

Use the actual files present in public/assets/.

---

# 31. PROJECT PRIORITY

Foundation
→ Components
→ Hero
→ About
→ Cinematography
→ Projects Architecture
→ Creative Interaction
→ Contact
→ Responsive Polish
→ Performance
→ Final Polish

Actual project content will be added later.

---

# 32. DEFINITION OF DONE

The portfolio is complete when:
- all major sections work
- navigation works
- real personal assets are used
- cinematography assets are integrated
- showreel works
- project architecture is ready
- mobile layout works
- animations are smooth
- accessibility is reasonable
- performance is reasonable
- there are no implementation-related build errors
- visual language is consistent
- the website feels premium and intentional

# END OF IMPLEMENTATION PLAN
