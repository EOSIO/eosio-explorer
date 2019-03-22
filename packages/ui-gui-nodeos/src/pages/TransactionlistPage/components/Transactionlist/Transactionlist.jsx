import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { pollingStart, pollingStop } from './TransactionlistReducer';


const Transactionlist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  let { transactionlist: { isFetching, data, filter } } = props;
  let { payload = [], error } = data;

  return (
    <div className="Transactionlist">
      <div>{ error          ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
             : isFetching   ? `loading...`
                            : <table>
                                <tbody>
                                  {payload.map(block=>
                                    <tr key={block.block_id}>
                                      <td style={{border:"1px solid black"}}>{block.block_num}</td>
                                      <td style={{border:"1px solid black"}}><Link to={`/transaction/${block.block_id}`}>{block.block_id}</Link></td>
                                    </tr>)}
                                </tbody>
                              </table>}
      </div>
    </div>
  );
}

export default connect(
  ({ transactionlistPage: { transactionlist }}) => ({
    transactionlist
  }),
  {
    pollingStart,
    pollingStop,
  }

)(Transactionlist);
