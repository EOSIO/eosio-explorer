import React, { useEffect } from 'react';
import { Card, CardTitle, CardBody, CardHeader, Col, Row, Table,Button,
  InputGroup, InputGroupAddon, InputGroupText, Input} from 'reactstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { pollingStart, pollingStop, filterToggle } from './BlocklistReducer';


const Blocklist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  let { blocklist: { isFetching, data, filter } } = props;
  let { payload = [], error } = data;

  return (
    <Card>
      <CardBody>
        <div className="Blocklist">
          <Row>
            <Col sm="6">
              <CardTitle>
                {filter
                  ? <input style={{"-webkit-appearance":"checkbox"}} onClick={props.filterToggle} type="checkbox" checked/>
                  : <input style={{"-webkit-appearance":"checkbox"}} onClick={props.filterToggle} type="checkbox"/>}
                  <label style={{"padding-left":"10px"}}>No empty blocks</label>
              </CardTitle>
            </Col>
            <Col sm="6">
              <CardTitle>
                <div style={{display:"flex"}}>
                  <label>Search&nbsp;Blocks:&nbsp;&nbsp;</label>
                  <Input style={{width:"50%","margin-top":"-6px"}} placeholder="username" />
                  <Button style={{"margin":"-6px 0 0 10px"}} color="secondary">Search</Button>
                </div>
              </CardTitle>
            </Col>
          </Row>
          <div>
            { error
              ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching
                ? `loading...`
                : <Table style={{textAlign:"center"}} dark>
                    <thead>
                      <tr>
                        <th>Block Number</th>
                        <th>Block ID</th>
                        <th>Number of Transactions</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payload.map(eachBlock=>
                        <tr key={eachBlock.block_id}>
                          <th>{eachBlock.block_num}</th>
                          <th><Link to={`/block/${eachBlock.block_id}`}>{eachBlock.block_id}</Link></th>
                          <th>{eachBlock.block.transactions.length}</th>
                          <th>{eachBlock.block.timestamp}</th>
                        </tr>)}
                    </tbody>
                  </Table>}
          </div>
        </div>
      </CardBody>
    </Card>
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
