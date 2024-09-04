import BusinessObject from "./BusinessObjectBO";


export default class PostingBO extends BusinessObject {


    constructor(aUser, aProjectID, aTaskID) {
        super();
        this.user = aUser;  //Festlegen der Person, welche die Zeit im System erfasst
        this.project_id = aProjectID;
        this.task_id = aTaskID;
    }


    setUser(aUser) {
        this.user = aUser;
    }

    getUser() {
        return this.user;
    }

    setProjectID(aProjectID) {
        this.project_id = aProjectID;
    }

    getProjectID() {
        return this.project_id;
    }

    setTaskID(aTaskID) {
        this.task_id = aTaskID;
    }

    getTaskID() {
        return this.task_id;
    }



    static fromJSON(postings) {
        let result = [];

        if (Array.isArray(postings)) {
            postings.forEach((a) => {
                Object.setPrototypeOf(a, PostingBO.prototype);
                result.push(a);
            })
        } else {
            // Es handelt sich offenbar um ein singuläres Objekt
            let a = postings;
            Object.setPrototypeOf(a, PostingBO.prototype);
            result.push(a);
        }

        return result;
    }

}