# Blueprint Graph Assignment

A React application for managing and configuring blueprint graphs with data source mappings.

## Prerequisites

- Yarn package manager

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

The project follows a **feature-based architecture** where each feature is self-contained with its own:
- **API layer** - Type definitions and API client functions
- **Components** - UI components specific to the feature
- **Context** - State management via React Context
- **Hooks** - React Query hooks for data fetching and mutations
- **Model** - Domain models and business logic
- **Tests** - Feature-specific test utilities and mocks

This structure ensures:
- ✅ Clear separation of concerns
- ✅ Easy feature discovery and maintenance
- ✅ Minimal coupling between features
- ✅ Scalability as the application grows

### Key Patterns

**Context Provider Pattern**
- `GraphProvider` manages global graph state
- Provides graph data, selected node, and update functions to child components

**Custom Hooks**
- API hooks (`useBlueprintGraphQuery`) for data fetching
- Mutation hooks (`useUpdateNodeInputMapping`) for data updates
- React Query for caching and state management

**Pure Functions**
- Business logic extracted into testable utility functions
- Example: `updateNodeInputMapping`

## Adding a New Data Source

### Adding a New Data Source

1. Define the data source type in `src/features/BlueprintGraph/model/data-source`
2. Adjust the dataSource interface if needed (e.g., if you want different args to the function than a graph) `src/features/BlueprintGraph/models/data-source/types/dataSource.ts`
3. If you need to fetch data from the api create the necessary hooks for it `src/features/BlueprintGraph/hooks`
5. Add the data source to the `src/features/BlueprintGraph/model/data-source/dataSources.ts` file
4. Add any business logic to `src/features/BlueprintGraph/models/`
5. Write tests for new utilities and components

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
