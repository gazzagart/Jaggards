import React from 'react';
import {Route, withRouter } from 'react-router-dom';
import Voip from "./voip.jsx";
import Excel from "./excel.jsx";
import Main from "./main.jsx";
import ButtonAppBar from "./buttonappbar.jsx";

class App extends React.Component {
  componentDidMount() {
    this.props.history.push("/main/");
    window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;
  }

  render() {
    return (
        <div>
          <ButtonAppBar></ButtonAppBar>
          <Route path="/main/" exact={true} component={Main} />
          <Route path="/voip/" exact={true} component={Voip} />
          <Route path="/excelMonthEnd/" exact={true} component={Excel} />
        </div>
        );
  }
}
export default withRouter(App)