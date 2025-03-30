use ark_ff::PrimeField;
use ark_relations::r1cs::{ConstraintSynthesizer, ConstraintSystemRef, SynthesisError};
use ark_r1cs_std::alloc::AllocVar;
use ark_r1cs_std::boolean::Boolean;
use ark_r1cs_std::fields::fp::FpVar;
use ark_r1cs_std::prelude::*;

/// The circuit struct
#[derive(Clone)]
pub struct LevelCheckCircuit<F: PrimeField> {
    pub level: Vec<F>,
    pub user_indices: Vec<usize>,
}

/// Generate contraints for LevelCheckCircuit
impl<F: PrimeField> ConstraintSynthesizer<F> for LevelCheckCircuit<F> {
    fn generate_constraints(self, cs: ConstraintSystemRef<F>) -> Result<(), SynthesisError> {
        let level_vars = self.level
            .iter()
            .map(|val| FpVar::new_input(cs.clone(), || Ok(*val)))
            .collect::<Result<Vec<_>, _>>()?;

        let level_bool_vars = level_vars
            .iter()
            .map(|v| v.clone().is_zero().and_then(|b| Ok(b.not())))
            .collect::<Result<Vec<_>, _>>()?;

        for &index in self.user_indices.iter() {
            level_bool_vars[index].enforce_equal(&Boolean::constant(true))?;
        }

        Ok(())
    }
}

/// Generates the circuit for use in proof creation
pub fn create_level_check_witness(
    level: Vec<u64>,
    user_indices: Vec<usize>,
) -> LevelCheckCircuit<ark_bn254::Fr> {
    let level = level.into_iter().map(ark_bn254::Fr::from).collect();
    LevelCheckCircuit { level, user_indices }
}
