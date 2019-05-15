import ecc from 'eosjs-ecc';

export default function editValidate(values) {
  let errors = {};

  if (!values.ownerPublic || values.ownerPublic.length === 0) {
    errors.ownerPublic = 'Owner public key is required';
  } else if (!ecc.isValidPublic(values.ownerPublic)) {
    errors.ownerPublic = 'Owner public key is not valid EOSKey'
  }

  if (!values.ownerPrivate || values.ownerPrivate.length === 0) {
    errors.ownerPrivate = 'Owner private key is required';
  } else if (!ecc.isValidPrivate(values.ownerPrivate)) {
    errors.ownerPrivate = 'Owner private key is not valid WIF (Wallet Import Format)';
  } else if (!(ecc.privateToPublic(values.ownerPrivate) === values.ownerPublic)) {
    errors.ownerPrivate = 'Owner private key signature does not match public key';
  }

  if (!values.activePublic || values.activePublic.length === 0) {
    errors.activePublic = 'Active public key is required';
  } else if (!ecc.isValidPublic(values.activePublic)) {
    errors.activePublic = 'Active public key is not valid EOSKey'
  }

  if (!values.activePrivate || values.activePrivate.length === 0) {
    errors.activePrivate = 'Active private key is required';
  } else if (!ecc.isValidPrivate(values.activePrivate)) {
    errors.activePrivate = 'Active private key is not valid WIF (Wallet Import Format)';
  } else if (!(ecc.privateToPublic(values.activePrivate) === values.activePublic)) {
    errors.activePrivate = 'Active private key signature does not match public key';
  }

  return errors;
}
