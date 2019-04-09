export default function validate (values, privateKeyList) {
    let errors = {};    
    // console.log(JSON.stringify(values));
    // console.log(JSON.stringify(privateKeyList));
    console.log(values.permission)
    
    if (!values.smartContractName || values.smartContractName.length === 0) {
        errors.smartContractName = 'Smart Contract name is required';
    }
    else {
        let errorString = "Smart contract name validation failed: ";
        let reasons = [];

        if (parseInt(values.smartContractName))
            reasons.push("name must be a string");

        if(reasons.length > 0)
            errors.smartContractName = errorString + reasons.join(', ');
    }

    if (!values.actionType || values.actionType.length === 0 || values.actionType === "Select Action Type") {
        errors.actionType = 'Action Type is required';
    }
    else {
        let errorString = "Action Type validation failed: ";
        let reasons = [];

        if (parseInt(values.actionType))
            reasons.push("action type must be a string");

        if(reasons.length > 0)
            errors.actionType = errorString + reasons.join(', ');
    }

    if(!values.permission || values.permission.length === 0) {
        errors.permission = 'Permission is required';
    }
    else {
        let errorString = "Permission validation failed: ";
        let reasons = [];

        let privateKey = privateKeyList.find(key => key._id === values.permission);
        if(!privateKey.private_key) {
            reasons.push("The selected permission does not have a private key");
        }

        if(reasons.length > 0)
            errors.permission = errorString + reasons.join(', ');
    }
    
    if (!values.payload || values.payload.length === 0) {
        errors.payload = 'Payload is required';
    }
    else {
        let errorString = "Payload validation failed: ";
        let reasons = [];

        if(!tryParseJSON(values.payload))
            reasons.push("Payload must be a valid JSON string");

        if(reasons.length > 0)
            errors.payload = errorString + reasons.join(', ');
    }

    console.log(JSON.stringify(errors));
    return errors;
}

function tryParseJSON (jsonString) {
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    }
    catch (e) { }

    return false;
};