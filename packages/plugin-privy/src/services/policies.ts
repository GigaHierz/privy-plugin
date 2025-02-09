import {
    PrivyRule,
    PrivyPolicyResponse,
    PrivyUpdatePolicy,
} from "../types/policies";
import { PrivyCreateWalletResponse } from "../types/wallets";

const BASE_URL = "https://api.privy.io/v1/policies";



export const policyService = (name: string, privyAppID: string, privyAppSecret: string, authRequestKey?: string) => {
    const createPolicy = async (): Promise<PrivyPolicyResponse> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'privy-app-id': privyAppID,
            'Authorization': `Basic ${Buffer.from(`${privyAppID}:${privyAppSecret}`).toString('base64')}`
        };

        // Only add authorization signature if it exists
        if (authRequestKey) {
            headers['privy-authorization-signature'] = authRequestKey;
        }

        const policy = {
            "version": "1.0",
            "name": name,
            "chain_type": "ethereum",
            "method_rules": [{
                "method": "eth_sendTransaction",
                "rules": [],
            }],
            "default_action": "DENY"
        };

        try {
            const url = BASE_URL;
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(policy)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("Privy API Error:", error.message);
            throw error;
        }
    };

    // TODO: add the case, if you need to remove a token from the allowlist
    const updatePolicy = async (policyId: string, tokenName: string, tokenAddress: string, remove:boolean): Promise<PrivyPolicyResponse> => {
        if (!policyId) {
            throw new Error("Invalid parameters");
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'privy-app-id': privyAppID,
            'Authorization': `Basic ${Buffer.from(`${privyAppID}:${privyAppSecret}`).toString('base64')}`
        };

        try {
            const url = `${BASE_URL}/${policyId}`;
            const existingPolicy = await getPolicy(policyId);
            const updatedPolicy = remove ? denylistToken(existingPolicy, tokenName, tokenAddress) : allowlistToken(existingPolicy, tokenName, tokenAddress);
            
            const response = await fetch(url, {
                method: 'PATCH',
                headers,
                body: JSON.stringify(updatedPolicy)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("Privy API Error:", error.message);
            throw error;
        }
    };

    const getPolicy = async (policyId: string): Promise<PrivyPolicyResponse> => {
        if (!policyId) {
            throw new Error("Invalid parameters");
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'privy-app-id': privyAppID,
            'Authorization': `Basic ${Buffer.from(`${privyAppID}:${privyAppSecret}`).toString('base64')}`
        };

        // Only add authorization signature if it exists
        if (authRequestKey) {
            headers['privy-authorization-signature'] = authRequestKey;
        }

        try {
            const url = `${BASE_URL}/${policyId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("Privy API Error:", error.message);
            throw error;
        }
    };

    return { createPolicy, updatePolicy, getPolicy };
};


function allowlistToken(existingPolicy: PrivyPolicyResponse, tokenName: string, tokenAddress: string): PrivyUpdatePolicy {
    const newRule: PrivyRule = {
        "name": `Allowlist ${tokenName}`,
        "conditions": [
            {
                "field_source": "ethereum_transaction",
                "field": "to",
                "operator": "eq",
                "value": tokenAddress
            }
        ],
        "action": "ALLOW"
    };
    

    // Create a deep copy of the existing policy
    const updatedPolicy: PrivyUpdatePolicy = {
        name: existingPolicy.name,
        method_rules: existingPolicy.method_rules ? [...existingPolicy.method_rules] : [],
    };

    // Add the new rule if method_rules exists
    if (updatedPolicy.method_rules && updatedPolicy.method_rules[0]) {
        updatedPolicy.method_rules[0].rules.push(newRule);
    }

    return updatedPolicy;
}

function denylistToken(existingPolicy: PrivyPolicyResponse, tokenName: string, tokenAddress: string): PrivyUpdatePolicy {
    // Create a deep copy of the existing policy with only updateable fields
    const updatedPolicy: PrivyUpdatePolicy = {
        name: existingPolicy.name,
        method_rules: existingPolicy.method_rules ? [...existingPolicy.method_rules] : [],
    };

    // Remove the rule for the specified token if method_rules exists
    if (updatedPolicy.method_rules && updatedPolicy.method_rules[0]) {
        updatedPolicy.method_rules[0].rules = updatedPolicy.method_rules[0].rules.filter(rule => {
            // Check if this rule is for the specified token
            const isTokenRule = rule.conditions?.some(condition =>
                condition.field_source === "ethereum_transaction" &&
                condition.field === "to" &&
                condition.value === tokenAddress
            );
            // Keep all rules that aren't for this token
            return !isTokenRule;
        });
    }

    return updatedPolicy;
}


