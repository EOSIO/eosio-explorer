export default ( params = {} ) =>
  Object.keys(params).length > 0
  ? Object.keys(params).map((k, i) => `${(i===0?"?":"")}${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`).join('&')
  : ``
