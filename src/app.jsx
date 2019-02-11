import React from 'react';
import {Route, withRouter } from 'react-router-dom';
import Voip from "./voip.jsx";
import Excel from "./excel.jsx";
import Main from "./main.jsx";
import EmployeePage from "./employeepage.jsx";
import ButtonAppBar from "./buttonappbar.jsx";

class App extends React.Component {

  componentDidMount() {
    this.props.history.push("/main/");
  }

  render() {
    return (
      <div>
        <ButtonAppBar></ButtonAppBar>
        <Route path="/main/" exact={true} component={Main} />
        <Route path="/voip/" exact={true} component={Voip} />
        <Route path="/excelMonthEnd/" exact={true} component={Excel} />
        <Route path="/employeePage/" exact={true} component={EmployeePage} />
      </div>
    );
  }
}
export default withRouter(App)