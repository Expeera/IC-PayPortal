# Fiat Payment Module for Motoko

The Fiat Payment Module for Motoko is a library that provides developers with a set of functions for managing fiat payments on the Internet Computer Protocol (ICP). This module enables seamless integration of popular fiat payment gateways such as Stripe, Paypal, Open Bank, and more into Motoko applications.

## Features

The Fiat Payment Module offers the following features:

- #### Payment Gateway Integration: 
    The module supports integration with popular fiat payment gateways, allowing developers to accept payments from various sources.

- #### Payment Processing:
    It provides functions to handle payment processing tasks, such as creating payment requests, verifying transactions, and handling callbacks.

- #### Secure Transactions: 
    The module ensures secure and reliable transaction handling, adhering to best practices in payment security.

- #### Error Handling: 
    It includes robust error handling mechanisms to gracefully handle exceptions and provide meaningful error messages to users.

## Requirements

1. [IC SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) latest version

2. [NodeJS](https://nodejs.org) version >= 16

3. Install [mops](https://j4mwm-bqaaa-aaaam-qajbq-cai.ic0.app/#/docs/install)


## Development

### Getting Started

1. Clone the git repository.

2. Run `npm install`

3. Run `dfx start --clean`

4. To deploy on a local network run `dfx deploy --network local`, To deploy on the Internet Computer network run `dfx deploy --nerwork ic`

5. After deploying the assets canister ID, open `config.mo` file and replace the `frontend Canister Id` with the new canister ID and deploy again.

6. To generate Typescript type `npm run generate:types`

7. Run `npm run dev`