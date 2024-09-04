import React, { Component } from 'react';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid,TextField} from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import ProjectDeleteDialog from '../dialogs/ProjectDeleteDialog';
import MainAPI from '../../api/MainAPI';
import ProjectForm from '../dialogs/ProjectForm';
import TaskEntryForTable from './TaskEntryForTable';
import UserEntryForTable from './UserEntryForTable';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TaskList from './TaskList';








class ProjectListEntry extends Component {

    constructor(props) {
        super(props);


        // Init an empty state
        this.state = {
            project: props.project,
            //intervals: null,
            showProjectForm: false, //für edit 
            showProjectDeleteDialog: false,
            expandedProjectID: null,
            projectuser: null,
            filtervon: '',
            filterbis: '',
            intervals: props.intervals,
            filteredInterval: [],
            intervalFilter: '',
            sumintervals: null,
            tasks: [],
            projecttask: null,
            sumtimes: "",
            timedeltaProject: null,
        };
    }


    /** Handles the onClick event of the edit project button */
    editProjectButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectForm: true
        });
    }

    aggregateIntervals = (list, key) => {
        return list.reduce((a, b) => a + (b[key] || 0), 0)
    }

    sumArrayKey = (obj) => {
        return this.aggregateIntervals(obj, 'intervall')
    }


    /** Handles the onClose event of the ProjectForm */
    ProjectFormClosed = (project) => {
        // project is not null and therefor changed
        if (project) {
            this.setState({
                project: project,
                showProjectForm: false
            },()=> {this.getUserbyProject(project.id)});
        } else {
            this.setState({
                showProjectForm: false
            });
        }
    }


    /** Handles the onClick event of the delete project button */
    deleteProjectButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showProjectDeleteDialog: true
        });
    }

    /** Handles the onClose event of the ProjectDeleteDialog */
    deleteProjectDialogClosed = (project) => {
        // if project is not null, delete it
        if (project) {
            this.props.onProjectDeleted(project);
        };

        // Don´t show the dialog
        this.setState({
            showProjectDeleteDialog: false
        });
    }

    getIntervalbyProject = (projectID) => {
        MainAPI.getAPI().getIntervalbyProject(projectID)
            .then(intervalsBOs => {
                this.setState({
                    intervals: intervalsBOs,
                    filteredInterval: [...intervalsBOs]
                })
                this.sum_times(intervalsBOs)
                setTimeout(() => {
                },1000)
            })
            .catch(
                this.setState({ // Reset state with error from catch 
                    intervals: [],
                    

                })
            )
    }

    //die Tasks zum ausgewählten Project auslesen
    getTaskByProjectID = (projectID) => {
        MainAPI.getAPI().getTaskbyProject(projectID)
            .then(taskBOs =>
                this.setState({
                    tasks: taskBOs,
                })).catch(
                    this.setState({ // Reset state with error from catch 
                        tasks: []
                    })
                );

    }

    getUserbyProject = (projectID) => {
        this.setState({projectuser: []})
        MainAPI.getAPI().getUserbyProject(projectID)
            .then(userBOs => this.setState({
                projectuser: userBOs,

            }))
            .catch(
                this.setState({ // Reset state with error from catch
                    projectuser: []

                })
            )
    }

    getSumIntervals = (projectID) => {
        MainAPI.getAPI().getSumIntervalsPerProject(projectID)
            .then(sumintervals => {
                this.setState({
                    sumintervals: sumintervals,
                })
            })
    }
    
    getTaskbyProject = (projectID) => {
        MainAPI.getAPI().getTaskbyProject(projectID)
            .then(taskBOs => this.setState({
                projecttask: taskBOs,

            }))
            .catch(
                this.setState({ // Reset state with error from catch
                    projecttask: []

                })
            )
    }

    componentDidMount() {
        this.getIntervalbyProject(this.props.project.getID());
        this.getUserbyProject(this.props.project.getID());
        this.getSumIntervals(this.props.project.getID());
        this.getTaskbyProject(this.props.project.getID());
        this.getTimedeltaProject(this.props.project.getID());
    }

    //Wenn man hier in der Funktion eine 1 oder ähnliches einfügt wird einmal die richtige URL abgefragt und danach zweimal wieder projekt
     componentDidUpdate(prevProps, prevState, snapshot) {
        if ((this.props.expandedState) && (this.props.expandedState !== prevProps.expandedState)) {
            this.getIntervalbyProject(this.props.project.getID());
            

        } else if ((prevProps.expandedState) && this.props.expandedState !== true) {
            this.setState({
                expandedProjectID: null,
            })
        }
    } 

    onExpandedStateChange = project => {

        // Set expandend project  to null by default
        let newID = null;


        if (project.getID() !== this.state.expandedProjectID) {

            newID = project.getID();
        }

        this.setState({
            expandedProjectID: newID,
        });
    }

    /** Handles onChange events of the underlying ExpansionPanel */
    expansionPanelStateChanged = () => {
        this.props.onExpandedStateChange(this.props.project)
        this.props.onExpandedStateChange(this.props.intervals)
    }

    currentDate = () => {
        let cdate = new Date(),
        dateString = "";
        dateString += cdate.getFullYear() + "-"
        dateString += (cdate.getMonth() < 10) ? "0" +
                    cdate.getMonth() : cdate.getMonth()
        dateString += "-"
        dateString += (cdate.getUTCDate() < 10) ? "0" +
                    cdate.getUTCDate() : cdate.getUTCDate()
        return dateString
    }

    sum_times = (times = []) => {
        // parameter = array => is times leeres array oder hat elemente
        if (times.length > 0) {
            // relevantes feld intervall mappen in variable times (altes times überschrieben)
            times = times.map((objs) => {
                return objs['intervall']
            })
            // beide Zeitvariablen auf 0 setzen
            let tempHours = 0,
                tempMinutes = 0;
            // i = counter, len mit i vergleichen und für i++ durchiterieren
            for (let i = 0, len = times.length; i < len; i++) {
                // time_split string an : splitten > array mit 2 elementen entsteht
                let time_split = times[i].split(":");
                // gezielt auf Elemente zugreifen und tempHours mit Stunden befüllen
                tempHours += parseInt(time_split[0])
                tempMinutes += parseInt(time_split[1])
            }
            // Minuten können > 60 sein, durch 60 teilen -> outcome wird float und wir runden ab + outcome auf temp hours rechnen
            tempHours += Math.trunc(parseInt(tempMinutes)/60)
            // z.B. 70 min 70%60 = 10 Rest in Minuten schreiben
            tempMinutes = tempMinutes % 60
            // sicherstellen, dass kein 17:1 angezeigt werden kann
            tempMinutes = (tempMinutes < 10) ? "0" + tempMinutes : tempMinutes;
            tempHours = (tempHours < 10) ? "0" + tempHours : tempHours;
            this.setState({sumtimes: (tempHours + ":" + tempMinutes).toString()})
        }
        else {this.setState({sumtimes: ""})}
    }

    // Handels onChange events of the filter date field 
    filterDateFrom = event => {
        
        const filteredIntervals = this.state.intervals.filter(intervals => {
            if (this.state.filterbis !== "") {
                return event.target.value + "T00:00:00" <= intervals.getVon() && intervals.getVon() <= this.state.filterbis  + "T00:00:00"
            }
            return intervals.getVon() > event.target.value + "T00:00:00"
        })

        this.setState({
            filteredInterval: filteredIntervals,
            filtervon: event.target.value
        })
        this.sum_times(filteredIntervals)
    } 

    filterDateTo = event => {
        const filteredIntervals = this.state.intervals.filter(intervals => {
            if (this.state.filtervon !== "") {
                return this.state.filtervon  + "T00:00:00" <= intervals.getVon() && intervals.getVon() <= event.target.value + "T00:00:00" 
            } else {
                return intervals.getVon() < event.target.value + "T00:00:00"
            }
            
        })
        this.setState({
            filteredInterval: filteredIntervals,
            filterbis: event.target.value
        })
        this.sum_times(filteredIntervals)
    } 

    // Das - zum löschen des Filters wurde gelickt 
    clearFilterFieldButtonClicked = () => {
    // Reset the filter
        this.setState({
            filteredInterval: [...this.state.intervals],           
            intervalFilter: ''
            
        });
        
    }

    getTimedeltaProject = (projectID) => {
        MainAPI.getAPI().getTimedeltaProject(projectID)
            .then(timedeltaProject => {
                this.setState({
                    timedeltaProject: timedeltaProject,
                })
            })
    }

    /** Renders the component */
    render() {
        const { expandedState, classes } = this.props;
        const { sumintervals, project, showProjectForm, showProjectDeleteDialog,  filtervon, filterbis, filteredInterval, sumtimes, timedeltaProject  } = this.state;
 
        return (
            <div className={classes.root}>

                <Accordion  className={classes.accordion} defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>

                    <AccordionSummary className={classes.accordion} id={`project${project.getID()}`}
                    >
                        <Grid container spacing={1} justifyContent='flex-start' alignItems='center'>
                            <Grid item>
                                <Typography> {project.getDescription()}</Typography>

                            </Grid>
                            <Grid item>
                                <ButtonGroup variant='text' size='small' >
                                    <Button color='primary' onClick={this.editProjectButtonClicked} >
                                        <EditIcon color="primary"/>
                                    </Button>
                                    <Button color='secondary' onClick={this.deleteProjectButtonClicked}>
                                        <DeleteIcon color="primary" />
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid item xs />
                            <Grid item>
                                <Typography variant='body2' color={'textSecondary'}>
                                    Details
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    
                    <p className={classes.client}>  Client: <span className={classes.nameClient}>{project.getClient()} </span> </p>
                    <p className={classes.duration}>  Project Duration: <span className={classes.nameproject}> {project.getDuration()}  h </span> </p>           
                    <p className={classes.time}>  Remaining Time: <span className={classes.namedelta}>{timedeltaProject} h </span> </p>
                    <p className={classes.projectmember}>  Projectmembers: {this.state.projectuser?.map( projectuser =><span key={projectuser.id}className={classes.nameuser}> {projectuser.getFirstName()} {projectuser.getLastName()}  </span> )}</p>
                    <Grid container spacing={5}  width="100%">
                        <Grid item width="100%">                    
                            <form className={classes.form} noValidate >   
                                                  
                                <TextField 
                                    helperText="Filter date from"                        
                                    id="datetime-von"
                                    label=""
                                    type="date"
                                    value={filtervon}
                                    onChange={this.filterDateFrom}
                                                                     
                                
                                />
                            </form>
                        </Grid>
                        <Grid item width="100%">                    
                            <form className={classes.form} noValidate >                        
                                <TextField 
                                    helperText="Filter date to"                        
                                    id="datetime-bis"
                                    label=""
                                    type="date"
                                    value={filterbis}
                                    onChange={this.filterDateTo}
                                  
                                
                                />
                            </form>
                        </Grid>
                    </Grid>
     
                    
                    <AccordionDetails className={classes.accordionDetails}>

                        <Grid container className={classes.container} grid-auto-flow="column"  >

                            <Grid item className={classes.gridHeader} grid-auto-flow="column" >
                                Date:
                            </Grid>
                            <Grid item className={classes.gridColumn} grid-auto-flow="column">
                                {filteredInterval?.map(intervals =>
                                    <p className={classes.listItem} key={intervals.id}> {intervals.getVon().split('T')[0]} </p>

                                )
                                }
                           </Grid> 
                        </Grid>
                        <Grid container className={classes.container} >
                            <Grid item className={classes.gridHeader} grid-auto-flow="column">
                                Recorded Time: 
                            </Grid>
                            <Grid item className={classes.gridColumn} grid-auto-flow="column"> 
                                {filteredInterval?.map(intervals =>
                                    <p className={classes.listItem} key={intervals.id}> {intervals.getInterval()} </p>

                                )
                                }
                            </Grid>
                        </Grid>
                        <Grid container className={classes.container} grid-auto-flow="column">
                            <Grid item className={classes.gridHeader} grid-auto-flow="column">
                                Tasks:
                            </Grid>
                            <Grid item className={classes.gridColumn} grid-auto-flow="column" >
                                {filteredInterval?.map((intervals, index ) =>
                                    <TaskEntryForTable key={index} taskID={intervals.task_id}  />
                                    
                                )                                
                                }


                            </Grid>
                        </Grid>
                        <Grid container className={classes.container} grid-auto-flow="column">
                            <Grid item className={classes.gridHeader} grid-auto-flow="column">
                                Users:
                            </Grid>
                            <Grid item className={classes.gridColumn} grid-auto-flow="column" >
                                {filteredInterval?.map((intervals, index) =>
                                    <UserEntryForTable key={index}  userID={intervals.user} />

                                )
                                }


                            </Grid>
                        </Grid>
                    </AccordionDetails>
                    <Grid container  >
                        <Grid item  className={classes.sum} >
                            Shown Working time for {project.getDescription()} : {sumtimes} h <br/>
                            Total working time for {project.getDescription()} : {sumintervals} h
                        </Grid>
                    </Grid>
                    <TaskList project={project} />
                    <ProjectForm show={showProjectForm} onClose={this.ProjectFormClosed} project={project} />
                    <ProjectDeleteDialog show={showProjectDeleteDialog} project={project} onClose={this.deleteProjectDialogClosed} />
                </Accordion>
                
            </div >
        );
    }
}

const styles = theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(1)
    },
    accordionDetails: {
        backgroundColor: "#F4F6F8"
    },
    listItem: {
        padding: "7.5px",
    },
    gridColumn: {
        fontWeight: "lighter",
    },
    gridHeader: {
        fontWeight: "bold",
        color: "#00695c",
        justifyContent: 'center',
        borderBottom: "solid"
    },
    container: {
        display: "grid",
        paddingTop: "2em"
    },
    client: {
        fontWeight: "light",     
        color: 'grey',
        marginLeft: "4em",
        marginTop: "3em"
        
       
    },
   duration: {
        fontWeight: "light",     
        color: 'grey',
        marginLeft: "4em",
        
       
    },
    time: {
        fontWeight: "light",     
        color: 'grey',
        marginLeft: "4em",
        
       
    },  
    projectmember: {
        fontWeight: "light",     
        color: 'grey',
        marginLeft: "4em",
        marginBottom: "3em"
        
       
    },
    nameClient:{
        marginLeft: "6em"
    },   
    namedelta:{
        marginLeft: "1em"
    },  

    nameproject:{
        marginLeft: "1em"
    },
    nameuser:{
        marginLeft: "1em"
    },  
   
    sum: {
        fontWeight: "bold",        
        padding: "10px",
        color: "grey",
        marginLeft: 5,
    },
    button: {
        marginBottom: "15px"
    },
    form: {
        marginTop: "20px",
        marginBottom: "20px",
        marginLeft: 200

    },
    accordion:{
        backgroundColor: "white",        
        boxShadow: " #DADADA 0px 3px 8px"
    },

    clear:{
        marginTop: "15px"
    },

    

    
   
});


export default withStyles(styles)(ProjectListEntry);
//evtl hier noch withRouter()

