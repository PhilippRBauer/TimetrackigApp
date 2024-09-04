import React, { Component } from 'react';
import { withStyles, Button, TextField, Grid} from '@material-ui/core';
import TaskEntryForTable from './TaskEntryForTable';
import ProjectEntryForTable from './ProjectEntryForTable';
import CancelIcon from '@material-ui/icons/Cancel';
import IntervalDeleteDialog from '../dialogs/IntervalDeleteDialog'



class UserTimeTrackingList extends Component {

    constructor(props) {
        super(props);


        this.state = {
            filtervon: '',
            filterbis: '',
            intervals: props.intervals,
            user_DB: props.user_DB,
            sumintervals: props.sumintervals,
            filteredInterval: [],
            intervalFilter: '',
            sumtimes: "",
            showIntervalDeleteDialog: false,
        };
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



    /** Lifecycle method, which is called when the component gets inserted into the browsers DOM */


    // Die folgende Funktion stellt sicher, dass nach Aktualisierung der Liste Intervals in User.js,
    // diese Component aktualisiert wird
    async componentDidUpdate(prevProps): Promise<void> {
        if (this.props.intervals !== prevProps.intervals) {
            this.sum_times(this.props.intervals)
            this.setState({ intervals: this.props.intervals })
            this.setState({ sumintervals: this.props.sumintervals })
            this.setState({ filteredInterval: this.props.intervals })

        }
    }


    // Das - zum löschen des Filters wurde gelickt
    clearFilterFieldButtonClicked = () => {
        // Reset the filter
        this.setState({
            filteredInterval: [...this.props.intervals],
            intervalFilter: ''
        });
    }
 

    /** Handles the onClick event of the delete intervals button */
    deleteIntervalButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showIntervalDeleteDialog: true
        });
    }

    /** Handles the onClose event of the IntervalDeleteDialog */
    deleteIntervalDialogClosed = (intervals) => {
        // if intervals is not null, delete it
        if (intervals) {
            this.props.onIntervalDeleted(intervals);
        };

        // Don´t show the dialog
        this.setState({
            showIntervalDeleteDialog: false
        });
    }



    render() {

        const { classes,  } = this.props;
        const { sumintervals,  filtervon, filterbis, filteredInterval, sumtimes, showIntervalDeleteDialog } = this.state;

        return (

            <div>
                <Grid container spacing={2} justifyContent="space-evenly" width="100%">
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


                <h2 className={classes.title}> Your time records </h2>
                <Grid container className={classes.container}>
                    <Grid item className={classes.gridHeader}>
                        Date
                    </Grid>
                    <Grid item className={classes.gridColumn}>
                        {filteredInterval?.map(intervals =>
                            <p className={classes.listItem} key={intervals.id}> {intervals.getVon().split('T')[0]}</p>
                        )

                        }
                    </Grid>
                     <Grid item className={classes.gridHeader}>
                        Project Name
                    </Grid>
                    <Grid item className={classes.gridColumn}>
                        {filteredInterval?.map(intervals =>
                            <ProjectEntryForTable key={intervals.id} projectID={intervals.project_id} />
                        )
                        }
                    </Grid>
                    <Grid item className={classes.gridHeader}>
                        Task Name
                    </Grid>
                    <Grid item className={classes.gridColumn}>
                        {filteredInterval?.map(intervals =>
                            < TaskEntryForTable key={intervals.id} taskID={intervals.task_id} />
                        )
                        }
                    </Grid>
                    <Grid item className={classes.gridHeader}>
                        Working Time
                    </Grid>
                    <Grid item className={classes.gridColumn}>
                        {filteredInterval?.map(intervals =>
                            <p className={classes.listItem} key={intervals.id}> {intervals.getInterval()} </p>
                        )
                        }
                    </Grid>
                    <Grid item className={classes.gridHeader}>
                       Storno
                    </Grid>
                    <Grid item className={classes.gridColumn}>
                        {filteredInterval?.map(intervals =>
                            <p key={intervals.id}>
                                <Button  onClick={this.deleteIntervalButtonClicked}>
                                    <CancelIcon color="primary" />
                                </Button>
                                <IntervalDeleteDialog show={showIntervalDeleteDialog} intervals={intervals} onClose={this.deleteIntervalDialogClosed} />
                            </p>
                        )}
                    </Grid>
                </Grid>
                <Grid container  >
                        <Grid item  className={classes.paragraph} >
                            Shown Working time : {sumtimes} h <br/>
                            Your total working time is: {sumintervals} h
                        </Grid>
                </Grid>
                
            </div>
        )
    }
}

const styles = theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(1)
    },
    gridColumn: {
        fontWeight: "lighter",
        gridRow: "4",
    },
    gridHeader: {
        fontWeight: "bold",
        color: "#00695c",
        justifyContent: 'center',
        borderBottom: "solid",
        gridRow: "1",
    },
    container: {
        display: "grid",
        gridTemplateColumns: "1fr 2fr 2fr 1fr",
        gridAutoFlow: "column",

    },
    listItem: {
        padding: "7.5px",
    },
    paragraph: {
        fontWeight: "bold",
        padding: "1px",
        color: "grey",
        
    },
    form:{
        display: 'flex',
        marginTop:"30px"
    },
    title:{
        marginTop: "50px"
    }
});

export default withStyles(styles)(UserTimeTrackingList);