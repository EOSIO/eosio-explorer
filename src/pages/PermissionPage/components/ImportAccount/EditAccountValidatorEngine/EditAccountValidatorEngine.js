import ecc from 'eosjs-ecc';

export default function editValidate(values) {
  let errors = {};

  if (!values.publicKey || values.publicKey.length === 0) {
    errors.publicKey = 'Public key is required';
  } else if (!ecc.isValidPublic(values.publicKey)) {
    errors.publicKey = 'Public key is not valid EOSKey'
  }

  if (!values.privateKey || values.privateKey.length === 0) {
    errors.privateKey = 'Private key is required';
  } else if (!ecc.isValidPrivate(values.privateKey)) {
    errors.privateKey = 'Private key is not valid WIF (Wallet Import Format)';
  } else if (!(ecc.privateToPublic(values.privateKey) === values.publicKey)) {
    errors.privateKey = 'Private key signature does not match public key';
  }

  // if (!values.activePublic || values.activePublic.length === 0) {
  //   errors.activePublic = 'Active public key is required';
  // } else if (!ecc.isValidPublic(values.activePublic)) {
  //   errors.activePublic = 'Active public key is not valid EOSKey';
  // }

  // if (!values.activePrivate || values.activePrivate.length === 0) {
  //   errors.activePrivate = 'Active private key is required';
  // } else if (!ecc.isValidPrivate(values.activePrivate)) {
  //   errors.activePrivate = 'Active private key is not valid WIF (Wallet Import Format)';
  // } else if (!(ecc.privateToPublic(values.activePrivate) === values.activePublic)) {
  //   errors.activePrivate = 'Active private key signature does not match public key';
  // }

  return errors;
}
