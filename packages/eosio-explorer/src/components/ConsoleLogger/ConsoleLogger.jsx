import './ConsoleLogger.scss';

import React, {Component} from 'react';
import { connect } from 'react-redux';

import Terminal from 'terminal-in-react';
import { CardHeaderStyled } from 'styled';

import { panelSet } from 'reducers/errorlog';

class ConsoleLogger extends Component {

  constructor(props){
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }


  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      // alert('You clicked outside of me!');
      this.props.panelSet("UNOPEN");
    }
  }

  render(){
    let { errorlog } = this.props;
    let { data: { unseen, status }} = errorlog;

    return (
      <div ref={this.setWrapperRef} className={`ConsoleLogger ${ status.toLowerCase() }`}>

        <CardHeaderStyled
          className="console-title"
          onClick={()=>{
            status !== "OPEN"
              ? this.props.panelSet("OPEN")
              : this.props.panelSet("MINIMISE")
          }}
        >
          <div>
            <div className="left-section">
              <i className="fa fa-times-circle" onClick={(e)=>{e.stopPropagation(); this.props.panelSet("CLOSE")}}></i>
              {
                status === "OPEN"
                  ? <i className="fa fa-window-minimize"></i>
                  : <i className="fa fa-window-maximize"></i>
              }
              <span>Errors</span>
            </div>
            { !!unseen && <span className="badge">{unseen}</span> }
          </div>
        </CardHeaderStyled>
        <div className="terminal-wrapper">
          <Terminal
            color={"red"}
            barColor={"red"}
            hideTopBar={true}
            backgroundColor={"white"}
            watchConsoleLogging={true}
            allowTabs={false}
          />
        </div>
      </div>)
  }
}


export default connect(
  ({ errorlog }) => ({
    errorlog
  }),
  {
    panelSet,
  }

)(ConsoleLogger);
