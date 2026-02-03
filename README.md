# 🤖 Gemini AI NestJS Integration

Welcome to the **Gemini AI Backend**, a NestJS-based repository designed to demonstrate the practical implementation of Google's Gemini AI models. This project serves as a comprehensive guide for integrating advanced AI features like streaming text generation, chat history, image analysis, and structured data tasks.

## Features

- **Basic Prompting**: Simple text-to-text generation using Gemini.(FCM).
- **Streaming Responses**: Real-time text generation to improve user experience.
- **Chat History & Context**: Maintain a conversation state with persistent messaging logic.
- **Multimodal Support**: Handle file uploads (images/documents) to interact with Gemini's vision capabilities.
- **Specialized Use Cases**: Employs the BLoC pattern to manage the state of notifications and UI updates.
  - **Image Generation**: Integration for generating or processing visual content.
  - **Pokemon Helper**: Structured assistance for Pokemon-related queries.
  - **Trivia Generator**: Dynamic question generation based on specific topics.


## Requirements

- **Node.js**: Ensure you have Node.js (v18 or higher) installed.
- **Nest CLI**: Useful for managing and running the project.
- **Google Gemini API Key**: You will need an API key from the Google AI Studio [https://aistudio.google.com].

## Installation

1. **Clone the repository**:
   Open your terminal or command prompt and navigate to the directory where you want to clone the project. 
   ```bash
   git clone https://github.com/lauritaila/gemini-backend.git
   ```
   2.**Navigate to the project directory**: 
   Once the repository is cloned, navigate into the project directory using the cd command:
   ```bash
   cd gemini-backend
   ```
   3. **Install dependencies**:
   Run the following command to install the project's dependencies:
   ```bash
    npm install
   ```
   4.**Environment Setup**: 
   Create a `.env` file in the root directory and copy the content from `.env.template`:
   ```bash
    GEMINI_API_KEY=your_gemini_api_key_here
    API_URL=http://localhost:3000
   ```
   5. **Run the app**:
   ```bash
    # Development mode
      npm run start:dev

    # Production mode
      npm run start:prod
   ```
## Project Structure
The project follows a modular Clean Architecture approach, separating business logic into Use Cases and exposing them via a Controller.

```
src/
┣ gemini/
┃ ┣ dtos/             # Data Transfer Objects for request validation
┃ ┣ helpers/          # Utility functions for file uploads/processing
┃ ┣ use-cases/        # Core business logic for each AI feature
┃ ┣ gemini.controller.ts # Route handlers and API definitions
┃ ┣ gemini.module.ts     # Gemini module configuration
┃ ┗ gemini.service.ts    # Main service for orchestration
┣ app.module.ts       # Root application module
┗ main.ts             # Application entry point
```

## DependenciesAPI Endpoints
### Text & Chat
- `POST /gemini/basic-prompt`: Simple question-response.
- `POST /gemini/basic-prompt-stream`: Returns a stream of text (supports file uploads).
- `POST /gemini/chat-stream`: Interactive chat with history tracking.
- `GET /gemini/chat-history/:chatId`: Retrieve the history of a specific conversation.

## Specialized Tasks
- `POST /gemini/image-generation`: Process or generate images based on prompts.
- `POST /gemini/pokemon-helper`: Get specific Pokemon help.
- `GET /gemini/trivia/question/:topic`: Generate a trivia question for a given topic.

## Dependencies
The following dependencies are used in this project:

- `@google/genai:Official Google SDK for Gemini AI integration.
- `@nestjs/common/core`:Core NestJS framework.
- `class-validator & class-transformer`: To ensure incoming requests are properly formatted.
- `sharp`: High-performance image processing.
- `multer`: For handling multipart/form-data (file uploads).

## Contributing
Contributions are welcome! If you have any suggestions, bug reports, or would like to add new features, please feel free to open an issue or submit a pull request.