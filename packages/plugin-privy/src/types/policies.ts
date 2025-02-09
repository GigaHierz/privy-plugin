/**
 * @fileoverview Type definitions for Privy Policy API
 * 
 * These types represent the structure of Privy's Policy API requests and responses.
 * Policies are used to define rules for wallet transactions, allowing or denying
 * specific actions based on conditions like token addresses, transaction types, etc.
 * 
 * @see https://docs.privy.io/guide/server-wallets/policies/concepts
 */

/**
 * Represents a condition in a Privy policy rule.
 * Conditions are boolean statements about wallet requests that determine if a rule applies.
 */
export interface PrivyCondition {
    field_source: 'ethereum_transaction' |
    'ethereum_calldata' |
    'solana_transaction' |
    'solana_instruction' |
    'interpreted_transaction';
    field: string;
    abi?: JSON;
    operator: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in';
    value: string | number | string[];
}

/**
 * Represents a single rule in a Privy policy.
 * Rules combine conditions with an action (ALLOW/DENY) to control wallet behavior.
 */
export interface PrivyRule {
    name: string;
    conditions: PrivyCondition[];
    action: 'ALLOW' | 'DENY';
}

/**
 * Represents method-specific rules in a Privy policy.
 * Each method (like eth_sendTransaction) can have its own set of rules.
 */
export interface PrivyMethodRule {
    method: 'personal_sign' |
    'eth_signTypedData_v4' |
    'eth_signTransaction' |
    'eth_sendTransaction' |
    'signMessage' |
    'signTransaction' |
    'signAndSendTransaction';
    rules: PrivyRule[];
}

/**
 * Request body for creating a new Privy policy.
 * Contains all required fields for policy creation.
 */
export interface PrivyCreatePolicy {
    version: string | '1.0';
    name: string;
    chain_type: 'ethereum' | 'solana';
    method_rules: PrivyMethodRule[];
    default_action: 'ALLOW' | 'DENY';
}

/**
 * Response structure when creating or retrieving a Privy policy.
 * Includes all policy fields plus a unique identifier.
 */
export interface PrivyPolicyResponse {
    id: string;
    version: string | '1.0';
    name: string;
    chain_type: 'ethereum' | 'solana';
    method_rules: PrivyMethodRule[];
    default_action: 'ALLOW' | 'DENY';
}

/**
 * Request body for updating an existing Privy policy.
 * All fields are optional as you can update specific parts of the policy.
 */
export interface PrivyUpdatePolicy {
    name?: string;
    method_rules?: PrivyMethodRule[];
    default_action?: 'ALLOW' | 'DENY';
}