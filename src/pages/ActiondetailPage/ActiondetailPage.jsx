import React, { useEffect } from 'react';
import { CardBody, Row, Col } from 'reactstrap';
import { connect } from 'react-redux';

import { LoadingSpinner } from 'components';
import { StandardTemplate } from 'templates';
import { fetchStart, paramsSet } from './ActiondetailPageReducer';
import Actiondetail from './components/Actiondetail';
import Actionjson from './components/Actionjson';
import styled from 'styled-components';
import isObjectEmpty from 'helpers/is-object-empty';
import { PageTitleDivStyled, CardStyled, CardHeaderStyled, ErrorButton } from 'styled';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const ActiondetailPage = (props) => {

  useEffect(()=>{
    let { router: { location: { pathname } } } = props;
    let urlValues = pathname.split("/");
    props.paramsSet({block_num: urlValues[2]});
    props.paramsSet({global_sequence: urlValues[3]});
    props.fetchStart();
  }, [])

  let { actiondetailPage: { data, isFetching } } = props;
  let { error } = data;
  
  return (
    <StandardTemplate>
      <div className="ActiondetailPage">
        <Row>
          <Col xs="12">
            <PageTitleDivStyled>Actions | Action Detail Page</PageTitleDivStyled>
          </Col>
        </Row>
        <Row>
          <Col xs="12">
            <FirstCardStyled>
              <CardHeaderStyled>
                Action Detail
              </CardHeaderStyled>
              <CardBody>
                { error ?
                  <>
                    {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
                    <ErrorButton onClick={props.fetchStart}>Connection error, click to reload</ErrorButton>
                  </>
                : isFetching ? (
                  <LoadingSpinner />
                ) : (
                  <Actiondetail/>
                )}
              </CardBody>
            </FirstCardStyled>
          </Col>
        </Row>
        
        {!isFetching && (
          !error &&
            <Row>
              <Col xs="12">
                <CardStyled>
                  <CardHeaderStyled>
                    Action Raw JSON
                  </CardHeaderStyled>
                  <CardBody>
                    <Actionjson />
                  </CardBody>
                </CardStyled>
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
