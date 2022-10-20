import { IUser } from "../models/User";

class UserDTO {
    email: string;
    fullname: string;
    id: string;
    isActivated: boolean;

    constructor(model: IUser) {
        this.email = model.email;
        this.fullname = model.fullname;
        this.id = model._id;
        this.isActivated = model.isActivated;
    }
}

export { UserDTO };