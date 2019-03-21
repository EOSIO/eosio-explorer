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
                        <ListGroupItem>1. Step one</ListGroupItem>
                        <ListGroupItem>2. Step two</ListGroupItem>
                        <ListGroupItem>3. ???</ListGroupItem>
                        <ListGroupItem>4. Profit!</ListGroupItem>
                    </ListGroup>
                </CardBody>
            </Card>
        )
    }

}

export default InputInstructions;
