// "/block/1234" => "1234"
export default ( pathname ) =>{
  const regex = /.*\/(.*)$/g;
  let matches = regex.exec(pathname.replace(/\/$/, ""));
  return matches[1];
}
