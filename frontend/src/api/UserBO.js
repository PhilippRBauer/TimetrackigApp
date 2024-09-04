import BusinessObject from './BusinessObjectBO';


export default class UserBO extends BusinessObject {

  constructor(aFirstname, aLastname, aEmail, aUsername, aProject, aGuid) {
    super();
    this.firstname = aFirstname;
    this.lastname = aLastname;
    this.email = aEmail;
    this.username = aUsername;
    this.project = aProject;
    this.guid = aGuid;
  }

  setFirstName(aFirstname) {
    this.firstname = aFirstname;
  }

  getFirstName() {
    return this.firstname;
  }

  //
  setLastName(aLastname) {
    this.lastname = aLastname;
  }

  getLastName() {
    return this.lastname;
  }

  //
  setEmail(aEmail) {
    this.email = aEmail;
  }

  getEmail() {
    return this.email;
  }

  //
  setUsername(aUsername) {
    this.username = aUsername;
  }

  getUsername() {
    return this.username;
  }

  // Project Liste Frage in BusinessObject.py
  setProject(aProject) {
    this.project = aProject;
  }

  getProject() {
    return this.project;
  }

  setGuid(aGuid) {
    this.guid = aGuid;
  }

  getGuid() {
    return this.guid;
  }

  static fromJSON(users) {
    let result = [];

    if (Array.isArray(users)) {
      users.forEach((u) => {
        Object.setPrototypeOf(u, UserBO.prototype);
        result.push(u);
      })
    } else {

      let u = users;
      Object.setPrototypeOf(u, UserBO.prototype);
      result.push(u);
    }

    return result;
  }
}