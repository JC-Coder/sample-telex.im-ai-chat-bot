# Telex Integration Sample App

This is a Node.js application that integrates with Telex for message processing using AI capabilities. The application uses Hono as a lightweight web framework to run on any Node.js environment, such as EC2.

## Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:

   ```env
   PORT=3000
   GEMINI_API_KEY=your-gemini-api-key-here
   NODE_ENV=development
   CHANNEL_ID=your-default-channel-id
   ```

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

### Production Mode

To build and run the application in production mode:

```bash
npm run build
npm start
```

The server will start on the port specified in the `.env` file (default is 3000).

## API Endpoints

### POST /webhook

Receives messages from Telex channels. The endpoint expects a JSON payload with the following structure:

```json
{
  "channel_id": "string (optional, defaults to value in .env)",
  "settings": [
    {
      "label": "string",
      "type": "string",
      "description": "string",
      "default": "any",
      "required": "boolean"
    }
  ],
  "message": "string"
}
```

An incoming message is added to a background processing queue, and the AI-generated response will be sent back via Telex.

### GET /health

Returns a JSON response confirming the server health:

```json
{ "status": "healthy" }
```

### GET /integration-config

Returns the integration configuration for Telex. Use this configuration to set up your integration in the Telex dashboard.

## Features

- **Message Queue Processing:** Incoming webhook messages are queued and processed asynchronously.
- **In-Memory Storage:** Uses an in-memory storage service to manage channel messages (can be replaced with a persistent storage as needed).
- **Integration with Google Gemini AI:** Processes messages using AI to generate responses.
- **CORS Support:** Allows cross-origin requests to ease integration.
- **Node.js Server:** Runs as a standalone Node.js application using Hono, making it easy to deploy on platforms like EC2.

## Development

To run the application locally with hot-reloading:

```bash
npm run dev
```

## License

MIT
