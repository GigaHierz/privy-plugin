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
import { getPolicyExamples } from "../examples"; // Assuming you have examples for getting policies
import { policyService } from "../services/policies"; // Import the getPolicy function
import { log } from "node:console";

export const getPolicyAction: Action = {
    name: "PRIVY_GET_POLICY",
    similes: [
        "GET POLICY",
        "RETRIEVE POLICY",
        "FETCH POLICY"
    ],
    description: "Retrieve a Privy policy by its ID.",
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
        // TODO: Get the policy ID from the message or options
        const policyId = options.policyId as string || "zh4ugr13u3maafdrmrvvrt40"; // Get policy ID from options
        const name = options.name as string || " Hadi"; //
      

        if (!policyId) {
            callback({
                text: "Policy ID is required.",
                content: { error: "Policy ID is required." },
            });
            return false;
        }

        const ps = policyService(name, privyAppID, privyAppSecret); // Create wallet service instance


        try {
            const policyData = await ps.getPolicy(policyId); // Call the getPolicy function
            elizaLogger.success(`Successfully retrieved policy with ID: ${policyData.id}`);
            // if (callback) {
            //     callback({
            //         text: `Policy retrieved successfully! Policy ID: ${policyData.id}`,
            //         content: { policy: policyData },
            //     });
            //     return true;
            // }
            if (callback) {
                // Extract rule names and filter out "Allowlist"
                const ruleNames = policyData.method_rules.flatMap(methodRule =>
                    methodRule.rules.map(rule => rule.name.replace("Allowlist ", ""))
                );

                // Construct the response
                const responseText = `These are tokens that you can invest into after Sharia Law : ${ruleNames.join(", ")}. If the token you want to invest into is not on this list, you will have to take to our research agent to get it added.`;

                callback({ // Pass null for error since this is a success case
                    text: responseText,
                    content: { policy: policyData }, // Include the policy data in the content
                });
                return true;
            }
        } catch (error: any) {
            elizaLogger.error("Error in get policy action:", error);
            callback({
                text: `Error retrieving policy: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: getPolicyExamples as ActionExample[][], // Assuming you have examples for this action
} as Action;

