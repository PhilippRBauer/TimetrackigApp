import PostingBO from "./PostingBO";


export default class IntervalBO extends PostingBO {


    constructor(aIntervall, aVon, aBis) {
        super();
        this.von = aVon;
        this.bis = aBis;
        this.intervall = aIntervall;
    }


    setVon(aVon) {
        this.von = aVon;
    }

    getVon() {
        return this.von;
    }


    setBis(aBis) {
        this.bis = aBis;
    }

    getBis() {
        return this.bis;
    }


    setInterval(aIntervall) {
        this.intervall = aIntervall;
    }

    getInterval() {
        return this.intervall;
    }


    static fromJSON(intervals) {
        let result = [];

        if (Array.isArray(intervals)) {
            intervals.forEach((a) => {
                Object.setPrototypeOf(a, IntervalBO.prototype);
                result.push(a);
            })
        } else {

            let a = intervals;
            Object.setPrototypeOf(a, IntervalBO.prototype);
            result.push(a);
        }
    
        return result;
    }

}