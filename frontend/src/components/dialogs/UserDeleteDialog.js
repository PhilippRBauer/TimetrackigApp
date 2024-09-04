import React, { Component } from 'react';
import { withStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import MainAPI from '../../api/MainAPI';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';



class UserDeleteDialog extends Component {

    constructor(props) {
        super(props);
    }

    /** Delete the user */
    deleteUser = () => {
        firebase.auth().signOut()  
        MainAPI.getAPI().deleteUser(this.props.user_DB.getID()).then(user => {            
            this.props.onClose(this.props.user);
             
        }).catch(e =>
            this.setState({
                deletingInProgress: false,              // disable loading indicator 
                deletingError: e                        // show error message
            })
        );

        
        this.setState({
            deletingInProgress: true,                 // show loading indicator
            deletingError: null                       // disable error message
        });
        
    }

    /** Handles the close / cancel button click event */
    handleClose = () => {
        this.props.onClose(null);
    }

    /** Renders the component */
    render() {
        const { user_DB, show } = this.props;

        return (
            show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle id='delete-dialog-title'> Delete User '{user_DB.username}'
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete yourself ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Cancel
                        </Button>
                        <Button color='primary' onClick={this.deleteUser} >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
                : null
        );
    }
}

/** Component specific styles */
const styles = theme => ({
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    }
});

export default withStyles(styles)(UserDeleteDialog);
