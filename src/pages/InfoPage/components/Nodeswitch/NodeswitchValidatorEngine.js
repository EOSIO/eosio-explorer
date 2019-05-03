export default function validate (values) {
  let errors = {};

  if (!values.nodeos || values.nodeos.length === 0) {
      errors.nodeos = 'Nodeos endpoint is required';
  } else if (!/^(https?:\/\/.*):?(\d*)?\/?(.*)$/.test(values.nodeos)) {
    errors.nodeos = 'Invalid Nodeos endpoint';
  }
  if (!values.mongodb || values.mongodb.length === 0) {
    errors.mongodb = 'Mongodb endpoint is required';
  } else if (!/^(mongodb?:\/\/.*):(\d*)\/?(.*)$/.test(values.mongodb)) {
      errors.mongodb = 'Invalid Mongodb endpoint';
  }
  return errors;
}
