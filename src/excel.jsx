import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

export default class Excel extends React.Component {
  render() {
    return (
    <div style={{ marginTop: 30 }}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
            <Grid container justify="center" spacing={16}>
                <h2>Excel Month End</h2>
            </Grid>
        </Grid>
      </Grid>
    </div>
    );
  }
}
