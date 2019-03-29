import React, { useState, useRef } from 'react';
import {
    Card, CardBody, CardHeader,
    Row, Col, Button, ButtonGroup,
    Form, FormGroup, Label, Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import InputInstructions from './components/InputInstructions';
import { DragDropCodeViewer, CodeViewer } from 'components';

import { defaultSet } from 'reducers/permission';
import { folderSet } from './DeploymentPageReducer';

const DeploymentPage = (props) => {

    let { permission: { data }, deployContainer, isProcessing, defaultSet, folderSet } = props;
    let { path } = deployContainer;
    let { list, defaultId } = data;

    const [ isOpenDropDown, toggleDropDown] = useState(false);
    const [ currentFile, setCurrentFile ] = useState("");

    const importRef = useRef(null);

    function handleChange(ev) {
        ev.preventDefault();
        folderSet(ev.target.value);
    };

    function resetPath(ev) {
        ev.preventDefault();
        folderSet("");
    }

    function clickButton(ev) {
        ev.preventDefault();
        console.log(importRef.current);
    }

    return (
        <StandardTemplate>
            <div className="DeploymentPage">
                <Card>
                    <CardHeader>
                        Step 1 - Review File
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs="4">
                                <InputInstructions />
                            </Col>
                            <Col xs="8">
                                <DragDropCodeViewer
                                    setCurrentFile={setCurrentFile} />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        Step 2 - Generate / Import ABI Files 
                    </CardHeader>
                    <CardBody className="clearfix">
                        <Form>
                            <FormGroup row>
                                <Label for="rootFolder" sm={1}>
                                    Root Folder Path
                                </Label>
                                <Col sm={6}>
                                    <Input type="text" 
                                        name="rootFolder" 
                                        id="rootFolder"
                                        value={path}
                                        onChange={(ev)=>handleChange(ev)}/>
                                </Col>
                                <Col sm={1}>
                                    <Button block
                                        onClick={(ev)=>resetPath(ev)}
                                        >
                                        Reset Path
                                    </Button>
                                </Col>
                                <Col sm={4}>
                                    <ButtonGroup className="float-right">
                                        <Button color="primary"
                                            disabled={path.length === 0}
                                            >
                                            Generate ABI
                                        </Button>
                                        <Button
                                            onClick={(ev)=>{clickButton(ev)}} 
                                            >
                                            Import ABI
                                        </Button>
                                    </ButtonGroup>
                                    <Input type="file" 
                                        id="abiImporter" 
                                        ref={importRef} 
                                        style={{display:"none"}} 
                                        />
                                </Col>
                            </FormGroup>
                        </Form>
                        <div>
                            <Row>
                                <Col sm={6}>
                                    <h4>ABI Viewer</h4>
                                    <CodeViewer
                                        language="json"
                                        readOnly={true}
                                        />  
                                </Col>
                                <Col sm={6}>
                                    <h4>Log</h4>
                                    <CodeViewer
                                        readOnly={true}
                                        />
                                </Col>
                            </Row>
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        Step 3 - Deploy
                    </CardHeader>
                    <CardBody className="clearfix">
                        <Form>
                            <FormGroup row>
                                <Col sm={2}>
                                    <Button color="primary" className="btn float-left" block>Deploy</Button>
                                </Col>
                                <Label for="permissionSelect" sm={8} style={{display:'block',textAlign:'right'}}>
                                    With the following permission:
                                </Label>
                                <Col sm={2}>
                                    <Dropdown className="float-right" isOpen={isOpenDropDown} toggle={()=>{toggleDropDown(!isOpenDropDown)}}>
                                        <DropdownToggle caret>
                                            { list.map((permission) => defaultId === permission._id && `${permission.account}@${permission.permission}`) }
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            { list.map((permission)=><DropdownItem key={permission._id} onClick={()=>{ defaultSet(permission._id)}}>{`${permission.account}@${permission.permission}`}</DropdownItem>) }
                                        </DropdownMenu>
                                    </Dropdown>
                                </Col> 
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </StandardTemplate>
    )
}

export default connect(
    ({ permission, deploymentPage: { deployContainer, isProcessing } }) => ({
      permission, deployContainer, isProcessing
    }),
    {
      defaultSet,
      folderSet
    }

  )(DeploymentPage);
