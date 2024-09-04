import React from 'react';
import { Button,  Grid, withStyles} from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import TextField from '@material-ui/core/TextField';
import SendIcon from '@material-ui/icons/Send';
import MainAPI from '../../api/MainAPI';
import IntervalBO from '../../api/IntervalBO';

class TimeTrackingForm extends React.Component {

    constructor(props) {
        super(props)


        this.state = {

            von: this.currentDate(),
            bis: this.currentDate(),
            selectedProject: "",
            projects: [],
            selectedTask: "",
            tasks: [],
            user_DB: {},

        };
        // this.baseState = this.state;
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.addInterval = this.addInterval.bind(this);
    }

    // returned dass aktuelle Datum in nörtigen format
    currentDate = () => {
        let cdate = new Date(),
            dateString = "";
        dateString += cdate.getFullYear() + "-"
        dateString += (cdate.getMonth() < 10) ? "0" +
            (cdate.getMonth()+1) : (cdate.getMonth()+1)
        dateString += "-"
        dateString += (cdate.getUTCDate() < 10) ? "0" +
            cdate.getUTCDate() : cdate.getUTCDate()
        dateString += "T"
        dateString += (cdate.getHours() < 10) ? "0" +
            cdate.getHours() : cdate.getHours()
        dateString += ":"
        dateString += (cdate.getMinutes() < 10) ? "0" +
            cdate.getMinutes() : cdate.getMinutes()
        
        return dateString
    }


    // das UserBO Objekt für den aktuell eingeloggten User )email (user aus Google Authentifizierung --> user_DB aus Datenbank)
    getCurrentUserObject = () => {
        MainAPI.getAPI().searchUser(this.props.user.email)
            .then(UserBO =>
                this.setState({ user_DB: UserBO })
            );         
    };

    // die ProjectBOs für den eingeloggten User(userID) holen
    getProjects = (id) => {
        MainAPI.getAPI().getProjectbyUser(id)
            .then(projectBOs =>
                this.setState({ 
                    projects: projectBOs 
                })).catch(
                    this.setState({
                        projects: []
                    })
                );
    };

    //  hier await verspätet der Aufruf um 1 Sukende
    async componentDidMount(): Promise<void> {
        await this.getCurrentUserObject();

        // Sleep for 1 seconds
        await new Promise(resolve => { setTimeout(resolve, 1000); });

        // Aufruf der Funktion GetIntervals() mit dem Argument User ID des aktuell einloggten Users,
        // um alle Intervals eines Users abzuholen und in State abzuspeichern
        this.getProjects(this.state.user_DB.id);
    };

    //die Tasks zum ausgewählten Project auslesen
    getTaskByProjectID = (projectID) => {
        if (typeof taskid !== null) {
            MainAPI.getAPI().getTaskbyProject(projectID)
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
    }

    // neues Intervall anlegen
    addInterval(event) {

        event.preventDefault();
        var interval = new IntervalBO()
        interval.setID(0)
        interval.setVon(this.state.von)
        interval.setBis(this.state.bis)
        interval.setUser(this.state.user_DB.id)
        interval.setProjectID(parseInt(this.state.selectedProject))
        interval.setTaskID(parseInt(this.state.selectedTask))


        MainAPI.getAPI().addInterval(interval).then((interval) => {
            this.setState({
                interval: interval,
            });
            //this.props.getInterval()
            this.setState(this.baseState);
        }).catch(e =>
            this.setState({
            })
        );

        alert('You have successfully recorded your working hours')
        window.location.reload(); //Lädt die Seite neu
    }

    handleSelectChange = (event) => {

        if (event.target.id === "project") {
            this.setState({
                selectedProject: event.target.value
            })
        } else {
            this.setState({
                selectedTask: event.target.value
            })
        }

        if (event.target.id === "project" && typeof event.target.value !== null) {
            this.getTaskByProjectID(event.target.value)
        }
    };

    /** Handles value changes of the forms validity from date picker field */
    vonValueChange = (event) => {
        this.setState({
            von: event.target.value
        })
    }

    /** Handles value changes of the forms validity to date picker field */
    bisValueChange = (event) => {
        this.setState({
            bis: event.target.value
        })
    }


    render() {

        const { classes } = this.props;
        const {  projects, tasks, selectedTask, selectedProject, von, bis } = this.state;

        return (
            <div>
                <h2>Track your working Time</h2>
                <br />

                <Grid container spacing={2} justifyContent="space-evenly">
                    <Grid item xs={6}>
                        <form className={classes.container} noValidate>
                            <TextField
                                id="datetime-bis"
                                label="When did you start ?"
                                type="datetime-local"
                                //value={von}
                                key={von.id}
                                defaultValue={von}
                                onChange={this.vonValueChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                    </Grid>

                    <Grid item xs={6}>
                        <form className={classes.container} noValidate>
                            <TextField
                                id="datetime-bis"
                                label="when did you finish ?"
                                type="datetime-local"
                                //value={bis}
                                key={bis.id}
                                defaultValue={bis}
                                onChange={this.bisValueChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </form>
                    </Grid> 
                           
                    <Grid item xs={6}>
                        <FormControl>
                            <InputLabel>Projects</InputLabel>
                            <NativeSelect
                                id="project"
                                value={selectedProject.id} 
                                onChange={this.handleSelectChange}

                            >
                                <option aria-label="None" value="" />
                                {
                                    projects.map(selectedProject => <option value={selectedProject.id} key={selectedProject.id}> {selectedProject.getDescription()} </option>)
                                }

                            </NativeSelect>
                            <FormHelperText>select the project you've worked on</FormHelperText>
                        </FormControl>
                    </Grid>
                
                    <Grid item xs={6}>
                        <FormControl>
                            <InputLabel>Tasks</InputLabel>
                            <NativeSelect
                                value={selectedTask.id}
                                onChange={this.handleSelectChange}

                            >
                                <option aria-label="None" value="" />
                                {
                                    tasks.map(selectedTask => <option value={selectedTask.id} key={selectedTask.id}> {selectedTask.getDescription()} </option>)
                                }

                            </NativeSelect>
                            <FormHelperText>select the task you've worked on</FormHelperText>
                        </FormControl>
                    </Grid>
                 </Grid> 

                <br />
                <br />
                <br />
                <Button  variant="outlined" color="primary" onClick={this.addInterval} >
                    Send <SendIcon color="primary" fontSize="large" className={classes.send}/>
                </Button>
            </div>
        );
    }
}

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },

    send:{
        marginLeft: "5px"
    }
});

export default withStyles(styles)(TimeTrackingForm);
