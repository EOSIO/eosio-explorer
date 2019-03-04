import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';

class WillRoute extends Component {

  componentDidUpdate(prevProps){

    //check if the location is changed
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }

  }

  render() {
      const { component: Component, ...restProps } = this.props;

    return <Route
            {...restProps}
             render={
               props => (
                  <Component { ...props}/>
               )
             }
           />;
  }
}


export default withRouter(WillRoute);
