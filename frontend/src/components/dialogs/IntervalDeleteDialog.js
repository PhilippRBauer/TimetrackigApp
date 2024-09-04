import React, { Component } from 'react';
import { withStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import MainAPI from '../../api/MainAPI';


class IntervalDeleteDialog extends Component {

    constructor(props) {
        super(props);
        
    }

    /** Delete the intervals */
    deleteInterval = () => {
        MainAPI.getAPI().deleteInterval(this.props.intervals.getID()).then(intervals => {
            this.props.onClose(this.props.intervals);  // call the parent with the deleted intervals
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
        const { show } = this.props;

        return (
            show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle id='delete-dialog-title'> Time recording retraction
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete this working time booking  ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Cancel
                        </Button>
                        <Button variant='contained' onClick={this.deleteInterval} color='primary'>
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
        color: theme.palette.grey[100],
    }
});

export default withStyles(styles)(IntervalDeleteDialog);
