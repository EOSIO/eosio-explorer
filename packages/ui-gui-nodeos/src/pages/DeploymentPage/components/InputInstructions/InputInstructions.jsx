import React, { Component } from 'react';
import { 
    Card, CardBody, CardHeader,
    ListGroup, ListGroupItem 
} from 'reactstrap';

class InputInstructions extends Component {

    render() {
        return (
            <Card>
                <CardHeader>
                    File Input Entry Instructions
                </CardHeader>
                <CardBody>
                    <ListGroup>
                        <ListGroupItem>1. Drag and drop the chosen entry file to the code viewer area</ListGroupItem>
                        <ListGroupItem>2. Double check your source code file and dependencies</ListGroupItem>
                        <ListGroupItem>3. <b>The folder containing this file</b> will be used as the source folder</ListGroupItem>
                        <ListGroupItem>4. Move to step 2 and generate the ABI file</ListGroupItem>
                    </ListGroup>
                </CardBody>
            </Card>
        )
    }

}

export default InputInstructions;
