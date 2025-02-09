/**
 * @fileoverview Type definitions for Privy Wallet API
 * 
 * These types represent the structure of Privy's Wallet API requests and responses.
 * The Wallet API allows for creation and management of custodial wallets that can
 * be controlled through authorization keys and policies.
 * 
 * @see https://docs.privy.io/guide/server-wallets/
 */

/**
 * Request body for creating a new Privy wallet.
 */
export interface PrivyCreateWallet {
    /** Chain type of the wallet to create. Ethereum supports any EVM-compatible network */
    chain_type: 'ethereum' | 'solana';

    /** Optional idempotency key to identify a unique request */
    idempotency_key?: string;

    /** Optional list of authorization key IDs that can approve transactions */
    authorization_key_ids?: string[];

    /** 
     * Optional number of required signatures to approve a transaction.
     * Must be <= length of authorization_key_ids if specified.
     */
    authorization_threshold?: number;

    /**
     * Optional list of policy IDs to enforce on the wallet.
     * Currently, only one policy is supported per wallet.
     */
    policy_ids?: string[];
}

/**
 * Response structure when creating a new Privy wallet.
 */
export interface PrivyCreateWalletResponse {
    /** Unique ID of the created wallet */
    id: string;

    /** Chain type of the created wallet */
    chain_type: 'ethereum' | 'solana';

    /** Address of the created wallet */
    address: string;

    /** List of policy IDs that are enforced on the wallet */
    policy_ids: string[];
}

/**
 * Request body for updating a Privy wallet.
 */
export interface PrivyUpdateWallet {
    /** Optional list of policy IDs to enforce on the wallet. Currently, only one policy is supported per wallet. */
    policy_ids?: string[];

    /** Optional list of authorization key IDs to authorize actions on the wallet */
    authorization_key_ids?: string[];

    /** 
     * Optional authorization key threshold if a quorum of authorization keys is needed 
     * to authorize wallet actions 
     */
    authorization_key_threshold?: number;
}

/**
 * Response structure when updating a Privy wallet.
 */
export interface PrivyUpdateWalletResponse {
    /** Unique ID of the wallet */
    id: string;

    /** Address of the wallet */
    address: string;

    /** Chain type of the wallet */
    chain_type: 'ethereum' | 'solana';

    /** List of policy IDs that are enforced on the wallet */
    policy_ids: string[];
}

/**
 * Parameters for signing a transaction or message with a Privy wallet.
 */
export interface PrivySign {
    /** RPC method to execute with the wallet */
    method: 'personal_sign';

    /** Parameters for the RPC method */
    params: {
        /** 
         * The message to sign with the wallet. 
         * For raw bytes, serialize the message as a hexadecimal string.
         */
        message: string;

        /** 
         * The encoding format for the message.
         * Use 'utf-8' for string messages and 'hex' for byte data.
         */
        encoding: 'utf-8' | 'hex';
    };
}

/**
 * Parameters for signing typed data with a Privy wallet.
 */
export interface PrivySignTypedData {
    /** RPC method to execute with the wallet */
    method: 'eth_signTypedData_v4';

    /** Parameters for the RPC method */
    params: {
        /** The typed data object to sign with the wallet, defined in EIP-712 */
        typed_data: {
            /** The typed data's domain, per the EIP-712 specification */
            domain: object;

            /** The typed data's types, per the EIP-712 specification */
            types: object;

            /** The typed data's primary type, per the EIP-712 specification */
            primary_type: string;

            /** The typed data's message, per the EIP-712 specification */
            message: object;
        };
    };
}


/**
 * Parameters for signing a transaction with a Privy wallet.
 */
export interface PrivySignTransaction {
    /** RPC method to execute with the wallet */
    method: 'eth_signTransaction';

    /** Parameters for the RPC method */
    params: {
        /** The transaction to sign with the wallet */
        transaction: {
            /** The unique identifier of the chain */
            chain_id: string;

            /** Other transaction fields (e.g., nonce, gas, gas_price, to, value, data) */
            nonce?: string;
            gas?: string;
            gas_price?: string;
            to?: string;
            value?: string;
            data?: string;
        };
    };
}


/**
 * Parameters for sending a transaction with a Privy wallet.
 */
export interface PrivySendTransaction {
    /** RPC method to execute with the wallet */
    method: 'eth_sendTransaction';

    /** CAIP2 chain ID to broadcast the transaction on */
    caip2: string; // Begins with 'eip155:'

    /** Parameters for the RPC method */
    params: {
        /** The transaction to sign with the wallet */
        transaction: {
            /** The unique identifier of the chain */
            chain_id: string;

            /** Other transaction fields (e.g., nonce, gas, gas_price, to, value, data) */
            nonce?: string;
            gas?: string;
            gas_price?: string;
            to?: string;
            value?: string;
            data?: string;
        };
    };
}

/**
 * Response structure when signing a transaction with a Privy wallet.
 */
export interface PrivySignResponse {
    /** The RPC method executed with the wallet */
    method: 'personal_sign';

    /** Outputs for the RPC method executed with the wallet */
    data: {
        /** An encoded string serializing the signature produced by the user's wallet */
        signature: string;

        /** The encoding format for the returned signature */
        encoding: 'hex'; // Currently, only 'hex' is supported for Ethereum
    };
}

/**
 * Response structure when signing typed data with a Privy wallet.
 */
export interface PrivySignTypedDataResponse {
    /** The RPC method executed with the wallet */
    method: 'eth_signTypedData_v4';

    /** Outputs for the RPC method executed with the wallet */
    data: {
        /** An encoded string serializing the signature produced by the user's wallet */
        signature: string;

        /** The encoding format for the returned signature */
        encoding: 'hex'; // Currently, only 'hex' is supported for Ethereum
    };
}


/**
 * Response structure when signing a transaction with a Privy wallet.
 */
export interface PrivySignTransactionResponse {
    /** The RPC method executed with the wallet */
    method: 'eth_signTransaction';

    /** Outputs for the RPC method executed with the wallet */
    data: {
        /** An encoded string serializing the signed transaction produced by the user's wallet */
        signed_transaction: string;

        /** The encoding format for the returned signed_transaction */
        encoding: 'rlp'; // Currently, only 'rlp' is supported for Ethereum
    };
}

/**
 * Response structure when sending a transaction with a Privy wallet.
 */
export interface PrivySendTransactionResponse {
    /** The RPC method executed with the wallet */
    method: 'eth_sendTransaction';

    /** Outputs for the RPC method executed with the wallet */
    data: {
        /** The hash for the broadcasted transaction */
        hash: string;

        /** The chain ID the transaction was sent on */
        caip2: string; // The CAIP2 chain ID
    };
}

/**
 * Query parameters for listing Privy wallets.
 */
export interface GetPrivyListWallets {
    /** ID of the wallet from which start the search */
    cursor?: string;

    /** Max amount of wallets per page */
    limit?: number;

    /** Chain type to filter by */
    chain_type?: 'ethereum' | 'solana';
}

/**
 * Response structure for listing Privy wallets.
 */
export interface PrivyListWalletsResponse {
    /** List of wallets in the current page */
    data: WalletApiWalletResponseType[];

    /** ID of the wallet from which start the next page */
    next_cursor?: string;
}

/**
* Response type for a single wallet from the Privy API.
*/
export interface WalletApiWalletResponseType {
    /** Unique ID of the wallet */
    id: string;

    /** Chain type of the wallet */
    chain_type: 'ethereum' | 'solana';

    /** Address of the wallet */
    address: string;

    /** The creation date of the wallet, in milliseconds since midnight, January 1, 1970 UTC */
    created_at: number;
}

