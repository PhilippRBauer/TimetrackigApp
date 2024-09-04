import React, { Component } from 'react';
import { withStyles} from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import MainAPI from '../../api/MainAPI';




class UserEntryForTable extends Component {

    constructor(props) {
        super(props);

        // Init an empty state
        this.state = {
            user: null
        };
    }

    getUser = () => {
        MainAPI.getAPI().getUser(this.props.userID)
            .then(UserBO =>
                this.setState({
                    user: UserBO,
                })).catch(
                    this.setState({ // Reset state with error from catch 
                        user: null
                    })
                );
        this.setState({
            //eig unnörig
        });
    }

    componentDidMount() {
        this.getUser()
    } 


    /** Renders the component */
    render() {
        const { classes } = this.props;
        const { user } = this.state;
        return (
            user ? 
                <div>
                    <p className={classes.listItem}>
                        {user.getFirstName()} {user.getLastName()}
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

export default withRouter(withStyles(styles)(UserEntryForTable));

