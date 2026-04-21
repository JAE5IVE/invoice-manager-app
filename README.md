# Invoice Management App

A full-stack responsive invoice management application built with React, Express, and Tailwind CSS.

## Setup Instructions

To get this application running locally:

1. **Clone the repository** (if you've exported it):
   ```bash
   git clone <repository-url>
   cd invoice-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   *This starts both the Express backend and the Vite frontend middleware.*

4. **Open the application**:
   Navigate to `http://localhost:3000` in your browser.

## Architecture Explanation

This project follows a **Full-Stack SPA** architecture:

- **Frontend**: Built with **React 18** and **Vite**.
  - **Context API**: Used for global state management (Invoices and Theme).
  - **Tailwind CSS**: Used for utility-first styling with custom theme variables for consistency with the Figma design.
  - **Motion (framer-motion)**: Used for layout transitions, slide-out forms, and list animations.
- **Backend**: A **Node.js/Express** server.
  - Acts as a thin API layer to persist data.
  - Uses `data.json` for persistent storage in a local environment.
  - Integrated into the Vite dev server using middleware mode.

## Trade-offs

- **Storage**: Used a local `data.json` file instead of a heavy database (like PostgreSQL/MongoDB) to keep the project lightweight and easily portable within the AI Studio environment.
- **Routing**: Implemented a simple state-based routing (`selectedInvoice`) instead of `react-router-dom` to reduce external dependencies and keep the single-file focus for simpler logic, while still maintaining distinct view states.
- **Validation**: Strict validation is applied to all submissions (including drafts) to ensure data integrity, although some implementations allow partial drafts.

## Accessibility Notes

- **Semantic HTML**: Used `<aside>`, `<main>`, `<header>`, `<section>`, and `<button>` for proper document structure.
- **Forms**: Every input has a corresponding label. Labels are visually linked to inputs and handle error states clearly.
- **Keyboard Navigation**: Buttons are keyboard accessible.
- **Color Contrast**: Follows the Figma color palette which is designed for high contrast in both light and dark modes.
- **Focus States**: Interactive elements have visible hover/focus states to guide the user.

## Improvements Beyond Requirements

- **Local Persistence Fallback**: If the backend is unavailable, the app environment is stable enough to serve as a high-fidelity prototype.
- **Motion Enhancements**: Added staggered list animations and smooth height transitions for the item list in the form.
- **Responsive Sidebar**: The sidebar transforms into a top bar on mobile/tablet to maximize vertical space.
