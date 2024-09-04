import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import MainAPI from '../../api/MainAPI';


class ProjectEntryForTable extends Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            project: null
        };
    }

    getProject = () => {
        MainAPI.getAPI().getProject(this.props.projectID)
            .then(projectBO =>
                this.setState({
                    project: projectBO,
                })).catch(
                    this.setState({ // Reset state with error from catch
                        project: null
                    })
                );
        this.setState({
            //eig unnörig
        });
    }

    componentDidMount() {
        this.getProject()
    }


    render() {
        const { classes } = this.props;
        const { project } = this.state;
        return (
            project ? 
                <div>
                    <p className={classes.listItem} >
                        {project.getDescription()}
                    </p>
                </div>
            : null

        );
    }
}

const styles = theme => ({
    listItem: {
        padding: "7.5px",
    },
});

export default withRouter(withStyles(styles)(ProjectEntryForTable));