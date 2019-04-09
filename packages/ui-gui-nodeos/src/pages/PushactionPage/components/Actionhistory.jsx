import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { Row, Col } from 'reactstrap';

import { LoadingSpinner } from 'components';
import styled from 'styled-components';
import { TableStyled, ButtonPrimary} from 'styled';

const CustomButton = styled(ButtonPrimary)`
  margin: 0 auto;
  padding-top: 4px;
  height: 32px;
`

const Actionhistory = (props) => {

  let { pushactionPage: { isFetching, data: { actionsList = [] } } } = props;

  return (
    <div className="Actionhistory">
      <Row>
        <Col xs="12">
        { isFetching ? (
          <LoadingSpinner />
        ) : (
          <TableStyled borderless>
            <thead>
              <tr className="font-weight-bold">
                <th width="20%">Smart Contract Name</th>
                <th width="20%">Action Type</th>
                <th width="25%">Timestamp</th>
                <th width="20%">Permission</th>
                <th width="15%" className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {actionsList.length < 1 ?
                <tr><td colSpan="5" className="text-center">No actions could be found for the given Smart Contract name</td></tr>
              : actionsList.map((action, index)=>
                <tr key={index}>
                  <td>{action.act.account}</td>
                  <td>{action.act.name}</td>
                  <td>{action.createdAt}</td>
                  <td>{action.act.authorization[0].actor + "@" + action.act.authorization[0].permission}</td>
                  <td className="text-center">
                    <CustomButton block size="sm" onClick={(e) => { e.preventDefault(); props.prefillCallback(action); }}>Prefill</CustomButton>
                  </td>
                </tr>
              )}
            </tbody>
          </TableStyled>
        )}
        </Col>
      </Row>
    </div>
  );
}

export default connect(
  ({ pushactionPage, router}) => ({
    pushactionPage,
    router
  })
)(Actionhistory);
