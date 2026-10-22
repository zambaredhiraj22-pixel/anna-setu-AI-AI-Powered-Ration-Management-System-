# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## AnnaSetu AI frontend (role-based + AI forecast)

### Run the frontend
1. Install Node.js 20.19+ or 22.12+.
2. Open this project folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev` and open the URL shown by Vite (normally `http://localhost:5173`).

### Backend and AI requirements
- Spring Boot backend must be running at `http://localhost:8080`.
- The Python AI service used by Spring Boot must be running at `http://127.0.0.1:8001` for AI forecast requests.
- Log in with an existing account. The role badge is read from the signed JWT; registration intentionally creates a `USER` account.
- The AI Forecast page has a database-based forecast (uses distribution history) and a manual forecast (submits at least three monthly demand values). Manual forecasting is available only to `ADMIN` and `OFFICER`, matching backend permissions.
- Database forecast needs distribution history for the selected commodity. If there is not enough history, use the manual option with an `ADMIN` or `OFFICER` account.

### Backend stock route check
The `StockController` route is `/api/stocks`. In `SecurityConfig.java`, make sure the stock permission matchers also use `/api/stocks/**` (plural), not `/api/stock/**`.

### Notes
This frontend calls the local backend directly. If your backend uses another host or port, update `API_BASE` in `src/services/api.js` and the API URLs in the service files.
