import { Plugin } from "@elizaos/core";
import { getPolicyAction } from "./actions/getPolicy";
import { createPolicyAction } from "./actions/createPolicy";
import {  updatePolicyAction } from "./actions/updatePolicy";
import { createWalletAction } from "./actions/createWallet";
import { sendTransactionAction } from "./actions/sentTransaction";
import { signTransactionAction } from "./actions/signTransaction";



export const privyPlugin: Plugin = {
    name: "privy",
    description: "PRIVY plugin for Eliza",
    actions: [getPolicyAction, createPolicyAction, updatePolicyAction, createWalletAction, sendTransactionAction, signTransactionAction],
    // evaluators analyze the situations and actions taken by the agent. they run after each agent action
    // allowing the agent to reflect on what happened and potentially trigger additional actions or modifications
    // TODO: add an evaluator that check if the contract address provided is on the allowlist, on the denylist, or neither
    evaluators: [],
    // providers supply information and state to the agent's context, help agent access necessary data
    // TODO: in case the contract address is not on the allowlist or denylist, the agent should call another agent to check if it should be on the allowlist or denylist
    // TODO: in case the contract address is on the allowlist or denylist, the agent should call another agent to provide that information to the user/ agent
    providers: [],
};
export default privyPlugin;