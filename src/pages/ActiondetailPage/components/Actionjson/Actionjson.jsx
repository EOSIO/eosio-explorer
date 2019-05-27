import React from 'react';
import { connect } from 'react-redux';

import { CodeViewer } from 'components';

const Actionjson = (props) => {

  let { actiondetailPage: { data } } = props;
  let { payload } = data;

  return (
    <>
      {
        <CodeViewer
          language="json"
          value={JSON.stringify(payload, null, 2)}
          readOnly={true}
          height={600} />
      }              
    </>
  );
}

export default connect(
  ({ actiondetailPage, router}) => ({
    actiondetailPage,
    router
  })
)(Actionjson);
