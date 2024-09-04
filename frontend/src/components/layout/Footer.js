import React, { Component } from 'react';
import {withStyles, Button} from '@material-ui/core';
import TwitterIcon from '@material-ui/icons/Twitter';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';






class Footer extends Component {

    constructor(props) {
        super(props);
    
        // Init an empty state
        this.state = {
          tabindex: 0
        };
      }


    render() {
        const { classes } = this.props;
       
    
    return (
<div className={classes.footer}>
        <div className={classes.container}>
           Get connected with us on social media:
           <Button className={classes.twitter} href="https://www.lada24.de/" target="_blank" rel="noopener noreferrer">
           <TwitterIcon className={classes.twitter} />
           </Button>
           <Button className={classes.instagram} href="https://www.lada4you.de/" target="_blank" rel="noopener noreferrer">  
           <InstagramIcon className={classes.Instagram}/>
           </Button>
           <Button className={classes.facebook} href="https://www.autobild.de/marken-modelle/lada/" target="_blank" rel="noopener noreferrer"> 
           <FacebookIcon className={classes.facebook} /> 
           </Button>
           </div>
        <p className={classes.toptext}>
        BetterTrack | All rights reserved |
        Terms Of Service | Privacy</p>
        <p className={classes.lowtext}>            
        &copy;{new Date().getFullYear()}
        </p>          
        
        </div> 
        
          
    
    )
}
}

/** Component specific styles */
const styles = theme => ({
  
  footer: {
    color: "white",
    backgroundColor: "#b2dfdb",    
    position: "relative",
    bottom: 0,
    paddingBottom: "10px",
    width: "100%",
    marginTop:"15px"
  },

  toptext: {
    color: "#004d40",
    textAlign: "center",
  },

  lowtext: {
    color: "#989898",
    textAlign: "center",
  },

  container:{    
    color: "white",
    backgroundColor:"#00897b",        
    paddingTop: "15px",            
    width: "100%",
    textAlign: "center",
    paddingBottom: "1em"
  },

  twitter:{    
    color: "white"  
  },

  Instagram:{  
    color: "white"
  },

  facebook:{    
    color: "white"  
  }

});



export default withStyles(styles)(Footer)