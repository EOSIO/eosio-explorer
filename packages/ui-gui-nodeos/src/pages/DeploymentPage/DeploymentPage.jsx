import React, { Component } from 'react';
import { 
    Card, CardBody, CardHeader,
    Row, Col, Button, ButtonGroup,
    Form, FormGroup, Label, Input
} from 'reactstrap';

import { StandardTemplate } from 'templates';
import InputInstructions from './components/InputInstructions';
import DragDropCodeViewer from '../../components/DragDropCodeViewer';
import CodeViewer from '../../components/CodeViewer';

class DeploymentPage extends Component {

    constructor() {
        super();
        this.state = {
            abiFilePath: "",
            wasmFilePath: "",
            compiledState: false,
            permissions: ""
        }
    }

    

    render() {
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
                                        <Input type="select" name="select" id="permissionSelect">
                                            <option>placeholder@active</option>
                                            <option>placeholder@active</option>
                                            <option>placeholder@active</option>
                                            <option>placeholder@active</option>
                                        </Input>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                </div>
            </StandardTemplate>
        )
    }
}

export default DeploymentPage;
