import React, { Component } from 'react';
import { withStyles, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import MainAPI from '../../api/MainAPI';


class ProjectDeleteDialog extends Component {

    constructor(props) {
        super(props);
    }

    /** Delete the project */
    deleteProject = () => {
        MainAPI.getAPI().deleteProject(this.props.project.getID()).then(project => {
            this.props.onClose(this.props.project);  // call the parent with the deleted project
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
        const { project, show } = this.props;

        return (
            show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle id='delete-dialog-title'> Delete Project '{project.getDescription()}'
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete this Project  ?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color='secondary'>
                            Cancel
                        </Button>
                        <Button variant='contained' onClick={this.deleteProject} color='primary'>
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

export default withStyles(styles)(ProjectDeleteDialog);
