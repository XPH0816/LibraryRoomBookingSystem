import { formatDate, formatTime, isNotHikmahRoomAndEksplorasiRoom, toDateTime } from "$lib/helper";
import { Room, getAvaliableRoomsByType } from "$lib/models/room";

/**
 * HistoryRepo class
 * @class
 * @classdesc HistoryRepo class to handle history data
 */
export class SearchRepo {
    /**
     * @param {Array<Room>} rooms - Array of rooms
     * @param {String} searchDate - Search date
     * @param {String} searchTime - Search time
     */
    constructor(rooms = [], searchDate, searchTime) {
        let date = new Date(toDateTime(searchDate, searchTime));
        this.datas = rooms.map((room) => {
            return !isNotHikmahRoomAndEksplorasiRoom(room.type) ?
                {
                    room: room.roomName,
                    date: formatDate(date),
                    time: formatTime(date),
                    action: {
                        book: `/booking/room?id=${room.room_id}&datetime=${date.getTime()}`
                    }
                } : {
                    room: room.roomName,
                    date: formatDate(date),
                    action: {
                        book: `/booking/room?id=${room.room_id}&datetime=${date.getTime()}`
                    }
                }
        });
    }
    static async getSearchResult(type, searchDate, searchTime) {
        let rooms = await getAvaliableRoomsByType(type, searchDate, searchTime);
        return new SearchRepo(rooms, searchDate, searchTime).datas;
    }
}