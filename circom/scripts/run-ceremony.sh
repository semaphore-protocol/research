#!/bin/bash

PTAU=14

if [ "$1" ]; then
    CIRCUIT=$1
fi

# Check if the necessary ptau file already exists. If it does not exist, it will be downloaded from the data center.
if [ -f ./ptau/powersOfTau28_hez_final_${PTAU}.ptau ]; then
    echo "----- powersOfTau28_hez_final_${PTAU}.ptau already exists -----"
else
    echo "----- Download powersOfTau28_hez_final_${PTAU}.ptau -----"
    wget -P ./ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_${PTAU}.ptau
fi

# Delete the build folder, if it exists.
rm -r -f build

# Create the build folder.
mkdir -p build

# Compile the circuit.
circom ${CIRCUIT}/index.circom --r1cs --wasm --sym --c -o build

echo "----- Generate .zkey file -----"
# Generate a .zkey file that will contain the proving and verification keys together with all phase 2 contributions.
snarkjs groth16 setup build/index.r1cs ptau/powersOfTau28_hez_final_${PTAU}.ptau build/index_0000.zkey

echo "----- Contribute to the phase 2 of the ceremony -----"
# Contribute to the phase 2 of the ceremony.
snarkjs zkey contribute build/index_0000.zkey build/index_final.zkey --name="1st Contributor Name" -v -e="some random text"

echo "----- Export the verification key -----"
# Export the verification key.
snarkjs zkey export verificationkey build/index_final.zkey build/verification_key.json
