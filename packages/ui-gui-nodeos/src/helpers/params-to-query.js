export default ( params = {} ) =>
  Object.keys(params).length > 0
  ? Object.keys(params).map(k => `?${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
  : ``
