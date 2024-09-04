import React, { Component, createRef } from 'react';
import { Popover, IconButton, Avatar, ClickAwayListener, withStyles, Typography, Paper, Button, Grid, Divider } from '@material-ui/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

class ProfileDropDown extends Component {

  // avatar button referenz
  #avatarButtonRef = createRef();

  constructor(props) {
    super(props);

    // Init the state
    this.state = {
      open: false,
    }
  }

  /** handled Klick-Ereignisse auf die Avatar-Schaltfläche und schaltet die Sichtbarkeit ein */
  handleAvatarButtonClick = () => {
    this.setState({
      open: !this.state.open
    });
  }


  handleClose = () => {
    this.setState({
      open: false
    });
  }

  handleSignOutButtonClicked = () => {
    firebase.auth().signOut();
  }

  /** Rendert profile drop down wenn der eingeloggte user als prop gegeben ist */
  render() {
    const { classes, user } = this.props;
    const { open } = this.state;

    return (
      user ?
        <div>
          <IconButton className={classes.avatarButton} ref={this.#avatarButtonRef} onClick={this.handleAvatarButtonClick}>
            <Avatar src={user.photoURL} />
          </IconButton>

          <Popover open={open} anchorEl={this.#avatarButtonRef.current} onClose={this.handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}>
            <ClickAwayListener onClickAway={this.handleClose}>
              <Paper className={classes.profileBox}>
                <Typography align='center'>You are logged in as</Typography>
                <Divider className={classes.divider} />
                <Typography align='center' variant='body2'>{user.email}</Typography>
                <Divider className={classes.divider} />
                <Grid container ='center'>
                  <Grid item>
                    <Button color='primary' onClick={this.handleSignOutButtonClicked}>Logout</Button>
                  </Grid>
                </Grid>
              </Paper>
            </ClickAwayListener>
          </Popover>
        </div>
        : null
    )
  }
}

/** Component spezifisches styling */
const styles = theme => ({
  avatarButton: {
    float: 'right'
  },
  divider: {
    margin: theme.spacing(1),
  },
  profileBox: {
    padding: theme.spacing(1),
    background: theme.palette.background.default,
  }
});

export default withStyles(styles)(ProfileDropDown)
