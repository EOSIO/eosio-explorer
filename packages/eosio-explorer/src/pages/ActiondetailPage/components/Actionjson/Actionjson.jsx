import React from 'react';
import { connect } from 'react-redux';

import { CodeViewer } from 'components';

const Actionjson = (props) => {

  let { actiondetailPage: { data } } = props;
  let { payload } = data;

  return (
    <>
      {payload && (payload.length > 0 ?
          <CodeViewer
            language="json"
            value={JSON.stringify(payload, null, 2)}
            readOnly={true}
            height={600} />
        :
          <div className="text-center">
            <p className="text-danger mb-0">Action data empty</p>
          </div>
      )}              
    </>
  );
}

export default connect(
  ({ actiondetailPage, router}) => ({
    actiondetailPage,
    router
  })
)(Actionjson);
