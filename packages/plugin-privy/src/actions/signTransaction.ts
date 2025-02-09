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
import { signTransactionExamples } from "../examples"; // Assuming you have examples for signing transactions
import { walletService } from "../services/wallets"; // Import the signTransaction function

export const signTransactionAction: Action = {
    name: "PRIVY_SIGN_TRANSACTION",
    similes: [
        "SIGN TRANSACTION",
        "APPROVE TRANSACTION",
        "AUTHORIZE TRANSACTION"
    ],
    description: "Sign a transaction using the Privy API.",
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
        const privyAppID = config.PRIVY_APP_ID; // Get the Privy API key from the config
        const privyAppSecret = config.PRIVY_APP_SECRET; // Get the Privy app secret from the config
        const walletId = options.walletId as string; // Get wallet ID from options
        const transaction = options.transaction as {
            to: string;
            value: number;
            chain_id: number;
            type?: number;
            gas_limit?: string;
            nonce: number;
            max_fee_per_gas?: string;
            max_priority_fee_per_gas?: string;
        }; // Get transaction details from options

        if (!walletId || !transaction) {
            callback({
                text: "Wallet ID and transaction details are required.",
                content: { error: "Wallet ID and transaction details are required." },
            });
            return false;
        }

        const ws = walletService(privyAppID, privyAppSecret); // Create wallet service instance

        try {
            const result = await ws.signTransaction(walletId, transaction); // Call the signTransaction function
            elizaLogger.success(`Successfully signed transaction with ID: ${result.id}`);
            if (callback) {
                callback({
                    text: `Transaction signed successfully! Transaction ID: ${result.id}`,
                    content: { transaction: result },
                });
                return true;
            }
        } catch (error: any) {
            elizaLogger.error("Error in sign transaction action:", error);
            callback({
                text: `Error signing transaction: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: signTransactionExamples as ActionExample[][], // Assuming you have examples for this action
} as Action;
