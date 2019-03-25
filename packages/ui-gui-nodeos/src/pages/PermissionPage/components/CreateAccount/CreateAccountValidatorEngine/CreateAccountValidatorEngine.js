export default function validate (values) {
    let errors = {};

    if (!values.accountName || values.accountName.length === 0) {
        errors.accountName = 'Account name is required';
    } else if (!/^([a-z][a-z1-5.]+)$/.test(values.accountName)) {
        errors.accountName = 'Invalid EOSIO account name';
    }

    return errors;
}