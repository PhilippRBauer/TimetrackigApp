import BusinessObject from "./BusinessObjectBO";


export default class TaskBO extends BusinessObject {

/**
   * Constructs a new TransactionBO object.
   * 
   * @param {*} aCapacity 
   * @param {*} aProject 
   * @param {*} aUser 
   * @param {*} aDescription 
   * 
   */





    constructor(aCapacity, aProject, aDescription, aUser) {
        super();
        this.capacity = aCapacity;
        this.project = aProject;
        this.user = aUser; //list
        this.description = aDescription;
    }


 

    setCapacity(aCapacity) {
        this.capacity = parseInt(aCapacity); //transferiert string to int
    }

    getCapacity() {
        return this.capacity;
    }

    
    setProject(aProject) {
        this.project = aProject;
    }

    getProject() {
        return this.project;
    }

    
    setUser(aUser) {
        this.user = aUser;
    }

    getUser() {
        return this.user;
    }

 

    setDescription(aDescription) {
        this.description = aDescription;
    }

    getDescription() {
        return this.description;
    }

    //

    static fromJSON(tasks) {
        let result = [];

        if (Array.isArray(tasks)) {
            tasks.forEach((t) => {
                Object.setPrototypeOf(t, TaskBO.prototype);
                result.push(t);
            })
        } else {

            let t = tasks;
            Object.setPrototypeOf(t, TaskBO.prototype);
            result.push(t);
        }

        return result;
    }

}