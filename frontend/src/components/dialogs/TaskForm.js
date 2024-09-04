import React from 'react';
import { withRouter } from 'react-router';
import TaskBO from "../../api/TaskBO";
import MainAPI from '../../api/MainAPI';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,    
    FormControl,    
    InputLabel,
    NativeSelect    
} from '@material-ui/core';
import ContextErrorMessage from "./ContextErrorMessage";

class TaskForm extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            open: false,
            id: 0,
            task: [],
            description: "",
            descriptionValidationFailed: false,
            descriptionEdited: false,
            capacity: "",
            capacityValidationFailed: false,
            capacityEdited: false,
            selectedProject: "",
            projects: [], 
            projectValidationFailed: false,
            user: "", // standardmäßig 0 weil wir das attribut doch nicht nutzen !!
            userValidationFailed: false

        };
        this.baseState = this.state;
        this.addTask = this.addTask.bind(this);

    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.show !== prevProps.show) {
        this.getProjects();
            if (this.props.task){
                this.setState({
                    description: this.props.task.description,
                    capacity: this.props.task.capacity,
                })
            }
        }
    }


    addTask(event) {

        event.preventDefault();
        var task = new TaskBO()
        task.setID(0)
        task.setDescription(this.state.description)
        task.setCapacity(this.state.capacity)
        task.setProject(parseInt(this.state.selectedProject))
        task.setUser(0)     //0 ist nur beispielhaft !!

        MainAPI.getAPI().addTask(task).then((task) => {
            this.props.onClose(this.props.task);  
            this.setState({
                task: task,
                showTaskForm: false
            });            
            this.setState(this.baseState);
            this.getProjects();
            this.handleClose(task);
        }).catch(e =>
            this.setState({
                addingInProgress: false,
                addingError: e
            })
        );
        alert("Your task has successfully been created")
        window.location.reload();
    }

    
    updateTask = () => {
        // clone the original task, in case the backend call fails
        let updatedTask = Object.assign(new TaskBO(), this.props.task);
        // set the new attributes from our dialog
        updatedTask.setDescription(this.state.description);
        updatedTask.setCapacity(this.state.capacity);
        updatedTask.setUser(0); 	    // 2 ist nur beispielhaft !! 
        updatedTask.setProject(parseInt(this.state.selectedProject));

        MainAPI.getAPI().updateTask(updatedTask).then(task => {
            this.setState({
                updatingInProgress: false,              // disable loading indicator  
                updatingError: null                     // no error message
            });
            // keep the new state as base state
            this.baseState.description = this.state.description;
            this.baseState.capacity = this.state.capacity;
            this.props.onClose(updatedTask);      // call the parent with the new task
        }).catch(e =>
            this.setState({
                updatingInProgress: false,              // disable loading indicator 
                updatingError: e                        // show error message
            })
        );
        // set loading to true
        this.setState({
            updatingInProgress: true,                 // show loading indicator
            updatingError: null                       // disable error message
        });
    }

    /** gets a list of projects */
    getProjects = () => {
        MainAPI.getAPI().getProjects()
            .then(projectBOs =>
                this.setState({
                    projects: projectBOs,
                })).catch(
                    this.setState({ // Reset state with error from catch 
                        projects: []
                    })
                );
        this.setState({
           
        });
    }

    handleClose = () => {
        this.setState(this.baseState);
        this.props.onClose(null);
    };


    handleSelectChange = (event) => {
        this.setState({selectedProject: event.target.value})
    }

    textFieldValueChange = (event) => {
        const value = event.target.value;

        let error = false;
        if (value.trim().length === 0) {
            error = true;
        }
        this.setState({
            [event.target.id]: event.target.value,
            [event.target.id + "ValidationFailed"]: error,
            [event.target.id + "Edited"]: true
        });
    }

    render() {

        const { show, task } = this.props;
        const { selectedProject, projects, description, descriptionValidationFailed, descriptionEdited, 
                capacity, capacityValidationFailed, capacityEdited, addingError } = this.state;
        
        let title = '';
        let header = '';

        if (task) {
            // task defindet, so ist an edit dialog
            title = 'Update a Task';
            header = `Task: ${task.getDescription()}`;
        } else {
            title = 'Create a new task';
            header = 'Enter task data';
        }

        return (
            show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {header}
                        </DialogContentText>

                        <form noValidate autoComplete='off'>                      
                            <TextField autoFocus type='text' required fullWidth margin='normal' id='description'
                                label='Description' variant="outlined"
                                value={description}
                                onChange={this.textFieldValueChange} error={descriptionValidationFailed}
                                helperText={descriptionValidationFailed ? 'Bitte geben Sie das Task ein' : ' '} />
                            <TextField autoFocus type='text' required fullWidth margin='normal' id='capacity'
                                label='Capacity' variant="outlined"
                                value={capacity}
                                placeholder="Capacity in person hours"
                                onChange={this.textFieldValueChange} error={capacityValidationFailed}
                                helperText={capacityValidationFailed ? 'Bitte geben Sie den Capacity an' : ' '} />
                            <FormControl fullWidth>
                                <InputLabel>Projects</InputLabel>
                                <NativeSelect
                                    value={selectedProject}
                                    onChange={this.handleSelectChange}
                                >
                                    <option aria-label="None" value="" />
                                        {  
                                            projects.map(selectedProject => <option value={selectedProject.getID()} key={selectedProject.id}> {selectedProject.getDescription()} </option>)
                                        }
                                    
                                </NativeSelect>
                            </FormControl>
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        {
                            task ?
                                <Button variant='contained' onClick={this.updateTask} color='primary'>
                                    Edit
                            </Button>
                                : <Button disabled={descriptionValidationFailed || !descriptionEdited || capacityValidationFailed || !capacityEdited } variant='contained' onClick={this.addTask} color='primary'>
                                    Add
                            </Button>
                        }
                    </DialogActions>
                    {addingError ?
                        <ContextErrorMessage error={addingError} contextErrorMsg={"Please check your input. Pay attention to the number format for the Capacity."} onReload={this.addTask} />
                        :
                        ""
                    }
                </Dialog>

                : null
        );
    }
}
export default withRouter(TaskForm);