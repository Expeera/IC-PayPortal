import Text "mo:base/Text";
import Nat "mo:base/Nat";

module {

    // Define the frontend canister ID used for constructing URLs
    private let frontendCanisterId:Text = "rrkah-fqaaa-aaaaa-aaaaq-cai";
    private let local_base_url = "localhost:8000"; 
    private let live_base_url = "icp0.io"; 

    // Function to generate the Stripe success URL for a specific invoice
    public func get_stripe_success_url (invoiceNo:Nat): Text { 
        "http://"# frontendCanisterId #"."# local_base_url # "/stripe/success/"# Nat.toText(invoiceNo) #"/{CHECKOUT_SESSION_ID}"
    };

     // Function to generate the Stripe cancel URL for a specific invoice
    public func get_stripe_cancel_url (invoiceNo:Nat): Text { 
        "http://"# frontendCanisterId # "."# local_base_url #  "/stripe/cancel/"# Nat.toText(invoiceNo) #"/{CHECKOUT_SESSION_ID}"
    };

}