import database from "./init";
import { get, ref } from "firebase/database";

const stateCache = {};

async function getState(gameId) {
    const stateUpdateNumber = await get(ref(database, `states/${gameId}/updateNumber`));
    if (stateCache[gameId]?.updateNumber === stateUpdateNumber.val()) {
        return stateCache[gameId];
    }
    console.log("getting full value");
    const snapshot = await get(ref(database, `states/${gameId}`));
    const value = snapshot.val();
    stateCache[gameId] = value;
    return value;
}

export default getState;
