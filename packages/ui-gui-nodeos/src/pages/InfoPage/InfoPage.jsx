import './InfoPage.scss';

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

import { StandardTemplate } from 'templates';
import { increaseCounter } from 'actions/counter';
import Headblock from './components/Headblock';
import CodeViewer from '../../components/CodeViewer';

import axios from 'axios';

class InfoPage extends Component {

  constructor() {
    super();
    this.state = { 
      text: `default`, 
      jsonData: ""
    }
  }

  componentDidMount(){
    axios
      .get(`/api/mongodb/get_accounts`)
      .then(({data})=>{
        this.setState({
          text: JSON.stringify(data), 
          jsonData: JSON.stringify([{"abc":"Hello","test2":[456,789]},{"abc":"Hello","test2":[456,789]},{"abc":"Hello","test2":[456,789]},{"abc":"Hello","test2":[456,789]},{"abc":"Hello","test2":[456,789]},{"abc":"Hello","test2":[456,789]},{"abc":"Hello","test2":[456,789]},{"abc":"Hello","test2":[456,789]},{"abc":"Hello","test2":[456,789]}])
        });
      })
  }

  editorDidMount(editor, monaco) {
    editor.focus();
    this.editor = editor;
    this.monaco = monaco;

    setTimeout(
      function() {
        this.editor.trigger('any', 'editor.action.formatDocument');
      }
      .bind(this),
      250
    );
  }

  onChange(newValue) {
    console.log('change', newValue);
    this.setState({
      text: this.state.text,
      jsonData: newValue
    });
  }

  render() {

    let { text } = this.state.text;

    return (
      <StandardTemplate>
        <div className="InfoPage animated fadeIn">
            <Card>
              <CardHeader>
                Landing Page Content
              </CardHeader>
              <CardBody>
                <p><strong>Calls from mongodb:</strong> {text}</p>
                <p><strong>Counter:</strong> {this.props.count}</p>
                <Col col="4" sm="8" md="4" className="mb-3 text-center">
                  <Button block color="primary" onClick={()=>{this.props.updateCounter(2)}}>Click here to increase counter by 2</Button>
                </Col>
                <Headblock/>
                <p>Scroll down</p>
                <p>
                  <Link to={'/some'}>Go to Some Page</Link>
                </p>

                <Row className="mb-3">
                  <Col col="3" sm="3">
                    <h2>File List</h2>
                  </Col>
                  <Col col="9" sm="9">
                    <Row>
                      <Col col="12" sm="12" xs="12">
                        <h2>Monaco Editor</h2>
                        <CodeViewer height="300"
                                    value={this.state.jsonData} 
                                    readOnly={false}
                                    onChange={this.onChange.bind(this)} 
                                    editorDidMount={this.editorDidMount.bind(this)} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                

                <p>Json String: {this.state.jsonData}</p>
              </CardBody>
            </Card>
        </div>
      </StandardTemplate>
    );
  }
}

export default connect(
  ({ counter }) => ({
    count: counter.count,
  }),
  dispatch => ({
      updateCounter: (number) => dispatch(increaseCounter(number)),
  })
)(InfoPage);
