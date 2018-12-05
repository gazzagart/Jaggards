import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CancelIcon from '@material-ui/icons/Cancel';
import MinimizeIcon from '@material-ui/icons/Minimize';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';

const remote = require('electron').remote;

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
    WebkitAppRegion: 'no-drag',
  },
  largeIcon: {
    fontSize: "3em",
    WebkitAppRegion: 'no-drag',
  },
  hide: {
    display: "none",
  },
  drag: {
    WebkitAppRegion: 'drag',
  },
  noDrag: {
    WebkitAppRegion: 'no-drag',
  },
};

function ButtonAppBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root} className={classes.drag}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Jaggards
          </Typography>
          <IconButton className={classes.largeIcon} color="inherit" aria-label="Close" onClick={() => remote.getCurrentWindow().minimize()}>
            <MinimizeIcon/>
          </IconButton>
          <IconButton className={classes.largeIcon} color="inherit" aria-label="MaxMinApp"
          onClick={() => {
              var window = remote.getCurrentWindow();
              if (!window.isMaximized()) {
                  window.maximize();
                  document.getElementById('maxIcon').style.display = "none";
                  document.getElementById('minIcon').style.display = "block";
              } else {
                  window.unmaximize();
                  document.getElementById('minIcon').style.display = "none";
                  document.getElementById('maxIcon').style.display = "block";
              };
            }
          }>
            <FullscreenIcon id="maxIcon"/>
            <FullscreenExitIcon className={classes.hide} id="minIcon"/>
          </IconButton>
          <IconButton className={classes.largeIcon} color="inherit" aria-label="Close" onClick={() => remote.getCurrentWindow().close()}>
            <CancelIcon/>
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonAppBar);