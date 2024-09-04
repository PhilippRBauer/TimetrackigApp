import BusinessObject from "./BusinessObjectBO";


export default class TimeAccountBO extends BusinessObject {


    constructor(aUser, aProject, aWorkingTime, aTask) {
        super();
        this.user = aUser;
        this.project = aProject;
        this.WorkingTime = aWorkingTime; //float
        this.task = aTask; //int
    }


    setUser(aUser) {
        this.user = aUser;
    }

    getUser() {
        return this.user;
    }

    //
    setProject(aProject) {
        this.project = aProject;
    }

    getProject() {
        return this.project;
    }

    //
    setWorkingTime(aWorkingTime) {
        this.WorkingTime = aWorkingTime;
    }

    getWorkingTime() {
        return this.WorkingTime;
    }

    //
    setTask(aTask) {
        this.task = aTask;
    }

    getTask() {
        return this.task;
    }

    static fromJSON(timeaccounts) {
        let result = [];

        if (Array.isArray(timeaccounts)) {
            timeaccounts.forEach((t) => {
                Object.setPrototypeOf(t, TimeAccountBO.prototype);
                result.push(t);
            })
        } else {

            let t = timeaccounts;
            Object.setPrototypeOf(t, TimeAccountBO.prototype);
            result.push(t);
        }

        return result;
    }

}