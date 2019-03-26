export default function validate (values) {
    let errors = {};

    if (!values.ownerPrivate || values.ownerPrivate.length === 0) {
        errors.ownerPrivate = 'Owner private key is required';
    } 

    if (!values.activePrivate || values.activePrivate.length === 0) {
        errors.activePrivate = 'Active private key is required';
    } 

    return errors;
}