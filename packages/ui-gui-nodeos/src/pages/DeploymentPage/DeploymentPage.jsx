import React, { useState } from 'react';
import {
    Card, CardBody, CardHeader,
    Row, Col, Button, ButtonGroup, Spinner, 
    Nav, NavLink, NavItem, TabContent, TabPane,
    Form, FormGroup, Label, Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import InputInstructions from './components/InputInstructions';
import DragDropCodeViewer from '../../components/DragDropCodeViewer';
import CodeViewer from '../../components/CodeViewer';

import { defaultSet } from 'reducers/permission';
import { folderSet, abiImport, contractCompile, contractDeploy, logClear } from './DeploymentPageReducer';

const overlayOn = {
    position: "fixed",
    display: "block",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 2,
    cursor: "pointer"
}

const overlayOff = {
    display: "none"
}

const DeploymentPage = (props) => {

    let { permission: { data }, deployContainer, isProcessing, nodeos,
        defaultSet, folderSet, abiImport, contractCompile, contractDeploy, logClear
    } = props;
    let { path, stdoutLog, stderrLog, 
        wasmPath, abiPath, abiContents, 
        errors, output, imported
    } = deployContainer;
    let { list, defaultId } = data;

    const [ isOpenDropDown, toggleDropDown ] = useState(false);
    const [ currentFile, setCurrentFile ] = useState("");
    const [ activeTab, setActiveTab ] = useState("1");

    const importRef = React.createRef();

    function handleChange(ev) {
        ev.preventDefault();
        folderSet(ev.target.value);
    };

    function resetPath(ev) {
        ev.preventDefault();
        folderSet("");
    }

    function generateAbi(ev) {
        ev.preventDefault();
        let actualRootPath = (path.endsWith("/")) ? path : path+"/";
        let fullPath = {
            source: actualRootPath+currentFile
        }
        logClear();
        contractCompile(fullPath);
    }

    function deployContract(ev) {
        ev.preventDefault();
        let actualRootPath = (path.endsWith("/")) ? path : path+"/";
        let currentPermission = list.find(account => account._id === defaultId);
        let fullPath = {
            source: actualRootPath+currentFile
        }
        console.log(currentPermission);
        let deployer = {
            endpoint: nodeos,
            account_name: currentPermission["account"],
            private_key: currentPermission["private_key"],
            abiSource: (imported) ? abiPath : null
        }
        logClear();
        contractDeploy(fullPath, deployer);
    }

    function clickButton() {
        importRef.current.click();
    }

    function handleFileSelect(ev) {
        ev.preventDefault();
        const file = ev.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            let contents = e.target.result;
            let fileContents = {
                abiName: file.name,
                content: contents
            };
            abiImport(fileContents);
        }
        
        reader.readAsText(file);
        ev.target.value = null;
    }

    return (
        <StandardTemplate>
            <div style={isProcessing ? overlayOn : overlayOff}></div>
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
                        {
                            isProcessing &&
                            <Spinner color="primary" 
                                style={{ 
                                    position: "absolute", 
                                    top: "50%", 
                                    left: "50%",
                                    width: "5rem",
                                    height: "5rem",
                                    zIndex: 3 
                                }}
                            />
                        }
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
                                            onClick={(ev)=>generateAbi(ev)}
                                            disabled={path.length === 0 || currentFile.length === 0 || isProcessing}
                                            >
                                            Generate ABI
                                        </Button>
                                        <Button
                                            onClick={()=>{clickButton()}} 
                                            disabled={isProcessing}
                                            >
                                            Import ABI
                                        </Button>
                                        <Button 
                                            onClick={()=>logClear()}
                                            >
                                            Clear Logs
                                        </Button>
                                    </ButtonGroup>
                                    <input type="file" 
                                        id="abiImporter"
                                        accept=".abi" 
                                        ref={importRef} 
                                        style={{display:"none"}} 
                                        onChange={(ev)=>handleFileSelect(ev)}
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
                                        value={abiContents}
                                        />  
                                </Col>
                                <Col sm={6}>
                                    <div>
                                        <Nav tabs>
                                            <NavItem>
                                                <NavLink
                                                    className={activeTab === "1" ? 'active' : ''}
                                                    onClick={()=>setActiveTab("1")}
                                                    >
                                                    Warnings { stdoutLog && stdoutLog.length > 0 ? "⚠️" : null }
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={activeTab === "2" ? 'active' : ''}
                                                    onClick={()=>setActiveTab("2")}
                                                    > 
                                                    Unexpected Errors { stderrLog && stderrLog.length > 0 ? "⚠️" : null }
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={activeTab === "3" ? 'active' : ''}
                                                    onClick={()=>setActiveTab("3")}
                                                    >
                                                    Tool Errors { errors && errors.length > 0 ? "⚠️" : null }
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={activeTab === "4" ? 'active' : ''}
                                                    onClick={()=>setActiveTab("4")}
                                                    >
                                                    Contract Output { output ? "💡" : null }
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent activeTab={activeTab} style={{maxHeight: 'inherit'}}>
                                            <TabPane tabId="1">
                                                <Row>
                                                    <Col sm={12}>
                                                        {
                                                            stdoutLog && stdoutLog.length === 0 
                                                            ? <pre>No logs</pre>
                                                            : stdoutLog.map((line, i) => 
                                                                <pre key={"stdout_"+i}>
                                                                    {line}
                                                                </pre>)
                                                        }
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <Row>
                                                    <Col sm={12}>
                                                        {
                                                            stderrLog && stderrLog.length === 0 
                                                            ? <pre>No logs</pre>
                                                            : stderrLog.map((line, i) => 
                                                                <pre key={"stderr_"+i}>
                                                                    {line}
                                                                </pre>)
                                                        }
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <Row>
                                                    <Col sm={12}>
                                                        {
                                                            errors && errors.length === 0 
                                                            ? <pre>No logs</pre>
                                                            : errors.map((line, i) => 
                                                                <div key={"errors_"+i}>
                                                                    <code>{line}</code>
                                                                </div>)
                                                        }
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="4">
                                                <Row>
                                                    <Col sm={12}>
                                                        {
                                                            output
                                                            ? <pre>{JSON.stringify(output, null, 4)}</pre>
                                                            : <pre>No successful contract deployment</pre>
                                                        }
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                        </TabContent>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    Current ABI Path: <code>{abiPath}</code> (Is imported? {imported.toString()})
                                </Col>
                            </Row>                            
                            <Row>
                                <Col sm={12}>
                                    Current WASM Path: <code>{wasmPath}</code>
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
                                    <Button color="primary" 
                                        className="btn float-left" 
                                        disabled={path.length === 0 || currentFile.length === 0 || isProcessing}
                                        onClick={(ev)=>deployContract(ev)}
                                        block>
                                        Deploy
                                    </Button>
                                </Col>
                                <Label for="permissionSelect" sm={8} style={{display:'block',textAlign:'right'}}>
                                    With the following permission:
                                </Label>
                                <Col sm={2}>
                                    <Dropdown className="float-right" isOpen={isOpenDropDown} toggle={()=>{toggleDropDown(!isOpenDropDown)}}>
                                        <DropdownToggle caret>
                                            { 
                                                list.map((permission) => (defaultId === permission._id) && `${permission.account}@${permission.permission}`) 
                                            }
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            { 
                                                list.map((permission)=> permission.private_key &&
                                                    <DropdownItem key={permission._id} onClick={()=>{ defaultSet(permission._id)}}>
                                                        {`${permission.account}@${permission.permission}`}
                                                    </DropdownItem>) 
                                            }
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
    ({ permission, deploymentPage: { deployContainer, isProcessing }, endpoint: { nodeos } }) => ({
      permission, deployContainer, isProcessing, nodeos
    }),
    {
      defaultSet,
      folderSet,
      abiImport,
      contractCompile,
      contractDeploy,
      logClear
    }

  )(DeploymentPage);
