import './ConsoleLogger.scss';

import React, {Component} from 'react';
import { connect } from 'react-redux';

import Terminal from 'terminal-in-react';
import { CardStyled,CardHeaderStyled, TableStyled, ButtonPrimary, CheckBoxDivStyled, InputStyled} from 'styled';

import { panelOpen, panelClose } from 'reducers/errorlog';

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
      this.props.panelClose();
    }
  }

  render(){
    let { errorlog } = this.props;
    let { data: {unseen, isPanelOpen }} = errorlog;

    return (
      <div ref={this.setWrapperRef} className={`ConsoleLogger ${isPanelOpen?`active`:``}`}>

        <CardHeaderStyled className="console-title" onClick={this.props.panelOpen}>
          <div>
            <span>Errors</span>
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
    panelOpen,
    panelClose,
  }

)(ConsoleLogger);
