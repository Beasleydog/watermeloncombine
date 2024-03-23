import database from './init.js';
import { ref, set, onDisconnect } from 'firebase/database';

let added = [];

function setState(id, state) {
    //Right now we only use the fruits array from the state object
    state = {
        fruits: state.fruits
    }

    //Round the position and rotation values of the balls to two decimals
    state.fruits.forEach(fruit => {
        fruit.position.x = Math.round(fruit.position.x * 100) / 100;
        fruit.position.y = Math.round(fruit.position.y * 100) / 100;
        fruit.angle = Math.round(fruit.angle * 100) / 100;

        delete fruit.velocity;
        delete fruit.hasFace;
    });

    const lastUsedName = localStorage.getItem('lastUsedName');
    state.lastUsedName = lastUsedName;

    const reference = ref(database, 'states/' + id);
    set(reference, state);

    if (!added.includes(id)) {
        added.push(id);

        onDisconnect(reference).remove();
    }
}
export default setState;