echo "Starting DFX server..."

dfx stop
dfx start --clean --background

dfx deploy


dfx wallet --network local send ryjl3-tyaaa-aaaaa-aaaba-cai 800000000000
dfx canister install fiat --mode reinstall

dfx wallet --network ic send 6hgen-jyaaa-aaaao-axdpq-cai 800000000000

