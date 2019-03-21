import React, { Component }  from 'react';
import { Keygen } from 'eosjs-keygen';

class CreateAccount extends Component {

  constructor(){
    super()
    this.state = {
      ownerPublicKey: "",
      ownerPrivateKey: "",
      activePublicKey: "",
      activePrivateKey: ""
    }
  }

  componentDidMount(){
    Keygen.generateMasterKeys()
    .then(keys => {
      this.setState({
        ownerPublicKey: keys.publicKeys.owner,
        ownerPrivateKey: keys.privateKeys.owner,
        activePublicKey: keys.publicKeys.active,
        activePrivateKey: keys.privateKeys.active,
      });
    })
    .catch(err => console.log("Internal server error " + err))
  }

  render() {
    return (
      <div  style={{border:"1px solid black"}} className="CreateAccount">
        <div>This is create account panel.</div>
        <div>Owner</div>
        <div className="keys">
          <p>public: {this.state.ownerPublicKey}</p>
          <p>private: {this.state.ownerPrivateKey}</p>
        </div>
        <div>Active</div>
        <div className="keys">
          <p>public: {this.state.activePublicKey}</p>
          <p>private: {this.state.activePrivateKey}</p>
        </div>
      </div>
    )
  }
}

export default CreateAccount;
