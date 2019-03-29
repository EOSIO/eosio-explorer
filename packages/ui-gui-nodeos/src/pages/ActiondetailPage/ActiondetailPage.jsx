import React, { useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

import { LoadingSpinner } from 'components';
import { StandardTemplate } from 'templates';
import pathNameConsumer from 'helpers/pathname-consumer';
import { fetchStart, paramsSet } from './ActiondetailPageReducer';
import Actiondetail from './components/Actiondetail';
import Actionjson from './components/Actionjson';

const ActiondetailPage = (props) => {

  useEffect(()=>{
    let { router: { location: { pathname } } } = props;
    props.paramsSet({id: pathNameConsumer(pathname)});
    props.fetchStart();
  }, [])

   let { actiondetailPage: { data, isFetching } } = props;
   let { payload, error } = data;

  return (
    <StandardTemplate>
      <div className="ActiondetailPage animated fadeIn">
        <Row>
          <Col xs="12">
            <h2 className="pageTitle text-center mb-4">Action Detail Page</h2>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <Card>
              <CardHeader>
                Action Detail
              </CardHeader>
              <CardBody>
                { error ?
                  <div className="text-center">
                    <p className="text-danger">{JSON.stringify(error)}</p>
                    <Button color="primary" onClick={props.fetchStart}>Click to Reload</Button>
                  </div>
                : isFetching ? (
                  <LoadingSpinner />
                ) : (
                  <Actiondetail/>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
        
        {!isFetching && (
          !error &&
            <Row>
              <Col xs="12">
                <Card>
                  <CardHeader>
                    Action Raw JSON
                  </CardHeader>
                  <CardBody>
                    <Actionjson />
                  </CardBody>
                </Card>
              </Col>
            </Row>
        )}
      </div>
    </StandardTemplate>
  );
}

export default connect(
  ({ actiondetailPage, router}) => ({
    actiondetailPage,
    router
  }),
  {
    fetchStart,
    paramsSet,
  }
)(ActiondetailPage);

