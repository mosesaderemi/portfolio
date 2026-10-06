# Professional Portfolio — Aderemi Moses Timileyin

A complete, production-ready editorial portfolio website cloned from the high-converting multi-page architecture of `neche-portfolio-main`, customized for **Aderemi Moses Timileyin** (Full-Stack Software Engineer & AI Automation Consultant) and featuring his 36+ projects from `repos` and his verified resume.

---

## 🚀 Website Structure & Pages

| File | Purpose & Contents |
| --- | --- |
| `index.html` | **Homepage**: Hero with scroll-driven portrait parallax, "What I Solve" (operational ROI math), Flagship Project feature cards, 4-step engineering methodology, Notes teaser, About preview, Consultation offers, and accessible Contact Modal. |
| `work.html` | **All Work & Case Studies**: Deep dive architectural breakdowns (Healthcare Microservices, CIITM Institute ERP, Autonomous AI Sales Voice Agent, Laravel E-Commerce & Vue 3 Admin, React Native Recipe Mobile App, Auth Starters) plus Systems Gallery and AI/ML/Desktop showcases. |
| `about.html` | **About Moses**: Full professional story, 2019-2026 engineering timeline, education (Obafemi Awolowo University B.Sc. Computer Science & Federal Polytechnic Offa), and full skills matrix. |
| `resources.html` | **Notes & Insights**: 4 in-depth architectural and operational essays (manual workflow costs, microservices failure boundaries, tool-calling AI agents, and production RBAC authentication). |
| `contact.html` | **Contact Page**: Interactive AJAX inquiry form with validation, honeypot spam protection, offer pre-selection, and direct communication channels (Email, WhatsApp, LinkedIn, GitHub). |
| `linktree/index.html` | **Bio Link Hub**: Standalone mobile-first bio link tree with quick links, resume download, flagship projects, and direct chat. |
| `styles.css` | **Design System**: Space Grotesk + Inter typography, responsive layouts, editorial card grids, subtle shadows, and dark/light accents. |
| `script.js` | **Interactive Engine**: Mobile drawer, portrait scroll parallax, intersection observers, modal dialog trap, and AJAX contact submission. |
| `api/contact.js` | **Vercel Serverless Function**: Dual-provider email delivery (Resend or Gmail SMTP). |
| `netlify/functions/contact.js` | **Netlify Serverless Function**: Serverless endpoint reached automatically via `/api/contact`. |

---

## 🎨 Project Mockups & Visual Assets

All project cards feature custom-generated, photorealistic or high-resolution vector UI mockups located in `Assets/images/`:
- `healthcare-platform.jpg` — MedCore Healthcare microservices telemetry & clinical dashboard.
- `ciitm-backend.jpg` — Higher ed admissions, tuition analytics & floating Gemini AI student assistant.
- `ecommerce-laravel.jpg` — Split-screen modern e-commerce storefront and Vue 3 dark merchant analytics panel.
- `ai-sales-agent.jpg` — Autonomous agent terminal, LangGraph execution logs, audio waveform, and Stripe link generator.
- `recipe-app.jpg` — React Native mobile app on dual smartphones showing recipe discovery and cooking mode.
- `auth-starters.jpg` — Swagger OpenAPI docs, JWT decoder, and RBAC matrix.
- `healthcare-ai.svg` — Chest X-ray radiograph scan with Grad-CAM heatmap and 6 diagnostic gauges.
- `online-bookstore.svg` — PageTurn bookstore digital catalog with automated Stripe checkout.
- `ev-prediction.svg` — Electric car market valuation sliders, regression curve, and R² metrics.
- `personal-ai.svg` — LangGraph multi-agent orchestration DAG and execution console.
- `real-estate.svg` — PrimeProperty real estate ERP and agent portal.
- `login-character.svg` — Interactive animated mascot login screen.
- `javafx-systems.svg` — JavaFX restaurant management & JasperReports analytics suite.
- `ai-web-scraper.svg` — Crawl4AI LLM directory extraction terminal.
- `my image.PNG` — Moses's background-removed portrait for the hero section.
- `profile.jpg` — Moses's professional headshot for linktree and cards.
- `Aderemi_Moses_Timileyin_Resume.pdf` — Direct one-click resume download.

---

## ⚙️ Contact Form Backend Setup

The contact form sends requests to `/api/contact`. It works automatically on both **Vercel** and **Netlify**.

### Option A: Resend (Recommended — 2 minutes, no packages needed)
1. Sign up for a free account at [resend.com](https://resend.com).
2. Generate an API Key in your Resend dashboard.
3. Add the following Environment Variable in your hosting dashboard (Vercel or Netlify):
   ```env
   RESEND_API_KEY=re_your_api_key_here
   CONTACT_TO=mosestimileyinaderemi@gmail.com
   ```

### Option B: Gmail SMTP
1. Enable 2-Step Verification in your Google Account.
2. Go to **Security > App Passwords** and generate a 16-character App Password for "Mail".
3. Add the following Environment Variables in your hosting dashboard:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=mosestimileyinaderemi@gmail.com
   SMTP_PASS=your_16_character_app_password
   CONTACT_TO=mosestimileyinaderemi@gmail.com
   ```

*(If environment variables are not yet configured, the form gracefully alerts the visitor and provides a direct email link so no message is ever lost.)*

---

## 🌐 Free 1-Click Hosting Guide

### Deploying to Netlify (Free)
1. Push this folder (`portfolio`) to a new repository on your GitHub account (`github.com/mosesaderemi/portfolio`).
2. Log into [app.netlify.com](https://app.netlify.com) and click **"Add new site" > "Import an existing project"**.
3. Select your GitHub repository.
4. Settings are detected automatically from `netlify.toml`:
   - **Publish directory**: `.`
   - **Functions directory**: `netlify/functions`
5. Go to **Site configuration > Environment variables**, and add `RESEND_API_KEY` (or `SMTP_USER` & `SMTP_PASS`).
6. Click **Deploy Site**. Your site will be live immediately with a free SSL certificate!

### Deploying to Vercel (Free)
1. Push this folder to your GitHub account.
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the repository. Settings are detected automatically from `vercel.json`.
4. Under **Environment Variables**, add `RESEND_API_KEY` (or your SMTP variables).
5. Click **Deploy**.

---

## 💻 Running Locally

To preview the website locally on your computer:
```bash
# Option 1: Using Node's npx serve
npx serve .

# Option 2: Using Python built-in server
python -m http.server 3000
```
Open `http://localhost:3000` in your web browser.
