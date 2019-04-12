import './TestRPCPage.scss';
import React, { Component } from 'react';
import { StandardTemplate } from 'templates';
import apiRpc from 'services/api-rpc';

class TestRPCPage extends Component {
  constructor(){
    super()
    this.state = { text: `default`}
  }

  componentDidMount(){
    // const query = {
    //   "creator_private_key": "5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5",
    //   "creator_account_name": "useraaaaaaaa",
    //   "new_account_name": "useraaaaaabb",
    //   "new_account_owner_key": "EOS6bvYVAFtXvMexmTnhu1APQ2CCDauxWHWoHXMEM9JdXEvMwvqkF",
    //   "new_account_active_key": "EOS6qoJStaBPnhWBX97G8H3dnfivT4uo6iZFUH345wL5vMNyLyRCp",
    // };
    // apiRpc.create_account(query).then(result => console.log(result));

    let now = new Date();
    const query = {
      "private_key": "5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5",
      "actor": "useraaaaaaaa",
      "permission": "active",
      "action_name": "update",
      "account_name": "noteacc",
      "payload": {"user": 'useraaaaaaaa',"note": 'this is automated message ' + now},
    };
    apiRpc("push_action", query).then(result => {
      console.log(result);
      this.setState({text: JSON.stringify(result)});
    });
  }

  render() {
    
    return (
      <StandardTemplate>
        <div className="InfoPage animated fadeIn">
          <p><strong>Calls from rpc ( push action )</strong> </p>
          <p><strong>Result:</strong></p>
          <p><strong>{this.state.text}</strong> </p>
        </div>
      </StandardTemplate>
    );
  }
}

export default TestRPCPage;
