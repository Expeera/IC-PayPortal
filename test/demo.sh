set -x
set -e

export fiat_canister=$(dfx canister id fiat)

echo "fiat canister = " "${fiat_canister}"

echo dfx canister call ${fiat_canister} invoiceCount "()"

dfx identity new user1 --disable-encryption || true

dfx identity use user1
dfx identity get-principal

export USER1=$(dfx identity get-principal)
echo USER1 "${USER1}"

export invoice_count=$(dfx canister call ${fiat_canister} invoiceCount)
echo "Number Of Invoices = " ${invoice_count}

if [${invoice_count} < 2]
then
    export create_invoice_1=$(dfx canister call ${fiat_canister} create_invoice "(record { amount = 10.0; paymentMethod = \"Stripe\"; currency = \"USD\";})")
fi

export my_invoices=$(dfx canister call ${fiat_canister} get_my_invoices)

dfx identity use default

export my_invoices=$(dfx canister call ${fiat_canister} get_my_invoices)

echo "PASS"