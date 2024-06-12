import { getUsers } from "$lib/models/user"


export class userManageRepo {
    constructor(users = []) {
        this.datas = users.map(user => {
            return {
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