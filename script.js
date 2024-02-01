(async () => {
    let gameRunning = false;
    let gameHidden = false;
    let canvas, score;
    //Listen for ctrl+alt+shift+g
    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.altKey && e.shiftKey && e.key === "G") {
            if (gameRunning) {
                toggleGame();
            } else {
                startGame();
            }
        }
    });
    function toggleGame() {
        gameHidden = !gameHidden;

        if (gameHidden) {
            canvas.style.display = "none";
            score.style.display = "none";
        } else {
            canvas.style.display = "block";
            score.style.display = "block";
        }
    }
    async function startGame() {
        gameRunning = true;

        const DROP_HEIGHT = 30;
        const DROP_MIN_INTERVAL = 1000;

        //Import matter.js
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js";
        document.head.appendChild(script);

        //Create fullscreen transparent canvas
        canvas = document.createElement("canvas");
        Object.assign(canvas.style, {
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999999,
        });
        document.body.appendChild(canvas);

        let scoreCount = 0;
        score = document.createElement("div");
        Object.assign(score.style, {
            position: "fixed",
            top: "5px",
            left: "20px",
            zIndex: 999999,
            userSelect: "none",
            fontSize: "40px",
            fontWeight: "bold"
        });
        score.innerText = scoreCount;
        document.body.appendChild(score);

        await new Promise((resolve) => {
            script.onload = resolve;
        });

        // module aliases
        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite;

        // create an engine
        var engine = Engine.create();

        // create a renderer
        var render = Render.create({
            canvas: canvas,
            engine: engine,
            options: {
                height: window.innerHeight,
                width: window.innerWidth,
                background: "#ffffff75",
                wireframes: false,
            }
        });



        //Create constraints
        var ground = Bodies.rectangle(0 + window.innerWidth / 2, window.innerHeight + 100, window.innerWidth, 200, { isStatic: true });
        ground.friction = 0;
        var leftWall = Bodies.rectangle(-100, window.innerHeight / 2, 200, window.innerHeight, { isStatic: true });
        var rightWall = Bodies.rectangle(window.innerWidth + 100, window.innerHeight / 2, 200, window.innerHeight, { isStatic: true });
        Composite.add(engine.world, [ground, leftWall, rightWall]);



        // run the renderer
        Render.run(render);
        // create runner
        var runner = Runner.create();
        // run the engine
        Runner.run(runner, engine);


        const TYPE_MAP = {
            red: {
                color: "red",
                radius: 10
            },
            blue: {
                color: "blue",
                radius: 30
            },
            aqua: {
                color: "#00FFFF",
                radius: 60
            },
            green: {
                color: "green",
                radius: 80
            },
            yellow: {
                color: "yellow",
                radius: 100
            },
            purple: {
                color: "purple",
                radius: 120
            },
            orange: {
                color: "orange",
                radius: 150
            },
            pink: {
                color: "pink",
                radius: 170
            },
            brown: {
                color: "brown",
                radius: 190
            },
            black: {
                color: "black",
                radius: 220
            },
            pearl: {
                color: "#FCDFFF",
                radius: 280
            }

        }
        function nextType(currentType) {
            const typeArray = Object.keys(TYPE_MAP);
            const currentIndex = typeArray.indexOf(currentType);
            return typeArray[currentIndex + 1];
        }

        function addFruit(type, x, y) {
            const color = TYPE_MAP[type].color;
            const body = Bodies.circle(x, y, TYPE_MAP[type].radius);
            setFruitStyle(body, type);
            body.fruitType = type;
            body.restitution = 0.9;
            body.friction = 0.1;
            body.hitYet = false;
            Composite.add(engine.world, [body]);
        }

        function setNextDropFruit() {
            let modifier = Math.max(Math.round(6 - drops / 100), 3);
            nextDropType = Object.keys(TYPE_MAP)[Math.floor(Math.pow(Math.random(), modifier) * Object.keys(TYPE_MAP).length / 2)];

            setFruitStyle(displayFruit, nextDropType);
        }

        function setFruitStyle(body, type) {
            const color = TYPE_MAP[type].color;
            body.render.fillStyle = color;
            body.render.strokeStyle = color;

            body.circleRadius = TYPE_MAP[type].radius;
        }

        function updateScore(newScore) {
            scoreCount = newScore;
            score.innerText = scoreCount;
        }

        function clearBalls() {
            engine.world.gravity.y = 0;
            lastTooHigh = Number.MAX_VALUE;
            let ci = setInterval(() => {
                let fruit = engine.world.bodies.filter(x => x.fruitType);
                if (fruit.length == 0) {
                    engine.world.gravity.y = 1;
                    lastTooHigh = -1;
                    clearInterval(ci);
                } else {
                    Composite.remove(engine.world, fruit[Math.floor(Math.random() * fruit.length)]);
                }
            }, 30);
        }

        Matter.Events.on(engine, 'collisionStart', function (event) {
            var pairs = event.pairs;
            pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                if (bodyA.fruitType) bodyA.hitYet = true;
                if (bodyB.fruitType) bodyB.hitYet = true;

                if (bodyA.fruitType && bodyB.fruitType && bodyA.fruitType === bodyB.fruitType) {
                    //Handle fruit upgrades

                    const averageX = (bodyA.position.x + bodyB.position.x) / 2;
                    const averageY = (bodyA.position.y + bodyB.position.y) / 2;

                    const newType = nextType(bodyA.fruitType);

                    addFruit(newType, averageX, averageY);

                    updateScore(scoreCount + Object.keys(TYPE_MAP).indexOf(bodyA.fruitType) + 1);

                    Composite.remove(engine.world, bodyA);
                    Composite.remove(engine.world, bodyB);
                }
            });
        });


        const topSensor = Bodies.rectangle(window.innerWidth / 2, DROP_HEIGHT * 2, window.innerWidth, 10, {
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: "rgb(0, 0, 0)"
            }
        });
        topSensor.death = true;
        Composite.add(engine.world, [topSensor]);

        //Create fruit that ignores gravity and follows mouseX
        const displayFruit = Bodies.circle(window.innerWidth / 2, DROP_HEIGHT, 10, {
            isStatic: true,
            isSensor: true,
        });
        Composite.add(engine.world, [displayFruit]);
        let mouseX = window.innerWidth / 2;

        let nextDropType = "red";
        setFruitStyle(displayFruit, nextDropType);

        let lastDropTime = 0;
        let drops = 0;

        canvas.onmousemove = (e) => {
            mouseX = e.clientX;
            displayFruit.position.x = mouseX;
        }
        canvas.onclick = (e) => {
            if (Date.now() - lastDropTime < DROP_MIN_INTERVAL) return;
            lastDropTime = Date.now();

            drops++;
            addFruit(nextDropType, mouseX, DROP_HEIGHT);
            setNextDropFruit();

            displayFruit.position.y = -999;
            setTimeout(() => {
                displayFruit.position.y = DROP_HEIGHT;
            }, DROP_MIN_INTERVAL);
        }

        let lastTooHigh = -1;
        setInterval(() => {
            //Loop through all bodies and check if any have a y value higher than topSensor
            let tooHighs = engine.world.bodies.filter((body) => {
                if (!body.hitYet) return false;
                let tooHigh = body.position.y < topSensor.position.y && body.fruitType;
                if (tooHigh) {
                    if (lastTooHigh != -1) {

                        let max = 3000;
                        let current = Date.now() - lastTooHigh;

                        topSensor.render.fillStyle = `rgb(${current / max * 255},0,0)`;

                        if (current > max) {
                            alert("Game Over! Score: " + scoreCount);

                            updateScore(0);
                            clearBalls();
                            drops = 0;

                            return;
                        }
                    } else {
                        lastTooHigh = Date.now();
                    }
                }
                return tooHigh
            });
            if (tooHighs.length == 0) {
                lastTooHigh = -1;
                topSensor.render.fillStyle = "rgb(0,0,0)";
            }
        }, 10);
    }
})();
