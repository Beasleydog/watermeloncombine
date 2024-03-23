import database from "./init";
import { get, ref } from "firebase/database";

async function getState(gameId) {
    const snapshot = await get(ref(database, `states/${gameId}`));
    return snapshot.val();
}

export default getState;
