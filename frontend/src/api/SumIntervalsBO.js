

export default class SumIntervalsBO {


    constructor(aSum) {
        this.sumintervals = aSum; 
    }


    setSum(aSum) {
        this.sumintervals = aSum;
    }

    getSum() {
        return this.sumintervals;
    }


    static fromJSON(sumintervals) {
        let result = [];

        if (Array.isArray(sumintervals)) {
            sumintervals.forEach((a) => {
                Object.setPrototypeOf(a, SumIntervalsBO.prototype);
                result.push(a);
            })
        } else {
            // Es handelt sich offenbar um ein singuläres Objekt
            let a = sumintervals;
            Object.setPrototypeOf(a, SumIntervalsBO.prototype);
            result.push(a);
        }

        return result;
    }

}