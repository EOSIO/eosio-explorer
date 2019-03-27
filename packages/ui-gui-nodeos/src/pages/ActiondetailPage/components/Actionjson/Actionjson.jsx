import React, { useEffect } from 'react';

import { connect } from 'react-redux';

import { Button, Card, CardBody, CardHeader, Col, Row, Form, FormGroup, Label } from 'reactstrap';

import pathNameConsumer from 'helpers/pathname-consumer';

import { CodeViewer } from 'components';

const Actionjson = (props) => {

  let { actiondetailPage: { data } } = props;
  let { payload } = data;

  return (
    <>
      <CodeViewer
        language="json"
        value={JSON.stringify(payload, null, 2)}
        readOnly={true}
        height={600}
      />                            
    </>
  );
}

export default connect(
  ({ actiondetailPage, router}) => ({
    actiondetailPage,
    router
  })
)(Actionjson);
