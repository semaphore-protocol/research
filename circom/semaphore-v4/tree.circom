pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/mux1.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template TreeRoot(MAX_DEPTH) {
    signal input leaf;
    signal input index;
    signal input depth;
    signal input siblings[MAX_DEPTH];

    signal output out;

    component poseidon[MAX_DEPTH];
    component mux[MAX_DEPTH];

    signal nodes[MAX_DEPTH + 1];
    nodes[0] <== leaf;

    for (var i = 0; i < MAX_DEPTH; i++) {
        poseidon[i] = Poseidon(2);
        mux[i] = MultiMux1(2);

        mux[i].c[0][0] <== nodes[i];
        mux[i].c[0][1] <== siblings[i];

        mux[i].c[1][0] <== siblings[i];
        mux[i].c[1][1] <== nodes[i];

        mux[i].s <-- (index >> i) & 1;
        // mux[i].s * (1 - mux[i].s) === 0;

        poseidon[i].inputs[0] <== mux[i].out[0];
        poseidon[i].inputs[1] <== mux[i].out[1];

        nodes[i + 1] <== poseidon[i].out;
    }

    // TODO: refactoring
    component depth_eq[MAX_DEPTH];
    signal root_vals[MAX_DEPTH];
    var root_sum = 0;

    for (var i = 0; i < MAX_DEPTH; i++) {
        depth_eq[i] = IsEqual();
        depth_eq[i].in[0] <== depth - 1;
        depth_eq[i].in[1] <== i;
        root_vals[i] <== depth_eq[i].out * nodes[i];
        root_sum += root_vals[i];
    }

    out <== root_sum;
}
