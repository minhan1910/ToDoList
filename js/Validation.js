export default class Validation {
    checkEmpty(value, message) {
        if(value.trim() == "") {
            alert(message);
            return false;
        }
        return true;
    }
}