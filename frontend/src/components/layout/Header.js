import React, { Component } from 'react';
import {  Typography, Tabs, Tab, Toolbar, withStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import ProfileDropDown from '../dialogs/ProfileDropDown';
import AppBar from '@material-ui/core/AppBar';


class Header extends Component {

  constructor(props) {
    super(props);

    // Init an empty state
    this.state = {
      tabindex: 0
    };
  }

  /** Handles onChange events of the Tabs component */
  handleTabChange = (e, newIndex) => {
    this.setState({
      tabindex: newIndex,
    })
  };

  /** Renders the component */
  render() {
    const { user, classes } = this.props;
   

    return (   
      
      <AppBar elevation={20} className={classes.app} position="static"> 
      <Toolbar>
        <ProfileDropDown user={user} />
        <Typography color= "inherit"className={classes.title}>
          BetterTrack        
        </Typography>
        <Typography >
             
        </Typography>
        {
          user ?
            <Tabs variant="fullWidth" className={classes.container}  value={this.state.tabindex} onChange={this.handleTabChange} >
              <Tab className={classes.tabs} label='Projects' component={RouterLink} to='/project' />
              <Tab className={classes.tabs}label='Time Tracking' component={RouterLink} to='/time' />
              <Tab className={classes.tabs}label='User' component={RouterLink} to='/user' />
            </Tabs>
            : null
        }
     </Toolbar>
      </AppBar>

      
    )
  }
}








/** Component specific styles */
const styles = theme => ({
  title: {
    marginTop:"10px",
    fontWeight: 'normal',
    fontSize: "25px"
  },

  app:{    
    display:"flex",
    width: "100%",
    height: "80px"
  },

  container:{
    marginTop: "10px",
    color:"white",
    marginLeft:"100px",
    backgroundColor:"#00897b",
    
  },

  tabs:{
    transition: " background 0.1s",

    "&:hover": {
      
      background: "#80cbc4"
    }
    
  }
   
});



export default withStyles(styles)(Header)