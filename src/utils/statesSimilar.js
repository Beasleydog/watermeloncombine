function statesSimilar(state1, state2) {
    //Fruit position and rotation values are extremeely procise. Round thse values and then compare to see if the overall state is similar
    state1 = {
        fruits: state1.fruits
    }
    state2 = {
        fruits: state2.fruits
    }

    state1.fruits.forEach(fruit => {
        fruit.position.x = Math.round(fruit.position.x * 100) / 100;
        fruit.position.y = Math.round(fruit.position.y * 100) / 100;
        fruit.angle = Math.round(fruit.angle * 100) / 100;

        delete fruit.velocity;
        delete fruit.hasFace;
    });

    state2.fruits.forEach(fruit => {
        fruit.position.x = Math.round(fruit.position.x * 100) / 100;
        fruit.position.y = Math.round(fruit.position.y * 100) / 100;
        fruit.angle = Math.round(fruit.angle * 100) / 100;

        delete fruit.velocity;
        delete fruit.hasFace;
    });

    return JSON.stringify(state1) == JSON.stringify(state2);
}
export default statesSimilar;