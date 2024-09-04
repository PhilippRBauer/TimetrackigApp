import PostingBO from "./PostingBO";


export default class EventBO extends PostingBO {


    constructor() {
        super();
        this.time = Date.now();
        this.type = aType;
    }


    setTime(aTime) {
        this.time = aTime;
    }

    getTime() {
        return this.time;
    }


    setType(aType) {
        this.type = aType;
    }

    getType() {
        return this.type;
    }

    // JSON Objekt  'event' wird übergeben 
    static fromJSON(events) {
        let result = [];

        // sind es mehrere event objekte ? -> also ist es ein array 
        if (Array.isArray(events)) {
            events.forEach((a) => {
                // wenn ja wird für jedes event objekt der Prototype EventBO gesetzt
                // d.h. man kann über die get und set methoden auf die grundlegende objektstruktur zugreifen
                Object.setPrototypeOf(a, EventBO.prototype);
                result.push(a);
            })
        } else {
            // wenn es ein siguläres objekt ist also kein array wird trotzdem der prototype gesetzt und es wird in result gespeichert
            let a = events;
            Object.setPrototypeOf(a, EventBO.prototype);
            result.push(a);
        }

        return result;
    }

}