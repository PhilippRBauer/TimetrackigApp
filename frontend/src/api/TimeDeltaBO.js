

export default class TimeDeltaBO {


    constructor(aDelta, aDeltaProject) {
        this.timedelta = aDelta;
        this.timedeltaProject = aDeltaProject; 
    }


    setSum(aDelta) {
        this.timedelta = aDelta;
    }

    getSum() {
        return this.timedelta;
    }

    setSumProject(aDeltaProject) {
        this.timedeltaProject = aDeltaProject;
    }

    getSumProject() {
        return this.timedeltaProject;
    }


    static fromJSON(timedelta) {
        let result = [];

        if (Array.isArray(timedelta)) {
            timedelta.forEach((a) => {
                Object.setPrototypeOf(a, TimeDeltaBO.prototype);
                result.push(a);
            })
        } else {
            // Es handelt sich offenbar um ein singuläres Objekt
            let a = timedelta;
            Object.setPrototypeOf(a, TimeDeltaBO.prototype);
            result.push(a);
        }

        return result;
    }

}