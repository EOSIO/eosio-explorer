export default function validate(values) {
  let errors = {};

  if (!values.accountName || values.accountName.length === 0) {
    errors.accountName = 'Account name is required';
  } else if (!/^([a-z1-5][a-z1-5.]+)$/.test(values.accountName)) {
    let errorString = "Invalid EOSIO account name: ";
    let reasons = [];

    if (/[A-Z]/.test(values.accountName)) {
      reasons.push("name contains capital letters");
    }

    if (/[6-9]/.test(values.accountName)) {
      let numbers = [];
      if (values.accountName.includes("6")) numbers.push(6);
      if (values.accountName.includes("7")) numbers.push(7);
      if (values.accountName.includes("8")) numbers.push(8);
      if (values.accountName.includes("9")) numbers.push(9);
      reasons.push("name contains following numbers: " + numbers.join(','));
    }

    errors.accountName = errorString + reasons.join(', ');
  }

  return errors;
}
