import React, { Component } from 'react';
import { 
    CardBody, ListGroup, ListGroupItem 
} from 'reactstrap';
import { CardStyled, CardHeaderStyled } from 'styled';
class InputInstructions extends Component {

    render() {
        return (
            <CardStyled>
                <CardHeaderStyled>
                    Entry Point File Upload Instructions
                </CardHeaderStyled>
                <CardBody>
                    <ListGroup>
                        <ListGroupItem>1. Drag and drop (or browse for it) the chosen entry file to the grey area</ListGroupItem>
                        <ListGroupItem>2. Double check your source code file and dependencies</ListGroupItem>
                        <ListGroupItem>
                            3. <b>Enter the absolute folder path containing this file</b> into the field indicated as 
                            "Root Folder Path". This path will be saved locally for future use. 
                        </ListGroupItem>
                        <ListGroupItem>
                            4. <b>Optional Step 2</b>: Generate your ABI file first by clicking "Generate ABI". The result of
                            compilation will appear in the code viewer. View the ABI / Deployment Log for any warnings
                            or errors. You may also choose to import an ABI file by clicking "Import ABI" instead.
                        </ListGroupItem>
                        <ListGroupItem>
                            5. Go to Step 3, deploy. If you're sure your contract works, you can deploy to the Nodeos instance you are
                            currently connected to by clicking on Deploy after selecting the permission you want
                            to deploy the contract as
                        </ListGroupItem>
                    </ListGroup>
                </CardBody>
            </CardStyled>
        )
    }

}

export default InputInstructions;
