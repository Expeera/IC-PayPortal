
import Trie "mo:base/Trie";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Blob "mo:base/Blob";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import List "mo:base/List";
import Time "mo:base/Time";
import Principal "mo:base/Principal";

import Http "http";
import Types "types";
import Validation "validation";
import Messages "messages";
import Utils "utils";
import Service "service";
import Util "mo:xtended-numbers/Util";


actor Fiat {

    type Invoice = Types.Invoice;

    // Variable to track the invoice number
    private stable var noInvoice : Nat = 1000;

    // Trie to store invoices
    private stable var invoicesTrie : Trie.Trie<Nat, Invoice> = Trie.empty();

    // Trie to store owner's invoices
    private stable var ownerInvoicesTrie : Trie.Trie<Principal, List.List<Nat>> = Trie.empty();

    // Owner's identifier
    private var owner:Text = "y7l3v-ohvp4-dl6mk-vc7bw-5oaqe-7jto7-okfcm-dyjym-olwfs-qzyri-hae";

    // Owner's identifier
    public func getOwner() : async Text {
        return owner
    };

    // Check if the caller is the owner
    public shared query (msg) func isOwner() : async Bool {
        return (owner == Principal.toText(msg.caller))
    };

    // Return the number of invoices in the trie
    public func invoiceCount() : async Nat {
        Trie.size(invoicesTrie)
    };

    public shared ({ caller }) func create_invoice(invoice : Types.Request.CreateInvoiceBody) : async Http.Response<Http.ResponseStatus<Types.Response.CreateInvoiceBody, {}>> {
        // Check if the caller is anonymous
        if (Validation.isAnonymous(caller)) {
            return Utils.generalResponse(false, Messages.not_authorized_to_confirm_invoice, #err({}), Http.Status.UnprocessableEntity);
        }
        // Check if the payment method is empty
        else if (Validation.isEmpty(invoice.paymentMethod)) {
            return Utils.generalResponse(false, Messages.payment_method_is_required, #err({}), Http.Status.UnprocessableEntity)
        }
        // Check if the payment method is valid
        else if (Validation.checkIfThePaymentMethodIsFound(invoice.paymentMethod)) {
            return Utils.generalResponse(false, Messages.payment_method_invalid_value, #err({}), Http.Status.UnprocessableEntity)
        }
        // Check if the currency is empty
        else if (Validation.isEmpty(invoice.currency)) {
            return Utils.generalResponse(false, Messages.currency_is_required, #err({}), Http.Status.UnprocessableEntity)
        }
        // Check if the currency is valid
        else if (Validation.checkIfTheCurrencyIsFound(invoice.currency)) {
            return Utils.generalResponse(false, Messages.currency_invalid_value, #err({}), Http.Status.UnprocessableEntity)
        }
        // Check if the invoice amount is greater than zero
        else if (not(Validation.isGreaterThanZero(invoice.amount))) {
            return Utils.generalResponse(false, Messages.invoice_amount_must_be_greater_than_zero, #err({}), Http.Status.UnprocessableEntity)
        };

        // Create a session with Stripe to initiate payment
        let sessionResult: Result.Result<?Service.Stripe.CreateSession, ?Service.Stripe.ErrorResponse> = await Service.Stripe.create_session(noInvoice + 1, invoice);

        return switch (sessionResult) {
            case (#err err) { 
                switch(err){
                    case(null) {
                        return Utils.generalResponse(false, Messages.created_invoice_failed, #err({}), Http.Status.InternalServerError);
                    };
                    case(?_err) {
                        return Utils.generalResponse(false, _err.error.message, #err({}), Http.Status.InternalServerError);
                    };
                };
            };
            case (#ok session) { 
                switch(session){
                    case(null) {
                        return Utils.generalResponse(false, Messages.created_invoice_failed, #err({}), Http.Status.InternalServerError);
                    };
                    case(?_session) {
                        // Increment the invoice number
                        noInvoice += 1;

                        // Store the invoice details in the trie
                        invoicesTrie := Trie.put(
                            invoicesTrie,
                            Utils.keyNat(noInvoice),
                            Nat.equal,
                            {
                                id = noInvoice;
                                owner = caller;
                                amount = invoice.amount;
                                status = Types.InvoiceStatus.Pending;
                                transactionId = _session.id;
                                paymentLink = _session.url;
                                paymentMethod = invoice.paymentMethod;
                                currency = invoice.currency;
                                createdAt = Time.now();
                            },
                        ).0;

                        // Retrieve the list of invoices for the owner
                        var ownerInvoicesList : List.List<Nat> = switch (Trie.get(ownerInvoicesTrie, Utils.keyPrincipal(caller), Principal.equal)) {
                            case null List.nil<Nat>();
                            case (?result) result;
                        };

                        // Add the new invoice to the owner's list of invoices
                        ownerInvoicesList := List.push(noInvoice, ownerInvoicesList);

                        // Update the owner's invoices in the trie
                        ownerInvoicesTrie := Trie.replace(
                            ownerInvoicesTrie,
                            Utils.keyPrincipal(caller),
                            Principal.equal, 
                            ?ownerInvoicesList,
                        ).0;

                        return Utils.generalResponse(true, Messages.created_invoice_successfully, #success({ 
                            id = noInvoice; 
                            payment = {
                                transactionId   = _session.id;
                                redirectUrl = _session.url;
                            } 
                        }), Http.Status.OK)
                    };
                };
            };                        
        };
    };

    ///////////////////////// Admin Fucntion /////////////////////////

    public shared({caller}) func get_all_invoices_to_admin() : async [Invoice] {
        // Convert the invoice trie into an array of invoices
        Iter.toArray(
            Iter.map(
                Trie.iter(invoicesTrie),
                func((invoiceNo : Nat, invoice : Invoice)) : Invoice = invoice,
            ),
        );
    };

    ///////////////////////// Admin Fucntion /////////////////////////

    public query({caller}) func get_my_invoices() : async [Invoice] {
        // Retrieve the list of invoice numbers belonging to the caller
        var invoiceNumberList : List.List<Nat> = switch (Trie.find(ownerInvoicesTrie, Utils.keyPrincipal(caller),Principal.equal)) {
            case null List.nil<Nat>();
            case (?result) result;
        };

        // Convert the list of invoice numbers into an array of invoices
        List.toArray(List.map<Nat, Invoice>(invoiceNumberList, func (invoiceNo: Nat): Invoice { 
            // Retrieve the invoice value using the invoice number
            let invoiceVal = Trie.find(invoicesTrie, Utils.keyNat(invoiceNo), Nat.equal);
            return switch(invoiceVal) {
                case (?invoice) invoice;
            };
        }));
    };

    public shared({caller}) func change_invoice_status (invoiceReq: Types.Request.ConfirmInvoiceBody) : async Http.Response<Http.ResponseStatus<Types.Response.ConfirmInvoiceBody, {}>> {
        // Check if the caller is anonymous
        if (Validation.isAnonymous(caller)) {
            return Utils.generalResponse(false, Messages.not_authorized_to_confirm_invoice, #err({}), Http.Status.UnprocessableEntity);
        }
        // Check if the payment method is empty
        else if (Validation.isEmpty(invoiceReq.paymentMethod)) {
            return Utils.generalResponse(false, Messages.payment_method_is_required, #err({}), Http.Status.UnprocessableEntity);
        }
        // Check if the payment method is valid
        else if (Validation.checkIfThePaymentMethodIsFound(invoiceReq.paymentMethod)) {
            return Utils.generalResponse(false, Messages.payment_method_invalid_value, #err({}), Http.Status.UnprocessableEntity);
        };

        // Retrieve the invoice value using the invoice number
        let invoiceVal = Trie.find(invoicesTrie, Utils.keyNat(invoiceReq.invoiceNo), Nat.equal);

        switch(invoiceVal) {
            case (null) {
                return Utils.generalResponse(true, Messages.invoice_not_found, #err({}), Http.Status.InternalServerError);
            };
            case (?invoiceFind) {
                // Check if the caller is the owner of the invoice
                if(not(Text.equal(Principal.toText(caller), Principal.toText(invoiceFind.owner)))) {
                    return Utils.generalResponse(false, Messages.invoice_not_found, #err({}), Http.Status.UnprocessableEntity);
                }
                // Check if the payment method matches the invoice
                else if(not(Text.equal(invoiceFind.paymentMethod, invoiceReq.paymentMethod))) {
                    return Utils.generalResponse(false, Messages.invoice_not_found, #err({}), Http.Status.UnprocessableEntity);
                }
                // Check if the invoice is in the pending status
                else if(not(Text.equal(invoiceFind.status, Types.InvoiceStatus.Pending))) {
                    return Utils.generalResponse(false, Messages.invoice_not_pending, #err({}), Http.Status.UnprocessableEntity);
                };
                
                // Retrieve the invoice result using the transaction ID
                let invoiceResult:Result.Result<?Service.Stripe.RetrieveSession, ?Service.Stripe.ErrorResponse> = await Service.Stripe.retrieve_session(invoiceFind.transactionId);
                
                switch (invoiceResult) {
                    case (#err err) { 
                        switch(err){
                            case(null) {
                                return Utils.generalResponse(false, Messages.confirmed_invoice_failed, #err({}), Http.Status.InternalServerError);
                            };
                            case(?_err) {
                                return Utils.generalResponse(false, _err.error.message, #err({}), Http.Status.InternalServerError);
                            };
                        };
                    };
                    case (#ok invoiceRes) { 
                        switch(invoiceRes) {
                            case(null) {
                                return Utils.generalResponse(false, Messages.confirmed_invoice_failed, #err({}), Http.Status.InternalServerError);
                            };
                            case(?_invoiceRes) {
                                
                                 // If the invoice request is successful and the payment status is "unpaid"
                                if (invoiceReq.isSuccess and Text.equal(_invoiceRes.payment_status, "unpaid")) {
                                    return Utils.generalResponse(false, Messages.unpaid_error_message, #err({}), Http.Status.UnprocessableEntity);
                                } 
                                // If the invoice request is not successful and the payment status is "paid"
                                else if (not(invoiceReq.isSuccess) and Text.equal(_invoiceRes.payment_status, "paid")) {
                                    return Utils.generalResponse(false, Messages.payment_failed_error_message, #err({}), Http.Status.UnprocessableEntity);
                                };

                                // Create a new invoice with updated status
                                let newInvoice = {
                                    id = invoiceFind.id;
                                    owner = invoiceFind.owner;
                                    amount = invoiceFind.amount;
                                    status = switch(invoiceReq.isSuccess){
                                        case(true)  Types.InvoiceStatus.Completed;
                                        case(false) Types.InvoiceStatus.Cancelled;
                                    };
                                    transactionId = invoiceFind.transactionId;
                                    paymentLink = invoiceFind.paymentLink;
                                    paymentMethod = invoiceFind.paymentMethod;
                                    currency = invoiceFind.currency;
                                    createdAt = invoiceFind.createdAt;
                                };

                                // Replace the old invoice with the new invoice in the trie
                                invoicesTrie := Trie.replace(
                                    invoicesTrie,
                                    Utils.keyNat(invoiceReq.invoiceNo),
                                    Nat.equal, 
                                    ?newInvoice,
                                ).0;

                                return Utils.generalResponse(true, 
                                    switch(invoiceReq.isSuccess) {
                                        case(true)  Messages.confirmed_invoice_successfully;
                                        case(false) Messages.cancelled_invoice_successfully;
                                    },
                                    #success({ 
                                        invoiceNo = invoiceReq.invoiceNo; 
                                        transactionId = invoiceFind.transactionId; 
                                        paymentMethod = invoiceFind.paymentMethod; 
                                        status = newInvoice.status; 
                                    }), 
                                    Http.Status.OK);

                            };
                        };        
                    };
                };
            };  
        };   
    };

    public query func get_actor_id_as_text() : async Text {
        // Convert the actor ID to text
        Principal.toText(Principal.fromActor(Fiat));
    };
}
