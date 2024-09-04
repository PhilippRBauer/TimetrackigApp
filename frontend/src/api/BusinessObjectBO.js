/* Basisklasse fuer alle BO's welche eine ID besitzen */

export default class BusinessObject {

    constructor() {
        this.modification_date = Date.now();
        this.id = 0;
    }

    setModificationDate(aModification) {
        this.modification_date = aModification;
    }

    getModificationDate() {
        return this.modification_date;
    }

    setID(aId) {
        this.id = aId;
    }

    getID() {
        return this.id;
    }

    // Darsellung des BO's als String 
    toString() {
        let result = '';
        for (var prop in this) {
            result += prop + ': ' + this[prop] + ' ';
        }
        return result;
    }
}