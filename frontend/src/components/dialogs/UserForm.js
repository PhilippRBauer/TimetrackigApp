import React from 'react';
import { withRouter } from 'react-router';
import UserBO from "../../api/UserBO";
import MainAPI from '../../api/MainAPI';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField
} from '@material-ui/core';

class UserForm extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            firstname: "",
            firstnameValidationFailed: false,
            firstnameEdited: false,
            lastname: "",
            lastnameValidationFailed: false,
            lastnameEdited: false,
        };
    };

    updateUser = () => {

        // clone the original task, in case the backend call fails
        let updated_user_DB = Object.assign(new UserBO(), this.props.user_DB);

        updated_user_DB.setFirstName(this.state.firstname)
        updated_user_DB.setLastName(this.state.lastname)

        MainAPI.getAPI().updateUser(updated_user_DB)
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

    render() {

        const { show } = this.props;
        const { firstname, firstnameValidationFailed, firstnameEdited, lastname, lastnameValidationFailed, lastnameEdited} = this.state;

        let title = '';
        let header = '';

        title = 'Update a User';
        header = `User: ${this.props.user_DB.email}`; // `Task: ${task.getDescription()}`

        //header = 'User:';


        return (
           // show ?
                <Dialog open={show} onClose={this.handleClose}>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {header}
                        </DialogContentText>
                        <form noValidate autoComplete='off'>
                            <TextField autoFocus type='text' required fullWidth margin='normal' id='firstname'
                                label='First Name' variant="outlined"
                                value={firstname}
                                onChange={this.textFieldValueChange} error={firstnameValidationFailed}
                                helperText={firstnameValidationFailed ? 'Bitte geben Sie ihren Vornamen ein' : ' '} />
                            <TextField autoFocus type='text' required fullWidth margin='normal' id='lastname'
                                label='Last Name' variant="outlined"
                                value={lastname}
                                onChange={this.textFieldValueChange} error={lastnameValidationFailed}
                                helperText={lastnameValidationFailed ? 'Bitte geben Sie ihren Nachnamen ein' : ' '} />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.props.handleClose} color='secondary'>
                            Cancel
                        </Button>
                        <Button disabled={firstnameValidationFailed || !firstnameEdited || lastnameValidationFailed || !lastnameEdited }   variant='contained' onClick={() => {this.updateUser(); this.props.handleClose()}} color='primary'>
                            Edit
                        </Button>
                    </DialogActions>
                </Dialog>
        );
    }
}

export default withRouter(UserForm);