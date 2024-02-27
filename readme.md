# 🚧 Fiat Payment Module for Motoko

The Fiat Payment Module for Motoko is a library that provides developers with a set of functions for managing fiat payments on the Internet Computer Protocol (ICP). This module enables seamless integration of popular fiat payment gateways such as `Stripe` and `Paypal` into Motoko applications.

[Live Demo](https://3356i-cqaaa-aaaao-axdqa-cai.icp0.io/): https​&#65279;://3356i-cqaaa-aaaao-axdqa-cai.icp0.io

[The IPV4 base URL of the payment service: ](https://ipv6.mcti.io) 
https​&#65279;://ipv6.mcti.io

[The IPV6 base URL of the payment service: ](https://[2604:a880:4:1d0::6d3:1000]) https​&#65279;://[2604:a880:4:1d0::6d3:1000]


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


## Sandbox Payment Accounts

- ### Stripe

        Card Number: 4242 4242 4242 4242

        Expiry Date: Any future date
    
        CVC: Any 3 digits

    More Cards go to this link: https://docs.stripe.com/testing?testing-method=card-numbers

- ### Paypal

        Email: sb-pnkfz26858873@personal.example.com

        Password: nE6@pf2^

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
    The `is_owner` function checks if the caller is the owner of a resource. It compares the caller's identity with the owner's identity and returns a Boolean indicating the result. It is used for ownership verification in access control and authorization scenarios.

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

### 🕹️ API`s
Here is a step-by-step guide on how to use the `Fiat Payment` Module:

### 1. Create New Invoice:

```motoko
create_invoice(invoice : Types.Request.CreateInvoiceBody) : async Http.Response<Http.ResponseStatus<Types.Response.CreateInvoiceBody, {}>>
```

The `create_invoice` function takes a record as input, containing essential details such as paymentMethod, currency, a vector of items (items) with their respective properties, and the amount. It returns another record with the following fields:

- #### Status: 
    A boolean indicating the overall success of the operation (true for success, false for failure).

- #### Body: 
    A variant containing either an error record (err) or a success record (success). In case of success, it includes an id for the created invoice and additional information about the payment, including a redirectUrl and a transactionId.

- #### Message: 
    A text field providing a descriptive message about the result of the operation.

- #### Status Code: 
    A natural number representing the HTTP status code of the response.

This function plays a crucial role in the invoicing system, empowering users to create invoices and receive relevant information about the newly created invoice and its payment details. For comprehensive implementation details, please refer to the actual code and accompanying documentation, which may include additional validation and error handling to ensure a robust and secure invoicing process.


### 2. Change Invoice Status:

```motoko
change_invoice_status (invoiceReq: Types.Request.ConfirmInvoiceBody) : async Http.Response<Http.ResponseStatus<Types.Response.ConfirmInvoiceBody, {}>>
```

The `change_invoice_status` function takes a record as input, containing essential details such as paymentMethod, invoiceNo, and a boolean value indicating the success of the operation (isSuccess). It returns another record with the following fields:

- #### Status: 
    A boolean indicating the overall success of the operation (true for success, false for failure).

- #### Body: 
    A variant containing either an error record (err) or a success record (success). In case of success, it includes the updated status of the invoice, paymentMethod, invoiceNo, and a transactionId associated with the operation.

- #### Message: 
    A text field providing a descriptive message about the result of the operation.

- #### Status Code: 
    A natural number representing the HTTP status code of the response.

The `change_invoice_status` function is instrumental in the invoicing system, allowing users to modify the status of existing invoices, and provides relevant information about the updated invoice, including the associated payment method and transaction ID. For comprehensive implementation details, please refer to the actual code and accompanying documentation, which may include additional validation and error handling to ensure a robust and secure invoicing process.


### 3. Get my Invoices:

``` motoko
get_my_invoices() : async Http.Response<Http.ResponseStatus<[Invoice], {}>>
```

The `get_my_invoices` query function retrieves invoices associated with the caller's account. It does not require any input parameters. The function returns a record with the following fields:

- #### Status: 
    A boolean indicating the overall success of the operation (true for success, false for failure).

- #### Body: 
    A variant containing either an error record (err) or a success record (success). In case of success, it includes a vector of records, where each record represents an invoice and contains various details such as id, status, paymentMethod, owner, createdAt, currency, paymentLink, items, amount, and transactionId.

- #### Message: 
    A text field providing a descriptive message about the result of the operation.

- #### Status Code: 
    A natural number representing the HTTP status code of the response.

The `get_my_invoices` query enables users to access their invoices efficiently, making it an essential part of the invoicing system. For comprehensive implementation details, please refer to the actual code and accompanying documentation, which may include additional optimizations to enhance query performance and security.

### 4. Change Invoice Status to Admin:

```motoko
change_invoice_status_to_admin (invoiceReq: Types.Request.ConfirmInvoiceAdminBody) : async Http.Response<Http.ResponseStatus<Bool, {}>>
```

The `change_invoice_status_to_admin` function allows administrators to modify the status of a specific invoice using a provided record with fields paymentMethod, isCompleted, and invoiceNo. The function returns a record with the following fields:

- #### Status: 
    A boolean indicating the overall success of the operation (true for success, false for failure).

- #### Body: 
    A variant containing either an error record (err) or a boolean value (success). If the operation is successful, success will be true.

- #### Message: 
    A text field providing a descriptive message about the result of the operation.

- #### Status Code: 
    A natural number representing the HTTP status code of the response.

The `change_invoice_status_to_admin` function plays a vital role in the invoicing system, enabling administrators to efficiently manage and update invoice statuses based on their requirements. For a detailed implementation, please refer to the actual code and accompanying documentation, which may include additional validation and error handling to ensure a secure and effective invoice management process.

### 5. Get All Invoices to Admin:

```motoko
get_all_invoices_to_admin() : async Http.Response<Http.ResponseStatus<[Invoice], {}>>
```

The `get_all_invoices_to_admin` query function retrieves all invoices in the system and is specifically designed for use by administrators. It does not require any input parameters. The function returns a record with the following fields:

- #### Status: 
    A boolean indicating the overall success of the operation (true for success, false for failure).

- #### Body: 
    A variant containing either an error record (err) or a success record (success). In case of success, it includes a vector of records, where each record represents an invoice and contains various details such as id, status, paymentMethod, owner, createdAt, currency, paymentLink, items, amount, and transactionId.

- #### Message: 
    A text field providing a descriptive message about the result of the operation.

- #### Status Code: 
    A natural number representing the HTTP status code of the response.

The `get_all_invoices_to_admin` query allows administrators to easily access and review all invoices stored in the system, facilitating efficient invoice management and administrative tasks. For a comprehensive understanding of the implementation, please refer to the actual code and accompanying documentation, which may include optimizations and security measures to ensure a seamless and secure experience for administrators.

### 6. Invoice Count:

```motoko
invoice_count: () : Nat
```

The `invoice_count` function is a query that takes no input parameters and returns a single natural number (nat). This function is designed to retrieve the total count of invoices in the system. It provides a convenient way for users or administrators to obtain the current number of invoices present, assisting in various statistical analyses or monitoring the growth of invoices over time. For implementation details, refer to the actual code and any accompanying documentation, which may include optimizations and other relevant information.


### 7. Is Owner:

```motoko
is_owner: () : Bool
```

The `is_owner` query function is designed to check if the caller (current user) is the owner of the system or has administrator privileges. It takes no input parameters and returns a boolean value (bool).

This query is crucial for implementing access control and security measures within the system. By calling the isOwner query, users can verify their privileges to perform certain actions or access specific functionalities restricted to the owner or administrators only.

For a comprehensive understanding of the implementation, including the specific checks and validation performed by this query, please refer to the actual code and any accompanying documentation. This will provide insights into how the ownership or administrative status is determined and utilized in the broader context of the application.