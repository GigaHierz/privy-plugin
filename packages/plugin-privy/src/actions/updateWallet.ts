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
import { updateWalletExamples } from "../examples"; // Assuming you have examples for updating wallets
import { walletService } from "../services/wallets"; // Import the walletService
import { PrivyClient } from '@privy-io/server-auth';

export const updateWalletAction: Action = {
    name: "PRIVY_UPDATE_WALLET",
    similes: [
        "UPDATE WALLET",
        "EDIT WALLET",
        "MODIFY WALLET"
    ],
    description: "Update an existing Privy wallet.",
    validate: async (runtime: IAgentRuntime) => {
        await validatePrivyConfig(runtime); // Validate Privy configuration
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: { walletId: string; updates: any },
        callback: HandlerCallback
    ) => {
        const config = await validatePrivyConfig(runtime);
        const privyAppID = config.PRIVY_APP_ID; // Get the Privy app id from the config
        const privyAppSecret = config.PRIVY_APP_SECRET; // Get the Privy app secret from the config

        const privy = new PrivyClient(privyAppID, privyAppSecret);
        const ws = walletService(privyAppID, privyAppSecret); // Create wallet service instance

        try {
            // Update the wallet with the provided updates
            const updatedWalletData = await ws.updateWallet(options.walletId, options.updates);
            elizaLogger.success(`Successfully updated wallet with ID: ${updatedWalletData.id}`);
            if (callback) {
                callback({
                    text: `Wallet updated successfully! Wallet ID: ${updatedWalletData.id}`,
                    content: { wallet: updatedWalletData },
                });
                return true;
            }
        } catch (error: any) {
            elizaLogger.error("Error in update wallet action:", error);
            callback({
                text: `Error updating wallet: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: updateWalletExamples as ActionExample[][], // Assuming you have examples for this action
} as Action;