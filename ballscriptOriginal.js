//As a wise man once said, "You can't cheat the game. You can't cheat the grind. You get out what you put in at the end of the day."
//If you're trying to cheat or find out the higher level balls, just dont
//Its so much more satisfying to get there on your own
//😭🤑
if (window.innerHeight < 500 && !(window === window.top)) {
    document.body.innerHTML = "";
    document.body.style.height = "0px";
    document.body.style.width = "0px";
    document.body.style.overflow = "hidden";
} else {
    document.body.style.display = "unset";
}
(async () => {
    const setTimeout = window.setTimeout;
    const setInterval = window.setInterval;
    const myClearInterval = window.clearInterval;

    window.clearInterval = () => {
        alert("Stop cheating youre so weird");
    }

    let warnText = document.getElementById("warn");
    warnText.style.zIndex = "99999";
    warnText.style.position = "fixed";
    warnText.style.left = "50%";
    warnText.style.top = "30%";
    warnText.style.transform = "translate(-50%, -50%)";
    warnText.style.fontSize = "20px";
    warnText.style.userSelect = "none";

    //If hash includes "noembed" then remove warnText
    if (window.location.hash.includes("noembed")) {
        warnText.remove();
    }

    const id = Math.random().toString(36).substring(2);
    var popSound = new Audio('./pop.mp3');
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

    const TYPES_MAP = {
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
            effect: "pulse"
        },
        gray: {
            fillStyle: "gray",
            radius: 240,
            shadowBlur: 80,
            effect: "pulse"
        },
        magenta: {
            fillStyle: "magenta",
            radius: 240,
            shadowBlur: 80,
        },

    };

    const SPAM = false;

    let canvas, score, ctx;


    const DEFAULT_DROP_HEIGHT = 30;
    let DROP_HEIGHT = DEFAULT_DROP_HEIGHT;
    let DROP_MIN_INTERVAL = 500;

    //Import matter.js
    const script = document.createElement("script");
    script.src =
        "https://cdn.jsdelivr.net/npm/matter-js@0.19.0/build/matter.min.js";
    document.head.appendChild(script);

    //Create fullscreen transparent canvas
    canvas = document.createElement("canvas");
    canvas.width = 1366;
    canvas.id = "gameCanvas";
    let TYPE_MAP;
    t();
    canvas.height = 777;
    Object.assign(canvas.style, {
        position: "fixed",
        bottom: 0,
        left: "50vw",
        transform: "translateX(-50%)",
        ...(window.innerWidth * 777 / 1366 > window.innerHeight ? { height: `100vh`, width: `auto` } : { width: `100vw`, height: `auto` }),
        zIndex: 100,
        backdropFilter: "blur(1px)",
        background: "rgb(255 255 255 / 10%)",
        border: "1px solid black",
        borderTop: "none"
    });

    window.onresize = () => {
        Object.assign(canvas.style, {
            ...(window.innerWidth * 777 / 1366 > window.innerHeight ? { height: `100vh`, width: `auto` } : { width: `100vw`, height: `auto` }),
        });
    }

    document.body.appendChild(canvas);
    let mouseX = canvas.width / 2;
    let nextDropType = "red";
    let currentDropType = "red";
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

    score.onclick = () => {
        //If the user clicks the score, prompt to confirm and then restart
        if (confirm("Are you sure you want to restart? Manually restarting means your score won't have a chance to go on the leaderboard")) {
            gameOver(true);
        }
    }

    document.body.appendChild(score);

    await new Promise((resolve) => {
        script.onload = resolve;
    });
    // module aliases
    var Engine = Matter.Engine,
        Runner = Matter.Runner,
        Bodies = Matter.Bodies,
        Composite = Matter.Composite;


    // create an engine
    var engine = Engine.create();
    engine.enableSleeping = false;
    engine.positionIterations = 10;
    engine.velocityIterations = 20;

    //Create fruit that ignores gravity and follows mouseX
    const displayFruit = Bodies.circle(canvas.width / 2, DROP_HEIGHT, 10, {
        isStatic: true,
        isSensor: true,
    });
    Composite.add(engine.world, [displayFruit]);

    //Create constraints
    var ground = Bodies.rectangle(
        0 + canvas.width / 2,
        canvas.height + 100,
        canvas.width,
        200,
        { isStatic: true }
    );
    ground.friction = 0;
    var leftWall = Bodies.rectangle(
        -100,
        canvas.height / 2,
        200,
        canvas.height,
        { isStatic: true }
    );
    var rightWall = Bodies.rectangle(
        canvas.width + 100,
        canvas.height / 2,
        200,
        canvas.height,
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
    let RAINBOW_COLOR;
    function render() {
        RAINBOW_COLOR = `hsl(${(Date.now() / 5) % 360}, 100%, 50%)`;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var bodies = Composite.allBodies(engine.world);

        window.requestAnimationFrame(render);

        // //Draw the next ball
        // ctx.save();
        // ctx.globalAlpha = 0.2;
        // //Make bigger balls slightly more opaque
        // ctx.globalAlpha += (TYPES_MAP[currentDropType].radius / 200) * 0.8;

        // ctx.fillStyle = TYPE_MAP[nextDropType].fillStyle;
        // let radius = TYPE_MAP[nextDropType].radius;
        // ctx.arc(mouseX - TYPES_MAP[currentDropType].radius - radius / 2, DROP_HEIGHT, radius * .8, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.restore();


        for (var i = 0; i < bodies.length; i += 1) {
            ctx.save();
            ctx.beginPath();

            ctx.fillStyle = bodies[i].render.fillStyle;
            if (bodies[i].render.fillStyle === "r") {
                ctx.fillStyle = RAINBOW_COLOR;
            }
            const blurAmount = bodies[i].render.shadowBlur;
            ctx.shadowBlur = blurAmount;

            if (bodies[i].fruitType) {
                const typeObject = TYPE_MAP[bodies[i].fruitType];

                if (typeObject.effect === "pulse") {
                    ctx.shadowBlur = blurAmount
                        ? blurAmount *
                        (Math.abs(((Date.now() / 50) % blurAmount) - blurAmount / 2) /
                            blurAmount)
                        : 0;
                }
                if (typeObject.effect === "dance") {
                    //Make offset move in a circle
                    const offset = 50;
                    const x = Math.cos(Date.now() / 500) * offset;
                    const y = Math.sin(Date.now() / 500) * offset;
                    ctx.shadowOffsetX = x;
                    ctx.shadowOffsetY = y;
                }
                if (typeObject.effect === "explode") {
                    if (Date.now() % 7 < 1) {
                        //Spawn confetti
                        console.log("spawn");
                        confetti(bodies[i].position.x, bodies[i].position.y, bodies[i].fruitType);
                    }
                }
            }
            ctx.shadowColor =
                bodies[i].render.shadowColor || ctx.fillStyle;

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


            ctx.restore();
        }


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

        currentDropType = localStorage.getItem("currentDropType") || "red";
        setFruitStyle(displayFruit, currentDropType);
        nextDropType = localStorage.getItem("nextDropType") || "red";
        score.style.borderRight = `5px solid ${TYPE_MAP[nextDropType].fillStyle}`
    }




    function nextType(currentType) {
        const typeArray = Object.keys(TYPE_MAP);
        const currentIndex = typeArray.indexOf(currentType);
        return typeArray[currentIndex + 1];
    }
    function addFruit(type, x, y, options) {
        let body
        if (TYPE_MAP[type].type === "c") {
            body = Bodies.circle(x, y, TYPE_MAP[type].radius);
        } else if (TYPE_MAP[type].type === "t") {
            //Make triangle
            body = Bodies.polygon(x, y, 3, TYPE_MAP[type].radius);
        }
        setFruitStyle(body, type);
        body.fruitType = type;
        body.fruitTypeNumber = Object.keys(TYPE_MAP).indexOf(type);
        body.restitution = 0.7;
        body.friction = 0.1;
        body.hitYet = false;
        // body.slop = .1;
        //Add any other options
        if (options) {
            Object.assign(body, options);
        }

        Composite.add(engine.world, [body]);

        body.id = Math.round(Math.random() * 1000000);

        return body;
    }
    function getAllFruit() {
        return engine.world.bodies.filter((x) => x.fruitType);
    }
    function setNextDropFruit() {
        let sameCount = 4;
        let modifier = Math.max(Math.round(6 - drops / 100), 3);

        while (sameCount > 0) {
            nextDropType =
                Object.keys(TYPE_MAP)[
                Math.floor(
                    (Math.pow(Math.random(), modifier) * Object.keys(TYPE_MAP).length) / 2
                )
                ];
            if (nextDropType === currentDropType) {
                sameCount--;
            } else {
                sameCount = 0;
            }

            if (nextDropType === Object.keys(TYPE_MAP)[0]) {
                sameCount = 0;
            }
        }
        localStorage.setItem("nextDropType", nextDropType);
        score.style.borderRight = `5px solid ${TYPE_MAP[nextDropType].fillStyle}`
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
                myClearInterval(ci);
                updateScore(0);
            } else {
                Composite.remove(
                    engine.world,
                    fruit[Math.floor(Math.random() * fruit.length)]
                );
            }
        }, 30);
    }


    function gameOver(manual) {
        localStorage.removeItem("game");
        localStorage.removeItem("score");

        alert("Game Over! Score: " + scoreCount);
        if (manual) {
            clearValues();
        } else {
            sendLeaderboardScore();
        }
    }
    function clearValues() {
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

                popSound.cloneNode(true).play();


                const averageX = (bodyA.position.x + bodyB.position.x) / 2;
                const averageY = (bodyA.position.y + bodyB.position.y) / 2;

                const newType = nextType(bodyA.fruitType);

                if (newType == "r") {
                    //Spawn confetti at random points throughout screen
                    let cel = setInterval(() => {
                        let rx = Math.random() * window.innerWidth;
                        let ry = Math.random() * window.innerHeight;
                        confetti(rx, ry, "r")
                    }, 80);
                    setTimeout(() => {
                        myClearInterval(cel);
                    }, 5000);
                }

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



    });



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
        }
    );
    topSensor.death = true;
    Composite.add(engine.world, [topSensor]);



    setFruitStyle(displayFruit, nextDropType);

    let lastDropTime = 0;
    let drops = 0;

    function t() {
        TYPE_MAP = {
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
                type: "c"
            },
            r: {
                fillStyle: "r",
                radius: 50,
                shadowBlur: 200,
                effect: "dance",
                type: "c"
            },
            t: {
                fillStyle: "t",
                radius: 50,
                type: "t",
            }
        };
    }
    let realMouseX = mouseX;
    function constrainMouseX() {
        //Look at the current ball and if the mosue position would cause the ball to go offscreen, move the ball to the edge of the screen
        let currentRadius = TYPE_MAP[currentDropType].radius;
        if (mouseX - currentRadius < 0) {
            mouseX = currentRadius;
        } else if (mouseX + currentRadius > canvas.width) {
            mouseX = canvas.width - currentRadius;
        }
        if (realMouseX < canvas.getBoundingClientRect().left) {
            mouseX = currentRadius
        } else if (realMouseX > canvas.getBoundingClientRect().width + canvas.getBoundingClientRect().left) {
            mouseX = canvas.width - currentRadius
        }
        displayFruit.position.x = mouseX;
    }
    document.onmousemove = (e) => {
        realMouseX = e.clientX;
        mouseX = (realMouseX - canvas.getBoundingClientRect().left) / canvas.getBoundingClientRect().width * canvas.width;
        constrainMouseX();
    };
    document.onclick = (e) => {
        if (!e.isTrusted) {
            alert("Cheating! Bye bye balls");
            clearValues();
            return;
        }
        if (e.target.classList.contains("nodrop")) return;

        constrainMouseX();
        if (Date.now() - lastDropTime < DROP_MIN_INTERVAL) return;
        lastDropTime = Date.now();

        localStorage.setItem("lastInteract", id);

        drops++;
        console.log(drops);
        DROP_MIN_INTERVAL += 1;
        if (DROP_MIN_INTERVAL > 1000) DROP_MIN_INTERVAL = 1000;
        console.log(displayFruit)
        addFruit(currentDropType, mouseX, DROP_HEIGHT);
        currentDropType = nextDropType;
        localStorage.setItem("currentDropType", currentDropType);
        setFruitStyle(displayFruit, currentDropType);
        setNextDropFruit();

        //Update DROP_HEIGHT so the "next up ball" moves too
        DROP_HEIGHT = -999;
        displayFruit.position.y = DROP_HEIGHT;
        setTimeout(() => {
            DROP_HEIGHT = DEFAULT_DROP_HEIGHT;
            displayFruit.position.y = DROP_HEIGHT;
            constrainMouseX();

        }, DROP_MIN_INTERVAL);

        constrainMouseX();

    };

    let lastTooHigh = -1;
    setInterval(() => {
        //Loop through all bodies and check if any have a y value higher than topSensor
        let tooHighs = engine.world.bodies.filter((body) => {
            if (!body.hitYet) return false;

            //If the body has enough velocity, ignore it
            if (Math.sqrt(Math.pow(body.velocity.y, 2) + Math.pow(body.velocity.x), 2) > 3) return false;
            if (Math.abs(body.velocity.y) + Math.abs(body.velocity.x) > 3) return false;

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
            addFruit(nextDropType, Math.random() * canvas.width, DROP_HEIGHT);
            setNextDropFruit();
        }, 1);
    }

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.altKey && e.shiftKey && e.key === "G") {
            console.log("close ball")
            parent.postMessage("closeBall", "*");
        }
    });
    loadFromStorage();

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            //Remove all fruit then load in the ones from localstorage
            loadFromStorage();
        }
    });


    //LEADERBOARD SHTUFF
    document.getElementById("leaderboardButton").onclick = () => { leaderboardPopup.style.display = "block"; }
    document.getElementById("leaderboardPopup").onclick = () => { leaderboardPopup.style.display = "none"; }

    const LEADERBOARD_URL = "https://script.google.com/macros/s/AKfycbw6iTqt_fyO5OtTZ9de3pZUEglgvTH9tlVxkiPmlpkjaRpoqz0vn8IK_CddqT3F3OLsTw/exec";


    function dataURLtoBlob(dataURL) {
        let array, binary, i, len;
        binary = atob(dataURL.split(',')[1]);
        array = [];
        i = 0;
        len = binary.length;
        while (i < len) {
            array.push(binary.charCodeAt(i));
            i++;
        }
        return new Blob([new Uint8Array(array)], {
            type: 'image/png'
        });
    };
    async function sendLeaderboardScore() {
        let SCORE = scoreCount;
        let dataURL = canvas.toDataURL();
        clearValues();
        let name = prompt("Enter your name if you would like to submit your score to leaderboard. Use your real name and don't put anything bad pls 🙏");

        //use purgomalum to censor bad words
        if (name) {
            let response = await fetch(`https://www.purgomalum.com/service/json?text=${name}`);
            let json = await response.json();
            name = json.result;
        } else {
            return;
        }

        //Upload canvas image to imgur and get link
        let blob = dataURLtoBlob(dataURL);
        let formData = new FormData();
        formData.append("image", blob);
        let response = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: "Client-ID a23332bdafb3fb9"
            },
            body: formData
        });
        let json = await response.json();
        let imageUrl = json.data.link;

        let data = {
            name: name,
            score: SCORE,
            canvasString: imageUrl
        }

        let encryptedData = btoa(JSON.stringify(data));
        encryptedData = encryptedData.split("").reverse().join("");
        let newData = await fetch(`${LEADERBOARD_URL}?data=${encodeURIComponent(encryptedData)}`);
        let newJson = await newData.json();
        renderLeaderboard(newJson);
        leaderboardPopup.style.display = "block";

        //Scroll to the leaderboard item that has a matching image 
        let leaderboard = document.getElementById("leaderboardEntries");
        let leaderboardImages = leaderboard.getElementsByClassName("leaderboardImage");
        for (let i = 0; i < leaderboardImages.length; i++) {
            if (leaderboardImages[i].src == imageUrl) {
                leaderboard.scrollTop = leaderboardImages[i].offsetTop;

                leaderboardImages[i].style.border = "5px solid black";
                setTimeout(() => {
                    leaderboardImages[i].style.border = "none";
                }, 5000);
                break;
            }
        }

        clearValues();
    }
    function getLeaderboard() {
        //Fetch the leaderboard and display it in the popup
        fetch(LEADERBOARD_URL)
            .then((response) => response.json())
            .then((data) => {
                renderLeaderboard(data);
            });
    };
    function renderLeaderboard(data) {
        data = data.sort((a, b) => b[1] - a[1]);

        let leaderboard = document.getElementById("leaderboardEntries");
        leaderboard.innerHTML = "";
        data.forEach((entry, i) => {
            let div = document.createElement("div");
            div.classList.add("leaderboardEntry");
            div.classList.add("nodrop");

            div.innerText = `${i + 1}.  ${entry[0]} - ${entry[1]}`;
            leaderboard.appendChild(div);

            let imageContainer = document.createElement("div");
            div.appendChild(imageContainer);

            let displayImage = document.createElement("img");
            displayImage.classList.add("leaderboardImage");
            displayImage.classList.add("nodrop");
            displayImage.src = entry[2];
            displayImage.style.width = "100px";
            displayImage.style.objectFit = "cover";
            displayImage.onclick = (e) => {
                openImage(entry[2]);
                console.log(entry[2]);
                setTimeout(() => {
                    leaderboardPopup.style.display = "block";
                }, 0);
            }
            imageContainer.appendChild(displayImage);

            if (i == 0) {
                div.style.color = "gold";
                imageContainer.classList.add("leaderContainer");
            }
        });
    }
    getLeaderboard();
    setInterval(getLeaderboard, 60 * 1000);


    //Open a new window and write an image to it
    function openImage(url) {
        let win = window.open();
        win.document.write(`<div style="
        thisisxssablelolbutidontcarecuzitwouldbekindafunnyifsomebodydidit:true;
        background-image: url(${url});
        width: 100vw;
        height: 100vh;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        position: absolute;
        top: 0px;
        left: 0px;
    ">
        
    </div>`);
    }
})();
if (location.href.includes("file") && location.href.includes("/index.")) alert("Use localindex");