export default function validate (values) {
    let errors = {};

    console.log("Vals: " + JSON.stringify(values));
    
    
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

    if (!values.actionType || values.actionType.length === 0) {
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

    console.log("PL: " + JSON.stringify(values.payload));
    
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