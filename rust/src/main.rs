use ark_bn254::Bn254;
use ark_circom::{CircomBuilder, CircomConfig};
use ark_crypto_primitives::snark::SNARK;
use ark_groth16::Groth16;
use ark_std::rand::thread_rng;
use color_eyre::Result;
use std::time::Instant;

type GrothBn = Groth16<Bn254>;

fn main() -> Result<()> {
    // Load the WASM and R1CS for witness and proof generation
    let cfg = CircomConfig::<Bn254>::new("./mt.wasm", "./mt.r1cs")?;

    // Insert our public inputs as key value pairs
    let mut builder = CircomBuilder::new(cfg);
    builder.push_input("message", 3);
    //builder.push_input("treeIndices", []);
    //builder.push_input("treeSiblings", []);

    // Create an empty instance for setting it up
    let circom = builder.setup();

    // Run a trusted setup
    let mut rng = thread_rng();
    let params = GrothBn::generate_random_parameters_with_reduction(circom, &mut rng)?;

    // Get the populated instance of the circuit with the witness
    let circom = builder.build()?;

    let inputs = circom.get_public_inputs().unwrap();

    // Generate the proof
    let proof = GrothBn::prove(&params, circom, &mut rng)?;

    let start_time = Instant::now();

    // Check that the proof is valid
    let pvk = GrothBn::process_vk(&params.vk)?;

    let verified = GrothBn::verify_with_processed_vk(&pvk, &inputs, &proof)?;

    assert!(verified);

    let end_time = Instant::now();

    let elapsed_time = end_time.duration_since(start_time);

    println!("Elapsed time: {:?}", elapsed_time);

    Ok(())
}
