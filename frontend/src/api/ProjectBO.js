import BusinessObject from "./BusinessObjectBO";


export default class ProjectBO extends BusinessObject {

 /**
   * Constructs a new TransactionBO object.
   * 
   * @param {*} aDescription - the ID of the source account.
   * @param {*} aClient - the ID of the target account.
   * @param {*} aDuration - the amount of money to transfer.
   */
    constructor(aDescription, aClient, aDuration, aConnection) {
        super();
        this.description = aDescription;
        this.client = aClient;
        this.duration = aDuration;
        this.connection = aConnection;
        //this.user = [];
    }


/**
   * Sets a new Description.
   * 
   * @param {String} Description 
   */

    setDescription(aDescription) {
        this.description = aDescription;
    }

    getDescription() {
        return this.description;
    }

 /**
   * Sets a new Client
   * 
   * @param {*} aClinet - 
   */
    setClient(aClient) {
        this.client = aClient;
    }

    getClient() {
        return this.client;
    }

/**
   * Sets a new Nurdation
   * 
   * @param {*} aDuration - 
   */
    setDuration(aDuration) {
        this.duration = aDuration;
    }

    getDuration() {
        return this.duration;
    }

    /**
   * Sets a new Connection
   *
   * @param {*} aConnection -
   */
    setConnection(aConnection) {
        this.connection = aConnection;
    }

    getConnection() {
        return this.connection;
    }

    /*
    setUserList(usersList) {
        this.user = usersList;
    }

    getUserList() {
        return this.user;
    }
    */
   
    static fromJSON(projects) {
        let result = [];

        if (Array.isArray(projects)) {
            projects.forEach((p) => {
                Object.setPrototypeOf(p, ProjectBO.prototype);
                result.push(p);
            })
        } else {

            let p = projects;
            Object.setPrototypeOf(p, ProjectBO.prototype);
            result.push(p);
        }

        return result;
    }

}