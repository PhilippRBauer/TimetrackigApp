import React, { Component } from 'react';
import { withStyles, Button,  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import MainAPI from '../../api/MainAPI';


class TaskDeleteDialog extends Component {

    constructor(props) {
        super(props);
    }

    /** Delete the task */
    deleteTask = () => {
        MainAPI.getAPI().deleteTask(this.props.task.getID()).then(task => {
            this.props.onClose(this.props.task);  // call the parent with the deleted task
        }).catch(e =>
            this.setState({
                deletingInProgress: false,              // disable loading indicator 
                deletingError: e                        // show error message
            })
        );

        // set loading to true
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
        const { task, show } = this.props;

        return (
            show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle id='delete-dialog-title'> Delete Task '{task.getDescription()}'
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete this Task  ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Cancel
                        </Button>
                        <Button variant='contained' onClick={this.deleteTask} color='primary'>
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

export default withStyles(styles)(TaskDeleteDialog);
