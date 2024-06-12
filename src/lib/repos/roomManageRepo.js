import { deleteRoom, getRooms } from "$lib/models/room";

/**
 * HistoryRepo class
 * @class
 * @classdesc HistoryRepo class to handle history data
 */
export class RoomManageRepo {
    /**
     * @constructs FeedBackRepo
     * @param {Array<import("$lib/models/room").Room>} rooms - Array of feedbacks
     */
    constructor(rooms = []){
        this.datas = rooms.map((room) => {
            return {
                room_id: room.room_id,
                room_name: room.roomName,
                price: room.price.toFixed(2),
                capacity: room.capacity,
                status: room.status,
                action: {
                    view: "/manage/room/form?id=" + room.room_id + "&view=true",
                    edit: "/manage/room/form?id=" + room.room_id + "&edit=true",
                    delete: deleteRoom(room.room_id),
                }
            }
        });
    }
    static async getRooms(){
        let rooms = await getRooms();
        return new RoomManageRepo(rooms).datas;
    }
}