pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";

template Hash(N) {
    signal input messages[N];
    signal output digest;

    digest <== Poseidon(N)(messages);
}

component main = Hash(1);
