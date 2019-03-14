import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { pollingStart, pollingStop, filterToggle } from './BlocklistReducer';


const Blocklist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  let { blocklist: { isFetching, data, filter } } = props;
  let { payload = [] } = data;

  return (
    <div className="Blocklist">
      <div onClick={props.filterToggle}>Empty Filter: {filter?'on':'off'}</div>
      <div>{isFetching ? `loading...`:
        <table>
          <tbody>
            {payload.map(block=><tr key={block._id} style={{border:"1px solid black"}}><td>{block.block_num}</td></tr>)}
          </tbody>
        </table>
      }</div>
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
