export default function validate (values) {
  let errors = {};

  if (!values.nodeosEndPoint || values.nodeosEndPoint.length === 0) {
      errors.nodeosEndPoint = 'Nodeos endpoint is required';
  } else if (!/^(https?:\/\/.*):?(\d*)?\/?(.*)$/.test(values.nodeosEndPoint)) {
    errors.nodeosEndPoint = 'Invalid Nodeos endpoint';
  }
  if (!values.mongodbEndPoint || values.mongodbEndPoint.length === 0) {
    errors.mongodbEndPoint = 'Mongodb endpoint is required';
  } else if (!/^(mongodb?:\/\/.*):(\d*)\/?(.*)$/.test(values.mongodbEndPoint)) {
      errors.mongodbEndPoint = 'Invalid Mongodb endpoint';
  }
  return errors;
}
