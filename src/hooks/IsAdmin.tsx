import { getAuth } from "./getUserFromLocalStorage";



export function isAdmin() {

    const auth = getAuth();

    if (!auth) {
        return
    } else {
        return `${auth.user?.email}`
    }


} 