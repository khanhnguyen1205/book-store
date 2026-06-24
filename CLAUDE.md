# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React 19 book store application (Create React App) for an FPT University FER202 assignment. Uses JSON Server as a mock backend API.

## Commands

- `npm start` — dev server on http://localhost:3000
- `npm run build` — production build
- `npm test` — run tests (Jest + React Testing Library)
- JSON Server must be started separately: `npx json-server --watch db.json --port 9999`
  - The `db.json` file was removed from the repo (commit f6597dc); you'll need to create one with `books` and `users` collections

## Architecture

**Routing:** React Router v7 with `BrowserRouter`. Routes defined in `src/routes/index.jsx`. `ProtectedRoute` wraps auth-required pages (redirects to `/login`).

**State management:** Two React Context providers nested in `App.jsx`:
- `AuthProvider` (outermost) — user session via localStorage, exposes `useAuth()` hook
- `CartProvider` (inside BrowserRouter) — cart state via localStorage, exposes `useCart()`. Requires router context because `addToCart` navigates unauthenticated users to `/login`.

**Feature modules:** Code is organized under `src/features/` by domain:
- `auth/` — Login, Register, AuthContext
- `book/` — BookList (with pagination), BookDetail
- `cart/` — Cart, CartItem, CartContext, cartUtils
- `order/` — OrderHistory (empty service file)
- `admin/` — Dashboard, ManageBooks, ManageUsers (empty service file)

**API layer:** `src/services/api.js` exports a single Axios instance pointing to `http://localhost:9999`. Feature services (`bookService`, `authService`) call this instance. Authentication uses a GET query against JSON Server (`/users?email=...&password=...`), not a real auth system.

**Shared components:** `src/components/` — Navbar, Footer, Hero, Sidebar, BookCard, SearchBar, Pagination, Button, Loader.

**Pricing:** Prices from the API may be stored in large numbers (e.g. 150000) and divided by 1000 for display. See `cartUtils.js:formatPrice` for the threshold-based logic.
