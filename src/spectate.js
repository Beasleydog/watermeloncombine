import getStates from "./firebase/getStates";
import drawBodiesToCanvas from "./utils/render";
import TYPE_MAP from "./utils/typeMap";

async function renderStates() {
    const states = await getStates();
    document.body.innerHTML = "";

    console.log(states);
    Object.keys(states).forEach((state) => {
        state = states[state];

        const canvas = document.createElement("canvas");
        canvas.height = 777;
        canvas.width = 1366;
        document.body.appendChild(canvas);

        const bodies = [];
        const RAPIER_MULTIPLIER = 100;
        state.fruits.forEach((fruit) => {
            const type = Object.assign({}, TYPE_MAP[fruit.fruitType]);

            if (type.type == "t") type.radius /= 1.9;

            bodies.push({
                position: {
                    x: fruit.position.x * RAPIER_MULTIPLIER,
                    y: fruit.position.y * RAPIER_MULTIPLIER,
                },
                radius: type.radius,
                rotation: fruit.angle,
                type: type.type,
                render: type,
                hasFace: !type.img,
                isSad: fruit.sad,
            });
        });

        const ctx = canvas.getContext("2d");
        drawBodiesToCanvas(ctx, bodies, 0, 0);


    });
}

setInterval(renderStates, 1000);