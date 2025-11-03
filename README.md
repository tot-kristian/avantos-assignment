# Blueprint Graph Assignment

A React application for managing and configuring blueprint graphs with data source mappings.

## Prerequisites

- Yarn package manager
- Mock API server (see setup below)
- 
## Mock API Setup

This project requires a mock API server to run. Clone and start the mock API:
```bash
# Clone the mock API repository
git clone https://github.com/mosaic-avantos/frontendchallengeserver.git
cd frontendchallengeserver

# Install and start
npm install
npm start
```

The mock API will run on `http://localhost:3000` by default.

**Note:** Make sure the mock API is running before starting the React application.

## Getting Started

### Installation

1. Install dependencies:
```bash
yarn install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure the API endpoint in `.env.local`:
```
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

**Note:** Make sure to include the API version in the URL (e.g., `/api/v1`)

### Running the Application

Start the development server:
```bash
yarn dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn preview      # Preview production build
yarn test         # Run tests in watch mode
yarn test:run     # Run tests once (CI mode)
yarn lint         # Run ESLint (if configured)
```

## Project Structure

```
src/
├── api/                      # Global API configuration
├── components/               # Shared/reusable components
├── features/                 # Feature-based modules
│   └── BlueprintGraph/
│       ├── api/              # Feature-specific API calls and types
│       ├── components/       # Feature components
│       ├── context/          # React context providers
│       ├── hooks/            # Custom hooks (queries, mutations etc.)
│       ├── model/            # Domain models and business logic
│       └── test/             # Feature-specific test utilities
├── lib/                      # Third-party library configurations
│   └── utils.ts              # Utility functions (e.g., cn helper)
└── test/                     # Global test setup and utilities
```

## Architecture

### Feature-Based Organization

The project uses **feature-based architecture** - each feature is self-contained with:
- `api/` - API types and functions
- `components/` - UI components
- `context/` - State management
- `hooks/` - React Query hooks
- `model/` - Business logic
- `test/` - Test utilities and smoke tests

### Key Patterns

- **Context Provider** - `GraphProvider` manages graph state globally
- **React Query** - Server state management with caching
- **Pure Functions** - Business logic (e.g., `updateNodeInputMapping`) extracted for testability

## Adding a New Data Source

1. Define the data source type in `src/features/BlueprintGraph/model/data-source`
2. Adjust the dataSource interface if needed (e.g., if you want different args to the listFor function than a graph) `src/features/BlueprintGraph/models/data-source/types/dataSource.ts`
3. If you need to fetch data from the api create the necessary hooks for it `src/features/BlueprintGraph/hooks`
4. Add the data source to the `src/features/BlueprintGraph/model/data-source/getAllDataSources.ts` file and adjust the input for listFor
5. Add any business logic to `src/features/BlueprintGraph/models`
6. Write tests for new utilities and components

## Testing

### Running Tests

```bash
yarn test              # Run in watch mode
yarn test:run          # Run once (CI mode)
```

### Test Coverage

**Unit Tests**
- Graph utility functions (e.g., `findSelectedDataSourceItemAndGroup`)
- Data transformation logic (e.g., `updateNodeInputMapping`)
- Business logic layer

**Component Tests**
- Core UI components with logic
- Form interactions and validations
- Data display components

**Smoke Tests**
- Complete user workflow: graph navigation → node selection → mapping → save
- Ensures core features work end-to-end

## Known Limitations

**Error Handling**
- API error handling is minimal in the current implementation
- In a production environment, I would add:
    - Proper error boundaries for component-level errors
    - Toast notifications for user feedback
    - Retry logic for failed requests
    - Loading states with error messages
    - Proper 404 page
