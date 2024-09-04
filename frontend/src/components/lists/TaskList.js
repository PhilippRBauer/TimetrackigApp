import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import MainAPI from '../../api/MainAPI';
import TaskListEntry from './TaskListEntry';





class TaskList extends Component {

    constructor(props) {
        super(props);

        let expandedID = null;

        if (this.props.location.expandedTask) {
            expandedID = this.props.location.expandedTask.getID();
        }

        // Speichert das expendedObj was über den Link aufruf von RouterLink of React Router übergeben wird
        //this.expandedID = this.props.location.expandedTask;

        // Init an empty state
        this.state = {
            project: null,
            tasks: [],
            filteredTasks: [],
            taskFilter: '',
            expandedTaskID: expandedID,
        };
    }

    //die Tasks zum ausgewählten Project auslesen
    getTaskByProjectID = () => {        
            MainAPI.getAPI().getTaskbyProject(this.props.project.getID())
                .then(taskBOs =>
                    this.setState({
                        tasks: taskBOs,
                    })).catch(
                        this.setState({ // Reset state with error from catch 
                            tasks: []
                        })
                    );
            this.setState({
                //eig unnörig
            });

    }

    /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
    componentDidMount() {
        this.getTaskByProjectID()
    }

    onExpandedStateChange = task => {
        // Set expandend task entry to null by default
        let newID = null;

        // If same task entry is clicked, collapse it else expand a new one
        if (task.getID() !== this.state.expandedTaskID) {
            // Expand the task entry with taskID
            newID = task.getID();
        }
        this.setState({
            expandedTaskID: newID
        });
    }

    // Gibt das liegende TaskBO zurück, das durch de aufruf vom Link vom RouterLink of React Router übergeben wird 
    getExpanded() {
        return this.expandedID;
    }

    // Für onTaskDeleted events in der TaskListEntry component
    taskDeleted = task => {
        const newTaskList = this.state.tasks.filter(taskFromState => taskFromState.getID() !== task.getID());
        this.setState({
            tasks: newTaskList,
            filteredTasks: [...newTaskList],
            showTaskForm: false
        });
    }


    /** Renders the component */
    render() {
        const { tasks, expandedTaskID} = this.state;

        return (
            <div>
                <br/>
                <br/>
                {
                    // Show the list of TaskListEntry components
                    // Do not use strict comparison, since expandedTaskID maybe a string if given from the URL parameters
                    tasks.map(task =>
                        <TaskListEntry key={task.id} task={task} expandedState={expandedTaskID === task.getID()}
                            onExpandedStateChange={this.onExpandedStateChange}
                            onTaskDeleted={this.taskDeleted}
                        />)
                }
            </div>
        );
    }
}

/** Component specific styles */
const styles = theme => ({
    root: {
        width: '100%',
    },
    taskFilter: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    }
});

export default withRouter(withStyles(styles)(TaskList));
