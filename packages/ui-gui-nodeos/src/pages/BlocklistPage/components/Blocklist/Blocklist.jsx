import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { pollingStart, pollingStop, filterToggle } from './BlocklistReducer';


const Blocklist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  let { blocklist: { isFetching, data, filter } } = props;
  let { payload, error } = data;

  return (
    <div className="Blocklist">
      <div onClick={props.filterToggle}>Empty Filter: {filter?'on':'off'}</div>
      <div>{ error          ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
             : isFetching   ? `loading...`
                            : <table>
                                <tbody>
                                  {payload.map(block=>
                                    <tr key={block.block_id}>
                                      <td style={{border:"1px solid black"}}>{block.block_num}</td>
                                      <td style={{border:"1px solid black"}}><Link to={`/block/${block.block_id}`}>{block.block_id}</Link></td>
                                    </tr>)}
                                </tbody>
                              </table>}
      </div>
    </div>
  );
}

export default connect(
  ({ blocklistPage: { blocklist }}) => ({
    blocklist
  }),
  {
    pollingStart,
    pollingStop,
    filterToggle,
  }

)(Blocklist);
