import React, { Component } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';


class SignIn extends Component {

	/** 
	 * Handles the click event of the sign in button an calls the prop onSignIn handler
	 */
	handleSignInButtonClicked = () => {
		this.props.onSignIn();
	}

	/** Renders the sign in page, if user objext is null */
	render() {
		return (
			<div>
				<Typography sx={{ margin: 2 }} align='center' variant='h6'>Welcome to our Projectmanagement App</Typography>
				<Typography sx={{ margin: 2 }} align='center'>It appears, that you are not signed in.</Typography>
				<Typography sx={{ margin: 2 }} align='center'>To use our Services</Typography>
				<Grid container justifyContent='center'>
					<Grid item>
						<Button variant='contained' color='primary' onClick={this.handleSignInButtonClicked}>
							Sign in with Google
						</Button>
					</Grid>
				</Grid>
			</div>
		);
	}
}


export default SignIn;