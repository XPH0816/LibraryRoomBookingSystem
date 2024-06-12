import { getRoomType } from "./store";

/**
 * 
 * @param {String} str 
 * @returns 
 */
export function SnakeCaseToCapitalized(str) {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

/**
 * 
 * @param {String|Number} price 
 * @returns 
 */
export function getPrice(price) {
    return isNaN(Number(price)) || Number(price) === 0
        ? "Free"
        : "RM " + Number(price).toFixed(2);
}

/**
 * 
 * @param {Date} time
 * @returns 
 * @description Format time to HH:MM
 */
export function formatTime(time) {
    return time.toTimeString().split(" ")[0].slice(0, -3);
}

/**
 * 
 * @param {Date} date
 * @returns
 * @description Format date to YYYY-MM-DD
 */
export function formatDate(date) {
    return date.toLocaleDateString().split("/").reverse().join("-");
}

/**
 * 
 * @param {Date} startDate
 * @param {object} duration
 * @returns 
 */
export function GetEndDateTime(startDate, duration) {
    let date = new Date(startDate);
    if (duration.month) {
        date.setMonth(date.getMonth() + duration.month);
    }
    if (duration.day) {
        date.setDate(date.getDate() + duration.day);
    }
    if (duration.hour) {
        date.setHours(date.getHours() + duration.hour);
    }
    return date;
}

/**
 * 
 * @param {Date} endDate
 * @param {object} duration
 * @returns 
 */
export function GetStartDateTime(endDate, duration) {
    let date = new Date(endDate);
    if (duration.month) {
        date.setMonth(date.getMonth() - duration.month);
    }
    if (duration.day) {
        date.setDate(date.getDate() - duration.day);
    }
    if (duration.hour) {
        date.setHours(date.getHours() - duration.hour);
    }
    return date;
}

/**
 * 
 * @param {String} date
 * @param {String} time
 * @returns 
 */
export function toDateTime(date, time) {
    return date + " " + time + ":00";
}

/**
 * 
 */
export function getMaxTime() {
    let date = new Date();
    date.setHours(20, 0, 0, 0);
    return date;
}

/**
 * @param {String} dateString if "YYYY-MM-DD" only will return false
 * @returns boolean
 */
export function isDateTimeValid(dateString) {
    if (typeof dateString !== "string") return false;
    if (dateString.match(/\d{4}-\d{2}-\d{2} \d{1,2}:\d{1,2}/g) === null) return false;
    return !isNaN(Date.parse(dateString));
}

/**
 * 
 * @param {*} value
 * @returns boolean
 */
export function isNumber(value) {
    return !isNaN(value);
}

/**
 * 
 * @param {*} value
 * @returns boolean
 */
export function isFunction(value) {
    return typeof value === "function";
}

/**
 * @param {*} value
 * @returns boolean
 */
export function isObject(value) {
    return typeof value === "object";
}

/**
 * @param {String} roomName
 * @returns boolean
 */
export function isNotHikmahRoomAndEksplorasiRoom(roomName) {
    let regex = /[a-z]*[_]room|[A-Z][a-z]* Room/g;
    if (regex.test(roomName)) {
        regex.lastIndex = 0;
        roomName = regex.exec(roomName)[0];
        if (roomName.includes(" ")) { roomName = roomName.split(" ").join("_"); }
    }
    return roomName !== "hikmah_room" && roomName !== "eksplorasi_room";
}

/**
 * @param {String} roomName
 * @returns boolean
 */
export function isFreeRoom(roomName){
    let regex = /[a-z]*[_](room|stage|lounge)|[A-Z][a-z]* (Room|Stage|Lounge)|[aA]uditorium/g;
    if (regex.test(roomName)) {
        regex.lastIndex = 0;
        roomName = regex.exec(roomName)[0];
        if (roomName.includes(" ")) { roomName = roomName.split(" ").join("_"); }
        return getRoomType().find(room => room.name === roomName).price === 0;
    }
    return false;
}

/**
 * @param {String} roomName
 * @returns boolean
 */
export function isNoRoomNumber(roomName){
    let regex = /[a-z]*[_](stage|lounge)|[A-Z][a-z]* (Stage|Lounge)|[aA]uditorium/g;
    if (regex.test(roomName)) {
        regex.lastIndex = 0;
        roomName = regex.exec(roomName)[0];
        if (roomName.includes(" ")) { roomName = roomName.split(" ").join("_"); }
        return getRoomType().find(room => room.name === roomName).price === 0;
    }
    return false;
}