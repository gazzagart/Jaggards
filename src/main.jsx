import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import CustomizedSnackbars from './customizedsnackbars.jsx';

export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.myCallback = this.myCallback.bind(this);
    this.state = {
      open: false,
      type: 'info',
      message: 'Well hello there',
    };
  }

  openSnackBar() {
    this.setState({
      open: true,
      type: 'success',
      message: 'so successful',
    });
  }

  myCallback (dataFromChild) {
    this.setState({
      open: dataFromChild
    });
  }


  render() {
    const open = this.state.open;
    const type = this.state.type;
    const message = this.state.message;
    return (
    <div style={{ marginTop: 183 }}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
          <Grid container justify="center" spacing={16}>
            <h2>Welcome to Jaggards!</h2>
          </Grid>
            <Grid container justify="center" spacing={16}>
                <Grid item>
                  <Button variant="contained" color="primary">
                    <Link style={{ textDecoration: 'none' }} to='/voip/'>Voip Dashboard</Link>
                  </Button>
                </Grid>
                <Grid item>
                <Button variant="contained" className="w3-green">
                  <Link style={{ textDecoration: 'none' }} to="/excelMonthEnd/">Excel Spreadsheet</Link>
                </Button>
                </Grid>
                {/* <Grid item>
                <Button variant="contained" className="w3-green" onClick={() => this.openSnackBar()}>
                  Snackbar
                </Button>
                </Grid> */}
            </Grid>
          </Grid>
        </Grid>
        <CustomizedSnackbars type={type} message={message} open={open} callbackFromParent={this.myCallback}/>
        </div>
    );
  }
}
