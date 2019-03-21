import React, { useEffect }  from 'react';

import { connect } from 'react-redux';

import { fetchStart } from './CreateAccountReducer';

const CreateAccount = (props) => {

  useEffect(()=>{
    props.fetchStart();
  }, [])

  let { createAccount: { isFetching, data, params } } = props;
  let { payload, error } = data;

  return (
    <div style={{border:"1px solid black"}} className="CreateAccount">
      <div>{ error                  ? <button onClick={props.fetchStart}>{JSON.stringify(error)} Click to Reload.</button>
            : isFetching           ? `loading...`
            : payload.length === 0 ? `No block found with block id = ${params.id}`
                                    : <>
                                      <div>This is create account panel.</div>
                                        <div>Owner</div>
                                        <div className="keys">
                                          <p>public: {payload.ownerPublicKey}</p>
                                          <p>private: {payload.ownerPrivateKey}</p>
                                        </div>
                                        <div>Active</div>
                                        <div className="keys">
                                          <p>public: {payload.activePublicKey}</p>
                                          <p>private: {payload.activePrivateKey}</p>
                                        </div>
                                      </>}
      </div>

    </div>
  )
}

export default connect(
  ({ permissionPage: { createAccount }}) => ({
    createAccount,
  }),
  {
    fetchStart,
  }

)(CreateAccount);
