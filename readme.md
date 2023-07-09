# Fiat Payment Module for Motoko

The Fiat Payment Module for Motoko is a library that provides developers with a set of functions for managing fiat payments on the Internet Computer Protocol (ICP). This module enables seamless integration of popular fiat payment gateways such as Stripe, Paypal, Open Bank, and more into Motoko applications.

[Live Demo](https://3356i-cqaaa-aaaao-axdqa-cai.icp0.io/)

## Features

The Fiat Payment Module offers the following features:

- ### Payment Gateway Integration: 
    The module supports integration with popular fiat payment gateways, allowing developers to accept payments from various sources.

- ### Payment Processing:
    It provides functions to handle payment processing tasks, such as creating payment requests, verifying transactions, and handling callbacks.

- ### Secure Transactions: 
    The module ensures secure and reliable transaction handling, adhering to best practices in payment security.

- ### Error Handling: 
    It includes robust error handling mechanisms to gracefully handle exceptions and provide meaningful error messages to users.

## Design and Implement the core functions.

- ### Create New Invoice:
    This `create_invoice` function enables users to create a new invoice by providing essential information such as the caller, amount, and payment gateway. It ensures the validity of the input data through various checks before proceeding with invoice creation. By leveraging the Service.Stripe.create_session function, it establishes a payment session with Stripe, a popular payment service provider. Upon successful session creation, the function increments the invoice number, stores the invoice details in a trie data structure, and updates the owner's list of invoices. The function concludes by returning a response that appropriately communicates the outcome of the invoice creation process, indicating whether it was successful or encountered any errors. This allows users to track and process payments using the unique invoice ID generated during the creation process.

    ![Create New Invoice Flowchart](images/Create%20New%20Invoice%20Function.png)

- ### Change Invoice Status:
    The `change_invoice_status` function allows authorized users to modify the status of an invoice within an invoice management system. It validates caller authorization, payment method, and invoice existence. The function retrieves invoice and payment information from external services and handles different status scenarios. It updates the invoice status and generates appropriate responses indicating the outcome of the status change. Overall, it showcases the system's flexibility, security measures, integration capabilities, and efficient handling of invoice status modifications.

    ![Change Invoice Status Flowchart](images/Change%20Invoice%20Status%20Function.png)

- ### Get My Invoices:
    The `get_my_invoices` function is a query function that allows a caller to retrieve their own invoices from the invoice management system. It first retrieves the list of invoice numbers associated with the caller from the ownerInvoicesTrie. Then, it iterates through the list of invoice numbers, retrieves the corresponding invoice details from the invoicesTrie, and constructs an array of invoices. The function returns this array as the result, providing the caller with their invoices. It provides a convenient way for users to access and view their invoice information within the system.

- ### Get All Invoices to Admin:
    The `get_all_invoices_to_admin` function allows the admin user to retrieve all invoices stored in the system. By returning an array of invoices, it provides the admin with easy access to the complete list of invoices. This function is designed to assist administrators in efficiently managing and reviewing invoices for administrative purposes. It enables them to retrieve and view all invoices in a straightforward manner, streamlining their workflow and facilitating effective invoice management.

- ### Is Owner: 
    The `isOwner` function checks if the caller is the owner of a resource. It compares the caller's identity with the owner's identity and returns a Boolean indicating the result. It is used for ownership verification in access control and authorization scenarios.

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

8. To test run `sh test/demo.sh`