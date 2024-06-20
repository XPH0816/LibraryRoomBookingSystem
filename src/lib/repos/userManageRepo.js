import { getUsers } from "$lib/models/user"


export class userManageRepo {
    constructor(users = []) {
        this.datas = users.map(user => {
            return {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                usertype: user.type,
            }
        })
    }
    static async getUsers() {
        let users = await getUsers("user");
        return new userManageRepo(users).datas;
    }
}