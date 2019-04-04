import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    CardBody, Row, Col, ButtonGroup, Spinner,
    Nav, NavLink, NavItem, TabContent, TabPane,
    Form, FormGroup, Label, Badge,
    DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import InputInstructions from './components/InputInstructions';
import { DragDropCodeViewer, CodeViewer } from 'components';
import { 
    CardStyled, CardHeaderStyled, PageTitleDivStyled,
    InputStyled, ButtonPrimary, ButtonSecondary,
    DropdownStyled
} from 'styled';

import { defaultSet } from 'reducers/permission';
import { folderSet, abiImport, contractCompile, contractDeploy, logClear, outputClear } from './DeploymentPageReducer';

const overlayOn = {
    position: "fixed",
    display: "block",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 999,
    cursor: "pointer"
}

const overlayOff = {
    display: "none"
}

const tabPane = {
    maxHeight: "350px",
    overflowY: "scroll"
}

const FirstCardStyled = styled(CardStyled)`
  border-top: solid 2px #1173a4;
`

const LogCardStyled = styled(CardStyled)`
  border: none;
`

const LogCardHeaderStyled = styled(CardHeaderStyled)`
  border: none;
  background-color: #ffffff;
  padding: 5px 20px;
`

const DeploymentPage = (props) => {

    let { permission: { data }, deployContainer, isProcessing, nodeos,
        defaultSet, folderSet, abiImport, contractCompile, contractDeploy, logClear,
        outputClear
    } = props;
    let { path, stdoutLog, stderrLog,
        abiPath, abiContents,
        errors, output, imported, deployed
    } = deployContainer;
    let { list, defaultId } = data;

    const [ isOpenDropDown, toggleDropDown ] = useState(false);
    const [ currentFile, setCurrentFile ] = useState("");
    const [ activeTab, setActiveTab ] = useState("1");

    const importRef = React.createRef();

    useEffect(() => {
        outputClear();
    }, [])

    function handleChange(ev) {
        ev.preventDefault();
        folderSet(ev.target.value);
    };

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
            {
                isProcessing &&
                    <div style={{position:"fixed",top:"50%",left:"50%", zIndex:"1000"}}>
                        <Spinner color="primary"
                            style={{
                                width: "5rem",
                                height: "5rem"
                            }}
                        />
                    </div>
            }
            <div className="DeploymentPage animated fadeIn">
                <Row>
                    <Col xs="12">
                        <PageTitleDivStyled>Smart Contract Deployment</PageTitleDivStyled>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        <FirstCardStyled>
                            <CardHeaderStyled>
                                Step 1 - Select File Entry Point
                            </CardHeaderStyled>
                            <CardBody>
                                <Row>
                                    <Col xs="4">
                                        <InputInstructions />
                                    </Col>
                                    <Col xs="8">
                                        <DragDropCodeViewer
                                            setCurrentFile={setCurrentFile}
                                            /> <br />
                                        <Form>
                                            <FormGroup row>
                                                <Label for="rootFolder" sm={2}>
                                                    Root Folder Path:
                                                </Label>
                                                <Col sm={10}>
                                                    <InputStyled type="text"
                                                        name="rootFolder"
                                                        id="rootFolder"
                                                        value={path}
                                                        onChange={(ev)=>handleChange(ev)}/>
                                                </Col>
                                            </FormGroup>
                                        </Form> 
                                    </Col>
                                </Row>
                            </CardBody>
                        </FirstCardStyled>
                    </Col>
                </Row>
                <Row>
                    <Col xs="6">
                        <CardStyled>
                            <CardHeaderStyled>
                                Step 2 - ABI File (Optional)
                            </CardHeaderStyled>
                            <CardBody className="clearfix">
                                <Form>
                                    <FormGroup row>
                                        <Col sm={4}>
                                            <ButtonGroup className="float-left">
                                                <ButtonPrimary
                                                    onClick={(ev)=>generateAbi(ev)}
                                                    disabled={path.length === 0 || currentFile.length === 0 || isProcessing}
                                                    >
                                                    Generate ABI
                                                </ButtonPrimary>
                                                <ButtonSecondary
                                                    onClick={()=>{clickButton()}}
                                                    disabled={isProcessing}
                                                    >
                                                    Import ABI
                                                </ButtonSecondary>
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
                                <CodeViewer
                                        language="json"
                                        readOnly={true}
                                        value={abiContents}
                                        height="350"
                                        />
                            </CardBody>
                        </CardStyled>
                        <CardStyled className="clearfix">
                            <CardHeaderStyled>
                                Step 3 - Deploy {imported && <Badge color="primary" pill>Imported ABI</Badge>}
                            </CardHeaderStyled>
                            <CardBody>

                                <Form>
                                    <FormGroup row>
                                        <Label for="permissionSelect" xs={4} style={{display:'block',textAlign:'left'}}>
                                            With the following permission:
                                        </Label>
                                        <Col xs={5}>
                                            <DropdownStyled className="float-left" isOpen={isOpenDropDown} toggle={()=>{toggleDropDown(!isOpenDropDown)}}>
                                                <DropdownToggle style={{minWidth: "225px", textAlign: "left"}} caret>
                                                    {
                                                        list.map((permission) => (defaultId === permission._id) && 
                                                            `${permission.account}@${permission.permission} (default)`)
                                                    }
                                                </DropdownToggle>
                                                <DropdownMenu style={{minWidth: "225px"}} right>
                                                    {
                                                        list.map((permission)=> permission.private_key &&
                                                            <DropdownItem key={permission._id} onClick={()=>{ defaultSet(permission._id)}}>
                                                                {`${permission.account}@${permission.permission}`}
                                                            </DropdownItem>)
                                                    }
                                                </DropdownMenu>
                                            </DropdownStyled>
                                        </Col>
                                        <Col xs={3}>
                                            <ButtonPrimary
                                                className="btn float-right"
                                                disabled={path.length === 0 || currentFile.length === 0 || isProcessing}
                                                onClick={(ev)=>deployContract(ev)}
                                                >
                                                Deploy
                                            </ButtonPrimary>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </CardStyled>
                    </Col>
                    <Col xs="6">
                        <LogCardStyled>
                            <LogCardHeaderStyled className="clearfix">
                                <span style={{fontSize: "16px"}}>
                                    ABI / Deployment Log
                                </span>
                                <ButtonPrimary
                                    className="float-right"
                                    onClick={()=>logClear()}
                                    >
                                    Clear Logs
                                </ButtonPrimary>
                            </LogCardHeaderStyled>
                            <CardBody>
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
                                                Compiler Errors { stderrLog && stderrLog.length > 0 ? "⚠️" : null }
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink
                                                className={activeTab === "3" ? 'active' : ''}
                                                onClick={()=>setActiveTab("3")}
                                                >
                                                Service Errors { errors && errors.length > 0 ? "⚠️" : null }
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                    <TabContent activeTab={activeTab}>
                                        <TabPane tabId="1" style={tabPane}>
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
                                        <TabPane tabId="2" style={tabPane}>
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
                                        <TabPane tabId="3" style={tabPane}>
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
                                    </TabContent>
                                </div>
                            </CardBody>
                            <LogCardHeaderStyled>
                                <span style={{fontSize: "16px"}}>Deployment Result</span>
                            </LogCardHeaderStyled>
                            <CardBody>
                                {
                                    !deployed
                                    ? <span>No successful deployment</span>
                                        : output
                                        ? <div style={tabPane}>
                                            <h5>Successfully deployed the {currentFile.split('.')[0]} smart contract:</h5>
                                            <pre>{JSON.stringify(output, null, 4)}</pre>
                                        </div>
                                        :  <div style={tabPane}>
                                            <h5>Something went wrong, please view the log for possible errors and causes</h5>
                                        </div>
                                }
                            </CardBody>
                        </LogCardStyled>
                    </Col>
                </Row>
            </div>
        </StandardTemplate>
    )
}

export default connect(
    ({ permission, deploymentPage: { deployContainer, isProcessing }, endpoint: { path : { nodeos }}}) => ({
      permission, deployContainer, isProcessing, nodeos
    }),
    {
      defaultSet,
      folderSet,
      abiImport,
      contractCompile,
      contractDeploy,
      logClear,
      outputClear
    }

  )(DeploymentPage);
