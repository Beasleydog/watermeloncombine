import database from "./init";
import { get, ref } from "firebase/database";

async function getStates() {
    const snapshot = await get(ref(database, "states"));
    return snapshot.val();
}
export default getStates;