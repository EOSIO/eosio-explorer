import React, { useEffect, useState } from 'react';
import { CardBody, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import styled from 'styled-components';
import { CardStyled,CardHeaderStyled, TableStyled, ButtonPrimary, CheckBoxDivStyled, InputStyled} from 'styled';

import { pollingStart, pollingStop, filterToggle } from './BlocklistReducer';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`
const SearchLabel = styled.label`
  padding-right: 10px;
  margin-top: 10px;
`
const SearchInputStyled = styled(InputStyled)`
  width: 65%;
  margin-right: 10px;
`
const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 20px;
`

const Blocklist = (props) => {

  useEffect(()=>{
    props.pollingStart()
    return () => { props.pollingStop() }
  }, [])

  const [inputValue, setInputValue] = useState("");

  let { blocklist: { isFetching, data, filter } } = props;
  let { payload = [], error } = data;

  return (
    <div className="Blocklist">
      <FirstCardStyled>
        <CardHeaderStyled>Block List</CardHeaderStyled>
        <CardBody>        
          <Row>
            <Col sm="6">  
              <CheckBoxDivStyled>
                <label className="checkboxContainer">No empty blocks

                  {filter 
                  ? <input onChange={props.filterToggle} type="checkbox" checked/>
                  : <input onChange={props.filterToggle} type="checkbox"/>}
                 
                  <span className="checkmark"></span>
                </label>   
              </CheckBoxDivStyled>          
                            
            </Col>
            <Col sm="6">              
              <DivFlexStyled>
              <SearchLabel>Search Blocks:</SearchLabel>
                <SearchInputStyled 
                      placeholder="Block number / Block ID"
                      value={inputValue}
                      onKeyDown={
                        evt => {
                          if (evt.key === 'Enter') {
                            setInputValue("")
                              {inputValue ? props.push('/block/'+inputValue) : console.log("No search text");} 
                          }
                        }
                      }
                      onChange={evt=>{setInputValue(evt.target.value)}}/>
                <ButtonPrimary                          
                      onClick={evt=> {
                        setInputValue("")
                        {inputValue ? props.push('/block/'+inputValue) : console.log("No search text");}                          
                      }}>
                SEARCH</ButtonPrimary>
              </DivFlexStyled>              
            </Col>
          </Row>
          <div>
            { error
              ? <button onClick={props.pollingStart}>{JSON.stringify(error)} Click to Reload.</button>
              : isFetching
                ? `loading...`
                : <TableStyled borderless>
                    <thead>
                      <tr>
                        <th width="20%">Block Number</th>
                        <th width="35%">Block ID</th>
                        <th width="25%" className="text-center">Number of Transactions</th>
                        <th width="20%">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payload.map(eachBlock=>
                        <tr onClick={evt=>props.push(`/block/${eachBlock.block_id}`)} key={eachBlock.block_id}>
                          <td>{eachBlock.block_num}</td>
                          <td>{eachBlock.block_id}</td>
                          <td className="text-center">{eachBlock.block.transactions.length}</td>
                          <td>{eachBlock.createdAt}</td>
                        </tr>)}
                    </tbody>
                  </TableStyled>}
          </div>        
        </CardBody>
      </FirstCardStyled>
    </div>
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
    push
  }

)(Blocklist);
