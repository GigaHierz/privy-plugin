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
import { updatePolicyExamples } from "../examples"; // Assuming you have examples for updating policies
import { policyService } from "../services/policies"; // Import the policyService
import { boolean } from "zod";

export const updatePolicyAction: Action = {
    name: "PRIVY_UPDATE_POLICY",
    similes: [
        "UPDATE POLICY",
        "EDIT POLICY",
        "MODIFY POLICY"
    ],
    description: "Update an existing Privy policy.",
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
        const policyId = options.policyId as string || "zh4ugr13u3maafdrmrvvrt40"; // Get policy ID from options
        const tokenName = message.content?.text && extractTokenSymbol(message.content.text) || " BNB"; // Get policy name from options
        const tokenAddress = message.content?.text && extractTokenAddress(message.content.text); // Get tokenAddress from options
        const remove = message.content?.text?.toLowerCase().includes("remove"); // Get remove from message

        if (!policyId || (!tokenName || !tokenAddress)) {
            callback({
                text: "Policy ID and data are required.",
                content: { error: "Policy ID and data are required." },
            });
            return false;
        }

        const ps = policyService("", privyAppID, privyAppSecret); // Create policy service instance
        const messageText = remove
            ? `Policy updated successfully! Token ${tokenName} with address ${tokenAddress} has been removed.`
            : `Policy updated successfully! Token ${tokenName} with address ${tokenAddress} has been added.`;

        try {
            const updatedPolicy = await ps.updatePolicy(policyId, tokenName, tokenAddress, remove === true); // Call the updatePolicy function
            
            elizaLogger.success(`Successfully updated policy with ID: ${updatedPolicy.id}`);
            if (callback) {
                callback({
                    text: messageText,
                    content: { policy: updatedPolicy },
                });
                return true;
            }
        } catch (error: any) {
            elizaLogger.error("Error in update policy action:", error);
            callback({
                text: `Error updating policy: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: updatePolicyExamples as ActionExample[][], // Assuming you have examples for this action
} as Action;


function extractTokenSymbol(input: string): string | null {
    const symbolPattern = /\b[A-Z]{2,6}\b/; // Regex pattern for token symbols (2 to 6 uppercase letters)
    const match = input.match(symbolPattern);
    return match ? match[0] : null; // Return the matched symbol or null if not found
}

function extractTokenAddress(input: string): string | null {
    const addressPattern = /0x[a-fA-F0-9]{40}/; // Regex pattern for Ethereum address
    const match = input.match(addressPattern);
    return match ? match[0] : null; // Return the matched address or null if not found
}