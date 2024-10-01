## Conventions

Work in the 'notion'folder from route and build the following which works with Notion. 

### Layout

```plaintext
notion-sdk/
├── src/
│   ├── notion/
│   │   ├── index.ts
│   │   ├── notion_client.ts
│   │   ├── page_api.ts
│   │   ├── database_api.ts
│   │   ├── block_api.ts
│   │   └── recursive_page_extractor.ts
│   ├── services/
│   │   ├── index.ts
│   │   ├── video_services/
│   │   │   ├── index.ts
│   │   │   ├── crud_operations.ts
│   │   │   ├── database_builder.ts
│   │   │   ├── step1_define_niche.ts
│   │   │   ├── step2_generate_ideas.ts
│   │   │   ├── step3_master_packaging.ts
│   │   │   ├── step4_expand_reach.ts
│   │   │   ├── step5_preproduction_planning.ts
│   │   │   ├── step6_identify_viral_traits.ts
│   │   │   ├── step7_simplify_recording.ts
│   │   │   └── step8_develop_system.ts
│   │   └── utility_services/
│   │       ├── reference_manager.ts
│   │       └── logger.ts
│   ├── models/
│   │   ├── index.ts
│   │   ├── notion_models.ts
│   │   ├── video_models.ts
│   │   └── common_types.ts
│   └── index.ts
├── tests/
│   ├── notion/
│   │   ├── page_api.test.ts
│   │   ├── database_api.test.ts
│   │   ├── block_api.test.ts
│   │   └── recursive_page_extractor.test.ts
│   ├── services/
│   │   ├── video_services/
│   │   │   ├── crud_operations.test.ts
│   │   │   ├── database_builder.test.ts
│   │   │   ├── step1_define_niche.test.ts
│   │   │   ├── step2_generate_ideas.test.ts
│   │   │   ├── step3_master_packaging.test.ts
│   │   │   ├── step4_expand_reach.test.ts
│   │   │   ├── step5_preproduction_planning.test.ts
│   │   │   ├── step6_identify_viral_traits.test.ts
│   │   │   ├── step7_simplify_recording.test.ts
│   │   │   └── step8_develop_system.test.ts
│   │   └── utility_services/
│   │       ├── reference_manager.test.ts
│   │       └── logger.test.ts
│   └── models/
│       ├── notion_models.test.ts
│       ├── video_models.test.ts
│       └── common_types.test.ts
├── package.json
├── tsconfig.json
├── bunfig.toml
└── README.md
```

### Module Descriptions

#### `src/notion/`
- **index.ts**: Exports all Notion API modules.
- **notion_client.ts**: Initializes and configures the Notion API client.
- **page_api.ts**: Contains functions to perform CRUD operations on Notion pages.
- **database_api.ts**: Contains functions to perform CRUD operations on Notion databases.
- **block_api.ts**: Functions to interact with Notion blocks (text, headings, lists, etc.).
- **recursive_page_extractor.ts**: Provides a function to recursively extract all information from a Notion page and its child elements.

#### `src/services/`
- **index.ts**: Exports all service modules.
  
  **video_services/**
  - **index.ts**: Exports all video service functions.
  - **crud_operations.ts**: Contains CRUD functions specific to video projects.
  - **database_builder.ts**: Functions to build and delete the video database on a new page.
  - **step1_define_niche.ts** to **step8_develop_system.ts**: Functions corresponding to each step in the video creation process.

  **utility_services/**
  - **reference_manager.ts**: Manages page references (e.g., mapping names to IDs).
  - **logger.ts**: Provides logging functionality.

#### `src/models/`
- **index.ts**: Exports all models.
- **notion_models.ts**: Defines types and interfaces for Notion API responses.
- **video_models.ts**: Defines types and interfaces specific to video projects.
- **common_types.ts**: Common types and enums used across the application.

#### Other Files
- **package.json**: Project dependencies and scripts.
- **tsconfig.json**: TypeScript configuration.
- **bunfig.toml**: Bun configuration file.
- **README.md**: Documentation for the project.

### Functional Approach

- **Pure Functions**: Functions without side effects, enhancing testability and predictability.
- **Immutability**: Use immutable data structures to prevent unintended mutations.
- **Modularity**: Each function serves a single purpose, promoting reusability.
- **Higher-Order Functions**: Utilize functions that accept or return other functions for enhanced flexibility.

### Functional Naming Conventions

- Use lowercase and hyphen-separated names for functions and files.
- Ensure names are descriptive and convey the purpose of the function or module.

### Implement Recursive Data Extraction

- Provide a function that extracts all information from a Notion page and its child elements, traversing multiple levels to ensure all data is captured.