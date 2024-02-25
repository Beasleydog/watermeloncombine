function CombineGame(canvas, extraOptions) {
    //Prevent hacking of global stuff
    const setTimeout = window.setTimeout;
    const setInterval = window.setInterval;
    const clearInterval = window.clearInterval;

    //Define some constants(ish)
    const TYPE_MAP = {
        red: {
            fillStyle: "red",
            radius: 12,
            type: "c"
        },
        blue: {
            fillStyle: "blue",
            radius: 45,
            type: "c"
        },
        aqua: {
            fillStyle: "#00FFFF",
            radius: 75,
            type: "c"
        },
        green: {
            fillStyle: "green",
            radius: 100,
            type: "c"
        },
        yellow: {
            fillStyle: "yellow",
            radius: 130,
            type: "c"
        },
        purple: {
            fillStyle: "purple",
            radius: 155,
            type: "c"
        },
        orange: {
            fillStyle: "orange",
            radius: 185,
            type: "c"
        },
        pink: {
            fillStyle: "pink",
            radius: 200,
            type: "c"
        },
        brown: {
            fillStyle: "brown",
            radius: 215,
            type: "c"
        },
        black: {
            fillStyle: "black",
            radius: 260,
            shadowBlur: 80,
            effect: "pulse",
            type: "c",
            hasStroke: true
        },
        r: {
            fillStyle: "r",
            radius: 50,
            shadowBlur: 200,
            effect: "dance",
            type: "c"
        },
        t: {
            fillStyle: "white",
            strokeStyle: "#cccccc",
            hasStroke: true,
            lineWidth: 5,
            radius: 80,
            type: "t",
            spawnSpin: .1
        }
    };
    const GLOBAL_COLLISION = {
        group: 1,
    }
    const SCREEN_WIDTH = 1366;
    const SCREEN_HEIGHT = 777;
    const DEFAULT_DROP_HEIGHT = 30;
    let DROP_HEIGHT = DEFAULT_DROP_HEIGHT;
    let DROP_MIN_INTERVAL = 500;
    let MOUSE_X = SCREEN_WIDTH / 2;
    let CURRENT_TYPE;
    let NEXT_TYPE;
    let RNG_SEED = Math.random() * 10000000;
    let LAST_DROP_TIME = 0;
    let CAN_DIE = true;
    const GAME_ID = Math.random().toString(36).substring(7);
    let DROPS = 0;
    let MINIMIZE_DUPLICATES = false;
    let RANDOMS_GENERATED = 0;
    let SCORE = 0;
    let BODIES = [];
    let FRUITS = [];
    let LAST_TIME_TOO_HIGH = -1;
    const LEADERBOARD_URL = "https://script.google.com/macros/s/AKfycbw6iTqt_fyO5OtTZ9de3pZUEglgvTH9tlVxkiPmlpkjaRpoqz0vn8IK_CddqT3F3OLsTw/exec";

    this.loadExtraOptions = (options) => {
        extraOptions = options;
    }

    function RNG(seed) {
        var m = 2 ** 35 - 31
        var a = 185852
        var s = seed % m
        return function () {
            return (s = s * a % m) / m
        }
    }
    let randFunction = RNG(RNG_SEED);
    function seededRandom() {
        RANDOMS_GENERATED++;
        let returnValue = randFunction();
        return returnValue;
    }
    this.setSeed = (seed) => {
        RNG_SEED = seed;
        resetRandom();
    }
    this.setMinimalDuplicates = (bool) => {
        console.log("setting to ", bool)
        MINIMIZE_DUPLICATES = bool;
    }
    function resetRandom() {
        randFunction = RNG(RNG_SEED);
        RANDOMS_GENERATED = 0;
    }
    const Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite,
        Body = Matter.Body;

    //Create engine
    const engine = Engine.create();
    engine.positionIterations = 10;
    engine.velocityIterations = 20;

    //Create runner for engine. This runner will be updated in the tick function later
    const runner = Runner.create();
    Runner.run(runner, engine);

    //Rendering stuff
    const ctx = canvas?.getContext("2d");

    const renderFunction = () => {
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        const firstBodies = BODIES.filter(body => body.renderFirst);
        const laterBodies = BODIES.filter(body => !body.renderFirst);

        drawBodiesToCanvas(firstBodies);
        drawBodiesToCanvas(laterBodies);
    }
    function applyBodyStylesToCanvas(body) {
        const RAINBOW_COLOR = `hsl(${(Date.now() / 5) % 360}, 100%, 50%)`;
        let fill = body.render.fillStyle;
        if (fill === "r") fill = RAINBOW_COLOR;

        //Apply basic styles
        ctx.fillStyle = fill;
        ctx.strokeStyle = body.render.strokeStyle;
        ctx.lineWidth = body.render.lineWidth || 0;
        ctx.shadowColor = body.render.shadowColor || ctx.fillStyle;
        ctx.shadowBlur = body.render.shadowBlur;
        ctx.globalAlpha = body.render.opacity;

        //Apply effects
        if (body.render.effect === "pulse") {
            //Apply pulsing shadow
            let blurAmount = body.render.shadowBlur;
            ctx.shadowBlur = blurAmount
                ? blurAmount *
                (Math.abs(((Date.now() / 50) % blurAmount) - blurAmount / 2) /
                    blurAmount)
                : 0;
        }
        if (body.render.effect === "dance") {
            //Make offset move in a circle
            const offset = 50;
            const x = Math.cos(Date.now() / 500) * offset;
            const y = Math.sin(Date.now() / 500) * offset;
            ctx.shadowOffsetX = x;
            ctx.shadowOffsetY = y;
        }

    }
    const drawBodiesToCanvas = (bodies) => {
        bodies.forEach(body => {
            ctx.save();
            ctx.beginPath();

            applyBodyStylesToCanvas(body);

            switch (body.specialRenderType) {
                case "text":
                    ctx.font = "30px Arial";
                    ctx.fillText(
                        body.text,
                        body.position.x,
                        body.position.y
                    );
                    break;
                case "circle":
                    ctx.arc(
                        body.position.x,
                        body.position.y,
                        body.circleRadius,
                        0,
                        2 * Math.PI
                    );
                    ctx.fill();
                    break;
                default:
                    ctx.moveTo(body.vertices[0].x, body.vertices[0].y);
                    for (let j = 1; j < body.vertices.length; j++) {
                        ctx.lineTo(body.vertices[j].x, body.vertices[j].y);
                    }
                    ctx.lineTo(body.vertices[0].x, body.vertices[0].y);
                    ctx.fill();
                    break;
            }
            ctx.closePath();
            if (body.render.hasStroke) {
                ctx.stroke();
            }
            ctx.restore();
        });
    }



    this.tick = () => {
        //Update engine 
        // Engine.update(engine, 1000 / 60);

        BODIES = Composite.allBodies(engine.world);
        FRUITS = BODIES.filter(body => body.fruitType);
        FRUITS.forEach(body => {
            //Ensure balls don't go offscreen
            if (body.position.y > SCREEN_HEIGHT + 100) {
                Body.setPosition(body, {
                    x: SCREEN_WIDTH / 2,
                    y: SCREEN_HEIGHT / 2
                });
                Body.setVelocity(body, { x: 0, y: 0 });
            }
        });


        if (CAN_DIE) {
            //Loop through all bodies and check if any have a y value higher than topSensor
            let tooHighs = FRUITS.filter((body) => {
                if (!body.hitYet) return false;

                //If the body has enough velocity, ignore it
                if (Math.sqrt(Math.pow(body.velocity.y, 2) + Math.pow(body.velocity.x), 2) > 3) return false;
                if (Math.abs(body.velocity.y) + Math.abs(body.velocity.x) > 3) return false;

                let tooHigh = body.position.y + body.circleRadius < topSensor.position.y;
                if (tooHigh) {
                    if (LAST_TIME_TOO_HIGH != -1) {
                        let max = 3000;
                        let current = Date.now() - LAST_TIME_TOO_HIGH;

                        if (canvas) topSensor.render.fillStyle = `rgb(${(current / max) * 255},0,0)`;

                        if (current > max && CAN_DIE) {
                            gameOver();

                            return;
                        }
                    } else {
                        LAST_TIME_TOO_HIGH = Date.now();
                    }
                }
                return tooHigh;
            });
            if (tooHighs.length == 0) {
                LAST_TIME_TOO_HIGH = -1;
                topSensor.render.fillStyle = "rgb(0,0,0)";
            }
        }
    }

    this.loop = () => {
        this.tick();
        if (canvas) renderFunction();

        requestAnimationFrame(this.loop);
    }
    function clearBallsAnimation(callback) {
        engine.world.gravity.y = 0;
        LAST_TIME_TOO_HIGH = Number.MAX_VALUE;
        CAN_DIE = false;
        let ci = setInterval(() => {
            if (FRUITS.length == 0) {
                engine.world.gravity.y = 1;
                LAST_TIME_TOO_HIGH = -1;
                CAN_DIE = true;
                clearInterval(ci);
                if (callback) callback();
            } else {
                Composite.remove(
                    engine.world,
                    FRUITS[Math.floor(Math.random() * FRUITS.length)]
                );
            }
        }, 15);
    }

    function resetToDefaultValues() {
        CURRENT_TYPE = "red";
        NEXT_TYPE = "red";
        DROPS = 0;
        SCORE = 0;
        LAST_DROP_TIME = 0;
        CAN_DIE = true;

        resetRandom();
        //Remove all bodies
        FRUITS.forEach((fruit) => {
            Composite.remove(engine.world, fruit);
        });
        FRUITS = [];
        BODIES = Composite.allBodies(engine.world);

        updateCurrentAndNextType();
        if (canvas) setFruitStyle(displayFruit, CURRENT_TYPE);

    }
    this.resetToDefaultValues = resetToDefaultValues;
    function gameOver() {
        extraOptions?.onGameOver?.(SCORE);

        clearBallsAnimation(() => {
            resetToDefaultValues();
        });
    }
    function nextType(currentType) {
        const typeArray = Object.keys(TYPE_MAP);
        const currentIndex = typeArray.indexOf(currentType);
        return typeArray[currentIndex + 1];
    }
    function updateCurrentAndNextType() {
        CURRENT_TYPE = NEXT_TYPE;

        let sameCount = 4;
        let modifier = Math.max(Math.round(6 - DROPS / 100), 3);

        if (MINIMIZE_DUPLICATES) {
            while (sameCount > 0) {
                let random = seededRandom();
                NEXT_TYPE =
                    Object.keys(TYPE_MAP)[
                    Math.floor(
                        (Math.pow(random, modifier) * Object.keys(TYPE_MAP).length) / 2
                    )
                    ];
                if (NEXT_TYPE === CURRENT_TYPE) {
                    sameCount--;
                } else {
                    sameCount = 0;
                }

                if (NEXT_TYPE === Object.keys(TYPE_MAP)[0]) {
                    sameCount = 0;
                }
            }
        } else {
            let random = seededRandom();
            NEXT_TYPE =
                Object.keys(TYPE_MAP)[
                Math.floor(
                    (Math.pow(random, modifier) * Object.keys(TYPE_MAP).length) / 2
                )
                ];
        }

        constrainMouseX();
    }
    function mergeAllFruitsEffect() {
        var num = -1;

        //Disable gravity
        engine.world.gravity.y = 0;
        CAN_DIE = false;

        let cleanup = () => {
            //Get all matterjs objects and set their collision filter to 1
            engine.world.bodies.forEach((x) => {
                x.collisionFilter = GLOBAL_COLLISION;
            });

            //Re-enable gravity
            engine.world.gravity.y = 1;
            CAN_DIE = true;
        }
        let merge = () => {
            //Kill all velocities
            engine.world.bodies.forEach((x) => {
                x.velocity.x = 0;
                x.velocity.y = 0;
            });

            let fruitOfNum = [];
            while (fruitOfNum.length <= 1) {
                num++;
                fruitOfNum = FRUITS.filter((x) => x.fruitTypeNumber == num);
                //If num is more than the highest fruit type, end the loop
                //Length is 12, stop at 11 so we dont merge the last one
                if (num > 10) {
                    cleanup();
                    return;
                }
            }
            // Loop through fruitOfNum
            let mergesExpected = Math.floor(fruitOfNum.length / 2);
            let mergesSoFar = 0;
            for (var i = 0; i < fruitOfNum.length - 1; i += 2) {
                var body1 = fruitOfNum[i];
                var body2 = fruitOfNum[i + 1];

                //Ensure that body2 is the lower one
                if (body1.position.y > body2.position.y) {
                    let temp = body1;
                    body1 = body2;
                    body2 = temp;
                }

                //Use collision filters to only make fruit of the same type merge
                var collisionFilter = {
                    group: Math.random() * 100000
                };
                body1.collisionFilter = collisionFilter;
                body2.collisionFilter = collisionFilter;

                var position1 = body1.position;
                var position2 = body2.position;
                let distance = Math.sqrt(Math.pow(position2.x - position1.x, 2) + Math.pow(position2.y - position1.y, 2));
                var speed = .00005 * body1.mass * distance;

                //Using trig, find the force to apply to body1 to make it move towards body2
                let angle = Math.atan2(position2.y - position1.y, position2.x - position1.x);
                let xComp = Math.cos(angle) * speed;
                let yComp = Math.sin(angle) * speed;

                var force = {
                    x: xComp,
                    y: yComp
                }

                Body.applyForce(body1, body1.position, force)

                let backup = setTimeout(() => {
                    //if the bodies havnt merged yet, just remove them
                    if (!body1.merged) Composite.remove(engine.world, body1);
                    if (!body2.merged) Composite.remove(engine.world, body2);

                    mergesSoFar++;
                    if (mergesSoFar == mergesExpected) {
                        merge();
                    }
                }, 3000);

                body1.onMerge = () => {
                    mergesSoFar++;
                    clearTimeout(backup);
                    if (mergesSoFar == mergesExpected) {
                        setTimeout(() => {
                            merge();
                        }, 1000);
                    }
                }


            }
        }

        setTimeout(merge, 5000);
    }
    function confetti(x, y, type) {
        //Spawn confetti at points x,y. Match the style of the type
        if (!canvas) return;
        const color = TYPE_MAP[type].fillStyle;
        let r = TYPE_MAP[type].radius;

        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.002;
            const confetti = Bodies.circle(
                x + Math.cos(angle) * r,
                y + Math.sin(angle) * r,
                5,
                {
                    render: {
                        fillStyle: color,
                    },
                    isSensor: true,
                    force: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }
                }
            );
            Composite.add(engine.world, [confetti]);

            setTimeout(() => {
                Composite.remove(engine.world, confetti);
            }, 2000 + Math.random() * 1000);
        }
    }
    function textPopup(x, y, text) {
        if (!canvas) return;

        const textBody = Bodies.rectangle(x, y, 100, 100, {
            isSensor: true,
            specialRenderType: "text",
            render: {
                fillStyle: "black"
            }
        });
        textBody.force.y = -0.3;
        //Make the body ignore gravity
        textBody.ignoreGravity = true;
        textBody.text = text;
        Composite.add(engine.world, [textBody]);
        setTimeout(() => {
            Composite.remove(engine.world, textBody);
        }, 2000);
    }
    function expandingCircle(x, y, color) {
        if (!canvas) return;

        //Create a circle objcet of color that expands and fades.
        const circle = Bodies.circle(x, y, 5, {
            isSensor: true,
            isStatic: true,
            ignoreGravity: true,
            renderFirst: true,
            specialRenderType: "circle",
            render: {
                fillStyle: color,
            },
        });
        const innerCircle = Bodies.circle(x, y, 5, {
            isSensor: true,
            isStatic: true,
            ignoreGravity: true,
            renderFirst: true,
            specialRenderType: "circle",
            render: {
                fillStyle: "white",
            },
        });

        Composite.add(engine.world, [circle, innerCircle]);

        let initialVelocity = 1;
        let growVelocity = initialVelocity;
        let growAcceleration = -0.002;

        let interval = setInterval(() => {
            if (growVelocity < 0) {
                clearInterval(interval);
                Composite.remove(engine.world, [circle, innerCircle]);
            }
            circle.circleRadius += growVelocity;
            growVelocity += growAcceleration;

            innerCircle.circleRadius = circle.circleRadius - 5;

            circle.render.opacity = growVelocity / initialVelocity + .0001;
        }, 1);
    }

    function handleCollision(event) {
        var pairs = event.pairs;
        pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;

            //Ignore any sensor collisions
            if (bodyA.isSensor || bodyB.isSensor) return;

            //If we have a fruit, mark it as hit
            if (bodyA.fruitType) bodyA.hitYet = true;
            if (bodyB.fruitType) bodyB.hitYet = true;

            if (
                bodyA.fruitType &&
                bodyB.fruitType &&
                bodyA.fruitType === bodyB.fruitType
            ) {
                //Handle fruit upgrades

                //Prevent duplication glitches
                if (bodyA.merged || bodyB.merged) return;
                bodyA.merged = true;
                bodyB.merged = true;

                //If body has a beforeMerge listner, ring its line 📞📞
                if (bodyA.onMerge) bodyA.onMerge();
                if (bodyB.onMerge) bodyB.onMerge();

                const averageX = (bodyA.position.x + bodyB.position.x) / 2;
                const averageY = (bodyA.position.y + bodyB.position.y) / 2;

                const newType = nextType(bodyA.fruitType);

                if (canvas) {
                    //Some types have visual celebrations
                    if (newType == "r") {
                        //Spawn confetti at random points throughout screen
                        let cel = setInterval(() => {
                            let rx = Math.random() * window.innerWidth;
                            let ry = Math.random() * window.innerHeight;
                            confetti(rx, ry, "r")
                        }, 80);
                        setTimeout(() => {
                            clearInterval(cel);
                        }, 5000);
                    }

                    if (newType == "t") {
                        //Circle effect and merge effect
                        expandingCircle(averageX, averageY, "black");
                        mergeAllFruitsEffect();
                    }
                }
                addFruit(newType, averageX, averageY);
                const scoreaddition = Math.pow(
                    Object.keys(TYPE_MAP).indexOf(bodyA.fruitType) + 1,
                    2
                );
                SCORE += scoreaddition;

                if (canvas) {
                    textPopup(averageX, averageY, `+${scoreaddition}`);
                    confetti(averageX, averageY, newType);
                }

                Composite.remove(engine.world, bodyA);
                Composite.remove(engine.world, bodyB);

                extraOptions?.onScoreChange?.(SCORE);
                extraOptions?.onMerge?.({
                    bodies: [bodyA, bodyB],
                    newType: newType,
                    score: SCORE,
                });
            }
        });
    }
    Matter.Events.on(engine, "collisionStart", handleCollision);
    function setFruitStyle(body, type) {
        body.render = {
            ...body.render,
            ...TYPE_MAP[type],
        };
        if (TYPE_MAP[type].type == "c") {
            body.circleRadius = TYPE_MAP[type].radius;
        }
    }
    function addFruit(type, x, y, options) {
        let body
        if (TYPE_MAP[type].type === "c") {
            body = Bodies.circle(x, y, TYPE_MAP[type].radius);
            body.specialRenderType = "circle";
        } else if (TYPE_MAP[type].type === "t") {
            body = Bodies.polygon(x, y, 3, TYPE_MAP[type].radius);
        }

        //Give body angular spin
        if (TYPE_MAP[type].spawnSpin) {
            Body.setAngularVelocity(body, TYPE_MAP[type].spawnSpin);
        }

        setFruitStyle(body, type);
        body.collisionFilter = GLOBAL_COLLISION;
        body.fruitType = type;
        body.fruitTypeNumber = Object.keys(TYPE_MAP).indexOf(type);
        body.restitution = 0.7;
        body.friction = 0.1;
        body.hitYet = false;
        body.id = Math.round(Math.random() * 1000000);

        //Add any other options
        if (options) {
            Object.assign(body, options);
        }

        Composite.add(engine.world, [body]);
        return body;
    }
    this.addFruit = addFruit;

    this.loadFromState = (state) => {
        CURRENT_TYPE = state.currentType;
        NEXT_TYPE = state.nextType;
        if (canvas) {
            setFruitStyle(displayFruit, CURRENT_TYPE);
            extraOptions?.onSyncFromState?.();
        }

        MINIMIZE_DUPLICATES = state.minimizeDuplicates;
        DROPS = state.drops;
        RANDOMS_GENERATED = state.randsGenerated;
        SCORE = state.score;
        extraOptions?.onScoreChange?.(SCORE);

        LAST_DROP_TIME = state.lastDropTime;
        FRUITS.forEach((fruit) => {
            Composite.remove(engine.world, fruit);
        }
        );
        state.fruits.forEach(function (fruit) {
            addFruit(fruit.fruitType, fruit.position.x, fruit.position.y, {
                velocity: fruit.velocity
            });
        });

        randFunction = RNG(RNG_SEED);
        for (let i = 0; i < RANDOMS_GENERATED; i++) {
            randFunction();
        }
    }
    this.getFullState = () => {
        const simplifiedFruits = FRUITS
            .map((body) => {
                return ({
                    position: body.position,
                    velocity: body.velocity,
                    fruitType: body.fruitType,
                });
            });
        return {
            fruits: simplifiedFruits,
            currentType: CURRENT_TYPE,
            nextType: NEXT_TYPE,
            drops: DROPS,
            randsGenerated: RANDOMS_GENERATED,
            score: SCORE,
            lastDropTime: LAST_DROP_TIME,
            minimizeDuplicates: MINIMIZE_DUPLICATES
        }
    }
    this.getNextDropColor = () => {
        //Return fill color of next drop
        return TYPE_MAP[NEXT_TYPE].fillStyle;
    }
    this.handleClick = (e) => {
        //Clearly we are rendering on a canvas, check anyway to be safe
        if (!canvas) return;
        if (!CAN_DIE) return;

        if (Date.now() - LAST_DROP_TIME < DROP_MIN_INTERVAL) return;
        LAST_DROP_TIME = Date.now();

        localStorage.setItem("lastInteract", GAME_ID);

        DROPS++;
        FRUITS.push(addFruit(CURRENT_TYPE, MOUSE_X, DROP_HEIGHT));

        updateCurrentAndNextType();

        setFruitStyle(displayFruit, CURRENT_TYPE);

        //Update DROP_HEIGHT so the "next up ball" moves too
        displayFruit.position.y = -9999;
        setTimeout(() => {
            displayFruit.position.y = DROP_HEIGHT;
        }, DROP_MIN_INTERVAL);

        extraOptions?.onDrop?.();
    }
    this.handleMove = (e) => {
        //Clearly we are rendering on a canvas, check anyway to be safe
        if (!canvas) return;

        const realMouseX = e.clientX;
        MOUSE_X = (realMouseX - canvas.getBoundingClientRect().left) / canvas.getBoundingClientRect().width * canvas.width;

        constrainMouseX(realMouseX);
    }
    function constrainMouseX(realMouseX) {
        let currentRadius = TYPE_MAP[CURRENT_TYPE].radius;
        if (MOUSE_X - currentRadius < 0) {
            MOUSE_X = currentRadius;
        } else if (MOUSE_X + currentRadius > canvas.width) {
            MOUSE_X = canvas.width - currentRadius;
        }
        if (realMouseX < canvas.getBoundingClientRect().left) {
            MOUSE_X = currentRadius
        } else if (realMouseX > canvas.getBoundingClientRect().width + canvas.getBoundingClientRect().left) {
            MOUSE_X = canvas.width - currentRadius
        }
        displayFruit.position.x = MOUSE_X;
    }

    //Create constraints
    const ground = Bodies.rectangle(
        0 + SCREEN_WIDTH / 2,
        SCREEN_HEIGHT + 100,
        SCREEN_WIDTH,
        200,
        {
            isStatic: true,
            collisionFilter: GLOBAL_COLLISION,
        }
    );
    ground.friction = 0;
    const leftWall = Bodies.rectangle(
        -100,
        SCREEN_HEIGHT / 2,
        200,
        SCREEN_HEIGHT * 5,
        {
            isStatic: true,
            collisionFilter: GLOBAL_COLLISION
        }
    );
    const rightWall = Bodies.rectangle(
        SCREEN_WIDTH + 100,
        SCREEN_HEIGHT / 2,
        200,
        SCREEN_HEIGHT * 5,
        {
            isStatic: true,
            collisionFilter: GLOBAL_COLLISION
        }
    );
    const topSensor = Bodies.rectangle(
        canvas.width / 2,
        DROP_HEIGHT * 2,
        canvas.width,
        10,
        {
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: "rgb(0, 0, 0)",
            },
            collisionFilter: GLOBAL_COLLISION
        }
    );
    topSensor.death = true;
    Composite.add(engine.world, [ground, leftWall, rightWall, topSensor]);


    //Create display ball if we are gonna render
    let displayFruit
    if (canvas) {
        displayFruit = Bodies.circle(SCREEN_WIDTH / 2, DROP_HEIGHT, 10, {
            isStatic: true,
            isSensor: true,
        });
        displayFruit.specialRenderType = "circle";
        displayFruit.renderFirst = true;
        Composite.add(engine.world, displayFruit);
    }

    this.resetToDefaultValues();
}