import React from 'react';
import { withRouter } from 'react-router';
import ProjectBO from "../../api/ProjectBO";
import MainAPI from '../../api/MainAPI';
import ContextErrorMessage from './ContextErrorMessage';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,    
    FormControl,
    Select,
    InputLabel,    
    MenuItem,   
    Grid,    
    FormHelperText
} from '@material-ui/core';



class ProjectForm extends React.Component {

    constructor(props) {
        super(props)

        // State Object
        this.state = {
            open: false,
            id: 0,
            project: [],
            description: "",
            descriptionValidationFailed: false,
            descriptionEdited: false,
            client: "",
            clientValidationFailed: false,
            clientEdited:false,
            duration: "",
            durationValidationFailed: false,
            durationEdited: false,
            selectedUser: [],
            updatingError: null,
            addingError: null,
            connection: [],
            connectionValidationFailed: false,
            users: []

        };
        this.baseState = this.state;
        this.addProject = this.addProject.bind(this);

    }


    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.show !== prevProps.show) {
            this.getUsersForProject();
            if (this.props.project){
                this.setState({
                    description: this.props.project.description,
                    client: this.props.project.client,
                    duration: this.props.project.duration,
                })
            }
        }
    }

    addProject(event) {
        event.preventDefault();
        var project = new ProjectBO()
        project.setID(0)
        project.setDescription(this.state.description)
        project.setClient(this.state.client)
        project.setDuration(this.state.duration)
        project.setConnection(this.state.selectedUser.map((user) => { return user.id }))

        MainAPI.getAPI().addProject(project).then((project) => {
            // this.setState "merged" project von this.state
            this.setState({
                project: project,
                showProjectForm: false
            });
            this.props.getProjects()
            this.setState(this.baseState);
            this.getUsersForProject();
            this.handleClose(project);
        }).catch(e =>
            this.setState({
                addingInProgress: false,
                addingError: e
            })
        );
        alert('You have successfully added your Project')
    }

    // User "holen"
    getUsersForProject() {
        MainAPI.getAPI().getUsers()
            .then((userBO) => {
                this.setState({
                    users: userBO
                })
            }).catch((e) => {
                console.error(e);
                this.setState({
                    users: [],
                    loadingReferencedObjects: false,
                })
            })
    }



    updateProject = () => {
        // clone the original project, in case the backend call fails
        let updatedProject = Object.assign(new ProjectBO(), this.props.project);
        // set the new attributes from our dialog
        updatedProject.setDescription(this.state.description);
        updatedProject.setClient(this.state.client);
        updatedProject.setDuration(this.state.duration);
        updatedProject.setConnection(this.state.selectedUser.map((user) => {return user.id}));       
        MainAPI.getAPI().updateProject(updatedProject).then(project => {
            this.setState({
                updatingInProgress: false,              // disable loading indicator  
                updatingError: null                     // no error message
            });
            // keep the new state as base state
            this.baseState.description = this.state.description;
            this.baseState.client = this.state.client;
            this.baseState.duration = this.state.duration;
            this.baseState.connection = this.state.connection;
            //this.baseState.user = this.state.user;
            this.props.onClose(updatedProject);      // call the parent with the new project
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


    handleClose = () => {
        this.setState(this.baseState);
        this.props.onClose(null);
    };

    handleSelectChange = (e) => {
        this.setState({ selectedUser: e.target.value })
    };

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
    };

    numberValueChange = (event) => {
        const value = event.target.value;
        const regex = /^\d+(:)\d\d$/;

        let error = false;
        if (value.trim().length === 0) {
            error = true;
        }
        if (regex.test(event.target.value) === false){
            error = true;
        } 

        this.setState({
            [event.target.id]: event.target.value,
            [event.target.id + 'ValidationFailed']: error,
            [event.target.id + 'Edited']: true
        });
    };


    render() {

        const { show, project } = this.props;
        const { description, descriptionValidationFailed, descriptionEdited, client, clientValidationFailed,
            clientEdited, duration, durationValidationFailed, durationEdited, users, selectedUser, updatingError, addingError,
            } = this.state;


        let title = '';
        let header = '';

        if (project) {
            // project defindet, so ist an edit dialog
            title = 'Update a Project';
            header = `Project: ${project.getDescription()}`;
        } else {
            title = 'Create a new project';
            header = 'Enter project data';
        }

        return (
            show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {header}
                        </DialogContentText>

                        <Grid container
                            spacing={2}
                            justifyContent="space-evenly"
                            /* Was macht das?: */
                            noValidate autoComplete='off' onSubmit={this.handleSubmit}>
                            <Grid item
                                xs={10}>
                                <TextField autoFocus type='text' required fullWidth margin='normal' id='description'
                                    label='Description' variant="outlined"
                                    placeholder='Please enter the Project Description'
                                    value={description}
                                    onChange={this.textFieldValueChange} error={descriptionValidationFailed}
                                    helperText={descriptionValidationFailed ? 'Bitte geben Sie das Project ein' : ' '} />
                            </Grid>
                            <Grid item
                                xs={10}>
                                <TextField autoFocus type='text' required fullWidth margin='normal' id='client'
                                    label='Client' variant="outlined"
                                    placeholder='Please enter the Project Client'
                                    value={client}
                                    onChange={this.textFieldValueChange} error={clientValidationFailed}
                                    helperText={clientValidationFailed ? 'Bitte geben Sie den Client an' : ' '} />
                            </Grid>
                            <Grid item
                                xs={10}>
                                <TextField autoFocus type='text' required fullWidth margin='normal' id='duration'
                                    label='Duration' variant="outlined"
                                    placeholder="Please enter the Duration like this: HH:MM"
                                    value={duration}
                                    onChange={this.numberValueChange} error={durationValidationFailed}
                                    helperText={durationValidationFailed ? 'Bitte geben Sie die Dauer an' : ' '} />
                            </Grid>
                            <Grid item
                                xs={10}>
                                <FormControl fullWidth>
                                    <InputLabel>Users</InputLabel>
                                    <Select
                                        labelId="multiple-checkbox-label"
                                        id="multiple-checkbox"
                                        multiple
                                        value={selectedUser}
                                        onChange={this.handleSelectChange}>

                                        {users.map((user) => (
                                            <MenuItem key={user.id} value={user}>
                                                {user.username}
                                            </MenuItem>
                                        ))}

                                    </Select>
                                    <FormHelperText>Select all Users who work on the Project</FormHelperText>
                                </FormControl>
                            </Grid>

                            {/* Show error message */}
                            {
                                project ?
                                    <ContextErrorMessage error={updatingError} contextErrorMsg={`The project ${project.getID()} could not be updated.`} onReload={this.updateProject} />
                                    :
                                    <ContextErrorMessage error={addingError} contextErrorMsg={`The project could not be added.`} onReload={this.addProject} />
                            }

                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose}>Cancel</Button>
                        
                        {
                            project ?
                                <Button variant='contained' onClick={this.updateProject} color='primary'>
                                    Edit
                                </Button>
                                : <Button disabled={descriptionValidationFailed || !descriptionEdited || clientValidationFailed || !clientEdited || durationValidationFailed || !durationEdited} variant='contained' onClick={this.addProject} color='primary'>
                                    Add
                                </Button>
                        }
                    </DialogActions>

                </Dialog>

                : null
        );
    }
}


export default withRouter(ProjectForm);