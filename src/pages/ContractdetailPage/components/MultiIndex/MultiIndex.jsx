import React, { useState } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './MultiIndexReducer';

import { push } from 'connected-react-router'

import { CardBody, DropdownToggle, DropdownMenu, DropdownItem, Row, Col} from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer } from 'components';
import isObjectEmpty from 'helpers/is-object-empty';
import { DropdownStyled, CardStyled, CardHeaderStyled, ErrorDivStyled, ErrorButton, InputStyled, ButtonPrimary, ToolTipUncontrolledStyled } from 'styled';

const ToolTipSVG = () => 
  <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">   
    <g id="Final-Version" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="Artboard" transform="translate(-93.000000, -44.000000)">
          <g id="Group-15" transform="translate(93.000000, 44.000000)">
              <circle id="Oval" fill="#667D96" cx="9" cy="9" r="9"></circle>
              <text id="i" fontFamily="ProximaNova-Semibold, Proxima Nova" fontSize="14" fontWeight="500" fill="#FFFFFF">
                  <tspan x="7.313" y="14">i</tspan>
              </text>
          </g>
      </g>
    </g>
  </svg>

const SelectLabel = styled.label`
  padding-right: 10px;
  margin-top: 10px;
`
const DropdownDiv = styled.div`
  display: flex;
`
const CustomErrorDiv = styled(ErrorDivStyled)`
  padding: 0;
  color: red;
`
const ScopeDivStyled = styled.div`
  display: flex;
  justify-content: flex-end;
`
const LabelStyled = styled.div`
  margin: auto 0;
`
const ScopeInputStyled = styled(InputStyled)`
  width: 30%;
`

const MultiIndex = (props) => {

  const [dropDownSelctedValue, setSelectedValue] = useState("Select Table");
  const [showDetailsSection, setShowDetailsSection ] = useState(false);
  const [ isOpenDropDown, toggleDropDown] = useState(false);
  const [ scopeName, setScopeName] = useState(props.abiData.name);  

  let { multiIndex: { isFetching, data, params } } = props;
  let { payload, error } = data;
  let { abiData } = props;

  return (
    <div className="MultiIndex">
      <Row>
        <Col sm={6}>
          <DropdownDiv>
            <SelectLabel>Select multi-index table to display data:</SelectLabel>
            <DropdownStyled isOpen={isOpenDropDown} toggle={()=>{toggleDropDown(!isOpenDropDown)}}>
              <DropdownToggle caret>{dropDownSelctedValue}</DropdownToggle>
              <DropdownMenu right>
                {(abiData.abi.tables).map((eachTable)=>
                    <DropdownItem 
                      key={eachTable.name} 
                      onClick={()=>{ 
                        setSelectedValue(eachTable.name);                          
                      }}>
                    {eachTable.name}</DropdownItem>)}
              </DropdownMenu>     
            </DropdownStyled>  
          </DropdownDiv>
        </Col>
        <Col sm={6}>
          <ScopeDivStyled>
            <LabelStyled>Scope Name:&nbsp;&nbsp;</LabelStyled>
            <LabelStyled id="scopeTooltip"> <ToolTipSVG /></LabelStyled>&nbsp;&nbsp;&nbsp;
            <ToolTipUncontrolledStyled placement="top" target="scopeTooltip"
              delay={{ show: 0, hide: 0}}
              trigger="hover focus"
              autohide={true}>
              Default value of Scope name is set to Smart Contract name, change it if you want to fetch from different scope
              </ToolTipUncontrolledStyled>          
            <ScopeInputStyled 
              value={scopeName}
              onKeyDown={
                evt => {
                  if (evt.key === 'Enter') {
                    if(dropDownSelctedValue !== "Select Table"){
                      props.paramsSet({contract_name: abiData.name, table_name: dropDownSelctedValue, scope_name: scopeName || abiData.name });
                      props.fetchStart();
                      setShowDetailsSection(true);  
                    }
                  }
                }
              }
              onChange = {evt=> {
                setScopeName(evt.target.value);
              }} />&nbsp;&nbsp;&nbsp;
            <ButtonPrimary
              disabled = {dropDownSelctedValue === "Select Table"}
              onClick={evt => {
                props.paramsSet({contract_name: abiData.name, table_name: dropDownSelctedValue, scope_name: scopeName || abiData.name });
                props.fetchStart();
                setShowDetailsSection(true);                               
              }}>
              Get Data
            </ButtonPrimary>  
          </ScopeDivStyled>
        </Col>
      </Row>   
      <br />            
      {error
        ? 
          <>
            {!isObjectEmpty(error) && <p className="text-danger">{JSON.stringify(error)}</p>}
            <ErrorButton onClick={props.fetchStart}>Connection error, click to reload</ErrorButton>
          </>
        : isFetching 
          ? `loading...`
          : showDetailsSection
            ? payload.length === 0
              ? <CustomErrorDiv>No data in Multi-Index table "{params.table_name}" for scope "{params.scope_name}"</CustomErrorDiv>
              : <div>
                  <CardStyled>
                    <CardHeaderStyled>Multi-Index Table Raw Data</CardHeaderStyled>
                    <CardBody>
                      <CodeViewer
                        language="json"
                        value={JSON.stringify(payload, null, 2)}
                        readOnly={true}
                        height={600}
                      />
                    </CardBody>        
                  </CardStyled>   
                </div>
              :<div></div>}         
    </div>
  );
}

export default connect(
  ({ contractdetailPage: { multiIndex }}) => ({
    multiIndex
  }),
  {
    fetchStart,
    paramsSet,
    push
  }

)(MultiIndex);
