# @elizaos/plugin-privy

The Privy plugin enables ELIZA to create Wallets, handle transactions, check policies and update policies 

## Features

- Create a serverwallet with the Hadi polciy initialy setup
- Initiate a transaction on Ethereum using the Privy server wallet
- Get the allowlisted tokens in the Hadi policy (tokens that are Sharia compliant)
- update the allowlisted token list


## Installation

1. Install the plugin package:

```bash
pnpm install @elizaos/plugin-privy
```

OR copy the plugin code into your eliza project node_modules directory. (node_modules\@elizaos)

2. Import and register the plugin in your `character.ts` configuration:

```typescript
import { Character, ModelProviderName, defaultCharacter } from "@elizaos/core";
import { privyPlugin } from "@elizaos/plugin-privy";

export const character: Character = {
  ...defaultCharacter,
  name: "Eliza",
  plugins: [privyPlugin],
  clients: [],
  modelProvider: ModelProviderName.HYPERBOLIC,
  settings: {
    secrets: {},
    voice: {},
    model: "gpt-4",
  },
  system: "Finally take part in DeFi by knowing you are following the Sharia law.",
  bio: [...],
  lore: [...],
  messageExamples: [...],
  postExamples: [...],
  adjectives: ["funny", "intelligent", "academic", "insightful"],
  people: [],
  topics: [...],
  style: {...},
};
```

## Configuration

The plugin requires the following environment variables:

```plaintext
#Privy Configuration - Required Settings
PRIVY_APP_ID="your-app-idea"                    # Privy App ID. Get yours here: https://dashboard.privy.io/
PRIVY_APP_SECRET="your-privy-app-secret"        # Privy App ID Secret for authentication
AUTH_REQUEST_KEY="your-auth-request-key"        # Authentification Request Key. Optional, but required once enabled. Required for production


# Hyperbolic Provider Configuration
HYPERBOLIC_API_KEY="your-api-key"               # Api Key. Get yours here: https://app.hyperbolic.xyz/
HYPERBOLIC_MODEL=meta-llama/Llama-3.2-3B-Instruct
```

## Usage Instructions

### Starting the Plugin

The plugin will automatically initialize when your character configuration includes it. It handles:
// TODO: What happens here? 


1. Room Connection Management

    - Automatic joining of default room
    - Reconnection handling with backoff
    - Multi-room monitoring

2. Message Processing

    - Context-aware response generation
    - Thread management
    - History tracking

3. Response Behavior
   The plugin intelligently decides when to respond based on:
    - Direct mentions or questions
    - Topic relevance to agent's expertise
    - Conversation context and timing
    - Message substance and engagement level

## Common Issues & Troubleshooting

1. **Connection Issues**

    - Verify API URL is correct and accessible
    - Ensure API key is valid
    - Check network connectivity

2. **Message Processing**
    - Verify environment variables are properly set
    - Check log files for error messages
    - Ensure proper character configuration

## Security Best Practices

1. **API Key Management**

    - Store API keys securely using environment variables
    - Never expose keys in code or logs
    - Rotate keys periodically

2. **Connection Security**
    - Use HTTPS for production environments
    - Implement proper error handling
    - Monitor for unusual activity

## Development Guide

### Setting Up Development Environment

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Build the plugin:

```bash
pnpm run build
```

4. Run in development mode:

```bash
pnpm run dev
```

## API Reference

### Core Components

1. **ServerWalletCreation**

    - Handles wallet creations
    - Handles transactions

2. **PolicyCreation**
    - Creating Policies
    - Updating Policies
    - Querying Policies

## Future Enhancements

- adding more functionalities to the policies
  - limit amounts
  - limit timeframes


Special thanks to:

- My amazing ETH Global Agentic hackathon team
- 
## License

This plugin is part of the Eliza project. See the main project repository for license information.
