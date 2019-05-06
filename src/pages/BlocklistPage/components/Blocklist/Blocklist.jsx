import React, { useEffect, useState } from 'react';
import { CardBody, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'
import styled from 'styled-components';
import isObjectEmpty from 'helpers/is-object-empty';
import { LoadingSpinner, LimitSelectDropdown } from 'components';
import { CardStyled,CardHeaderStyled, TableStyled, ButtonPrimary, ErrorButton, CheckBoxDivStyled, InputStyled } from 'styled';

import { pollingStart, pollingStop, filterToggle, recordsUpdate } from './BlocklistReducer';

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
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

  let { blocklist: { isFetching, data, filter, records } } = props;
  let { payload = [], error } = data;
  
  return (
    <div className="Blocklist">
      <FirstCardStyled>
        <CardHeaderStyled>Block List</CardHeaderStyled>
        <CardBody>
          <Row>
            <Col sm="5">
              <CheckBoxDivStyled>
                <label className="checkboxContainer">No empty blocks

                  {filter
                  ? <input onChange={props.filterToggle} type="checkbox" checked/>
                  : <input onChange={props.filterToggle} type="checkbox"/>}

                  <span className="checkmark"></span>
                </label>
              </CheckBoxDivStyled>

            </Col>
            <Col sm="7">
              <DivFlexStyled>
                <SearchInputStyled
                      placeholder="Block number / Block ID"
                      value={inputValue}
                      onKeyDown={
                        evt => {
                          if (evt.key === 'Enter') {
                            setInputValue("");
                            if(inputValue !== "") 
                              props.push('/block/'+inputValue) 
                          }
                        }
                      }
                      onChange={evt=>{setInputValue(evt.target.value)}}/>
                <ButtonPrimary
                      disabled = { inputValue === "" }
                      onClick={evt=> {
                        setInputValue("");
                        if(inputValue !== "") 
                          props.push('/block/'+inputValue)
                      }}>
                SEARCH</ButtonPrimary>
                </DivFlexStyled>
            </Col>
          </Row>
          <div>
            { error
              ? 
                <>
                  {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
                  <ErrorButton onClick={props.pollingStart}>Connection error, click to reload</ErrorButton>
                </>
              : 
                <Row>
                  <Col xs="12">
                    <TableStyled borderless>
                        <thead>
                          <tr>
                            <th width="20%">Block Number</th>
                            <th width="35%">Block ID</th>
                            <th width="25%" className="text-center">Number of Transactions</th>
                            <th width="20%">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="hashText">
                          {(isFetching || payload.length <= 0) ? (
                            <tr><td colSpan="4" className="text-center"><LoadingSpinner /></td></tr>
                          ) : payload.map(eachBlock=>
                            <tr onClick={evt=>props.push(`/block/${eachBlock.block_id}`)} key={eachBlock.block_id}>
                              <td>{eachBlock.block_num}</td>
                              <td>{eachBlock.block_id}</td>
                              <td className="text-center">{eachBlock.block.transactions.length}</td>
                              <td>{eachBlock.createdAt}</td>
                            </tr>)}
                        </tbody>
                      </TableStyled>
                    </Col>
                    {payload.length > 0 &&
                      <Col xs="12" className="text-right">
                        <LimitSelectDropdown limit={records} onChange={(limit) => { props.recordsUpdate(limit) }} />
                      </Col>
                    }
                  </Row>
                }
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
    recordsUpdate,
    push
  }

)(Blocklist);
