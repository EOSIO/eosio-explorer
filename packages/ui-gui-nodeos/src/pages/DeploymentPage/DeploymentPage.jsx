import React, { useState } from 'react';
import {
    Card, CardBody, CardHeader,
    Row, Col, Button, ButtonGroup,
    Form, FormGroup, Label, Input,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { StandardTemplate } from 'templates';
import { connect } from 'react-redux';

import InputInstructions from './components/InputInstructions';
import DragDropCodeViewer from '../../components/DragDropCodeViewer';
import CodeViewer from '../../components/CodeViewer';

import { defaultSet } from 'reducers/permission';

const DeploymentPage = (props) => {

    // constructor() {
    //     super();
    //     this.state = {
    //         abiFilePath: "",
    //         wasmFilePath: "",
    //         compiledState: false,
    //         permissions: ""
    //     }
    // }
    const [ isOpenDropDown, toggleDropDown] = useState(false);

    let { permission: { isFetching, data }, defaultSet } = props;
    let { list,defaultId } = data;

    return (
        <StandardTemplate>
            <div className="DeploymentPage">
                <Card>
                    <CardHeader>
                        Step 1 - Select File Entry Point
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs="4">
                                <InputInstructions />
                            </Col>
                            <Col xs="8">
                                <DragDropCodeViewer />
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        Step 2 - Generate / Import ABI File
                    </CardHeader>
                    <CardBody>
                        <div>
                            <ButtonGroup>
                                <Button color="primary">Generate ABI File</Button>
                                <Button color="secondary">Import ABI File</Button>
                            </ButtonGroup>
                        </div> <br/>
                        <div>
                            <CodeViewer
                                language="json"
                                readOnly={true}
                                />
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
                                <Label for="permissionSelect" sm={5} style={{display:'block',textAlign:'right'}}>
                                    With the following permission:
                                </Label>
                                <Col sm={5}>
                                <Dropdown isOpen={isOpenDropDown} toggle={()=>{toggleDropDown(!isOpenDropDown)}}>
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
    ({ permission }) => ({
      permission
    }),
    {
      defaultSet,
    }

  )(DeploymentPage);
