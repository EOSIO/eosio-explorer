import ecc from 'eosjs-ecc';

export default function validate (values) {
    let errors = {};

    if (!values.ownerPrivate || values.ownerPrivate.length === 0) {
        errors.ownerPrivate = 'Owner private key is required';
    } else if (!ecc.isValidPrivate(values.ownerPrivate)) {
        errors.ownerPrivate = 'Owner private key is not valid WIF';
    }

    if (!values.activePrivate || values.activePrivate.length === 0) {
        errors.activePrivate = 'Active private key is required';
    } else if (!ecc.isValidPrivate(values.activePrivate)) {
        errors.activePrivate = 'Active private key is not valid WIF';
    }

    return errors;
}