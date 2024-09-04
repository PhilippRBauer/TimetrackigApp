import ProjectBO from './ProjectBO';
import UserBO from './UserBO';
import TaskBO from './TaskBO';
import TimeAccountBO from './TimeAccountBO';
import PostingBO from './PostingBO';
import IntervalBO from './IntervalBO';
import SumIntervalsBO from './SumIntervalsBO';
import TimeDeltaBO from './TimeDeltaBO';

/**
 * Fasst die REST-Schnittstelle des Python-Backends mit bequemen Zugriffsmethoden im frontend zusammen.
 * Die Klasse ist als Singleton implementiert. 
**/

export default class MainAPI {

  // Singelton
  static #api = null;


  // Das Lokale Python backend
  #TimeServerURL = '/time';


  // User 
  #getUsersURL = () => `${this.#TimeServerURL}/user`;
  #getUserURL = (id) => `${this.#TimeServerURL}/user/${id}`;
  #updateUserURL = (id) => `${this.#TimeServerURL}/user/${id}`;s
  #addUserURL = () => `${this.#TimeServerURL}/user`;
  #deleteUserURL = (id) => `${this.#TimeServerURL}/user/${id}`;
  #searchUserURL = (email) => `${this.#TimeServerURL}/user-by-email/${email}`;
  #searchUserURL2 = (guid) => `${this.#TimeServerURL}/user-by-guid/${guid}`;
  #getUserbyProjectURL = (projectID) => `${this.#TimeServerURL}/project/${projectID}/user`;

  // Project 
  #getProjectsURL = () => `${this.#TimeServerURL}/project`;
  #addProjectURL = () => `${this.#TimeServerURL}/project`;
  #getProjectURL = (id) => `${this.#TimeServerURL}/project/${id}`;
  #updateProjectURL = (id) => `${this.#TimeServerURL}/project/${id}`;
  #deleteProjectURL = (id) => `${this.#TimeServerURL}/project/${id}`;
  #searchProjectURL = (projectName) => `${this.#TimeServerURL}/project-by-name/${projectName}`;
  #getProjectbyUserURL = (id) => `${this.#TimeServerURL}/project-id-by-user/${id}`

  // Task 
  #getTasksURL = () => `${this.#TimeServerURL}/task`;
  #addTaskURL = () => `${this.#TimeServerURL}/task`;
  #getTaskURL = (id) => `${this.#TimeServerURL}/task/${id}`;
  #updateTaskURL = (id) => `${this.#TimeServerURL}/task/${id}`;
  #deleteTaskURL = (id) => `${this.#TimeServerURL}/task/${id}`;
  #searchTaskURL = (taskName) => `${this.#TimeServerURL}/task-by-name/${taskName}`;
  #getTaksforTaskURL = (id) => `${this.#TimeServerURL}/task-by-task/${id}`;
  #getTaskbyProjectURL = (projectID) => `${this.#TimeServerURL}/task-by-project/${projectID}`;

  //TimeAccount 
  #getTimeAccountsURL = () => `${this.#TimeServerURL}/timeaccount`;
  #addTimeAccountURL = () => `${this.#TimeServerURL}/timeaccount`;
  #getTimeAccountURL = (id) => `${this.#TimeServerURL}/timeaccount/${id}`;
  #updateTimeAccountURL = (id) => `${this.#TimeServerURL}/timeaccount/${id}`;
  #searchTimeAccountURL = (timeaccountName) => `${this.#TimeServerURL}/timeaccount-by-name/${timeaccountName}`;
  #getTimeAccountsforTimeAccountURL = (id) => `${this.#TimeServerURL}/timeaccount-by-timeaccount/${id}`;

  //Posting 
  #searchPostingByUserURL = (userID) => `${this.#TimeServerURL}/posting-by-user/${userID}`;
  #getPostingbyProjectURL = (projectID) => `${this.#TimeServerURL}/posting/${projectID}/project`;


  //Interval 
  #getIntervalURL = (intervalID) => `${this.#TimeServerURL}/intervals/${intervalID}`;
  #addIntervalURL = () => `${this.#TimeServerURL}/intervals`; 
  #deleteIntervalURL = (id) => `${this.#TimeServerURL}/intervals/${id}`;
  #getIntervalbyProjectURL = (projectID) => `${this.#TimeServerURL}/intervals/${projectID}/project`;
  #getIntervalsByUserURL = (userID) => `${this.#TimeServerURL}/intervals-by-user/${userID}`;
  #getSumIntervalsProjectURL = (projectID) => `${this.#TimeServerURL}/sumintervals/${projectID}/project`;   //Interval Summe per Project
  #getSumIntervalsUserURL = (userID) => `${this.#TimeServerURL}/sumintervals/${userID}/user`;   // Interval Summe per User
  #getSumIntervalsTaskURL = (taskID) => `${this.#TimeServerURL}/sumintervals/${taskID}/task`;   // Interval Summe per Task

  //capacity time delta
  #getTimedeltaURL = (taskID) => `${this.#TimeServerURL}/calculatecapacity/${taskID}/task`;   // Interval Summe per Task
  #getTimedeltaProjectURL = (projectID) => `${this.#TimeServerURL}/calculateduration/${projectID}/project`;   // Interval Summe per Projekt

  // holt sich die Singelton Instanz 
  static getAPI() {
    if (this.#api == null) {
      this.#api = new MainAPI();
    }
    return this.#api;
  }

  #fetchAdvanced = (url, init) => fetch(url, init)
    .then(res => {
      // The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500. 
      if (!res.ok) {
        // auskommentieren, falls SignIn einen Fehler wirft:
        throw Error(`${res.status} ${res.statusText}`);
      }
      return res.json();
    }
    )


  // User Methoden
  getUsers() {
    return this.#fetchAdvanced(this.#getUsersURL()).then((responseJSON) => {
      let userBOs = UserBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(userBOs);
      })
    })
  }

  getUser(userID) {
    return this.#fetchAdvanced(this.#getUserURL(userID)).then((responseJSON) => {
      let responseUserBO = UserBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseUserBO);
      })
    })
  }

  // für User Seite notwendig !!!
  searchUser(email) {
    return this.#fetchAdvanced(this.#searchUserURL(email)).then((responseJSON) => {
      let responseUserBO = UserBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseUserBO);
      })
    })
  }

  // alternative anstatt über email über guid suchen!!!
  searchUser2(guid) {
    return this.#fetchAdvanced(this.#searchUserURL2(guid)).then((responseJSON) => {
      let responseUserBO = UserBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseUserBO);
      })
    })
  }

  addUser(userBO) {
    return this.#fetchAdvanced(this.#addUserURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userBO)
    }).then((responseJSON) => {
      let responseUserBO = UserBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseUserBO);
      })
    })

  }

  updateUser(userBO) {
    return this.#fetchAdvanced(this.#updateUserURL(userBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(userBO)
    }).then((responseJSON) => {

      let responseUserBO = UserBO.fromJSON(responseJSON)[0];

      return new Promise(function (resolve) {
        resolve(responseUserBO);
      })
    })
  }

  deleteUser(userID) {
    return this.#fetchAdvanced(this.#deleteUserURL(userID), {
      method: 'DELETE'
    }).then((responseJSON) => {

      let responseUserBO = UserBO.fromJSON(responseJSON)[0];

      return new Promise(function (resolve) {
        resolve(responseUserBO);
      })
    })
  }  


  // Project Methoden
  getProjects() {
    return this.#fetchAdvanced(this.#getProjectsURL()).then((responseJSON) => {
      let projectBOs = ProjectBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(projectBOs);
      })
    })
  }

  getProject(projectID) {
    return this.#fetchAdvanced(this.#getProjectURL(projectID)).then((responseJSON) => {
      let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseProjectBO);
      })
    })
  }

  deleteProject(projectID) {
    return this.#fetchAdvanced(this.#deleteProjectURL(projectID), {
      method: 'DELETE'
    }).then((responseJSON) => {
      // We always get an array of ProjectBOs.fromJSON
      let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseProjectBO);
      })
    })
  }

  addProject(projectBO) {
    return this.#fetchAdvanced(this.#addProjectURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(projectBO)
    }).then((responseJSON) => {
      let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseProjectBO);
      })
    })

  }

  updateProject(projectBO) {
    return this.#fetchAdvanced(this.#updateProjectURL(projectBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(projectBO)
    }).then((responseJSON) => {

      let responseProjectBO = ProjectBO.fromJSON(responseJSON)[0];

      return new Promise(function (resolve) {
        resolve(responseProjectBO);
      })
    })
  }

  getProjectbyUser(id) {
    return this.#fetchAdvanced(this.#getProjectbyUserURL(id)).then((responseJSON) => {
      let projectBO = ProjectBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(projectBO);
      })
    })
  }


  // Task Methoden
  getTasks() {
    return this.#fetchAdvanced(this.#getTasksURL()).then((responseJSON) => {
      let taskBOs = TaskBO.fromJSON(responseJSON);;
      return new Promise(function (resolve) {
        resolve(taskBOs);
      })
    })
  }

  getTask(taskID) {
    return this.#fetchAdvanced(this.#getTaskURL(taskID)).then((responseJSON) => {
      let responseTaskBO = TaskBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseTaskBO);
      })
    })
  }

  addTask(taskBO) {
    return this.#fetchAdvanced(this.#addTaskURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(taskBO)
    }).then((responseJSON) => {
      let responseTaskBO = TaskBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseTaskBO);
      })
    })

  }

  updateTask(taskBO) {
    return this.#fetchAdvanced(this.#updateTaskURL(taskBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(taskBO)
    }).then((responseJSON) => {

      let responseTaskBO = TaskBO.fromJSON(responseJSON)[0];

      return new Promise(function (resolve) {
        resolve(responseTaskBO);
      })
    })
  }

  deleteTask(taskID) {
    return this.#fetchAdvanced(this.#deleteTaskURL(taskID), {
      method: 'DELETE'
    }).then((responseJSON) => {

      let responseTaskBO = TaskBO.fromJSON(responseJSON)[0];

      return new Promise(function (resolve) {
        resolve(responseTaskBO);
      })
    })
  }

  getTaskbyProject(projectID) {
    return this.#fetchAdvanced(this.#getTaskbyProjectURL(projectID)).then((responseJSON) => {
      let taskBOs = TaskBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(taskBOs);
      })
    })
  }


  // TimeAccount Methoden
  getTimeAccounts() {
    return this.#fetchAdvanced(this.#getTimeAccountsURL()).then((responseJSON) => {
      let timeaccountBOs = TimeAccountBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(timeaccountBOs);
      })
    })
  }

  getTimeAccount(timeaccountID) {
    return this.#fetchAdvanced(this.#getTimeAccountURL(timeaccountID)).then((responseJSON) => {
      let responseTimeAccountBO = TimeAccountBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseTimeAccountBO);
      })
    })
  }

  getUserbyProject(projectID) {
    return this.#fetchAdvanced(this.#getUserbyProjectURL(projectID)).then((responseJSON) => {
      let userBOs = UserBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(userBOs);
      })
    })
  }

  addTimeAccount(timeaccountBO) {
    return this.#fetchAdvanced(this.#addTimeAccountURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(timeaccountBO)
    }).then((responseJSON) => {
      let responseTimeAccountBO = TimeAccountBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseTimeAccountBO);
      })
    })

  }

  updateTimeAccount(timeaccountBO) {
    return this.#fetchAdvanced(this.#updateTimeAccountURL(timeaccountBO.getID()), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(timeaccountBO)
    }).then((responseJSON) => {

      let responseTimeAccountBO = TimeAccountBO.fromJSON(responseJSON)[0];

      return new Promise(function (resolve) {
        resolve(responseTimeAccountBO);
      })
    })
  }

  // Posting Methoden
  searchPostingByUser(userID) {
    return this.#fetchAdvanced(this.#searchPostingByUserURL(userID)).then((responseJSON) => {
      let postingBOs = PostingBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(postingBOs);
      })
    })
  }

  getPostingbyProject(projectID) {
    return this.#fetchAdvanced(this.#getPostingbyProjectURL(projectID)).then((responseJSON) => {
      let postingBOs = PostingBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(postingBOs);
      })
    })
  }

  // Interval Methoden
  getInterval(intervalID) {
    return this.#fetchAdvanced(this.#getIntervalURL(intervalID)).then((responseJSON) => {
      let responseIntervalBO = IntervalBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseIntervalBO);
      })
    })
  }

  addInterval(intervalBO) {
    return this.#fetchAdvanced(this.#addIntervalURL(), {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(intervalBO)
    }).then((responseJSON) => {
      let responseIntervalBO = IntervalBO.fromJSON(responseJSON)[0];
      return new Promise(function (resolve) {
        resolve(responseIntervalBO);
      })
    })
  }

  deleteInterval(intervalID) {
    return this.#fetchAdvanced(this.#deleteIntervalURL(intervalID), {
      method: 'DELETE'
    }).then((responseJSON) => {

      let responseIntervalBO = IntervalBO.fromJSON(responseJSON)[0];

      return new Promise(function (resolve) {
        resolve(responseIntervalBO);
      })
    })
  }

  getIntervalbyProject(projectID) {
    return this.#fetchAdvanced(this.#getIntervalbyProjectURL(projectID)).then((responseJSON) => {
      let intervalBOs = IntervalBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(intervalBOs);
      })
    })
  }

  getIntervalsByUser(userID) {
    return this.#fetchAdvanced(this.#getIntervalsByUserURL(userID)).then((responseJSON) => {
      let intervalBOs = IntervalBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(intervalBOs);
      })
    })
  }

  getSumIntervalsPerProject(projectID) {
    return this.#fetchAdvanced(this.#getSumIntervalsProjectURL(projectID)).then((responseJSON) => {
      let sumintervals = SumIntervalsBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(sumintervals);
      })
    })
  }

  getSumIntervalsPerUser(userID) {
    return this.#fetchAdvanced(this.#getSumIntervalsUserURL(userID)).then((responseJSON) => {
      let sumintervals = SumIntervalsBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(sumintervals);
      })
    })
  }

  getSumIntervalsPerTask(taskID) {
    return this.#fetchAdvanced(this.#getSumIntervalsTaskURL(taskID)).then((responseJSON) => {
      let sumintervals = SumIntervalsBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(sumintervals);
      })
    })
  }

  //Timedelta capacity
  getTimedelta(taskID) {
    return this.#fetchAdvanced(this.#getTimedeltaURL(taskID)).then((responseJSON) => {
      let timedelta = TimeDeltaBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(timedelta);
      })
    })
  }

  //Timedelta for Project capacity
  getTimedeltaProject(projectID) {
    return this.#fetchAdvanced(this.#getTimedeltaProjectURL(projectID)).then((responseJSON) => {
      let timedeltaProject = TimeDeltaBO.fromJSON(responseJSON);
      return new Promise(function (resolve) {
        resolve(timedeltaProject);
      })
    })
  }

}


