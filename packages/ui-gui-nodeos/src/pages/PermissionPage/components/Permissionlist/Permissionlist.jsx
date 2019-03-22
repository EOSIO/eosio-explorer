import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { fetchStart, defaultSet } from 'reducers/permission';


const Permissionlist = (props) => {

  useEffect(()=>{
    props.fetchStart()
  }, [])

  let { permission: { isFetching, data }, defaultSet } = props;
  let { list,defaultId } = data;

  return (
    <div className="Permissionlist">
      <div>{ isFetching   ? `loading...`
                            : <table>
                                <thead>
                                  <tr>
                                    <td>Permission List:</td>
                                  </tr>
                                </thead>
                                <tbody>
                                  {list.map(permission=>
                                    <tr key={permission.id}>
                                      <td style={{border:"1px solid black"}}>{permission.account}</td>
                                      <td style={{border:"1px solid black"}}>{permission.permission}</td>
                                      <td style={{border:"1px solid black"}}>{
                                        permission.id === defaultId
                                        ? `This is DEFAULT permission`
                                        : <button onClick={()=>{defaultSet(permission.id)}}>click to set</button>}</td>
                                    </tr>)}
                                </tbody>
                              </table>}
      </div>
    </div>
  );
}

export default connect(
  ({ permission }) => ({
    permission
  }),
  {
    fetchStart,
    defaultSet,
  }

)(Permissionlist);
