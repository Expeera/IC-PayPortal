# 🚧 Fiat Payment Module for Motoko

The Fiat Payment Module for Motoko is a library that provides developers with a set of functions for managing fiat payments on the Internet Computer Protocol (ICP). This module enables seamless integration of popular fiat payment gateways such as `Stripe` and `Paypal` into Motoko applications.

<!---
[Live Demo](https://3356i-cqaaa-aaaao-axdqa-cai.icp0.io/) 
-->

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

    ![Create New Invoice Flowchart](images/Create%20new%20Invoice%20Function.png)

- ### Change Invoice Status:
    The `change_invoice_status` function allows authorized users to modify the status of an invoice within an invoice management system. It validates caller authorization, payment method, and invoice existence. The function retrieves invoice and payment information from external services and handles different status scenarios. It updates the invoice status and generates appropriate responses indicating the outcome of the status change. Overall, it showcases the system's flexibility, security measures, integration capabilities, and efficient handling of invoice status modifications.

    ![Change Invoice Status Flowchart](images/Update%20Invoice%20Status.png)

- ### Get My Invoices:
    The `get_my_invoices` function is a query function that allows a caller to retrieve their own invoices from the invoice management system. It first retrieves the list of invoice numbers associated with the caller from the ownerInvoicesTrie. Then, it iterates through the list of invoice numbers, retrieves the corresponding invoice details from the invoicesTrie, and constructs an array of invoices. The function returns this array as the result, providing the caller with their invoices. It provides a convenient way for users to access and view their invoice information within the system.

- ### Get All Invoices to Admin:
    The `get_all_invoices_to_admin` function allows the admin user to retrieve all invoices stored in the system. By returning an array of invoices, it provides the admin with easy access to the complete list of invoices. This function is designed to assist administrators in efficiently managing and reviewing invoices for administrative purposes. It enables them to retrieve and view all invoices in a straightforward manner, streamlining their workflow and facilitating effective invoice management.

- ### Change Invoice Status to Admin:
    The `change_invoice_status_to_admin` function enables the owner or administrator to modify the status of an invoice under certain conditions. This function is useful for updating the status of invoices based on administrative actions or special circumstances. The function ensures that the caller is authorized to make changes and validates the payment method provided in the request. If the conditions are met, the function updates the invoice status in the system, allowing administrators to efficiently manage and track the status of invoices.

    ![Change Invoice Status By Admin Flowchart](images/Update%20Invoice%20Status%20by%20admin.png)

- ### Is Owner: 
    The `isOwner` function checks if the caller is the owner of a resource. It compares the caller's identity with the owner's identity and returns a Boolean indicating the result. It is used for ownership verification in access control and authorization scenarios.

- ### Background Processing of Pending Invoices:
    The invoicing system employs a background processing mechanism to efficiently manage pending invoices. The `check_pending_invoices` function, complemented by the `heartbeat` system function, plays a pivotal role in automatically processing invoices that have been in the "Pending" status for an extended period. By periodically checking pending invoices and updating their status to "Cancelled By System" when the 24-hour threshold is exceeded, the system ensures efficient self-regulation. The `heartbeat` function schedules regular checks, maintaining data accuracy and enhancing overall efficiency. Together, these components provide seamless invoice management for administrators and users, safeguarding the integrity of the invoicing system.

    ![Cancel Pending Invoices Hearbeat Flowchart](images/Cancel%20pending%20invoices%20Hearbeat.png)

## Requirements

1. [IC SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) latest version

2. [NodeJS](https://nodejs.org) version >= 16

3. Install [mops](https://j4mwm-bqaaa-aaaam-qajbq-cai.ic0.app/#/docs/install)


## Development

### ⌛ Installation

1. Clone the git repository.

2. Run `npm install`

3. Run `dfx start --clean`

4. Configure the `fiat` canister's owner before deployment, and update Stripe's `secret_key` and PayPal's `client_id` and `client_secret` in the `service.mo` file. Follow best security practices to store sensitive information securely.

5. To deploy on a local network run `dfx deploy --network local`, To deploy on the Internet Computer network run `dfx deploy --nerwork ic`

6. After deploying the assets canister ID, open `config.mo` file and replace the `frontend Canister Id` with the new assets canister ID and redeploy.

7. To generate Typescript type `npm run generate:types`

8. Run `npm run dev`

9. To test run `sh test/demo.sh`
