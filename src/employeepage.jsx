import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

/** In this element we need to be able to display the voip data in a clean way.
 *  TODO: data for today, week month year all time
 */

export default class EmployeePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      employeeName: "No Name",
      employeeNumber: 0,
    };
  }

  render() {
    return (
    <div style={{ marginTop: 30 }}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
            <Grid container justify="center" spacing={16}>
              <Grid item>
                <h2>Employee: {this.employeeName}</h2>
              </Grid>
              <Grid item>
                <h2>Ex Number: {this.employeeNumber}</h2>
              </Grid>
            </Grid>
            <Grid container justify="center" spacing={16}>
                <Grid item>
                  <Button variant="contained" color="primary">
                    <Link style={{ textDecoration: 'none' }} to='/voip/'>Back To Voip</Link>
                  </Button>
                </Grid>
            </Grid>
        </Grid>
      </Grid>
    </div>
    );
  }
}
