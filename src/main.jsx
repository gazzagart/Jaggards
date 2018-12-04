import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
export default class Start extends React.Component {

  render() {
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
                    <Link to='/voip/'>Voip Dashboard</Link>
                  </Button>
                </Grid>
                <Grid item>
                <Button variant="contained" className="w3-green">
                  <Link to="/excelMonthEnd/">Excel Spreadsheet</Link>
                </Button>
                </Grid>
            </Grid>
          </Grid>
        </Grid>
        </div>
    );
  }
}
