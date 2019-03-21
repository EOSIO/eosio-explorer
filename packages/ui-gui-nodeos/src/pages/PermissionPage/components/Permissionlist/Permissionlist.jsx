import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { pollingStart, pollingStop } from './PermissionlistReducer';


const Permissionlist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  let { permissionlist: { isFetching, data, filter } } = props;
  let { payload, error } = data;

  return (
    <div className="Permissionlist">
      <div>{ error          ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
             : isFetching   ? `loading...`
                            : <table>
                                <thead>
                                  <tr>
                                    <td>Permission List:</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(payload || []).map(permission=>
                                    <tr key={permission.account}>
                                      <td style={{border:"1px solid black"}}>{permission.account}</td>
                                    </tr>)}
                                </tbody>
                              </table>}
      </div>
    </div>
  );
}

export default connect(
  ({ permissionPage: { permissionlist }}) => ({
    permissionlist
  }),
  {
    pollingStart,
    pollingStop,
  }

)(Permissionlist);
