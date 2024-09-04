import React, { Component } from 'react';
import { withStyles, Button, TextField, InputAdornment, Grid, Typography } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import MainAPI from '../../api/MainAPI';
import ProjectlistEntry from './ProjectlistEntry';
import ProjectForm from '../dialogs/ProjectForm';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import ClearIcon from '@material-ui/icons/Clear';
import TaskForm from '../dialogs/TaskForm';




class AllProjectList extends Component {

    constructor(props) {
        super(props);

        let expandedID = null;

        if (this.props.location.expandedProject) {
            expandedID = this.props.location.expandedProject.getID();
        }

        // Speichert das expendedObj was über den Link aufruf von RouterLink of React Router übergeben wird
        //this.expandedID = this.props.location.expandedProject;

        // Init an empty state
        this.state = {
            projects: [],
            filteredProjects: [],
            projectFilter: '',
            showTaskForm: false,
            showProjectForm: false,
            expandedProjectID: expandedID,
        };
    }

    /***** Project Related *****/
    
    //get all projects
    getProjects = () => {
        MainAPI.getAPI().getProjects()
            .then(projectBOs =>
                this.setState({
                    projects: projectBOs,
                    filteredProjects: [...projectBOs]
                })).catch(
                    this.setState({ // Reset state with error from catch 
                        projects: []
                    })
                );
        this.setState({
            
        });
    }

    /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */
    componentDidMount() {
        this.getProjects()
    }

    onExpandedStateChange = project => {
        // Set expandend project entry to null by default
        let newID = null;

        // If same project entry is clicked, collapse it else expand a new one
        if (typeof project !== "undefined")  {
            if (project.getID() !== this.state.expandedProjectID) {
            // Expand the project entry with projectID
                newID = project.getID();
            }
            this.setState({
                expandedProjectID: newID
            });
        }

    }

    // Gibt das liegende ProjectBO zurück, das durch de aufruf vom Link vom RouterLink of React Router übergeben wird 
    getExpanded() {
        return this.expandedID;
    }

    // Für onProjectDeleted events in der ProjectListEntry component
    projectDeleted = project => {
        const newProjectList = this.state.projects.filter(projectFromState => projectFromState.getID() !== project.getID());
        this.setState({
            projects: newProjectList,
            filteredProjects: [...newProjectList],
            showProjectForm: false
        });
    }

    // neues  Project Anlegen -> Formular anzeigen 
    addProjectButtonClicked = event => {
        // Den expanded state nicht umschalten
        event.stopPropagation();
        //ProjectForm anzeigen
        this.setState({
            showProjectForm: true,
        });
    }

    ProjectFormClosed = event => {
        this.setState({
            showProjectForm: false
        })
    }

    // Handels onChange events of the filter text field 
    filterFieldValueChange = event => {
        const value = event.target.value.toLowerCase();
        this.setState({
            filteredProjects: this.state.projects.filter(project => {
                let descriptionContainsValue = project.getDescription().toLowerCase().includes(value);
                return descriptionContainsValue;
            }),
            projectFilter: value
        });
    }

    // Das - zum löschen des Filters wurde gelickt 
    clearFilterFieldButtonClicked = () => {
        // Reset the filter
        this.setState({
            filteredProjects: [...this.state.projects],
            projectFilter: ''
        });
    }
    

    /***** Task Related *****/

    // Für onTaskDeleted events in der TaskListEntry component
    taskDeleted = task => {
        const newTaskList = this.state.tasks.filter(taskFromState => taskFromState.getID() !== task.getID());
            this.setState({
                tasks: newTaskList,
                filteredTasks: [...newTaskList],
                showTaskForm: false
            });
        }
        
    // neues  Task Anlegen -> Formular anzeigen 
    addTaskButtonClicked = event => {
        // Den expanded state nicht umschalten
        event.stopPropagation();
        //TaskForm anzeigen
        this.setState({
            showTaskForm: true,
        });
    }
        
    taskFormClosed = event => {        
        this.setState({
            showTaskForm: false,
        });
    }
    

    /** Renders the component */
    render() {
        const { filteredProjects, projectFilter, expandedProjectID, showProjectForm, showTaskForm } = this.state;
        
        return (
            <div>
                <Grid container spacing={1} justifyContent='flex-start' alignItems='center'>
                    <Grid item>
                        <Typography>
                            Filter Projects by name:
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            autoFocus
                            fullWidth
                            type='text'
                            id='projectFilter'
                            value={projectFilter}  //evtl this.projectFilter
                            onChange={this.filterFieldValueChange}
                            InputProps={{
                                endAdornment: <InputAdornment position='end'>
                                    <Button onClick={this.clearFilterFieldButtonClicked}>
                                        <ClearIcon color="primary"/>
                                    </Button>
                                </InputAdornment>,
                            }}
                        />
                    </Grid>
                    <Grid item xs />
                    <Grid item>
                        <Button onClick={this.addTaskButtonClicked}>
                            Add Task
                            <AddCircleIcon color="primary" fontSize="large"/>
                        </Button>
                        <TaskForm show={showTaskForm} onClose={this.taskFormClosed} getTasks={this.getTaskbyProject} />
                    </Grid>
                    <Grid item>
                        <Button onClick={this.addProjectButtonClicked}>
                            Add Project
                            <AddCircleIcon color="primary" fontSize="large"/> 
                        </Button>
                        <ProjectForm show={showProjectForm} onClose={this.ProjectFormClosed} getProjects={this.getProjects} />
                    </Grid>
                </Grid>
                <br/>
                <br/>
                {
                    // Show the list of ProjectListEntry components
                    // Do not use strict comparison, since expandedProjectID maybe a string if given from the URL parameters
                    filteredProjects.map(project =>
                        <ProjectlistEntry key={project.id} project={project} expandedState={expandedProjectID === project.getID()}
                            onExpandedStateChange={this.onExpandedStateChange}
                            onProjectDeleted={this.projectDeleted}
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
    projectFilter: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1)
    }
});

export default withRouter(withStyles(styles)(AllProjectList));
