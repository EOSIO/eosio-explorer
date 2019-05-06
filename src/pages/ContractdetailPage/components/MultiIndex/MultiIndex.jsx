import React, { useState } from 'react';

import { connect } from 'react-redux';

import { fetchStart, paramsSet } from './MultiIndexReducer';

import { push } from 'connected-react-router'

import { CardBody, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import styled from 'styled-components';
import { CodeViewer } from 'components';
import { DropdownStyled, CardStyled, CardHeaderStyled, ErrorDivStyled, ButtonSecondary } from 'styled';

const SelectLabel = styled.label`
  padding-right: 10px;
  margin-top: 10px;
`
const DivFlexStyled = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 15px 25px 15px;
`
const CustomErrorDiv = styled(ErrorDivStyled)`
  padding: 0;
`
const CustomErrorButton = styled(ButtonSecondary)`
  width: auto;
`

const MultiIndex = (props) => {

  const [dropDownSelctedValue, setSelectedValue] = useState("Select Table");
  const [showDetailsSection, setShowDetailsSection ] = useState(false);
  const [ isOpenDropDown, toggleDropDown] = useState(false);  

  let { multiIndex: { isFetching, data, params } } = props;
  let { payload, error } = data;
  let { abiData } = props;

  return (
    <div className="MultiIndex">
      <DivFlexStyled>
        <SelectLabel>Select Table to Display multi-Index Table:</SelectLabel>
        <DropdownStyled isOpen={isOpenDropDown} toggle={()=>{toggleDropDown(!isOpenDropDown)}}>
          <DropdownToggle caret>{dropDownSelctedValue}</DropdownToggle>
          <DropdownMenu right>
            {(abiData.abi.tables).map((eachTable)=>
                <DropdownItem 
                  key={eachTable.name} 
                  onClick={()=>{ 
                    setSelectedValue(eachTable.name);
                    props.paramsSet({contract_name: abiData.name, table_name: eachTable.name });
                    props.fetchStart();
                    setShowDetailsSection(true);   
                  }}>
                {eachTable.name}</DropdownItem>)}
          </DropdownMenu>     
        </DropdownStyled>               
      </DivFlexStyled>                
      {error
        ? <CustomErrorButton onClick={props.fetchStart}>Connection error, click to reload</CustomErrorButton>
        : isFetching 
          ? `loading...`
          : showDetailsSection
            ? payload.length === 0
              ? <CustomErrorDiv>No data in Multi-Index table {params.table_name}</CustomErrorDiv>
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
