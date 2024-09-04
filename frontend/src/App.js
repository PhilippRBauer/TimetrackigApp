import React from 'react';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom';
import { Container, ThemeProvider, CssBaseline } from '@material-ui/core';
import Theme from './Theme';
import SignIn from './components/pages/SignIn';
import Header from './components/layout/Header'
import firebaseConfig from './firebaseconfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AllProjectList from './components/lists/AllProjectList';
import User from './components/lists/User';
import TimeTrackingForm from './components/dialogs/TimeTrackingForm';
import Footer from './components/layout/Footer'

class App extends React.Component {

  /** Constructor of the app, which initializes firebase  */
  constructor(props) {
    super(props);

    // Init an empty state
    this.state = {
      currentUser: null,
      hasError: false,   //wird eig nicht für ContextErrormessage genutzt 
      authError: null,  //wird eig nicht für ContextErrormessage genutzt 
      authLoading: false
    };
  }


  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.    
    return { hasError: true };
  }


  /** Handles firebase users logged in state changes  */
  handleAuthStateChange = user => {
    if (user) {
      this.setState({
        authLoading: true
      });
      // The user is signed in
      user.getIdToken().then(token => {
        // Add the token to the browser's cookies. The server will then be
        // able to verify the token against the API.
        // SECURITY NOTE: As cookies can easily be modified, only put the
        // token (which is verified server-side) in a cookie; do not add other
        // user information.
        document.cookie = `token=${token};path=/`;

        // Set the user not before the token arrived 
        this.setState({
          currentUser: user,
          authError: null,
          authLoading: false
        });
      }).catch(e => {
        this.setState({
          authError: e,
          authLoading: false
        });
      });
    } else {
      // User has logged out, so clear the id token
      document.cookie = 'token=;path=/';

      // Set the logged out user to null
      this.setState({
        currentUser: null,
        authLoading: false
      });
    }
  }

  handleSignIn = () => {
    this.setState({
      authLoading: true
    });
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  componentDidMount() {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().languageCode = 'en';
    firebase.auth().onAuthStateChanged(this.handleAuthStateChange);
  }

  /** Renders the whole app */
  render() {
    const { currentUser } = this.state;

    return (
      <ThemeProvider theme={Theme}>
        {/* Global CSS reset and browser normalization. CssBaseline kickstarts an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Router basename={process.env.PUBLIC_URL}>
          <Container maxWidth='md'>
            <Header user={currentUser} />
            <br />
            <br />
            <br />
            {
              // Is a user signed in?
              currentUser ?
                <>
                  <Redirect from='/' to='/project' />
                  <Route exact path='/project'>
                    <AllProjectList />
                  </Route>
                  <Route path='/time'>
                    <TimeTrackingForm user={currentUser}/>
                  </Route>
                  <Route exact path='/user'>
                    <User user={currentUser}/>
                  </Route>
                </>
                :
                // else show the sign in page
                <>
                  <Redirect to='/signin' />
                  <SignIn onSignIn={this.handleSignIn} />

                </>
            }
            
          </Container>
          <br/>
          <br/>
          <br/> 
          <br/>
          <br/>   
          <br/>
          <br/>   
          <br/>
          <br/>                        
          <Footer/>
          </Router>
      </ThemeProvider>
    );
  }
}
export default App;