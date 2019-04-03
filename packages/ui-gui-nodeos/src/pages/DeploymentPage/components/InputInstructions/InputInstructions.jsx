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
                        <ListGroupItem>1. Drag and drop (or browse for it) the chosen entry file to the grey area</ListGroupItem>
                        <ListGroupItem>2. Double check your source code file and dependencies</ListGroupItem>
                        <ListGroupItem>
                            3. <b>Enter the absolute folder path containing this file</b> into the field indicated as 
                            "Root Folder Path". This path will be saved locally for future use. If you want to change
                            the path, you can click "Reset Path" to clear the field.
                        </ListGroupItem>
                        <ListGroupItem>
                            4. If you want to check your ABI works, you can click Generate ABI to compile the smart
                            contract only. In case this doesn't work, you can Import ABI instead. The header in step 3
                            will show you if you are using an imported ABI file or not.
                        </ListGroupItem>
                        <ListGroupItem>
                            5. If you're sure your contract works, you can deploy to the Nodeos instance you are
                            currently connected to by clicking on Deploy after selecting the permission you want
                            to deploy the contract as
                        </ListGroupItem>
                    </ListGroup>
                </CardBody>
            </Card>
        )
    }

}

export default InputInstructions;
