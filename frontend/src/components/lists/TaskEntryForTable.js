import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import MainAPI from '../../api/MainAPI';




class TaskEntryForTable extends Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            task: null
        };
    }

    getTask = () => {
        MainAPI.getAPI().getTask(this.props.taskID)
            .then(taskBO =>
                this.setState({
                    task: taskBO,
                })).catch(
                    this.setState({ // Reset state with error from catch 
                        task: null
                    })
                );
        this.setState({
            //eig unnörig
        });
    }

    componentDidMount() {
        this.getTask()
    } 


    /** Renders the component */
    render() {
        const { classes } = this.props;
        const { task } = this.state;
        return (
            task ? 
                <div>
                    <p className={classes.listItem} >
                        {task.getDescription()}
                    </p>
                </div>
            : null

        );
    }
}

const styles = theme => ({
    listItem: {
        padding: "7.5px",
    },
});

export default withRouter(withStyles(styles)(TaskEntryForTable));

