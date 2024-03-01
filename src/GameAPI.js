function CombineGame(RAPIER, canvas, extraOptions) {
    if (!RAPIER) throw "gimme rapier yo";

    //Prevent hacking of global stuff
    const setTimeout = window.setTimeout;
    const setInterval = window.setInterval;
    const clearInterval = window.clearInterval;

    //Define some constants(ish)
    const TYPE_MAP = {
        red: {
            fillStyle: "#FF0000",
            radius: 12,
            type: "circle"
        },
        blue: {
            fillStyle: "#0000FF",
            radius: 45,
            type: "circle"
        },
        aqua: {
            fillStyle: "#00FFFF",
            radius: 75,
            type: "circle",
        },
        green: {
            fillStyle: "#008000",
            radius: 100,
            type: "circle",
        },
        yellow: {
            fillStyle: "#FFFF00",
            radius: 130,
            type: "circle",
        },
        purple: {
            fillStyle: "#800080",
            radius: 155,
            type: "circle"
        },
        orange: {
            fillStyle: "#FFA500",
            radius: 185,
            type: "circle"
        },
        pink: {
            fillStyle: "#FFC0CB",
            radius: 200,
            type: "circle"
        },
        brown: {
            fillStyle: "#A52A2A",
            radius: 215,
            type: "circle"
        },
        black: {
            fillStyle: "#000000",
            radius: 260,
            shadowBlur: 80,
            effect: "pulse",
            type: "circle",
            hasStroke: true
        },
        r: {
            fillStyle: "r",
            radius: 50,
            shadowBlur: 200,
            effect: "dance",
            type: "circle"
        },
        t: {
            fillStyle: "#FF0000",
            strokeStyle: "#cccccc",
            hasStroke: true,
            lineWidth: 5,
            radius: 80,
            type: "triangle",
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
    let MOUSE_Y = SCREEN_HEIGHT / 2;
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
    let RAPIER_MULTIPLIER = 100;
    const BALL_RESTITUTION = .4;
    const MAX_FRUIT_VELOCITY = 5;
    const NEW_DAMPENING_TIME = 500;
    const DAMP_AMOUNT = 200;
    const VERTICAL_EXPLODE_DAMP_MULTIPLIER = .5;
    const TICKS_PER_SECOND = 60;
    let SCHEDULED_EVENTS = [];
    let ALL_COLLISIONS = [];
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
        MINIMIZE_DUPLICATES = bool;
    }
    function resetRandom() {
        randFunction = RNG(RNG_SEED);
        RANDOMS_GENERATED = 0;
    }

    //Create engine
    const gravity = { x: 0, y: 9.81 };
    const eventQueue = new RAPIER.EventQueue(true);
    const world = new RAPIER.World(gravity);

    //Rendering stuff
    const ctx = canvas?.getContext("2d");

    const renderFunction = () => {
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        //Draw sensor bar
        ctx.save();
        ctx.fillStyle = topSensor.fill;
        ctx.fillRect(0, topSensor.y, SCREEN_WIDTH, 10);
        ctx.restore();

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
            const position = {};
            if (body.position) {
                position.x = body.position.x;
                position.y = body.position.y;
            } else {
                position.x = body.rigidBody.translation().x * RAPIER_MULTIPLIER;
                position.y = body.rigidBody.translation().y * RAPIER_MULTIPLIER;
            }

            ctx.save();
            ctx.beginPath();

            applyBodyStylesToCanvas(body);

            switch (body.type) {
                case "text":
                    ctx.font = "30px Arial";
                    ctx.fillText(
                        body.text,
                        position.x,
                        position.y
                    );
                    break;
                case "circle":
                    const radius = body.circleRadius || body.colliderDesc.shape.radius * RAPIER_MULTIPLIER;
                    ctx.arc(
                        position.x,
                        position.y,
                        radius,
                        0,
                        2 * Math.PI
                    );
                    ctx.fill();
                    if (!body.noFace) {
                        const xDiff = MOUSE_X - position.x;
                        const yDiff = MOUSE_Y - position.y;

                        const largestPossibleXDiff = (position.x > MOUSE_X ? position.x : SCREEN_WIDTH - position.x);
                        const largestPossibleYDiff = (position.y > MOUSE_Y ? position.y : SCREEN_HEIGHT - position.y);

                        const xPercent = (xDiff / largestPossibleXDiff);
                        const yPercent = (yDiff / largestPossibleYDiff);

                        let xShift = xPercent * radius * .01;
                        let yShift = yPercent * radius * .01;

                        let shiftAngle = Math.atan2(yDiff, xDiff);
                        let shiftMagnitude = Math.sqrt(Math.pow(xShift, 2) + Math.pow(yShift, 2));

                        //Draw face 😃😃
                        //If ball is black, fill white
                        if (body.render.fillStyle === "#000000") {
                            ctx.fillStyle = "white";
                        } else {
                            ctx.fillStyle = "black";
                        }
                        ctx.globalAlpha *= .5;
                        //Apply filter to darken
                        // ctx.filter = "brightness(0.5)";
                        // console.log()
                        //Center canvas at position
                        ctx.translate(position.x, position.y);
                        //Rotate to the angle of the body
                        let angle;
                        if (body.rigidBody) {
                            angle = body.rigidBody.rotation();
                            ctx.rotate(angle);
                        }
                        ctx.beginPath();
                        if (body.isSad) {
                            ctx.arc(0, radius * .25, radius * .65, 1 * Math.PI, 0);
                        } else {
                            ctx.arc(0, radius * .05, radius * .65, 0, 1 * Math.PI);

                        }

                        //Subtract angle from shiftAngle
                        shiftAngle -= angle;
                        xShift = Math.cos(shiftAngle) * shiftMagnitude;
                        yShift = Math.sin(shiftAngle) * shiftMagnitude;

                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(radius * .3 + xShift, -radius * .3 + yShift, radius * .16, 0, 2 * Math.PI);
                        ctx.arc(-radius * .3 + xShift, -radius * .3 + yShift, radius * .16, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.closePath();

                        ctx.globalAlpha *= .2;
                        ctx.beginPath();
                        ctx.arc(radius * .3, -radius * .3, radius * .18, 0, 2 * Math.PI);
                        ctx.arc(-radius * .3, -radius * .3, radius * .18, 0, 2 * Math.PI);
                        ctx.fill();
                        ctx.closePath();
                    }
                    break;
                case "triangle":
                    break;
                default:
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
        SCHEDULED_EVENTS = SCHEDULED_EVENTS.filter((event) => {
            event.ticks--;
            if (event.ticks <= 0) {
                event.callback();
                return false;
            }
            return true;
        });
        FRUITS = BODIES.filter(body => body.fruitType);
        FRUITS.forEach(body => {
            //Ensure balls don't go offscreen
            const yPosition = body.rigidBody.translation().y;
            if (yPosition > SCREEN_HEIGHT + 100) {
                //Teleport body to center of screen
                body.rigidBody.setTranslation({ x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 2 });
                body.rigidBody.setLinvel({ x: 0, y: 0 }, true);
            }

            if (body.hitYet) {
                //Cap velocity
                const velocity = body.rigidBody.linvel();
                const speed = Math.sqrt(Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2));
                let checkAmount = MAX_FRUIT_VELOCITY;
                const radius = body.colliderDesc.shape.radius;

                //If the body is touching the sensor, cap it at a lower speed
                if (Math.abs(yPosition - topSensor.y) < radius || yPosition > topSensor.y) {
                    checkAmount *= VERTICAL_EXPLODE_DAMP_MULTIPLIER;
                }

                if (speed > checkAmount) {
                    body.velocityCapped = true;
                    let angle = Math.atan2(velocity.y, velocity.x);
                    body.rigidBody.setLinvel({ x: Math.cos(angle) * checkAmount, y: Math.sin(angle) * checkAmount }, true);
                } else {
                    body.velocityCapped = false;
                }

                //Cap acceleration
                if (body.lastVelocity) {
                    let velocityDiff = {
                        x: Math.abs(body.lastVelocity.x - velocity.x),
                        y: Math.abs(body.lastVelocity.y - velocity.y)
                    }
                    let difMag = Math.sqrt(Math.pow(velocityDiff.x, 2) + Math.pow(velocityDiff.y, 2));
                    if (difMag > 2) {
                        body.accelLimited = true;
                        body.rigidBody.setLinearDamping(DAMP_AMOUNT);
                        let callback = () => {
                            if (body.merged) return;
                            body.accelLimited = false;
                            body.rigidBody.setLinearDamping(0);
                        }
                        scheduledEvent(NEW_DAMPENING_TIME / TICKS_PER_SECOND, callback);
                    } else {
                        // body.accelLimited = false;
                        // body.rigidBody.setLinearDamping(0);

                    }
                }
                body.lastVelocity = velocity;
            }
            if (body.impactedByNew) {
                //Lower bouncieness
                body.collider.setRestitution(0);
                body.rigidBody.setLinearDamping(DAMP_AMOUNT * .1);
                body.rigidBody.setAngularDamping(DAMP_AMOUNT * .1);
                //If body is moving up, dampen it more
                const velocity = body.rigidBody.linvel();
                if (velocity.y < 0) {
                    body.rigidBody.setLinearDamping(DAMP_AMOUNT * VERTICAL_EXPLODE_DAMP_MULTIPLIER);
                    body.rigidBody.setAngularDamping(DAMP_AMOUNT * VERTICAL_EXPLODE_DAMP_MULTIPLIER);
                    //TODO: Change this logic. We shouldn't be damping all velocities we should just be ensuring that it doesnt get jolted around with a suddent velocity change.
                    //Maybe store the last velocity and if it changes too much, dampen it

                }
            } else {
                body.rigidBody.setAngularDamping(0);
                body.rigidBody.setLinearDamping(0);
                body.collider.setRestitution(BALL_RESTITUTION);
            }
        });

        //Update engine 
        world.step(eventQueue);


        ALL_COLLISIONS = [];
        eventQueue.drainCollisionEvents((handle1, handle2, started) => {
            //Get body from handle
            ALL_COLLISIONS.push([handle1, handle2, started]);

            let bodyA, bodyB;
            BODIES.filter((body) => {
                if (body.rigidBody) {
                    if (body.rigidBody.handle == handle1) {
                        bodyA = body;
                    } else if (body.rigidBody.handle == handle2) {
                        bodyB = body;
                    }
                }
            })
            handleCollision(bodyA, bodyB, started);
        });

        if (CAN_DIE) {
            //Loop through all bodies and check if any have a y value higher than topSensor
            let tooHighs = FRUITS.filter((body) => {
                if (!body.hitYet) return false;
                const yVelocity = body.rigidBody.linvel().y;
                const xVelocity = body.rigidBody.linvel().x;
                const radius = body.colliderDesc.shape.radius;
                const position = body.rigidBody.translation();
                //If the body has enough velocity, ignore it
                if (Math.sqrt(Math.pow(yVelocity, 2) + Math.pow(xVelocity), 2) > 3) return false;
                if (Math.abs(yVelocity) + Math.abs(xVelocity) > 3) return false;

                let tooHigh = (position.y + radius) * RAPIER_MULTIPLIER < topSensor.y;
                if (tooHigh) {
                    if (LAST_TIME_TOO_HIGH != -1) {
                        let max = 3000;
                        let current = Date.now() - LAST_TIME_TOO_HIGH;

                        if (canvas) topSensor.fill = `rgb(${(current / max) * 255},0,0)`;

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
                topSensor.fill = "rgb(0,0,0)";
            }
        }
    }

    this.loop = () => {
        this.tick();

        if (canvas) renderFunction();
        setTimeout(this.loop, 1000 / TICKS_PER_SECOND);
        // requestAnimationFrame(this.loop);
    }
    function setGravityOn(bool) {
        if (bool) {
            world.setGravity({ x: 0, y: 9.81 });
        } else {
            world.setGravity({ x: 0, y: 0 });
        }
    }
    function clearBallsAnimation(callback) {
        //Disable gravity 
        setGravityOn(false);
        LAST_TIME_TOO_HIGH = Number.MAX_VALUE;
        CAN_DIE = false;
        let ci = setInterval(() => {
            if (FRUITS.length == 0) {
                setGravityOn(true);
                LAST_TIME_TOO_HIGH = -1;
                CAN_DIE = true;
                clearInterval(ci);
                if (callback) callback();
            } else {
                let randomIndex = Math.floor(Math.random() * FRUITS.length);
                let randomBody = FRUITS[randomIndex];
                removeBody(randomBody);
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
            removeBody(fruit);
        });

        FRUITS = [];

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
        //TODO: FIX THIS
        //Turn all into sensors with specific id. Then in merge logic check by id?
        //https://rapier.rs/docs/user_guides/javascript/collider_collision_groups/
        var num = -1;

        setGravityOn(false);
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

                let backup = scheduledEvent(3000 / TICKS_PER_SECOND, () => {
                    //if the bodies havnt merged yet, just remove them
                    if (!body1.merged) Composite.remove(engine.world, body1);
                    if (!body2.merged) Composite.remove(engine.world, body2);

                    mergesSoFar++;
                    if (mergesSoFar == mergesExpected) {
                        merge();
                    }
                });

                body1.onMerge = () => {
                    mergesSoFar++;
                    clearTimeout(backup);
                    if (mergesSoFar == mergesExpected) {
                        scheduledEvent(1000 / TICKS_PER_SECOND, () => {
                            merge();
                        });
                    }
                }


            }
        }

        scheduledEvent(5000 / TICKS_PER_SECOND, merge);
    }
    function addCircle(x, y, radius) {
        let ballColliderDesc = RAPIER.ColliderDesc.ball(radius / RAPIER_MULTIPLIER).setRestitution(BALL_RESTITUTION);
        let ballBodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x / RAPIER_MULTIPLIER, y / RAPIER_MULTIPLIER).setCcdEnabled(true);
        let ballRigidBody = world.createRigidBody(ballBodyDesc);

        ballColliderDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
        ballColliderDesc.setFriction(.1);
        ballColliderDesc.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max);

        ballColliderDesc.setMass(radius)

        let collider = world.createCollider(ballColliderDesc, ballRigidBody);
        let addition = {
            id: Math.random(),
            type: "circle",
            renderType: "circle",
            rigidBody: ballRigidBody,
            colliderDesc: ballColliderDesc,
            collider: collider
        }
        BODIES.push(addition);
        return addition
    }

    function addWall(x, y, width, height) {
        let wallColliderDesc = RAPIER.ColliderDesc.cuboid(width / RAPIER_MULTIPLIER, height / RAPIER_MULTIPLIER);
        let wallBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(x / RAPIER_MULTIPLIER, y / RAPIER_MULTIPLIER);
        let wallRigidBody = world.createRigidBody(wallBodyDesc);
        wallColliderDesc.setFriction(1);
        world.createCollider(wallColliderDesc, wallRigidBody);
        let addition = ({
            type: "rectangle",
            rigidBody: wallRigidBody,
            colliderDesc: wallColliderDesc,
            render: {
                fillStyle: "black"
            }
        });
        BODIES.push(addition);
        return addition;
    }
    function removeBody(body) {
        world.removeRigidBody(body.rigidBody);
        BODIES = BODIES.filter((b) => b.id != body.id);
        FRUITS = FRUITS.filter((b) => b.id != body.id);
    }
    function confetti(x, y, type) {
        //Spawn confetti at points x,y. Match the style of the type
        if (!canvas) return;
        const color = TYPE_MAP[type].fillStyle;
        let r = TYPE_MAP[type].radius;

        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 0.002;
            const confetti = addCircle(x + Math.cos(angle) * r, y + Math.sin(angle) * r, 5);

            //Make the confetti rigibdoy KinematicVelocityBased


            confetti.render = {
                fillStyle: color,
                shadowBlur: 20,
                effect: "pulse",
                opacity: 1
            }

            confetti.noFace = true;
            confetti.rigidBody.setLinvel({ x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, true);
            scheduledEvent((2000 + Math.random() * 1000) / TICKS_PER_SECOND, () => {
                removeBody(confetti);
            });
        }
    }
    function textPopup(x, y, textValue) {
        if (!canvas) return;

        const text = {
            id: Math.random(),
            type: "text",
            text: textValue,
            position: { x: x, y: y },
        }

        scheduledEvent(2000 / TICKS_PER_SECOND, () => {
            BODIES = BODIES.filter((b) => b.id != text.id);
        });
    }
    function expandingCircle(x, y, color) {
        if (!canvas) return;

        //Create a circle objcet of color that expands and fades.
        const circle = {
            id: Math.random(),
            type: "circle",
            position: { x: x, y: y },
            circleRadius: 5,
            renderFirst: true,
            render: {
                strokeStyle: color,
                lineWidth: 4,
                opactiy: 1
            }
        }

        BODIES.push(circle);

        let initialVelocity = 1;
        let growVelocity = initialVelocity;
        let growAcceleration = -0.002;

        let interval = setInterval(() => {
            if (growVelocity < 0) {
                clearInterval(interval);
                BODIES = BODIES.filter((b) => b.id != circle.id);
            }
            circle.circleRadius += growVelocity;
            growVelocity += growAcceleration;
            circle.render.opacity = growVelocity / initialVelocity + .0001;
        }, 1);
    }

    function handleCollision(bodyA, bodyB, started) {
        //If we have a fruit, mark it as hit
        if (bodyA.fruitType && bodyB.fruitType) {
            bodyA.hitYet = true;
            bodyB.hitYet = true;
        }

        // if (bodyA.impactedByNew || bodyB.impactedByNew) {
        //     if(!bodyA.impactedByNew){
        //         bodyA.impactedByNew = true;
        //         scheduledEvent(NEW_DAMPENING_TIME/TICKS_PER_SECOND, () => {
        //             bodyA.impactedByNew = false;
        //         });
        //     };
        //     if(!bodyB.impactedByNew){
        //         bodyB.impactedByNew = true;
        //         scheduledEvent(NEW_DAMPENING_TIME/TICKS_PER_SECOND, () => {
        //             bodyB.impactedByNew = false;
        //         });
        //     };
        // }

        //If this isn't a new collision, ignore it
        if (!started) return;

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

            const aPosition = bodyA.rigidBody.translation();
            const bPosition = bodyB.rigidBody.translation();

            const averageX = (aPosition.x + bPosition.x) / 2 * RAPIER_MULTIPLIER;
            const averageY = (aPosition.y + bPosition.y) / 2 * RAPIER_MULTIPLIER;

            const averageRotation = (bodyA.rigidBody.rotation() + bodyB.rigidBody.rotation()) / 2;

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

                    scheduledEvent(5000 / TICKS_PER_SECOND, () => {
                        clearInterval(cel);
                    });
                }

                if (newType == "triangle") {
                    //Circle effect and merge effect
                    expandingCircle(averageX, averageY, "black");
                    mergeAllFruitsEffect();
                }
            }

            const scoreaddition = Math.pow(
                Object.keys(TYPE_MAP).indexOf(bodyA.fruitType) + 1,
                2
            );
            SCORE += scoreaddition;

            extraOptions?.onScoreChange?.(SCORE);
            extraOptions?.onMerge?.({
                bodies: [bodyA, bodyB],
                newType: newType,
                score: SCORE,
            });

            let newFruit = addFruit(newType, averageX, averageY);
            newFruit.impactedByNew = true;
            newFruit.rigidBody.setRotation(averageRotation);

            //As any good biologist knows, being sad is a dominant trait
            if (bodyA.isSad || bodyB.isSad) {
                newFruit.isSad = true;
            }

            scheduledEvent(NEW_DAMPENING_TIME / TICKS_PER_SECOND, () => {
                newFruit.impactedByNew = false;
            });

            removeBody(bodyA);
            removeBody(bodyB);

            if (canvas) {
                textPopup(averageX, averageY, `+${scoreaddition}`);
                // confetti(averageX, averageY, newType);
            }
        }
    }
    function markTouchingImpacted(f, depth) {
        const depthLimit = 3;
        if (depth >= depthLimit) return;

        //get all balls touching f by checking if their distance is less than the sum of their radii
        FRUITS.forEach((fruit) => {
            if (fruit.id == f.id) return;
            let distance = Math.sqrt(Math.pow(fruit.rigidBody.translation().x - f.rigidBody.translation().x, 2) + Math.pow(fruit.rigidBody.translation().y - f.rigidBody.translation().y, 2));
            let sumOfRadii = (fruit.colliderDesc.shape.radius) + (f.colliderDesc.shape.radius);
            console.log(distance, sumOfRadii);
            if (distance < sumOfRadii) {
                fruit.impactedByNew = true;
                scheduledEvent(NEW_DAMPENING_TIME / TICKS_PER_SECOND, () => {
                    fruit.impactedByNew = false;
                });
                markTouchingImpacted(fruit, !depth ? 1 : depth + 1);
            }
        });
    }



    //     world.contactPairsWith(f.collider, (otherCollider) => {
    //         console.log(otherCollider, "colides");
    //         let otherBody = BODIES.find((b) => b.collider.handle == otherCollider.handle);
    //         if (otherBody.fruitType && !otherBody.impactedByNew) {
    //             otherBody.impactedByNew = true;
    //             scheduledEvent(NEW_DAMPENING_TIME / TICKS_PER_SECOND, () => {
    //                 otherBody.impactedByNew = false;
    //             });
    //         }
    //         if (!stop) {
    //             markTouchingImpacted(otherBody, !depth ? 1 : depth + 1);
    //         }
    //     });
    // }
    function scheduledEvent(ticks, callback) {
        SCHEDULED_EVENTS.push({
            ticks: ticks,
            callback: callback
        });
    }
    function setFruitStyle(body, type) {
        body.render = {
            ...body.render,
            ...TYPE_MAP[type],
        };
        if (type && TYPE_MAP[type].type == "circle") {
            body.circleRadius = TYPE_MAP[type].radius;
        }
    }
    function addFruit(type, x, y, options) {
        let body
        if (TYPE_MAP[type].type === "circle") {
            body = addCircle(x, y, TYPE_MAP[type].radius);
        } else if (TYPE_MAP[type].type === "triangle") {
            //TODO: implement t
        }
        //Add any other options
        if (options) {
            if (options.forceRadius) {
                removeBody(body);
                body = addCircle(x, y, options.forceRadius);
            }
            if (options.velocity) {
                body.rigidBody.setLinvel(options.velocity, true);
            }
            Object.assign(body, options);
        }

        //Give body angular spin
        if (TYPE_MAP[type].spawnSpin) {
            body.rigidBody.setAngvel(TYPE_MAP[type].spawnSpin);
        }

        setFruitStyle(body, type);
        if (options && options.forceRadius) body.circleRadius = options.forceRadius;
        body.fruitType = type;
        body.fruitTypeNumber = Object.keys(TYPE_MAP).indexOf(type);
        body.hitYet = false;

        if (Math.random() * 10000 == 1) {
            body.isSad = true;
        }

        //Get all balls touching newFruit
        FRUITS.push(body);

        markTouchingImpacted(body);

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
            removeBody(fruit);
        }
        );
        state.fruits.forEach(function (fruit) {
            let addedFruit = addFruit(fruit.fruitType, fruit.position.x * RAPIER_MULTIPLIER, fruit.position.y * RAPIER_MULTIPLIER, {
                velocity: fruit.velocity
            });

            addedFruit.rigidBody.setRotation(fruit.angle);
            addedFruit.isSad = fruit.sad;
        });

        randFunction = RNG(RNG_SEED);
        for (let i = 0; i < RANDOMS_GENERATED; i++) {
            randFunction();
        }
    }
    this.getFullState = () => {
        const simplifiedFruits = FRUITS
            .map((body) => {
                const position = body.rigidBody.translation();
                const velocity = body.rigidBody.linvel();
                const angle = body.rigidBody.rotation();
                return ({
                    position: position,
                    velocity: velocity,
                    fruitType: body.fruitType,
                    angle: angle,
                    sad: body.isSad
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
        addFruit(CURRENT_TYPE, MOUSE_X, DROP_HEIGHT);

        updateCurrentAndNextType();

        setFruitStyle(displayFruit, CURRENT_TYPE);

        //Update DROP_HEIGHT so the "next up ball" moves too
        displayFruit.position.y = -9999;
        scheduledEvent(DROP_MIN_INTERVAL / TICKS_PER_SECOND, () => {
            displayFruit.position.y = DROP_HEIGHT;
        });

        extraOptions?.onDrop?.();
    }
    this.handleMove = (e) => {
        //Clearly we are rendering on a canvas, check anyway to be safe
        if (!canvas) return;

        const realMouseX = e.clientX;
        MOUSE_X = (realMouseX - canvas.getBoundingClientRect().left) / canvas.getBoundingClientRect().width * canvas.width;
        MOUSE_Y = e.clientY;
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
    //Create ground
    let thickness = 10;
    addWall(0.0, SCREEN_HEIGHT + thickness, SCREEN_WIDTH, thickness);
    addWall(SCREEN_WIDTH + thickness, SCREEN_HEIGHT / 2, 10, SCREEN_HEIGHT);
    addWall(-thickness, SCREEN_HEIGHT / 2, 10, SCREEN_HEIGHT);

    const topSensor = {
        fill: "#000",
        y: DROP_HEIGHT * 2
    }


    //Create display ball if we are gonna render
    let displayFruit = {
        renderType: "circle",
        type: "circle",
        renderFirst: true,
        position: { x: SCREEN_WIDTH / 2, y: DROP_HEIGHT },
        render: {
            fillStyle: "red",
        },
        circleRadius: 5
    }
    if (canvas) {
        BODIES.push(displayFruit);
        setFruitStyle(displayFruit, CURRENT_TYPE);
    }

    this.resetToDefaultValues();
}
//Export the game
export default CombineGame;