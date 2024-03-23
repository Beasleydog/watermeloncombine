import getStates from "./firebase/getStates";
import getState from "./firebase/getState";
import drawBodiesToCanvas from "./utils/render";
import TYPE_MAP from "./utils/typeMap";

//This design is idiotic but it works.

//Read the query params to see if we have a gameId
const urlParams = new URLSearchParams(window.location.search);
const gameId = urlParams.get("gameId");

if (gameId) {
    displaySingleState(gameId);
} else {
    displayAllStates();
}

async function displaySingleState(gameId) {
    const state = await getState(gameId);
    document.body.innerHTML = "";
    document.body.style.display = "unset";

    const container = document.createElement("div");

    const canvas = document.createElement("canvas");
    canvas.height = 777;
    canvas.width = 1366;
    canvas.lastUsedName = state.lastUsedName;
    container.appendChild(canvas);

    Object.assign(canvas.style, {
        ...(window.innerWidth * 777 / 1366 > window.innerHeight ? { height: `100vh`, width: `auto` } : { width: `100vw`, height: `auto` }),
    });

    const name = document.createTextNode(state.lastUsedName);
    container.appendChild(name);

    document.body.appendChild(container);

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

    setTimeout(() => {
        displaySingleState(gameId);
    }, 10000);
}
async function displayAllStates() {
    const states = await getStates();
    document.body.innerHTML = "";

    console.log(states);
    Object.keys(states).forEach((state) => {
        const gameId = state;
        state = states[state];


        const container = document.createElement("div");
        container.onclick = () => {
            location.replace(`?gameId=${gameId}`);
        }

        const canvas = document.createElement("canvas");
        canvas.height = 777;
        canvas.width = 1366;
        canvas.lastUsedName = state.lastUsedName;
        canvas.classList.add("littlecanvas");
        container.appendChild(canvas);

        const name = document.createTextNode(state.lastUsedName);
        container.appendChild(name);

        document.body.appendChild(container);

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