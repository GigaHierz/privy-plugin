# Tech Stack

## Creating client wallets 

Quickstart
Get started with Privy in the 5 quick steps below.

0. Prerequisites
In order to integrate the Privy React SDK, your project must be on:

a minimum React version of 18
a minimum TypeScript version of 5
1. Install the Privy React SDK
Install the latest version of the Privy React SDK using your package manager of choice:

npmpnpmyarn
sh
npm install @privy-io/react-auth@latest
2. Set your login methods
Navigate to the Login methods page on the Privy Dashboard by selecting your app and then clicking Login Methods in the side bar. Select the account types you'd like users to be able to login with. By default, Privy enables wallet and email logins for new apps; you can update this setting now or later. For more information on how to enable social logins, check out the Dashboard docs

3. Get your Privy app ID
From the Privy dashboard for select your desired app, navigate to the Settings page in the side bar. On the Basics tab, find the API keys section. Get your Privy app ID, you will need it in the next step.

The app ID serves as an API key used to initialize the Privy React SDK. This value can be safely exposed in a client-side environment, and you can further secure it for production applications.

4. Import Privy into your app
In your project, import the PrivyProvider component and wrap your app with it. Set the appId field to the app ID you got from the Dashboard in step 3.

Concretely, the PrivyProvider must wrap any component or page that will use the Privy React SDK. It is generally recommended to render it as close to the root of your application as possible.

TIP
If you're new to React and using contexts, check out these resources!

For example, in a NextJS or Create React App project, you may wrap your components like so:

NextJSCreate React App
tsx
'use client';

import {PrivyProvider} from '@privy-io/react-auth';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId="your-privy-app-id"
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
This example assumes you are using the NextJS App Router. You can copy the component above into a providers.tsx file, and import it and render it in your project's _app.tsx.

In the examples above, notice that the PrivyProvider component takes two properties:

Property	Description
appId	(Required) Your Privy app ID, from step 3.
config	(Optional) An object to customize your app's appearance, login vs. linking methods, embedded wallets, supported networks, and more. Learn about customizing your configuration.
5. Just usePrivy! 🎉
Once you've wrapped your app with the PrivyProvider, you can now use the Privy SDK throughout your components and pages via the usePrivy hook!

Check out our starter repo to see what a simple end-to-end integration looks like, or read on to learn how you can use Privy to:

log your users in
prompt users to link additional accounts, as part of progressive onboarding
request signatures and transactions from wallets
and to do so much more!

## Example loging page using client wallet

import Portal from "../components/graphics/portal";
import { useLogin } from "@privy-io/react-auth";
import { PrivyClient } from "@privy-io/server-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  // If no cookie is found, skip any further checks
  if (!cookieAuthToken) return { props: {} };

  const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET;
  const client = new PrivyClient(PRIVY_APP_ID!, PRIVY_APP_SECRET!);

  try {
    const claims = await client.verifyAuthToken(cookieAuthToken);
    // Use this result to pass props to a page for server rendering or to drive redirects!
    // ref https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props
    console.log({ claims });

    return {
      props: {},
      redirect: { destination: "/dashboard", permanent: false },
    };
  } catch (error) {
    return { props: {} };
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  return (
    <>
      <Head>
        <title>Login · Privy</title>
      </Head>

      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-privy-light-blue flex-1 p-6 justify-center items-center">
          <div>
            <div>
              <Portal style={{ maxWidth: "100%", height: "auto" }} />
            </div>
            <div className="mt-6 flex justify-center text-center">
              <button
                className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
                onClick={login}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}


## Creating server wallets
Privy enables your app to easily create new wallets on any EVM network or .

Using the SDK
To create a new wallet, use the Privy client's walletApi.create method. As parameters to the method, pass the following:

Parameter	Type	Description
chainType	'ethereum' | '	Chain type of the wallet to create. 'Ethereum' supports any EVM-compatible network.
idempotencyKey	string	(Optional) Idempotency key to identify a unique request.
authorizationKeyIds	string[]	(Optional) List of authorization key IDs that should be allowed to approve transactions for the wallet.
authorizationThreshold	number	(Optional) The number of authorization key signatures required to approve a transaction. This number must be less than or equal to the number of length of authorizationKeyIds. If not specified, all keys in the authorizationKeyIds list are required.
Once invoked, walletApi.create will request Privy's API to create the desired wallet. The method returns a Promise for an object containing the following:

Field	Type	Description
id	string	Unique ID for the created wallet. Used when requesting signatures or transactions from the wallet in the future.
address	string	Address of the created wallet.
chainType	'ethereum' | '	Chain type of the created wallet.
Below is an example code snippet creating a wallet using the SDK

ts
const {id, address, chainType} = await privy.walletApi.create({chainType: 'ethereum'});
Using the REST API
To create a new wallet, make a POST request to:

sh
https://api.privy.io/v1/wallets
Body
In the request body, include the following:

Field	Type	Description
chain_type	'ethereum' | '	Chain type of the wallet to create. 'Ethereum' supports any EVM-compatible network.
idempotency_key	string	(Optional) Idempotency key to identify a unique request.
authorization_key_ids	string[]	(Optional) List of authorization key IDs that should be allowed to approve transactions for the wallet.
authorization_threshold	number	(Optional) The number of authorization key signatures required to approve a transaction. This number must be less than or equal to the number of length of authorization_key_ids. If not specified, all keys in the authorization_key_ids list are required.
policy_ids	string[]	(Optional) List of policy IDs for policies that should be enforced on the wallet. Currently, only one policy is supported per wallet.
Response
In the response, Privy will send back the following if successful:

Field	Type	Description
id	string	Unique ID of the created wallet. This will be the primary identifier when using the wallet in the future.
chain_type	'ethereum' | '	Chain type of the created wallet.
address	string	Address of the created wallet.
policy_ids	string[]	List of policy IDs for policies that are enforced on the wallet.
Example
As an example, a sample request to create a new EVM wallet might look like the following:

bash
$ curl --request POST https://api.privy.io/v1/wallets \
-u "<your-privy-app-id>:<your-privy-app-secret>" \
-H "privy-app-id: <your-privy-app-id>" \
-H "privy-authorization-signature: <authorization-signature-for-request>" \
-H 'Content-Type: application/json' \
-d '{
  "chain_type": "ethereum"
}'
A successful response will look like the following:

json
{
  "id": "fmfdj6yqly31huorjqzq38zc",
  "address": "0xf9f284C7Eaf97b0f9B5542d83Af7F785D12E803a",
  "chain_type": "ethereum",
  "policy_ids": []
}


## using wallets

Using wallets on EVM networks
You can use Privy server wallets to sign messages and execute transactions on any EVM-compatible network, like Ethereum, Base, or Arbitrum.

Using the SDK
TIP
If you're familiar with the viem library for using wallets on EVM networks, you can integrate Privy server wallets directly with viem.

To execute an EVM action with a server wallet, use the methods on PrivyClient's walletApi.ethereum class.

There are currently four supported EVM actions: signMessage, signTypedData, signTransaction, and sendTransaction. View the parameters required for each method and examples below.

INFO
The walletApi.ethereum methods above respectively correspond to the EIP1193 personal_sign, eth_signTypedData_v4, eth_signTransaction, and eth_sendTransaction methods.

signMessagesignTypedDatasignTransactionsendTransaction
Field	Type	Description
walletId	string	Unique ID of the wallet to take actions with.
idempotencyKey	string	(Optional) Idempotency key to identify a unique request.
message	string | Uint8Array	The string or bytes to sign with the wallet.
tsx
// Get the signature and encoding from the response
const {signature, encoding} = await privy.walletApi.ethereum.signMessage({
  walletId: 'insert-wallet-id',
  message: 'Hello world',
});
Using the REST API
To request a signature or transaction from an Ethereum wallet, make a POST request to:

sh
https://api.privy.io/v1/wallets/<wallet_id>/rpc
TIP
In the request headers, make sure to include Privy's required authentication headers and headers that may be required for your app's wallet API setup.

Body
In the body of the request, include the following fields. Make sure to follow the appropriate guidance for the action you'd like to take with the wallet (signing messages, signing typed data, signing transactions, or signing and broadcasting transactions).

personal_signeth_signTypedData_v4eth_signTransactioneth_sendTransaction
Field	Type	Description
method	'personal_sign'	RPC method to execute with the wallet.
params	Object	Parameters for the RPC method to execute with the wallet.
params.message	string	The message to sign with the wallet. If the message to sign is raw bytes, you must serialize the message as a hexadecimal string.
params.encoding	'utf-8' | 'hex'	The encoding format for params.message. Use utf-8 for a string message and hex for bytes.
Response
personal_signeth_signTypedData_v4eth_signTransactioneth_sendTransaction
If the action is allowed, Privy will send the following fields in the response body:

Field	Type	Description
method	'personal_sign'	The RPC method executed with the wallet.
data	Object	Outputs for the RPC method executed with the wallet.
data.signature	string	An encoded string serializing the signature produced by the user's wallet.
data.encoding	'hex'	The encoding format for the returned signature. Currently, only 'hex' is supported for Ethereum.
Examples
As an example, a sample request to take a delegated action with a wallet might look like the following:

personal_signeth_signTypedData_v4eth_signTransactioneth_sendTransaction
bash
$ curl --request POST https://api.privy.io/v1/wallets/<wallet_id>/rpc \
-u "<your-privy-app-id>:<your-privy-app-secret>" \
-H "privy-app-id: <your-privy-app-id>" \
-H "privy-authorization-signature: <authorization-signature-for-request>" \
-H 'Content-Type: application/json' \
-d '{
  "chain_type": "ethereum",
  "method": "personal_sign",
  "params": {
    "message": "Hello, Ethereum.",
    "encoding": "utf-8"
  }
}'
A successful response will look like the following:

json
{
  "method": "personal_sign",
  "data": {
    "signature": "0x28eac519bf4051a624d4246a5788667baf84dcd7d2a439b314b339013b5cdb4c",
    "encoding": "hex"
  }
}
Using viem
viem is a popular TypeScript library on EVM for executing onchain actions with wallets. Privy's server wallets on EVM natively integrate with viem, allowing you to use the library's interfaces for signing messages, signing typed data, sending transactions, and more.

To integrate with viem, first install version 2^ of the library as a peer dependency:

sh
npm i viem@latest
Then, use Privy's createViemAccount method to initialize an instance of a viem Account for an EVM server wallet. As a parameter to this method, pass an object with the following:

Field	Type	Description
walletId	string	ID of the wallet.
address	0x${string}	Ethereum address of the wallet.
privy	PrivyClient	Instance of the Privy client for your app.
As an example, you can initialize an Account like so:

tsx
import {PrivyClient} from '@privy-io/server-auth';
import {createViemAccount} from '@privy-io/server-auth/viem';

// Initialize your Privy client
const privy = new PrivyClient(...);
// Create a viem account instance for a wallet
const account = await createViemAccount({
  walletId: 'insert-wallet-id',
  address: 'insert-address',
  privy
});
From the returned Account, you can then initialize a viem WalletClient to sign messages and execute transactions with the wallet like so:

tsx
import {createWalletClient, http, parseEther} from 'viem';
import {base} from 'viem/chains';

const client = createWalletClient({
  account, // `Account` instance from above
  chain: base, // Replace with your desired network
  transport: http(),
});

const hash = await client.sendTransaction({
  to: '0x59D3eB21Dd06A211C89d1caBE252676e2F3F2218',
  value: parseEther('0.001'),
});


## Fetching transaction status
INFO
This endpoint is not yet live in production. This guide is intended to be a preview of upcoming functionality.

Privy supports fetching transaction status by the transaction ID.

To do so, make a GET request to

bash
https://api.privy.io/v1/transactions/<transaction_id>
replacing <transaction_id> with the ID of your desired transaction.

Response
Privy will send the following in the response body:

Field	Type	Description
transaction_id	string	ID for the transaction.
wallet_id	string	ID for the wallet that sent the transaction.
status	'broadcasted' | 'confirmed' | 'execution_reverted'	Current status of the transaction.
hash	string	Hash for the transaction.
caip2	string	CAIP-2 chain ID for the network the transaction was broadcasted on.
'broadcasted' refers to when a transaction has been submitted to the network but has not yet been included in a block
'confirmed' refers to when a transaction has been included in a block that has been confirmed on the network. You can additionally configure Privy to wait for more than one block confirmation before updating a transaction's status to 'confirmed'.
'execution_reverted' refers to when a transaction has reverted in execution.
Example
For example, you might fetch a transactions status using transaction ID using the cURL request below.

bash
$ curl --request GET https://api.privy.io/v1/transactions/<transaction_id> \
-u "<your-privy-app-id>:<your-privy-app-secret>" \
-H "privy-app-id: <your-privy-app-id>" \
-H 'Content-Type: application/json' \
The response might look like

json
{
  "transaction_id": "<transaction_id>",
  "wallet_id": "fmfdj6yqly31huorjqzq38zc",
  "status": "confirmed",
  "hash": "0x2446f1fd773fbb9f080e674b60c6a033c7ed7427b8b9413cf28a2a4a6da9b56c",
  "caip2": "eip155:8453"
}



## Policy engine
Privy's policy engine allow your application to restrict the actions that can be taken with server wallets.

Policies allows you to configure transfer limits, allowlists and denylists of transfer recipients, allowlists and denylists of smart contracts and programs, and even constraints around calldata that can be passed to smart contracts.

This ensures that server wallets can only ever be used to take actions your application intends to take.

Managing policies in the Privy Dashboard



### Creating Policies

Creating a policy
To create a new policy, make a POST request to:

sh
https://api.privy.io/v1/policies
TIP
In the request headers, make sure to include Privy's required authentication headers and headers that may be required for your app's wallet API setup.

Body
In the request body, include the following:

Field	Type	Description
version	'1.0'	Version of the policy. Currently, 1.0 is the only version.
name	string	Name to assign to policy.
chain_type	'ethereum'	Chain type for wallets that the policy will be applied to.
method_rules	MethodRule	A list of MethodRule objects describing what rules to apply to each RPC method (e.g. 'eth_sendTransaction') that the wallet can take. This list may contain at most one MethodRule entry for each RPC method. Learn more about MethodRules.
default_action	'ALLOW' | 'DENY'	The default action to take if a wallet request does not satisfy any of the method_rules for the policy.
Once you have successfully created a policy, you can assign that policy to server wallets at creation.

INFO
Currently, the policy engine supports the eth_signTransaction and eth_sendTransaction RPC methods and the ethereum_transaction field source. We are actively expanding support here.

Response
If the policy is created successfully, the response will include the request body as well as an additional unique id field for the policy.

Field	Type	Description
id	string	Unique ID for the policy.
version	'1.0'	Version of the policy. Currently, 1.0 is the only version.
name	string	Name to assign to policy.
chain_type	'ethereum'	Chain type for wallets that the policy will be applied to.
method_rules	MethodRule	A list of MethodRule objects describing what rules to apply to each RPC method (e.g. 'eth_sendTransaction') that the wallet can take. This list may contain at most one MethodRule entry for each RPC method. Learn more about MethodRules.
default_action	'ALLOW' | 'DENY'	The default action to take if a wallet request does not satisfy any of the rules for the policy.
Example
As an example, a sample request to create a new eth_sendTransaction policy might look like the following:

bash
$ curl --request POST https://api.privy.io/v1/policies \
-u "<your-privy-app-id>:<your-privy-app-secret>" \
-H "privy-app-id: <your-privy-app-id>" \
-H "privy-authorization-signature: <authorization-signature-for-request>" \
-H 'Content-Type: application/json' \
-d '{
    "version": "1.0",
    "name": "Allowlist certain smart contracts",
    "chain_type": "ethereum",
    "method_rules": [{
      "method": "eth_sendTransaction",
      "rules": [{
        "name": "Allowlist USDC"
        "conditions": [
            {
                "field_source": "ethereum_transaction",
                "field": "to",
                "operator": "eq",
                "value": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
            },
        ],
        "action": "ALLOW"
      }],
    }],
    "default_action": "DENY"
}'
A successful response will look like the following:

json
{
  "id": "fmfdj6yqly31huorjqzq38zc",
  "name": "Allowlist certain smart contracts",
  "version": "1.0",
  "chain_type": "ethereum",
  "method_rules": [
    {
      "method": "eth_sendTransaction",
      "rules": [
        {
          "name": "Allowlist USDC",
          "conditions": [
            {
              "field_source": "ethereum_transaction",
              "field": "to",
              "operator": "eq",
              "value": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
            }
          ],
          "action": "ALLOW"
        }
      ]
    }
  ],
  "default_action": "DENY"
}


### getting Policies

Getting a policy
To get a policy by its ID, make a GET request to:

bash
https://api.privy.io/v1/policies/<policy_id>
Replacing <policy_id> with the ID of your desired policy.

A sample request to fetch a policy with ID fmfdj6yqly31huorjqzq38zc looks like:

bash
curl --request GET https://api.privy.io/v1/policies/fmfdj6yqly31huorjqzq38zc \
-u "<your-privy-app-id>:<your-privy-app-secret>" \
-H "privy-app-id: <your-privy-app-id>"
A successful response will look like the following:

json
{
  "id": "fmfdj6yqly31huorjqzq38zc",
  "name": "Allowlist certain smart contracts",
  "version": "1.0",
  "chain_type": "ethereum",
  "method_rules": [
    {
      "method": "eth_sendTransaction",
      "rules": [
        {
          "name": "Allowlist USDC",
          "conditions": [
            {
              "field_source": "ethereum_transaction",
              "field": "to",
              "operator": "eq",
              "value": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
            }
          ],
          "action": "ALLOW"
        }
      ]
    }
  ],
  "default_action": "DENY"
}


## Updating a policy
To update an existing policy, make a PATCH request to:

sh
https://api.privy.io/v1/policies/<policy_id>
Replacing <policy_id> with the ID of your desired policy.

TIP
In the request headers, make sure to include Privy's required authentication headers and headers that may be required for your app's wallet API setup.

Body
In the request body, include the following fields:

Field	Type	Description
name	string	(Optional) New name to assign to policy.
method_rules	MethodRule	(Optional) New list of MethodRule objects describing what rules to apply to each RPC method (e.g. 'eth_sendTransaction') that the wallet can take. Learn more about MethodRules.
default_action	'ALLOW' | 'DENY'	(Optional) New default action to take if a wallet request does not satisfy any of the method_rules for the policy.
Any fields not included in the PATCH request body will remain unchanged from the original policy.

Response
If the policy is updated successfully, the response will include the full updated policy object.

Field	Type	Description
id	string	Unique ID for the policy.
version	'1.0'	Version of the policy. Currently, 1.0 is the only version.
name	string	Updated name of the policy.
chain_type	'ethereum'	Chain type for wallets that the policy will be applied to.
method_rules	MethodRule	Updated list of MethodRule objects describing what rules to apply to each RPC method (e.g. 'eth_sendTransaction') that the wallet can take. Learn more about MethodRules.
default_action	'ALLOW' | 'DENY'	Updated default action to take if a wallet request does not satisfy any of the rules for the policy.
Example
As an example, a sample request to update the method_rules of a policy with ID fmfdj6yqly31huorjqzq38zc might look like the following:

bash
$ curl --request PATCH https://api.privy.io/v1/policies/fmfdj6yqly31huorjqzq38zc \
-u "<your-privy-app-id>:<your-privy-app-secret>" \
-H "privy-app-id: <your-privy-app-id>" \
-H "privy-authorization-signature: <authorization-signature-for-request>" \
-H 'Content-Type: application/json' \
-d '{
    "method_rules": [{
      "method": "eth_sendTransaction",
      "rules": [{
        "name": "Allowlist USDT"
        "conditions": [
            {
                "field_source": "ethereum_transaction",
                "field": "to",
                "operator": "eq",
                "value": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
            },
        ],
        "action": "ALLOW"
      }],
    }],
    "default_action": "DENY"
}'
A successful response will look like the following:

json
{
  "id": "fmfdj6yqly31huorjqzq38zc",
  "name": "Allowlist certain smart contracts",
  "version": "1.0",
  "chain_type": "ethereum",
  "method_rules": [
    {
      "method": "eth_sendTransaction",
      "rules": [
        {
          "name": "Allowlist USDT",
          "conditions": [
            {
              "field_source": "ethereum_transaction",
              "field": "to",
              "operator": "eq",
              "value": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
            }
          ],
          "action": "ALLOW"
        }
      ]
    }
  ],
  "default_action": "DENY"
}

### Policy Examples

Examples
Check out some example policies below.

Allowlist a specific smart contract or program interaction
EVM
ts
{
    version: '1.0',
    name: 'Allowlisted contracts',
    chain_type: 'ethereum',
    method_rules: [{
        method: 'eth_sendTransaction',
        rules: [
            {
                name: 'Allowlist the USDC address on Base',
                conditions: [
                    {
                        field_source: 'ethereum_transaction',
                        field: 'to',
                        operator: 'eq',
                        value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
                    },
                    {
                        field_source: 'ethereum_transaction',
                        field: 'chain_id',
                        operator: 'eq',
                        value: '8453'
                    }
                ],
                action: 'ALLOW'
            }
        ]
    }],
    default_action: 'DENY'
}
Configure a max transfer value of the native token (ETH, SOL)
EVM
ts
{
    version: '1.0',
    name: 'Native token transfer maximums'
    chain_type: 'ethereum',
    method_rules: [{
        method: 'eth_sendTransaction',
        rules: [{
            name: 'Restrict ETH transfers to a maximum value',
            conditions: [
                {
                    field_source: 'ethereum_transaction',
                    field: 'value',
                    operator: 'leq',
                    value: '500000000'
                },
            ],
            action: 'ALLOW'
        }]
    }],
    default_action: 'DENY'
}
Configure a max transfer value of an ERC20 or SPL token
EVM
ts
{
    version: '1.0',
    name: 'ERC20 maximums'
    chain_type: 'ethereum',
    method_rules: [{
        method: 'eth_sendTransaction',
        rules: [{
            name: 'Restrict USDC transfers on Base to be less than or equal to some value'
            conditions: [
                {
                    field_source: 'ethereum_transaction',
                    field: 'to',
                    operator: 'eq',
                    value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
                },
                {
                    field_source: 'ethereum_transaction',
                    field: 'chain_id',
                    operator: 'eq',
                    value: '8453'
                },
                {
                    field_source: 'ethereum_calldata',
                    field: 'transfer.amount',
                    abi: [{
                        "inputs": [
                            {
                                "internalType": "address",
                                "name": "recipient",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "name": "transfer",
                        "outputs": [
                            {
                                "internalType": "bool",
                                "name": "",
                                "type": "bool"
                            }
                        ],
                        "stateMutability": "nonpayable",
                        "type": "function"
                    }],
                    operator: 'leq',
                    value: '500000000'
                }
            ],
            action: 'ALLOW'
        }]
    }],
    default_action: 'DENY'
}
Denylist recipients of a transaction
EVM
ts
{
    version: '1.0',
    name: 'Denylisted addresses',
    chain_type: 'ethereum',
    method_rules: [{
        method: 'eth_sendTransaction',
        rules: [{
            name: 'Deny interactions with the USDC contract',
            conditions: [
                {
                    field_source: 'ethereum_transaction',
                    field: 'to',
                    operator: 'eq',
                    value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
                },
            ],
            action: 'DENY'
        }]
    }],
    default_action: 'ALLOW'
}
Enforce policies across multiple RPC methods
EVM
ts
{
    version: '1.0',
    name: 'Example policy with multiple RPC methods',
    chain_type: 'ethereum',
    method_rules: [{
        method: 'eth_sendTransaction',
        rules: [{
            name: 'Deny interactions with the USDC contract',
            conditions: [
                {
                    field_source: 'ethereum_transaction',
                    field: 'to',
                    operator: 'eq',
                    value: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
                },
            ],
            action: 'DENY'
        }]
    }, {
        method: 'personal_sign',
        rules: [{
            name: 'Only allow certain messages to be signed',
            conditions: [
                {
                    field_source: 'ethereum_message',
                    field: 'value',
                    operator: 'eq',
                    value: 'Hello world'
                },
            ],
            action: 'ALLOW'
        }]
    }],
    default_action: 'DENY'
}
Allow all requests for a given RPC method
EVM
ts
{
    version: '1.0',
    name: 'Example policy to allow all personal_sign requests',
    chain_type: 'ethereum',
    method_rules: [{
        method: 'personal_sign',
        rules: [{
            name: 'Allow all EIP191 messages to be signed',
            conditions: [{
                field_source: 'ethereum_message',
                field: 'value',
                operator: 'eq',
                value: '*' // Allow all
            }],
            action: 'ALLOW'
        }],
    }],
    default_action: 'DENY'
}


### Policy Concepts
Policies are defined by three core primitives: policies, rules, and conditions. At a high-level:

Policies are an ordered list of rules that define the total set of actions that are allowed or denied for a server wallet.
Rules are a set of conditions, such that if a request satisfies all of the conditions in a rule, the policy engine executes the action (ALLOW or DENY) prescribed by the rule.
Conditions are boolean statements that the policy engine can evaluate RPC requests against.
You can create and manage policies through the Privy Dashboard or via the REST API.

Policies
A policy is composed from an ordered list of rules for each RPC method that a wallet can execute that define what actions are allowed or denied for the wallet.

Policy objects have the following properties:

Field	Type	Description
version	'1.0'	Version of the policy. Currently, 1.0 is the only version.
name	string	Name to assign to policy.
chain_type	'ethereum' | ''	Chain type for wallets that the policy will be applied to.
method_rules	MethodRule[]	A list of MethodRule objects describing what rules to apply to each RPC method (e.g. 'eth_sendTransaction') that the wallet can take. This list may contain at most one MethodRule entry for each RPC method.
default_action	'ALLOW' | 'DENY'	The default action to take if (1) no rules are configured for the requested RPC method, or (2) the wallet request does not satisfy the rules for the requested RPC method.
Method rules
The nested MethodRule object within the policy's method_rules array has the following properties:

Field	Type	Description
method	'personal_sign' | 'eth_signTypedData_v4' | 'eth_signTransaction' | 'eth_sendTransaction' | 'signMessage' | 'signTransaction' | 'signAndSendTransaction'	RPC method to apply the rules to. Must correspond to the chain_type of the parent policy.
rules	Rule[]	An ordered list of rules defining what actions are allowed or denied by the policy when this RPC method is requested from the wallet.
Policy evaluation
When your application makes a wallet request to a server wallet that has a policy, the policy engine first determines what rules should be applied to the request, by searching for the entry in its method_rules array whose method corresponds to the requested RPC method.

For instance, if your application makes an 'eth_signTransaction' request, the policy engine will first find the entry in the method_rules array with method: 'eth_sendTransaction', to determine what rules should be applied to the request.

Once the policy engine has found the method_rules entry for the requested RPC method, the policy engine will evaluate the request against the rules in this entry in order. For a given rule in the list:

If the request satisfies the conditions for the rule, the policy engine executes the action (ALLOW or DENY) prescribed by the rule. Once this action is taken, the policy engine will not evaluate the request against subsequent rules in the policy.
If the request does not satisfy the conditions for a given rule, the policy engine evaluates the request against the next rule in the policy.
If the request does not satisfy any of the rules for the policy, the policy engine executes the default action for the policy (ALLOW or DENY).

Notes
If your application makes a request to a server wallet with RPC method X, and the policy's method_rules contains no entry with a method corresponding to X, the engine will deny the request by default. If you'd like the policy engine to instead allow requests for RPC method X by default, we recommend setting up an "Allow all" MethodRule for that RPC method like so.
A wallet can be associated with one policy. A policy may only have one method_rules entry for each RPC method it supports. Support for associating multiple policies to the same wallet is coming soon.
Rules
A rule is composed of an set of boolean conditions and an action (ALLOW or DENY) that is taken if an RPC request satisfies all of the conditions in the rule.

Rule objects have the following fields:

Field	Type	Description
name	string	Name to assign to the rule.
conditions	Condition[]	An unordered set of boolean conditions that define the action the rule allows or denies.
action	'ALLOW' | 'DENY'	Whether the rule should allow or deny a wallet request if it satisfies all of the rule's conditions.
Each rule corresponds to an individual action that should be allowed or denied by a server wallet. For example, you might configure rules for a policy to:

ALLOW transfers of the native token to a set of allowlisted recipient addresses
DENY interactions with specific Ethereum smart contracts or  programs
Conditions
A condition is a boolean statement about a wallet request. When evaluating a wallet request against a rule, the policy engine checks whether the wallet request satisfies each of the boolean conditions in the rule. If all of the conditions are satisfied, the engine executes the action associated with the rule.

Conditions allow you to define specific action types that should be allowed or denied for a server wallet.

Field	Type	Description
field_source	'ethereum_transaction' | 'ethereum_calldata' | '_transaction' | '_instruction' | 'interpreted_transaction'	Data source from which to derive the field for the condition.
field	string	The attribute to evaluate for a wallet request. As an example, the field for the recipient of an EVM transaction is 'to'.
abi	JSON	Contract ABI to decode Ethereum calldata against. Should only be set for 'ethereum_calldata' policies. Must strictly be formatted as JSON.
operator	'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in'	Boolean operator used to compare a field with a value
value	string | number | string[]	Static value to compare a field to.
Conditions for certain sources may have additional parameters. For instance, ethereum_calldata conditions also include an abi parameter used to decode the calldata.

Field
Fields are attributes of a wallet request that can be parsed or interpreted from the wallet request. Examples of fields include the to parameter of an EVM transaction, the fee_payer parameter of a  transaction, or an spl_transfer_recipient field that is populated when the policy engine interprets a transaction.

Fields are derived from field sources, which surface data from the wallet request. Possible field sources are listed below.

Field source	Description	Example fields
'ethereum_transaction'	The verbatim Ethereum transaction object in an eth_signTransaction or eth_sendTransaction request.	to, chain_id, value.
'ethereum_calldata'	The decoded calldata in a smart contract interaction as the smart contract method's parameters. Note that that 'ethereum_calldata' conditions must contain an abi parameter with the JSON ABI of the smart contract	function_name, _to, _value (for a ERC20 interaction)
'_transaction'	The verbatim  transaction from a signTransaction or signAndSendTransaction request.	fee_payer, latest_valid_block_height
'_instruction'	The verbatim instruction in a  transaction from a signTransaction or signAndSendTransaction request.	program_id, keys, data
'interpreted_transaction'	Attributes that the policy engine interprets from an wallet request, but are not defined within the request object itself.	spl_transfer_recipient, spl_transfer_value
Operator
Operators are boolean operators used to compare fields and values. Operators include eq, neq, lt, lte, gt, gte, in.

Values
A condition compares a field using its boolean operator to a static value. As an example, if a condition determines whether an Ethereum transaction has specific recipient address X, the value for the condition is X.

