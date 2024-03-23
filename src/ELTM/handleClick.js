import applyAir from "./air";
import waterify from "./water";
function handleClick(e, game, canvas, activePowerup) {
    const RAPIER_MULTIPLIER = game.RAPIER_MULTIPLIER;
    const clickPos = {
        x: e.clientX,
        y: e.clientY
    }
    clickPos.x = (clickPos.x - canvas.getBoundingClientRect().left) / canvas.getBoundingClientRect().width * canvas.width
    clickPos.y = (clickPos.y - canvas.getBoundingClientRect().top) / canvas.getBoundingClientRect().height * canvas.height

    const FRUITS = game.allFruit();

    const FRUIT_CLICKED = FRUITS.find(fruit => {
        const fruitPosition = fruit.rigidBody.translation();

        fruitPosition.x *= RAPIER_MULTIPLIER;
        fruitPosition.y *= RAPIER_MULTIPLIER;



        const fruitRadius = fruit.circleRadius;


        const distance = Math.sqrt((clickPos.x - fruitPosition.x) ** 2 + (clickPos.y - fruitPosition.y) ** 2);

        console.log(fruitPosition, fruitRadius, clickPos, distance);


        return distance < fruitRadius;
    });
    console.log("CLICKED", FRUIT_CLICKED, activePowerup);
    if (FRUIT_CLICKED) {
        switch (activePowerup.name) {
            case "fire":
                break;
            case "water":
                waterify(FRUIT_CLICKED, game);
                break;
            case "wind":
                applyAir(FRUIT_CLICKED, game);
                break;
            case "ground":
                break;
            default:
                break;
        }
    }
}
export default handleClick;