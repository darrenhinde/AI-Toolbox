
Think step by step on each, describe the solution first then implement it. All test should be made for bun @notion_plan.md using the bun add  @notionhq/client :
sage
Use Notion's Getting Started Guide to get set up to use Notion's API.

Import and initialize a client using an integration token or an OAuth access token.

const { Client } = require("@notionhq/client")

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})
Make a request to any Notion API endpoint.

See the complete list of endpoints in the API reference.

;(async () => {
  const listUsersResponse = await notion.users.list({})
})()
Each method returns a Promise which resolves the response.

console.log(listUsersResponse)
{
  results: [
    {
      object: 'user',
      id: 'd40e767c-d7af-4b18-a86d-55c61f1e39a4',
      type: 'person',
      person: {
        email: 'avo@example.org',
      },
      name: 'Avocado Lovelace',
      avatar_url: 'https://secure.notion-static.com/e6a352a8-8381-44d0-a1dc-9ed80e62b53d.jpg',
    },
    ...
  ]
}
Endpoint parameters are grouped into a single object. You don't need to remember which parameters go in the path, query, or body.

const myPage = await notion.databases.query({
  database_id: "897e5a76-ae52-4b48-9fdf-e71f5945d1af",
  filter: {
    property: "Landmark",
    rich_text: {
      contains: "Bridge",
    },
  },
})
Handling errors
If the API returns an unsuccessful response, the returned Promise rejects with a APIResponseError.

The error contains properties from the response, and the most helpful is code. You can compare code to the values in the APIErrorCode object to avoid misspelling error codes.

const { Client, APIErrorCode } = require("@notionhq/client")

try {
  const notion = new Client({ auth: process.env.NOTION_TOKEN })
  const myPage = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Landmark",
      rich_text: {
        contains: "Bridge",
      },
    },
  })
} catch (error) {
  if (error.code === APIErrorCode.ObjectNotFound) {
    //
    // For example: handle by asking the user to select a different database
    //
  } else {
    // Other error handling code
    console.error(error)
  }
}
Logging
The client emits useful information to a logger. By default, it only emits warnings and errors.

If you're debugging an application, and would like the client to log response bodies, set the logLevel option to LogLevel.DEBUG.

const { Client, LogLevel } = require("@notionhq/client")

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  logLevel: LogLevel.DEBUG,
})
You may also set a custom logger to emit logs to a destination other than stdout. A custom logger is a function which is called with 3 parameters: logLevel, message, and extraInfo. The custom logger should not return a value.

Client options
The Client supports the following options on initialization. These options are all keys in the single constructor parameter.

Option	Default value	Type	Description
auth	undefined	string	Bearer token for authentication. If left undefined, the auth parameter should be set on each request.
logLevel	LogLevel.WARN	LogLevel	Verbosity of logs the instance will produce. By default, logs are written to stdout.
timeoutMs	60_000	number	Number of milliseconds to wait before emitting a RequestTimeoutError
baseUrl	"https://api.notion.com"	string	The root URL for sending API requests. This can be changed to test with a mock server.
logger	Log to console	Logger	A custom logging function. This function is only called when the client emits a log that is equal or greater severity than logLevel.
agent	Default node agent	http.Agent	Used to control creation of TCP sockets. A common use is to proxy requests with https-proxy-agent
TypeScript
This package contains type definitions for all request parameters and responses, as well as some useful sub-objects from those entities.

Because errors in TypeScript start with type any or unknown, you should use the isNotionClientError type guard to handle them in a type-safe way. Each NotionClientError type is uniquely identified by its error.code. Codes in the APIErrorCode enum are returned from the server. Codes in the ClientErrorCode enum are produced on the client.

try {
  const response = await notion.databases.query({
    /* ... */
  })
} catch (error: unknown) {
  if (isNotionClientError(error)) {
    // error is now strongly typed to NotionClientError
    switch (error.code) {
      case ClientErrorCode.RequestTimeout:
        // ...
        break
      case APIErrorCode.ObjectNotFound:
        // ...
        break
      case APIErrorCode.Unauthorized:
        // ...
        break
      // ...
      default:
        // you could even take advantage of exhaustiveness checking
        assertNever(error.code)
    }
  }
}
Type guards
There are several type guards provided to distinguish between full and partial API responses.

Type guard function	Purpose
isFullPage	Determine whether an object is a full PageObjectResponse
isFullBlock	Determine whether an object is a full BlockObjectResponse
isFullDatabase	Determine whether an object is a full DatabaseObjectResponse
isFullPageOrDatabase	Determine whether an object is a full PageObjectResponse or DatabaseObjectResponse
isFullUser	Determine whether an object is a full UserObjectResponse
isFullComment	Determine whether an object is a full CommentObjectResponse
Here is an example of using a type guard:

const fullOrPartialPages = await notion.databases.query({
  database_id: "897e5a76-ae52-4b48-9fdf-e71f5945d1af",
})
for (const page of fullOrPartialPages.results) {
  if (!isFullPageOrDatabase(page)) {
    continue
  }
  // The page variable has been narrowed from
  //      PageObjectResponse | PartialPageObjectResponse | DatabaseObjectResponse | PartialDatabaseObjectResponse
  // to
  //      PageObjectResponse | DatabaseObjectResponse.
  console.log("Created at:", page.created_time)
}
Utility functions
This package also exports a few utility functions that are helpful for dealing with any of our paginated APIs.

iteratePaginatedAPI(listFn, firstPageArgs)
This utility turns any paginated API into an async iterator.

Parameters:

listFn: Any function on the Notion client that represents a paginated API (i.e. accepts start_cursor.) Example: notion.blocks.children.list.
firstPageArgs: Arguments that should be passed to the API on the first and subsequent calls to the API, for example a block_id.
Returns:

An async iterator over results from the API.

Example:

for await (const block of iteratePaginatedAPI(notion.blocks.children.list, {
  block_id: parentBlockId,
})) {
  // Do something with block.
}
collectPaginatedAPI(listFn, firstPageArgs)
This utility accepts the same arguments as iteratePaginatedAPI, but collects the results into an in-memory array.

Before using this utility, check that the data you are dealing with is small enough to fit in memory.

Parameters:

listFn: Any function on the Notion client that represents a paginated API (i.e. accepts start_cursor.) Example: notion.blocks.children.list.
firstPageArgs: Arguments that should be passed to the API on the first and subsequent calls to the API, for example a block_id.
Returns:

An array with results from the API.

Example:

const blocks = await collectPaginatedAPI(notion.blocks.children.list, {
  block_id: parentBlockId,
})
// Do something with blocks.
Requirements
This package supports the following minimum versions:

Runtime: node >= 12
Type definitions (optional): typescript >= 4.5
Earlier versions may still work, but we encourage people building new applications to upgrade to the current stable.


, I want to make a CRUD operations using notion. However I want to make them modular, so I can quickly use them to add them to AI agents to easily interact with Notion. Make tests for these and make unit tests for each using bun while keeping to the @CONVENTIONS.md but using @notionhq/client
