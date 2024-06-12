import { getDB } from "$lib/db";
import { toDateTime } from "$lib/helper";

export class Room {
    constructor({ room_id = null, room_number, type, price, capacity, location, status = "available", roomName = room_number == 0 ? type : type + "_" + room_number }) {
        this.room_id = room_id;
        this.room_number = room_number;
        this.roomName = roomName;
        this.type = type;
        this.price = price / 100;
        this.capacity = capacity;
        this.location = location;
        this.status = status;
    }

    async save() {
        let db = await getDB();
        let query = `INSERT INTO room (room_number, type, price, capacity, location, status) VALUES (?, ?, ?, ?, ?, ?)`;
        let result = await db.execute(query, [this.room_number, this.type, this.price * 100, this.capacity, this.location, this.status]);
        this.room_id = result.lastInsertId;
        return result.rowsAffected === 1;
    }

    static async create({ room_number, type, price, capacity, location, status = "available" }) {
        let room = new Room({ room_number, type, price: price * 100, capacity, location, status });
        let result = await room.save();
        return result ? room : null;
    }

    async update() {
        let db = await getDB();
        let query = `UPDATE room SET room_number = ?, type = ?, price = ?, capacity = ?, location = ?, status = ? WHERE room_id = ?`;
        let result = await db.execute(query, [this.room_number, this.type, this.price * 100, this.capacity, this.location, this.status, this.room_id]);
        return result.rowsAffected === 1;
    }

    async delete() {
        let db = await getDB();
        let query = `DELETE FROM room WHERE room_id = ?`;
        let result = await db.execute(query, [this.room_id]);
        return result.rowsAffected === 1;
    }

    static async checkRoomExist(type, room_number) {
        let db = await getDB();
        let query = `SELECT room_id FROM room WHERE type = ? AND room_number = ? LIMIT 1`;
        let result = await db.select(query, [type, room_number]);
        return result.length > 0;
    }
}

/**
 * @returns {Promise<Array<{name: String}>>}
 */
export async function getRoomTypes() {
    let db = await getDB();
    let query = "SHOW COLUMNS FROM room WHERE Field = 'type'";
    let result = await db.select(query);
    return result[0].Type.match(/'([^']+)'/g).map((v) => { name: v.slice(1, -1) });
}
/**
 * @returns {Promise<Array<Room>>}
 */
export async function getRooms() {
    let db = await getDB();
    let query = `SELECT * FROM room`;
    let result = await db.select(query);
    return result.map((room) => new Room(room));
}

/**
 * 
 * @param {String} type 
 * @returns 
 */
export async function getRoomsByType(type) {
    let db = await getDB();
    let query = `SELECT room_id, room_number FROM room WHERE type = ?`;
    let result = await db.select(query, [type]);
    return result.map((room) => new Room(room));
}

/**
 * 
 * @param {Number} id
 * @returns {Promise<Room>}
 */
export async function getRoomById(id) {
    let db = await getDB();
    let query = `SELECT * FROM room WHERE room_id = ?`;
    let result = await db.select(query, [id]);
    return new Room(result.pop());
}

/**
 * 
 * @param {String} type
 * @param {String} searchDate
 * @param {String} searchTime
 * @returns {Promise<Array<Room>>}
 */
export async function getAvaliableRoomsByType(type, searchDate, searchTime) {
    let searchDateTime = toDateTime(searchDate, searchTime);
    let db = await getDB();
    let query = `SELECT room_id, type, room_number FROM room WHERE type = ? AND status != "maintenance" AND room_id NOT IN (SELECT room_id FROM booking WHERE start_datetime <= ? AND end_datetime >= ?)`;
    let result = await db.select(query, [type, searchDateTime, searchDateTime]);
    return result.map((room) => new Room(room));
}

/**
 * 
 * @param {Array<Number>} ids
 * @returns {Promise<Array<{Room}>>} 
 */
export async function getRoomNameByIds(ids) {
    let db = await getDB();
    let query = `SELECT room_id, type, room_number, price FROM room WHERE room_id IN (${ids.join(",")})`;
    let result = await db.select(query);
    return result.map((room) => new Room(room));
}

export function deleteRoom(id) {
    return async () => {
        let db = await getDB();
        let query = `DELETE FROM room WHERE room_id = ?`;
        let result = await db.execute(query, [id]);
        return result.rowsAffected === 1;
    }
}

export function maintenanceRoom(id) {
    return async () => {
        let db = await getDB();
        let query = `UPDATE room SET status = "maintenance" WHERE room_id = ?`;
        let result = await db.execute(query, [id]);
        return result.rowsAffected === 1;
    }
}

export function availableRoom(id) {
    return async () => {
        let db = await getDB();
        let query = `UPDATE room SET status = "available" WHERE room_id = ?`;
        let result = await db.execute(query, [id]);
        return result.rowsAffected === 1;
    }
}