# Asphalt Legends Unite Tracker – Front End

![Static Badge](https://img.shields.io/badge/License-MIT-yellow)

A **fan-made** website for tracking progress in *Asphalt Legends Unite*.  
This repository contains the **front end** (React + Vite + TypeScript + SCSS). It consumes APIs from separate back-end services for car data, user profiles, feedback, and per-car comments.

> **Disclaimer**: Not affiliated with or endorsed by Gameloft. All trademarks and game assets are the property of their respective owners.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Roadmap](#roadmap)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Repository Layout](#repository-layout)
- [Contributing](#contributing)
- [Acknowledgments](#acknowledgments)
- [Security & Privacy](#security--privacy)
- [License](#license)

---

## Project Overview

- **This repo**: UI for browsing cars/manufacturers, tracking ownership & upgrades, leaving per-car comments, and managing user profiles. Includes a feedback page that is being finalized.
- **Back-end repos** provide the data and persistence; the front end does not store authoritative game data locally.

---

## Features

**Shipped**
- ✅ Browse cars and manufacturers  
- ✅ Car ownership tracking (bugs recently addressed)  
- ✅ Upgrade tracking (initial implementation)  
- ✅ User login & profile tracking (present; ongoing refinement)  
- ✅ Per-car comments (basic): post as guest or with account; edit/delete own comments  
- ✅ Responsive SCSS theme

**In Progress**
- 🛠️ Feedback page: UI present; rendering of submitted feedback on the site pending  
- 🛠️ Progress tracking UX polish  
- 🛠️ Login reliability & cross-device DB sync hardening  
- 🛠️ Comment image attachments — **not supported yet**

---

## Roadmap

- [ ] Stabilize login flows (eliminate double-attempts)  
- [ ] Improve DB sync to prevent rare account state loss  
- [ ] Render & moderate feedback submissions on-site  
- [ ] Add comment image uploads with validation/moderation  
- [ ] Performance & Lighthouse improvements  
- [ ] Accessibility (ARIA labels, focus states, color contrast)

---

## Tech Stack

- **Front End**: React, Vite, TypeScript, SCSS  
- **APIs**: Separate microservices (Data API, User/Profile API, Comments API, Feedback API)  
- **Hosting**: Netlify (front end), Render (APIs)

## Getting Started

git clone https://github.com/yourusername/alu-tracker-front-end
cd alu-tracker-front-end
npm install
npm run dev

The dev server runs at http://localhost:5173 (default).

## Scripts

- `npm run dev` – Start Vite dev server  
- `npm run build` – Production build

## Repository Layout

This project is part of a multi-repo setup:

- **alu-tracker-front-end** ← *you are here*  
- **alu-tracker-data-api** – Cars, manufacturers, stats (authoritative game data)  
- **alu-tracker-user-api** – Accounts, profiles, ownership/progress state  
- **alu-tracker-comments-api** – Per-car comments (guest or account), moderation and for feedback on the site

## Contributing

Contributions and ideas are welcome!

- Open issues for bugs/requests  
- Submit PRs with focused changes  
- Share feature ideas informed by community discussions

> See **Acknowledgments** for how community inspiration is credited safely.

---

## Acknowledgments

- **Community inspiration**: Several features and UX concepts were inspired by discussions with fellow *Asphalt Legends Unite* players in fan Discord communities.  
- **Image help**: Friends contributed some missing car images.  
- **Reference material**: Manufacturer sites, Wikipedia, and the Asphalt Fandom wiki—full citations are tracked in the **data API** repository to keep attribution centralized.

---

## Security & Privacy

- No personal contact info is published in this README.  
- To reach the maintainer, use GitHub Issues in this repo.  
- User data is handled by the back-end services; never commit secrets to this repo.

---

## License

Licensed under the MIT license: https://opensource.org/license/MIT