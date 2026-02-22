# Developer Setup

Thank you for contributing to the Bventy frontend. This guide will help you set up a local development environment.

## Prerequisites

- **Node.js**: Version 18 or later.
- **npm**: Or your preferred package manager (yarn, pnpm).
- **Backend API**: A running instance of the [Bventy Backend](https://github.com/bventy/backend).

## Installation

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/bventy/web.git
    cd web
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Copy the example environment file and update it with your local backend URL:
    ```bash
    cp .env.example .env.local
    ```
    See the [Environment Reference](environment.md) for details on each key.

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The application should now be available at `http://localhost:3000`.

## Testing

Ensure your changes don't introduce regressions by running the build check:
```bash
npm run build
```
In the future, we will expand this to include comprehensive unit and integration tests.
