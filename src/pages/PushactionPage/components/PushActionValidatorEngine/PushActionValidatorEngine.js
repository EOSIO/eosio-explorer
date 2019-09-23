export default function validate (values, privateKeyList) {
    let errors = {};    
    
    if (!values.smartContractName || values.smartContractName.length === 0) {
        errors.smartContractName = 'Smart Contract name is required';
    }

    if (!values.actionType || values.actionType.length === 0 || values.actionType === "Select Action Type") {
        errors.actionType = 'Action Type is required';
    }

    if(!values.permission || values.permission.length === 0) {
        errors.permission = 'Permission is required';
    }
    else {
        let errorString = "";
        let reasons = [];

        let privateKey = privateKeyList.find(key => key.account+"@"+key.permission === values.permission);
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
        let errorString = "";
        let reasons = [];

        if(!tryParseJSON(values.payload))
            reasons.push("Payload must be a valid JSON string");

        if(reasons.length > 0)
            errors.payload = errorString + reasons.join(', ');
    }
    
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
