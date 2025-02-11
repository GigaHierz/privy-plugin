# 🔑 Privy Integration in Hadi AI

## Overview
[Privy](https://privy.io/) simplifies **Web3 onboarding** with **embedded wallets & policy-based transaction controls**.

## 🚀 How Hadi AI Uses Privy
✅ **Provides seamless onboarding for Web3 & non-Web3 users.**  
✅ **Implements server wallets for AI-driven DeFi investments.**  
✅ **Uses Privy’s Policy Engine to allowlist tokens.**  

## Why Did We Choose Privy 

## 🛠️ Technical Implementation

Keywords: Policy, Allowlist



## What Did We Implement

- We created an Eliza plugin-privy for creating server wallets with policies: https://github.com/EmanHerawy/hadi/tree/main/ts-agent/eliza/packages/plugin-privy
  - Server Wallets
    - Create Wallet (with policy)
    - Update Wallet
    - Get All Wallets
  - Transactions
    - Sign Transaction
    - Send Transaction
  - Policies
    - Create Policy
    - Update Policy
    - Get All Policies

- For this project, we created a **policy called Hadi** with the ID: **zh4ugr13u3maafdrmrvvrt40**

## Privy x Hadi Actions 💛

### Get a List of All Sharia Compliant Tokens

Get a list of all tokens already allowlisted. If a token is not allowlisted, you can reach out to one of our other agents/plugins to get it classified. This agent will then call the Privy API to add the token to the allowlist. 
```
Hi Hadi,
Which tokens are Halal?
```

### Update the Policy with New Tokens to the Allowlist (or Remove)

The agent has an allowlist of tokens that are Sharia compliant. This list can be updated by calling the plugin to say: (add or remove) tokens.
```
Hi Hadi,
Please add this BNB token with the address 0xB8c77482e45F1F44dE1745F52C74426C631bDD52 to the allowlist.
```

### Create a Sharia Compliant Wallet

We want to provide our users with the best, most seamless experience. So, signing up for Hadi, we will create a server-side wallet, already with the policies implemented, which will be connected to a Smart Wallet (Safe - look out for the next hackathon). For now, a user could create their wallet, pre-fund it, and start buying tokens with Hadi's advice and help. 

```
Hi Hadi, 
I need to create a new wallet that has Sharia law implemented.
```

The halalScannerToken could call the pluginPrivy to update the policy to add a token to the allowlist. 

## Who Built It?

https://github.com/GigaHierz



## How to run the Privy Plugin?

1. add these two ENV variables to your .env file

```
#Privy Configuration
PRIVY_APP_ID=
PRIVY_APP_SECRET=
```

2. Call the Plugin in your Characterfile like this


```typescript
import { ModelProviderName, Clients } from "@elizaos/core";
import privyPlugin from '@elizaos/plugin-privy'

export const mainCharacter = {
    name: "hadi",
    clients: [],
    modelProvider: ModelProviderName.OPENAI,
    plugins: [privyPlugin],
    settings: {
    },
```


## DevEX Feedback

- Example on the [Create Policy page](https://docs.privy.io/guide/server-wallets/policies/create#example) and update policy has too many commas and is throwing an Invalid JSON error.
- The issues were:
    Missing comma after "name": "Allowlist USDC"
    Extra comma after the conditions object
    Extra comma after the method_rules array
    Remember in JSON:
    You need commas between items in arrays and objects.
    You should not have a comma after the last item in an array or object.
- Example on the Update Policy page is throwing an error:
  - The changes:
    Removed the default_action field since it's not allowed in the PATCH request.
    Only included the method_rules, which is what we want to update.
    Remember:
    default_action can only be set during policy creation (POST request).
    PATCH requests should only include the fields you want to update.
- When I Google for policy engine, the first result in the Google search leads to a 404: https://docs.privy.io/guide/wallet-api/policies



1. **Generate Embedded Wallets for Users**:
    ```python
    user_wallet = privy.create_wallet(user_email="investor@example.com")
    ```

2. **Enforce AI-Driven Allowlist Based on the Agent's Research**:
    ```python
    privy.set_policy(wallet=user_wallet, max_tx_per_day=3)
    ```

## 🔧 Setup Instructions
1. **Clone Repo & Install Dependencies**:
    // TODO: which ENV variables to add
    // TODO: how to set up the plugin

2. **Run Server Wallets**:
    ```bash
    python wallet_manager.py
    ```

## 🔹 Benefits to Hadi AI
✔️ **User-Friendly Web3 Onboarding.**  
✔️ **Secure Server Wallets for Investment Execution.**  
✔️ **Policy-Based Trading for AI-Governed Strategies.**  

## 🔮 Future Enhancements
🚀 **Integrate Privy’s social logins for seamless DeFi execution.**  