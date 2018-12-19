import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

function Loader(props) {
  const { classes } = props;
  return (
    <div>
        <Grid container justify="center" spacing={16}>
            <CircularProgress size={90} thickness={2.7} className={classes.progress} />
        </Grid>
    </div>
  );
}

Loader.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Loader);