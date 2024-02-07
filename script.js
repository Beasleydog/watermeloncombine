(async () => {
    const id = Math.random().toString(36).substring(2);

    //Use intersection observer to await until the page is visible
    await new Promise((resolve) => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                resolve();
                observer.disconnect();
            }
        }
        );
        observer.observe(document.querySelector("body"));
    });

    const SPAM = false;

    let canvas, score, ctx;

    const DROP_HEIGHT = 30;
    const DROP_MIN_INTERVAL = 500;

    //Import matter.js
    const script = document.createElement("script");
    script.src =
        "https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js";
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
        backdropFilter: "blur(1px)",
        background: "rgb(255 255 255 / 10%)",
    });
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");

    let scoreCount = 0;
    score = document.createElement("div");
    Object.assign(score.style, {
        position: "fixed",
        top: "5px",
        left: "20px",
        zIndex: 999999,
        userSelect: "none",
        fontSize: "40px",
        fontWeight: "bold",
        background: "white",
        paddingLeft: "5px",
        borderRadius: "3px",
        paddingRight: "5px",
    });
    score.innerText = scoreCount;
    document.body.appendChild(score);

    await new Promise((resolve) => {
        script.onload = resolve;
    });
    // module aliases
    var Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite;

    window.Engine = Engine;
    window.Runner = Runner;
    window.Bodies = Bodies;
    window.Composite = Composite;

    // create an engine
    var engine = Engine.create();
    engine.enableSleeping = false;
    window.engine = engine;

    //Create constraints
    var ground = Bodies.rectangle(
        0 + window.innerWidth / 2,
        window.innerHeight + 100,
        window.innerWidth,
        200,
        { isStatic: true }
    );
    ground.friction = 0;
    var leftWall = Bodies.rectangle(
        -100,
        window.innerHeight / 2,
        200,
        window.innerHeight,
        { isStatic: true }
    );
    var rightWall = Bodies.rectangle(
        window.innerWidth + 100,
        window.innerHeight / 2,
        200,
        window.innerHeight,
        { isStatic: true }
    );
    Composite.add(engine.world, [ground, leftWall, rightWall]);
    leftWall.hitYet = true;
    rightWall.hitYet = true;
    ground.hitYet = true;
    // create runner
    var runner = Runner.create();
    // run the engine
    Runner.run(runner, engine);
    let validChains = [];
    let RAINBOW_COLOR;
    function render() {
        RAINBOW_COLOR = `hsl(${(Date.now() / 10) % 360}, 100%, 50%)`;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var bodies = Composite.allBodies(engine.world);

        window.requestAnimationFrame(render);

        for (var i = 0; i < bodies.length; i += 1) {
            ctx.save();
            ctx.beginPath();

            ctx.fillStyle = bodies[i].render.fillStyle;
            if (bodies[i].render.fillStyle === "rainbow") {
                ctx.fillStyle = RAINBOW_COLOR;
            }

            const blurAmount = bodies[i].render.shadowBlur;
            ctx.shadowBlur = blurAmount
                ? blurAmount *
                (Math.abs(((Date.now() / 50) % blurAmount) - blurAmount / 2) /
                    blurAmount)
                : 0;
            ctx.shadowColor =
                bodies[i].render.shadowColor || bodies[i].render.fillStyle;

            if (bodies[i].text) {
                ctx.font = "30px Arial";
                ctx.fillStyle = "black";
                ctx.fillText(
                    bodies[i].text,
                    bodies[i].position.x,
                    bodies[i].position.y
                );
            } else if (bodies[i].circleRadius) {
                ctx.arc(
                    bodies[i].position.x,
                    bodies[i].position.y,
                    bodies[i].circleRadius,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
            } else {
                var vertices = bodies[i].vertices;

                ctx.moveTo(vertices[0].x, vertices[0].y);

                for (var j = 1; j < vertices.length; j += 1) {
                    ctx.lineTo(vertices[j].x, vertices[j].y);
                }

                ctx.lineTo(vertices[0].x, vertices[0].y);
                ctx.fill();
            }
            ctx.closePath();

            // if (bodies[i].fruitType) {
            //     //Draw the number of the longest chain on the ball
            //     let chainsOnBall = getChains(bodies[i]);
            //     let longestChain = chainsOnBall.reduce((a, b) => a.length > b.length ? a : b, []);
            //     ctx.fillStyle = "black";
            //     ctx.font = "30px Arial";
            //     ctx.fillText(longestChain.length, bodies[i].position.x, bodies[i].position.y);

            // }
            ctx.restore();
        }

        //Draw outlines around balls in chains
        for (let chain of validChains) {
            ctx.beginPath();

            //Make pulse effect
            let alpha = (Math.abs(((Date.now() / 200) % 10) - 10 / 2) / 10) * .8 - .1;
            ctx.strokeStyle = `rgba(199, 202, 204,${alpha})`;
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.moveTo(chain[0].position.x, chain[0].position.y);
            for (let ball of chain) {
                ctx.lineTo(ball.position.x, ball.position.y);
            }
            ctx.stroke();
        }

        console.log("rendering");
        if (!document.hidden) {
            if (localStorage.getItem("lastInteract") !== id) return;
            //Create array of all fruit in simple object form with only necessary properties
            const stringBodys = bodies
                .filter((body) => body.fruitType)
                .map((body) => {
                    return ({
                        position: body.position,
                        velocity: body.velocity,
                        fruitType: body.fruitType,
                    });
                });
            localStorage.setItem("game", JSON.stringify(stringBodys));
            localStorage.setItem("score", scoreCount)
        }
    }
    render();

    function loadFromStorage() {
        engine.world.bodies
            .filter((body) => body.fruitType)
            .forEach((body) => {
                Composite.remove(engine.world, body);
            });
        const stringBodys = JSON.parse(localStorage.getItem("game"));
        if (!stringBodys) return;
        stringBodys.forEach((body) => {
            let f = addFruit(body.fruitType, body.position.x, body.position.y, { hitYet: true });
            f.velocity = body.velocity;
        });
        updateScore(localStorage.getItem("score"));
    }

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            //Remove all fruit then load in the ones from localstorage
            loadFromStorage();
        }
    });

    const TYPE_MAP = {
        red: {
            fillStyle: "red",
            radius: 10,
        },
        blue: {
            fillStyle: "blue",
            radius: 40,
        },
        aqua: {
            fillStyle: "#00FFFF",
            radius: 70,
        },
        green: {
            fillStyle: "green",
            radius: 90,
        },
        yellow: {
            fillStyle: "yellow",
            radius: 120,
        },
        purple: {
            fillStyle: "purple",
            radius: 140,
        },
        orange: {
            fillStyle: "orange",
            radius: 170,
        },
        pink: {
            fillStyle: "pink",
            radius: 190,
        },
        brown: {
            fillStyle: "brown",
            radius: 200,
        },
        black: {
            fillStyle: "black",
            radius: 240,
            shadowBlur: 80,
        },
        pearl: {
            fillStyle: "rainbow",
            radius: 50,
        },
    };
    function nextType(currentType) {
        const typeArray = Object.keys(TYPE_MAP);
        const currentIndex = typeArray.indexOf(currentType);
        return typeArray[currentIndex + 1];
    }

    function addFruit(type, x, y, options) {
        const body = Bodies.circle(x, y, TYPE_MAP[type].radius);
        setFruitStyle(body, type);
        body.fruitType = type;
        body.fruitTypeNumber = Object.keys(TYPE_MAP).indexOf(type);
        body.restitution = 0.7;
        body.friction = 0.1;
        body.hitYet = false;

        //Add any other options
        if (options) {
            Object.assign(body, options);
        }

        Composite.add(engine.world, [body]);


        return body;
    }

    function setNextDropFruit() {
        let modifier = Math.max(Math.round(6 - drops / 100), 3);
        nextDropType =
            Object.keys(TYPE_MAP)[
            Math.floor(
                (Math.pow(Math.random(), modifier) * Object.keys(TYPE_MAP).length) / 2
            )
            ];

        setFruitStyle(displayFruit, nextDropType);
    }

    function setFruitStyle(body, type) {
        body.render = {
            ...body.render,
            ...TYPE_MAP[type],
        };
        body.circleRadius = TYPE_MAP[type].radius;
    }

    function updateScore(newScore) {
        scoreCount = Number(newScore);
        score.innerText = scoreCount;
    }
    function textPopup(x, y, text) {
        if (SPAM) return;
        const textBody = Bodies.rectangle(x, y, 100, 100, {
            isSensor: true,
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

    function confetti(x, y, type) {
        if (SPAM) return;
        const color = TYPE_MAP[type].fillStyle;
        let r = TYPE_MAP[type].radius;
        for (let i = 0; i < 50; i++) {
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
                }
            );
            confetti.friction = 0;
            confetti.restitution = 0.5;
            confetti.force.x = Math.cos(angle) * speed;
            confetti.force.y = Math.sin(angle) * speed;
            Composite.add(engine.world, [confetti]);
            setTimeout(() => {
                Composite.remove(engine.world, confetti);
            }, 2000);
        }
    }

    function clearBalls() {
        engine.world.gravity.y = 0;
        lastTooHigh = Number.MAX_VALUE;
        let ci = setInterval(() => {
            let fruit = engine.world.bodies.filter((x) => x.fruitType);
            if (fruit.length == 0) {
                engine.world.gravity.y = 1;
                lastTooHigh = -1;
                clearInterval(ci);
            } else {
                Composite.remove(
                    engine.world,
                    fruit[Math.floor(Math.random() * fruit.length)]
                );
            }
        }, 30);
    }

    function previousStepNeighbors(ball) {
        return engine.world.bodies.filter(x => x.fruitType).filter((x) => {
            return Matter.Collision.collides(x, ball) && x.fruitTypeNumber == ball.fruitTypeNumber - 1
        });
    }
    function getChains(ball) {
        let uglyChains = c(ball);
        let cleanChains = flattenChains(uglyChains);
        cleanChains = cleanChains.map(x => [ball].concat(x));
        return cleanChains;
    }
    function c(ball) {
        let neighbors = previousStepNeighbors(ball);
        neighbors = neighbors.map((x) => {
            return {
                main: x,
                next: c(x)
            }
        });
        return neighbors;
    }
    function flattenChains(arr) {
        let result = [];
        for (let obj of arr) {
            if (obj.next.length == 0) {
                result.push([obj.main]);
            } else {
                let next = flattenChains(obj.next);
                for (let n of next) {
                    result.push([obj.main].concat(n));
                }
            }
        }
        return result;
    }



    window.gameOver = function gameOver() {
        alert("Game Over! Score: " + scoreCount);

        updateScore(0);
        clearBalls();
        drops = 0;
    }

    Matter.Events.on(engine, "collisionStart", function (event) {
        var pairs = event.pairs;
        pairs.forEach((pair) => {

            const { bodyA, bodyB } = pair;

            if (bodyA.isSensor || bodyB.isSensor) return;

            if (!bodyA.hitYet) console.log(bodyA);
            if (!bodyB.hitYet) console.log(bodyB);

            if (bodyA.fruitType) bodyA.hitYet = true;
            if (bodyB.fruitType) bodyB.hitYet = true;

            if (
                bodyA.fruitType &&
                bodyB.fruitType &&
                bodyA.fruitType === bodyB.fruitType
            ) {
                //Handle fruit upgrades
                if (bodyA.merged || bodyB.merged) return;
                bodyA.merged = true;
                bodyB.merged = true;

                const averageX = (bodyA.position.x + bodyB.position.x) / 2;
                const averageY = (bodyA.position.y + bodyB.position.y) / 2;

                const newType = nextType(bodyA.fruitType);

                addFruit(newType, averageX, averageY);
                confetti(averageX, averageY, newType);
                const scoreaddition = Math.pow(
                    Object.keys(TYPE_MAP).indexOf(bodyA.fruitType) + 1,
                    2
                );
                updateScore(scoreCount + scoreaddition);
                textPopup(averageX, averageY, `+${scoreaddition}`);

                Composite.remove(engine.world, bodyA);
                Composite.remove(engine.world, bodyB);
            }
        });


        //Store any chains longer than 2 in the validChains array
        let fruit = engine.world.bodies.filter((x) => x.fruitType);

        validChains = [...fruit.map(getChains)].flat().filter((x) => x.length > 3);
        window.validChains = validChains;
    });

    loadFromStorage();

    const topSensor = Bodies.rectangle(
        window.innerWidth / 2,
        DROP_HEIGHT * 2,
        window.innerWidth,
        10,
        {
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: "rgb(0, 0, 0)",
            },
        }
    );
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
    };
    canvas.onclick = () => {
        if (Date.now() - lastDropTime < DROP_MIN_INTERVAL) return;
        lastDropTime = Date.now();

        localStorage.setItem("lastInteract", id);

        drops++;
        addFruit(nextDropType, mouseX, DROP_HEIGHT);
        setNextDropFruit();

        displayFruit.position.y = -999;
        setTimeout(() => {
            displayFruit.position.y = DROP_HEIGHT;
        }, DROP_MIN_INTERVAL);
    };

    let lastTooHigh = -1;
    setInterval(() => {
        //Loop through all bodies and check if any have a y value higher than topSensor
        let tooHighs = engine.world.bodies.filter((body) => {
            if (!body.hitYet) return false;
            let tooHigh = body.position.y + body.circleRadius < topSensor.position.y && body.fruitType;
            if (tooHigh) {
                if (lastTooHigh != -1) {
                    let max = SPAM ? 9999999 : 3000;
                    let current = Date.now() - lastTooHigh;

                    topSensor.render.fillStyle = `rgb(${(current / max) * 255},0,0)`;

                    if (current > max) {
                        gameOver();

                        return;
                    }
                } else {
                    lastTooHigh = Date.now();
                }
            }
            return tooHigh;
        });
        if (tooHighs.length == 0) {
            lastTooHigh = -1;
            topSensor.render.fillStyle = "rgb(0,0,0)";
        }
    }, 10);

    if (SPAM) {
        setInterval(() => {
            drops++;
            addFruit(nextDropType, Math.random() * window.innerWidth, DROP_HEIGHT);
            setNextDropFruit();
        }, 1);
    }

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.altKey && e.shiftKey && e.key === "G") {
            console.log("close ball")
            parent.postMessage("closeBall", "*");
        }
    });
})();
