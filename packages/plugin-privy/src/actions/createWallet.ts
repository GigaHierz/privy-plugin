import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { validatePrivyConfig } from "../environment"; // Assuming you have a config validation function
import { createWalletExamples } from "../examples"; // Assuming you have examples for creating wallets
import { walletService } from "../services/wallets"; // Import the walletService
import {PrivyClient} from '@privy-io/server-auth';


export const createWalletAction: Action = {
    name: "PRIVY_CREATE_WALLET",
    similes: [
        "CREATE WALLET",
        "NEW WALLET",
        "ADD WALLET"
    ],
    description: "Create a new Privy wallet.",
    validate: async (runtime: IAgentRuntime) => {
        await validatePrivyConfig(runtime); // Validate Privy configuration
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        const config = await validatePrivyConfig(runtime);
        const privyAppID = config.PRIVY_APP_ID; // Get the Privy app id from the config
        const privyAppSecret = config.PRIVY_APP_SECRET; // Get the Privy app secret from the config
        const policyIds = options.policyIds as string[] || ['zh4ugr13u3maafdrmrvvrt40']; // Get policy IDs from options

        const privy = new PrivyClient(privyAppID, privyAppSecret);


        const ws = walletService(privyAppID, privyAppSecret); // Create wallet service instance

        try {
            // Create a Wallet with the SDK (not possible to add a policy to the wallet)
            // const {id, address, chainType} = await privy.walletApi.create({chainType: 'ethereum'});
            // console.log('wallet created', id, address, chainType);
            

            const walletData = await ws.createWallet(policyIds);
            elizaLogger.success(`Successfully created wallet with Address: ${walletData.address}`);
            if (callback) {
                callback({
                    text: `Wallet created successfully! Wallet Address: ${walletData.address}. You can start by pre-funding it to use it for your first transactions.`,
                    // content: { wallet: {id, address, chainType} },
                     content: { wallet: walletData },
                });
                return true;
            }
        } catch (error: any) {
            elizaLogger.error("Error in create wallet action:", error);
            callback({
                text: `Error creating wallet: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: createWalletExamples as ActionExample[][], // Assuming you have examples for this action
} as Action;