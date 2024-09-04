import React, { Component } from 'react';
import { withStyles, Button, Typography } from '@material-ui/core';
import MainAPI from '../../api/MainAPI';
import UserForm from '../dialogs/UserForm.js';
import UserTimeTrackingList from '../lists/UserTimeTrackingList.js';
import UserDeleteDialog from '../dialogs/UserDeleteDialog';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

class User extends Component {

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            user_DB: {},
            intervals: [],
            showUserDeleteDialog: false,
            sumintervals: null,
        }

    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    }

    showForm = () => {
        this.setState({show:true})
    };

    hideForm = () => {
        this.setState({show:false})
        // erneuter Aufruf der Funktion, um die Seite zu aktualisieren (2x, da das Schreiben in die DB manchmal länger dauert)
        this.GetCurrentUserObject()
        this.GetCurrentUserObject()
    };

    // das UserBO Objekt für den aktuell eingeloggten User )email (user aus Google Authentifizierung --> user_DB aus Datenbank)
    GetCurrentUserObject = () => {
        MainAPI.getAPI().searchUser(this.props.user.email)
            .then(UserBO =>
                this.setState({user_DB: UserBO})
                );
    };

    // die IntervalsBOs für einen User (User_ID) holen
    GetIntervals = (user_id) => {
        MainAPI.getAPI().getIntervalsByUser(user_id)
            .then(intervalBOs =>
                this.setState({intervals: intervalBOs})
                );
    };

    getSumIntervals = (user_id) => {
        MainAPI.getAPI().getSumIntervalsPerUser(user_id)
            .then(sumintervals => {
                this.setState({
                    sumintervals: sumintervals,
                })
            })
    }

    //  hier await verspätet der Aufruf um 1 Sukende
    async componentDidMount(): Promise<void> {
        await this.GetCurrentUserObject();

        // Sleep for 1 seconds
        await new Promise(resolve => { setTimeout(resolve, 1000); });

        // Aufruf der Funktion GetIntervals() mit dem Argument User ID des aktuell einloggten Users,
        // um alle Intervals eines Users abzuholen und in State abzuspeichern
        // Aufruf von getSumIntervals um die aufsummierte Arbeitszeit des eingeloggten Users im State zu speichern
        this.GetIntervals(this.state.user_DB.id);
        this.getSumIntervals(this.state.user_DB.id);
    };


    /** Handles the onClick event of the delete task button */
    deleteUserButtonClicked = (event) => {
        event.stopPropagation();
             		
        this.setState({            
            showUserDeleteDialog: true
        
        });       
  
        
    }

    /** Handles the onClose event of the UserDeleteDialog */
    deleteUserDialogClosed = (user_DB) => {
        // if task is not null, delete it
        if (user_DB) {
            this.props.onUserDeleted(user_DB);
        };

        // Don´t show the dialog
        this.setState({
            showUserDeleteDialog: false
        });
    }

     // Für onUserkDeleted events in der TaskListEntry component
      userDeleted = user_DB => {
        const newUserList = this.state.user.filter(userFromState => userFromState.getID() !== user_DB.getID());
        this.setState({
            user_DB: newUserList,
            filteredUser: [...newUserList],
            showUserForm: false
        });
    } 

    // Für onIntervalDeleted events
    intervalsDeleted = intervals => {
        const newIntervalList = this.state.intervals.filter(intervalsFromState => intervalsFromState.getID() !== intervals.getID());
        this.setState({
            intervals: newIntervalList,
            filteredIntervals: [...newIntervalList],
            showIntervalForm: false
        });
    }
  

    render() {
        	
        const {classes} = this.props;
        const { sumintervals, user_DB, intervals, showUserDeleteDialog } = this.state;

        return (
            <div>
                <Typography>
                    Firstname: {user_DB.firstname}
                </Typography>
                <Typography>
                    Lastname: {user_DB.lastname}
                </Typography>
                <Typography>
                    Email: {user_DB.email}
                </Typography>

                <br />
                <UserForm show={this.state.show} handleClose={this.hideForm} user_DB = {user_DB} />
                <Button className={classes.button} variant="outlined" color="primary" onClick={this.showForm}>
                    <EditIcon color="primary"/>
                </Button>
                <Button  className={classes.button}variant="outlined" color="primary" onClick={this.deleteUserButtonClicked} >
                    <DeleteIcon color="primary"/>
                </Button>             
                <UserDeleteDialog show={showUserDeleteDialog} user_DB={user_DB} onClose={this.deleteUserDialogClosed} />
                <br />
                <br />
                <UserTimeTrackingList intervals={intervals} sumintervals={sumintervals} user_DB={user_DB.id} onIntervalDeleted={this.intervalsDeleted}/>
            </div>
        )
    }
}

const styles = theme => ({
    button: {
        marginLeft: "20px"
    },
})


export default withStyles(styles)(User);
