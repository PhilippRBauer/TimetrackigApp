import React, { Component } from 'react';
import { withStyles, Typography, Accordion, AccordionSummary, AccordionDetails, Grid } from '@material-ui/core';
import { Button, ButtonGroup } from '@material-ui/core';
import TaskDeleteDialog from '../dialogs/TaskDeleteDialog';
import MainAPI from '../../api/MainAPI';
import TaskForm from '../dialogs/TaskForm';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


class TaskListEntry extends Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            sumintervals: null,
            timedelta: null,
            task: props.task,
            showTaskForm: false, //für edit 
            showTaskDeleteDialog: false,
        };
    }

    getSumIntervals = (taskID) => {
        MainAPI.getAPI().getSumIntervalsPerTask(taskID)
            .then(sumintervals => {
                this.setState({
                    sumintervals: sumintervals,
                })
            })
    }

    getTimedelta = (taskID) => {
        MainAPI.getAPI().getTimedelta(taskID)
            .then(timedelta => {
                this.setState({
                    timedelta: timedelta,
                })
            })
    }

    componentDidMount() {
        this.getSumIntervals(this.props.task.getID());
        this.getTimedelta(this.props.task.getID());
    }

    /** Handles onChange events of the underlying ExpansionPanel */
    expansionPanelStateChanged = () => {
        this.props.onExpandedStateChange(this.props.task);
    }

    /** Handles the onClick event of the edit task button */
    editTaskButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showTaskForm: true
        });
    }

    /** Handles the onClose event of the TaskForm */
    taskFormClosed = (task) => {
        // task is not null and therefor changed
        if (task) {
            this.setState({
                task: task,
                showTaskForm: false
            });
        } else {
            this.setState({
                showTaskForm: false
            });
        }
    }

    /** Handles the onClick event of the delete task button */
    deleteTaskButtonClicked = (event) => {
        event.stopPropagation();
        this.setState({
            showTaskDeleteDialog: true
        });
    }

    /** Handles the onClose event of the TaskDeleteDialog */
    deleteTaskDialogClosed = (task) => {
        // if task is not null, delete it
        if (task) {
            this.props.onTaskDeleted(task);
        };

        // Don´t show the dialog
        this.setState({
            showTaskDeleteDialog: false
        });
    }

    /** Renders the component */
    render() {
        const { expandedState, classes } = this.props;
        const { task, sumintervals, timedelta, showTaskForm, showTaskDeleteDialog } = this.state;

      
        return (
            <div className={classes.root}>
                <Accordion className={classes.accordion} defaultExpanded={false} expanded={expandedState} onChange={this.expansionPanelStateChanged}>
                    <AccordionSummary
                        id={`task${task.getID()}`}
                    >
                        <Grid container spacing={1} justifyContent='flex-start' alignItems='center'>
                            <Grid item>
                                <Typography variant='body1'>
                                    {task.getDescription()}
                                </Typography>
                            </Grid>
                            <Grid item xs />
                            <Grid item>
                                <ButtonGroup variant='text' size='small'>
                                    <Button color='primary' onClick={this.editTaskButtonClicked}>
                                    <EditIcon color="primary"/>
                                    </Button>
                                    <Button onClick={this.deleteTaskButtonClicked}>
                                        <DeleteIcon color="primary"/>
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </AccordionSummary>

                    <AccordionDetails className={classes.accordionDetails}>
                        <Grid container className={classes.container} grid-auto-flow="column"  >
                            <Grid item className={classes.gridHeader} grid-auto-flow="column" >
                                Task capacity:
                            </Grid>
                            <Grid item className={classes.gridColumn} grid-auto-flow="column">
                                {task.getCapacity()}
                        </Grid> 
                        </Grid>
                        <Grid container className={classes.container} >
                            <Grid item className={classes.gridHeader} grid-auto-flow="column">
                                Recorded Time for this Task: 
                            </Grid>
                            <Grid item className={classes.gridColumn} grid-auto-flow="column"> 
                                {sumintervals} h
                            </Grid>
                        </Grid>
                        <Grid container className={classes.container} grid-auto-flow="column">
                            <Grid item className={classes.gridHeader} grid-auto-flow="column">
                            Remaining Time:
                            </Grid>
                            <Grid item className={classes.gridColumn} grid-auto-flow="column" >
                                {timedelta} h                              
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                    <TaskForm show={showTaskForm} onClose={this.taskFormClosed} task= {task} />
                    <TaskDeleteDialog show={showTaskDeleteDialog} task={task} onClose={this.deleteTaskDialogClosed} />
                </Accordion>
            </div>
        );
    }
}

const styles = theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(1)
    },
    accordion: {
        backgroundColor: "#b2dfdb",
        boxShadow: "0px 3px 8px #909090",
        color: "#004d40"
        
    },
    accordionDetails: {
        backgroundColor: "white"
    },
    gridColumn: {
        fontWeight: "lighter",
        padding: "7px",
    },
    gridHeader: {
        fontWeight: "bold",
        color: "#00695c",
        justifyContent: 'center',
        borderBottom: "solid"
    },
    container: {
        display: "grid",
    },
})

export default withStyles(styles)(TaskListEntry);

