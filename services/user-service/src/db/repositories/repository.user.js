import {database} from "@irctc/database";
import {users} from "../schemas/schema.user.js";
import { eq } from "drizzle-orm";

/**
 * @class UserRepository
 * @method find_uesr_by_email 
 *      @returns find the user profile using email and returns
 */

class UserReposiroty {
    constructor() {
        // safe
    }

    // return the profile of the user using email id
    static find_uesr_by_email(email) {
        return database.select().from(user_schema).where(eq(users.email, email)).limit(1);
    }
}

export default UserRepository;