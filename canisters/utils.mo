import Iter "mo:base/Iter";
import Array "mo:base/Array";
import Nat8 "mo:base/Nat8";
import Trie "mo:base/Trie";
import Hash "mo:base/Hash";
import Char "mo:base/Char";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Prim "mo:⛔";
import Http "http";

module {
    
    // Function to generate a Trie key from a Nat value
    public func keyNat(x: Nat): Trie.Key<Nat> {
        return { key = x; hash = Hash.hash(x) };
    };

    // Function to generate a Trie key from a Principal value
    public func keyPrincipal(x: Principal): Trie.Key<Principal> {
        return { key = x; hash = Principal.hash(x) };
    };

     // Function to generate a general HTTP response
    public func generalResponse<T, W>(status: Bool, message: Text, data: Http.ResponseStatus<T, W>, status_code: Nat): Http.Response<Http.ResponseStatus<T, W>> {
        return {
            status = status;
            status_code = status_code;
            body = data;
            message = message;
        };
    };
};