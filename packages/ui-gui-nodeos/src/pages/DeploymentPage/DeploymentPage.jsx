import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
    CardBody, Row, Col, Spinner,
    Nav, NavLink, NavItem, TabContent, TabPane,
    Form, FormGroup, Label, Badge,
    DropdownToggle, DropdownMenu, DropdownItem,
    UncontrolledTooltip
} from 'reactstrap';
import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import InputInstructions from './components/InputInstructions';
import { DragDropCodeViewer, CodeViewer } from 'components';
import { 
    CardStyled, CardHeaderStyled, PageTitleDivStyled,
    InputStyled, ButtonPrimary, ButtonSecondary,
    DropdownStyled, OverlayStyled, ButtonGroupSeperated
} from 'styled';
import cogoToast from 'cogo-toast';

import { defaultSet } from 'reducers/permission';
import { folderSet, abiImport, contractCompile, contractDeploy, logClear, outputClear } from './DeploymentPageReducer';

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

const ButtonPrimaryResponsive = styled(ButtonPrimary)`
  max-width: 130px;
  display: inline-block;
  width: 100%;
`

const DeploymentPage = (props) => {

    let { permission: { data }, deployContainer, isProcessing, nodeos,
        folderSet, abiImport, contractCompile, contractDeploy, logClear,
        outputClear
    } = props;
    let { path, stdoutLog, stderrLog,
        abiPath, abiContents, compiled,
        errors, output, imported, deployed
    } = deployContainer;
    let { list, defaultId } = data;
    let noOfPermissions = list.slice(0).reduce((accounts, el) => {
        if (el.private_key) accounts++;
        return accounts;
    }, 0);

    const [ clickDeploy, setClickDeploy ] = useState(false);
    const [ isOpenDropDown, toggleDropDown ] = useState(false);
    const [ currentFile, setCurrentFile ] = useState("");
    const [ activeTab, setActiveTab ] = useState("1");
    const [ currentId, setCurrentId ] = useState(defaultId || null);

    const importRef = React.createRef();

    useEffect(() => {
        outputClear();
    }, [])

    useEffect(() => {
        if (!deployed && !clickDeploy) {
            if (compiled && currentFile.length > 0) {
                cogoToast.success(
                    "Smart contract successfully generated",
                    {heading: 'Compile Success', position: 'bottom-center', hideAfter: 3}
                );
            } else if (imported && currentFile.length > 0) {
                cogoToast.success(
                    "Smart contract successfully imported",
                    {heading: 'Import Success', position: 'bottom-center', hideAfter: 3}
                );
            } else if (!compiled && currentFile.length > 0) {
                cogoToast.error(
                    "Smart contract failed to compile, please check ABI / Deployment Log",
                    {heading: 'Compile Unsuccessful', position: 'bottom-center', hideAfter: 3}
                );
            }
        } else if (!deployed && clickDeploy) {
            cogoToast.error(
                "Smart contract could not be deployed, please check ABI / Deployment Log",
                {heading: 'Deployment Unsuccessful', position: 'bottom-center', hideAfter: 3}
            );
            setClickDeploy(false);
        } else if (deployed && clickDeploy) {
            cogoToast.success(
                "Smart contract successfully deployed",
                {heading: 'Deployment Success', position: 'bottom-center', hideAfter: 3}
            );
            setClickDeploy(false);
        }
    }, [abiContents]);

    function handleChange(ev) {
        ev.preventDefault();
        folderSet(ev.target.value.trim());
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
        let currentPermission = list.find(account => account._id === currentId);
        let msg = `Cannot deploy contract under owner of the system contract`;
        let fullPath = {
            source: actualRootPath+currentFile
        }
        let deployer = {
            endpoint: nodeos,
            account_name: currentPermission["account"],
            private_key: currentPermission["private_key"],
            abiSource: (imported) ? abiPath : null
        }
        logClear();
        setClickDeploy(true);

        if (currentPermission["account"] !== 'eosio')
            contractDeploy(fullPath, deployer);
        else {
            cogoToast.warn(msg, {
                heading: 'Unable to Deploy',
                position: 'bottom-center',
                hideAfter: 4
            });
            setClickDeploy(false);
        }
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
            <OverlayStyled isLoading={isProcessing}></OverlayStyled>
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
                                        <UncontrolledTooltip placement="top" target="rootFolder"
                                            delay={{show: 0, hide: 0}}
                                            trigger="hover focus"
                                            autohide={true}
                                            >
                                            Input the absolute folder path containing your .cpp file in this field.
                                            For example: /Users/syzygy/contracts/mycontract
                                        </UncontrolledTooltip>
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
                                            <ButtonGroupSeperated className="float-left">
                                                <ButtonPrimary
                                                    id="GenerateAbi"
                                                    onClick={(ev)=>generateAbi(ev)}
                                                    disabled={path.length === 0 || currentFile.length === 0 || isProcessing}
                                                    >
                                                    Generate ABI
                                                </ButtonPrimary>
                                                <ButtonSecondary
                                                    id="ImportAbi"
                                                    onClick={()=>{clickButton()}}
                                                    disabled={isProcessing}
                                                    >
                                                    Import ABI
                                                </ButtonSecondary>
                                            </ButtonGroupSeperated>
                                            <input type="file"
                                                id="abiImporter"
                                                accept=".abi"
                                                ref={importRef}
                                                style={{display:"none"}}
                                                onChange={(ev)=>handleFileSelect(ev)}
                                                />
                                        </Col>
                                    </FormGroup>
                                    <UncontrolledTooltip placement="top" target="GenerateAbi"
                                        delay={{show: 0, hide: 0}}
                                        trigger="hover"
                                        autohide={true}
                                        >
                                        Click this button to compile the smart contract and view the resulting ABI
                                        file in the viewer below.
                                    </UncontrolledTooltip>
                                    <UncontrolledTooltip placement="top" target="ImportAbi"
                                        delay={{show: 0, hide: 0}}
                                        trigger="hover"
                                        autohide={true}
                                        >
                                        Click this button to import a pre-made ABI file and review it in the viewer below
                                    </UncontrolledTooltip>
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
                                        <Label for="permissionSelect" xs={4}>
                                            With the following permission:
                                        </Label>
                                        <Col xs={5}>
                                            <DropdownStyled className="float-left" isOpen={isOpenDropDown} toggle={()=>{toggleDropDown(!isOpenDropDown)}}>
                                                <DropdownToggle caret={noOfPermissions > 0}>
                                                    {
                                                      noOfPermissions > 0
                                                      ? list.map(permission => {
                                                        let msg = (currentId === defaultId) ?
                                                          `${permission.account}@${permission.permission} (default)` :
                                                          `${permission.account}@${permission.permission}`;
                                                        if (currentId === permission._id) 
                                                          return msg;
                                                        else
                                                          return null;
                                                      })
                                                      : "No Permissions Available"
                                                    }
                                                </DropdownToggle>
                                                {
                                                  noOfPermissions > 0
                                                  ? <DropdownMenu right>
                                                      {
                                                        list.map((permission)=> permission.private_key &&
                                                          <DropdownItem key={permission._id} onClick={()=>{setCurrentId(permission._id)}}>
                                                            {`${permission.account}@${permission.permission}`}
                                                          </DropdownItem>)
                                                      }
                                                  </DropdownMenu>
                                                  : null
                                                }
                                            </DropdownStyled>
                                        </Col>
                                        <Col xs={3}>
                                            <ButtonPrimaryResponsive
                                                id="DeployContract"
                                                className="btn float-right"
                                                disabled={path.length === 0 || 
                                                    currentFile.length === 0 ||
                                                    isProcessing}
                                                onClick={(ev)=>deployContract(ev)}
                                                >
                                                Deploy
                                            </ButtonPrimaryResponsive>
                                        </Col>
                                    </FormGroup>
                                </Form>
                                <UncontrolledTooltip placement="top" target="DeployContract"
                                    delay={{show: 0, hide: 0}}
                                    trigger="hover"
                                    autohide={true}
                                    >
                                    Compiles and deploys the smart contract at once. 
                                </UncontrolledTooltip>
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
                                    id="ClearLogs"
                                    onClick={()=>{ 
                                        if (errors.length > 0 || stderrLog.length > 0 || stdoutLog.length > 0)
                                            cogoToast.info("Cleared all logs", {position: 'bottom-center', hideAfter: 2});
                                        logClear(); 
                                    }}
                                    >
                                    Clear All Logs
                                </ButtonPrimary>
                                <UncontrolledTooltip placement="top" target="ClearLogs"
                                    delay={{show: 0, hide: 0}}
                                    trigger="hover"
                                    autohide={true}
                                    >
                                    Click this button to remove all the currently displayed warnings and error logs
                                </UncontrolledTooltip>
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
