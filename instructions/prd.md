# Product Requirements Document: DeFi Agent with Policy Engine

## Introduction
This project implements a DeFi agent system that leverages Privy's wallet infrastructure and policy engine to create a secure and automated DeFi interaction framework. The system utilizes dual wallets - a user wallet for authentication and personal transactions, and a server wallet for agent operations. The system consists of two agents working in tandem - Agent A for user interactions and transaction execution, and Agent B for contract analysis and classification.

## App Flow
1. **User Signup and Wallet Creation**
   - User signs up to the dapp
   - Privy creates/manages a personal wallet for the user
   - System creates a separate server wallet for Agent A using Privy
   - User wallet is used for authentication and personal transactions
   - Agent server wallet is used for automated operations

2. **Initial Setup**
   - System initializes the hadi-policy in Privy's policy engine
   - Initial allowlist and denylist are configured
   - Agent server wallet is configured with appropriate permissions

3. **User Interaction Flow**
   - User connects with their Privy wallet
   - User requests DeFi activity execution
   - Agent A (using its server wallet) queries hadi-policy for contract status
   - If contract is listed:
     - Execute according to policy (allow/deny)
   - If contract is unlisted:
     - Forward to Agent B for classification
     - Update hadi-policy with new classification
     - Re-execute original request

4. **Policy Update Flow**
   - Agent B receives contract address
   - Agent B performs analysis
   - Agent B sends classification to Agent A
   - Agent A updates hadi-policy
   - Policy engine reflects updated classifications

## Core Features
1. **Wallet Management**
   - User wallet creation and management via Privy
   - Server wallet integration for Agent A
   - Secure key management for both wallets
   - Transaction signing capabilities
   - Clear separation between user and agent operations

2. **Policy Engine**
   - hadi-policy implementation
   - Allowlist/denylist management
   - Policy query interface
   - Policy update mechanism

3. **Agent System**
   - Agent A: User interaction and transaction execution
   - Agent B: Contract analysis and classification
   - Inter-agent communication protocol

4. **Contract Classification**
   - Contract address analysis
   - Classification criteria
   - Classification storage and retrieval

## Tech Stack
1. **Privy Integration**
   - User Wallet Creation and Management
   - Server Wallets SDK
   - Policy Engine API
   - Authentication system

2. **Backend Infrastructure**
   - Node.js/TypeScript
   - API framework (to be determined)
   - Database for agent state management

3. **Smart Contract Integration**
   - Web3 libraries
   - Contract interaction tools

## In Scope
- User wallet creation and management
- Server wallet creation and management
- Policy engine implementation
- Basic contract classification system
- Inter-agent communication
- Transaction execution based on policy
- Policy updates and management
- Wallet permission management

## Out of Scope
- Complex DeFi strategies
- Multiple chain support (initial phase)
- Advanced contract analysis
- Advanced user interface features (initial phase)

## TODO List: Areas Needing Further Definition
1. **Wallet Architecture**
   - Define permission boundaries between user and agent wallets
   - Specify wallet creation flow and error handling
   - Determine wallet recovery procedures
   - Define wallet interaction patterns

2. **Technical Specifications**
   - Specific API endpoints structure
   - Database schema design
   - Error handling protocols
   - Rate limiting implementation

3. **Agent B Classification**
   - Define classification criteria
   - Determine analysis methodology
   - Set classification timeouts
   - Define failure handling

4. **Security Considerations**
   - Access control mechanisms
   - Key rotation policies
   - Backup and recovery procedures
   - Wallet security measures

5. **Policy Rules**
   - Define exact allowlist/denylist criteria
   - Policy update frequency limits
   - Conflict resolution rules

6. **Integration Details**
   - Define exact communication protocol between agents
   - Specify state management approach
   - Detail rollback procedures

7. **Performance Requirements**
   - Response time expectations
   - Throughput requirements
   - Concurrent request handling

8. **Monitoring and Maintenance**
   - Define logging requirements
   - Specify monitoring metrics
   - Establish maintenance procedures

9. **Testing Strategy**
   - Unit testing approach
   - Integration testing plan
   - Security testing requirements
   - Wallet interaction testing

