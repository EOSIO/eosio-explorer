import { JsonRpc } from 'eosjs';

export default async (query: {
  endpoint: string,
  contract_name: string,
  table_name: string
}) => {
  try{
    let { endpoint, contract_name, table_name } = query;
    
    const rpc = new JsonRpc(endpoint);
    const result = await rpc.get_table_rows({
      "json": true,
      "code": contract_name,    // contract who owns the table
      "scope": contract_name,   // scope of the table
      "table": table_name  // name of the table as specified by the contract abi
    });
    return result.rows;
  }catch(e){
    console.log('Caught exception: ' + e);
    throw(e);
  }
}
