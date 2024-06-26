import drawBodiesToCanvas from "./utils/render.js";
function CombineGame(RAPIER, canvas, extraOptions) {
  if (!RAPIER) throw "gimme rapier yo";
  //Prevent hacking of global stuff
  const setTimeout = window.setTimeout;
  const setInterval = window.setInterval;
  const clearInterval = window.clearInterval;

  //Define some constants(ish)

  let TYPE_MAP = extraOptions.TYPE_MAP || {};

  const DEFAULT_TICKS_PER_SCEOND = 60;
  let TICKS_PER_SECOND = DEFAULT_TICKS_PER_SCEOND;

  let CURRENT_TICK = 0;
  //Test
  const SCREEN_WIDTH = 1366;
  const SCREEN_HEIGHT = 777;
  const DEFAULT_DROP_HEIGHT = 40;
  this.DEFAULT_DROP_HEIGHT = DEFAULT_DROP_HEIGHT;
  let DROP_HEIGHT = DEFAULT_DROP_HEIGHT;
  let DROP_MIN_INTERVAL = 0.5 * TICKS_PER_SECOND;
  let MOUSE_X = SCREEN_WIDTH / 2;
  let MOUSE_Y = SCREEN_HEIGHT / 2;
  let CURRENT_TYPE;
  let NEXT_TYPE;
  let RNG_SEED = Math.random() * 10000000;
  let LAST_DROP_TIME = 0;
  let CAN_DIE = true;
  let CALM_NEW_FRUIT = true;
  const DEATH_TICK_TIME = 3 * TICKS_PER_SECOND;
  let GAME_ID = Math.random().toString(36).substring(7);
  let DROPS = 0;
  let MINIMIZE_DUPLICATES = false;
  let RANDOMS_GENERATED = 0;
  let SCORE = 0;
  let BODIES = [];
  let FRUITS = [];
  let LAST_TIME_TOO_HIGH = -1;
  let RAPIER_MULTIPLIER = 100;
  this.RAPIER_MULTIPLIER = RAPIER_MULTIPLIER;
  const BALL_RESTITUTION = 0.4;
  const MAX_FRUIT_VELOCITY = 5;
  const NEW_DAMPENING_TIME = 0.3;
  const DAMP_AMOUNT = 250;
  const DEFAULT_DAMP = 0.5;
  const DEFAULT_ANGULAR_DAMP = 2;
  const VERTICAL_EXPLODE_DAMP_MULTIPLIER = 0.5;
  let SCHEDULED_EVENTS = [];
  let ALL_COLLISIONS = [];
  let RENDER_OFFSET = {
    x: 0,
    y: 0,
  };
  const FLOOR_FRICTION = 0.3;
  this.setTypeMap = (map) => {
    TYPE_MAP = map;
    console.log("set to ", map);
  };
  this.getGameId = () => {
    return GAME_ID;
  };
  this.loadExtraOptions = (options) => {
    extraOptions = options;
  };

  function RNG(seed) {
    var m = 2 ** 35 - 31;
    var a = 185852;
    var s = seed % m;
    return function () {
      return (s = (s * a) % m) / m;
    };
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
  };
  this.setMinimalDuplicates = (bool) => {
    MINIMIZE_DUPLICATES = bool;
  };
  function resetRandom() {
    randFunction = RNG(RNG_SEED);
    RANDOMS_GENERATED = 0;
  }

  //Create engine
  const gravity = { x: 0, y: 9.81 };
  const eventQueue = new RAPIER.EventQueue(true);
  const world = new RAPIER.World(gravity);
  world.integrationParameters.numSolverIterations = 20;

  //Rendering stuff
  const ctx = canvas?.getContext("2d");

  const renderFunction = () => {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.save();
    ctx.translate(RENDER_OFFSET.x, RENDER_OFFSET.y);

    //Draw sensor bar
    ctx.save();
    ctx.fillStyle = topSensor.fill;
    ctx.fillRect(0, topSensor.y, SCREEN_WIDTH, 10);
    ctx.restore();

    const firstBodies = [];
    const laterBodies = [];
    BODIES.forEach((body) => {
      if (body.render && body.render.dontRender) return;

      const renderObject = {};

      //Set position
      if (body.position) {
        renderObject.position = body.position;
      } else {
        renderObject.position = {
          x: body.rigidBody.translation().x * RAPIER_MULTIPLIER,
          y: body.rigidBody.translation().y * RAPIER_MULTIPLIER,
        };
      }

      if (body.rigidBody) renderObject.rotation = body.rigidBody.rotation();

      switch (body.type) {
        case "text":
          renderObject.text = body.text;
          break;
        case "circle":
          renderObject.radius =
            body.circleRadius ||
            body.colliderDesc?.shape?.radius * RAPIER_MULTIPLIER;
          break;
        case "t":
          renderObject.radius =
            body.circleRadius ||
            body.colliderDesc?.shape?.radius * RAPIER_MULTIPLIER;
          break;
      }

      renderObject.render = body.render;
      renderObject.type = body.type;
      renderObject.hasFace = body.hasFace;
      renderObject.isSad = body.isSad;

      if (body.renderFirst) {
        firstBodies.push(renderObject);
      } else {
        laterBodies.push(renderObject);
      }
    });

    drawBodiesToCanvas(ctx, firstBodies, MOUSE_X, MOUSE_Y);
    drawBodiesToCanvas(ctx, laterBodies, MOUSE_X, MOUSE_Y);
    ctx.restore();
  };

  this.tick = () => {
    CURRENT_TICK++;
    SCHEDULED_EVENTS.forEach((event) => {
      event.ticks--;
      if (event.ticks <= 0) {
        if (event.callback) event.callback();
        event.clear(true, true);
      }
    });

    //In an attempt to fix performance...
    const handleBodyMap = {};
    let ballsOver = 0;

    FRUITS = BODIES.filter((body) => {
      if (body.rigidBody) handleBodyMap[body.rigidBody.handle] = body;

      if (!body.fruitType) return false;

      //Ensure balls don't go offscreen
      const yPosition = body.rigidBody.translation().y;
      const radius = body.colliderDesc.shape.radius;
      if (yPosition * RAPIER_MULTIPLIER > SCREEN_HEIGHT + 100) {
        //Teleport body to center of screen
        body.rigidBody.setTranslation({
          x: SCREEN_WIDTH / RAPIER_MULTIPLIER / 2,
          y: SCREEN_HEIGHT / RAPIER_MULTIPLIER / 2,
        });
        body.rigidBody.setLinvel({ x: 0, y: 0 }, true);
      }

      if (yPosition + radius + 10 > SCREEN_HEIGHT) {
        //Move body up by 1 tick
        body.rigidBody.setTranslation({
          x: body.rigidBody.translation().x,
          y: 0,
        });
      }

      if (body.hitYet) {
        //EXtra damp vertical velocity
        if (!body.overrideDamping) {
          const yVelocity = body.rigidBody.linvel().y;
          const xVelocity = body.rigidBody.linvel().x;
          if (yVelocity < 0) {
            //Set velocity to .9 times yVelocity
            body.rigidBody.setLinvel(
              { x: xVelocity, y: yVelocity * 0.8 },
              true
            );
          }
        }
        //Cap velocity
        const velocity = body.rigidBody.linvel();
        const speed = Math.sqrt(
          Math.pow(velocity.x, 2) + Math.pow(velocity.y, 2)
        );
        let checkAmount = MAX_FRUIT_VELOCITY;
        const radius = body.colliderDesc.shape.radius;

        //If the body is touching the sensor, cap it at a lower speed
        if (
          Math.abs(yPosition - topSensor.y) < radius ||
          yPosition > topSensor.y
        ) {
          checkAmount *= VERTICAL_EXPLODE_DAMP_MULTIPLIER;
        }

        if (speed > checkAmount) {
          body.velocityCapped = true;
          let angle = Math.atan2(velocity.y, velocity.x);
          body.rigidBody.setLinvel(
            {
              x: Math.cos(angle) * checkAmount,
              y: Math.sin(angle) * checkAmount,
            },
            true
          );
        } else {
          body.velocityCapped = false;
        }
      }
      if (!body.overrideDamping) {
        if (body.impactedByNew) {
          //Lower bouncieness
          body.collider.setRestitution(0);
          body.rigidBody.setLinearDamping(DEFAULT_DAMP * 1.2);
          //If body is moving up, dampen it more
          const velocity = body.rigidBody.linvel();
          if (velocity.y < 0) {
            body.rigidBody.setLinearDamping(
              DAMP_AMOUNT * 0.2 * VERTICAL_EXPLODE_DAMP_MULTIPLIER
            );
          }

          //Cap acceleration
          if (body.lastVelocity) {
            let velocityDiff = {
              x: Math.abs(body.lastVelocity.x - velocity.x),
              y: Math.abs(body.lastVelocity.y - velocity.y),
            };
            let difMag = Math.sqrt(
              Math.pow(velocityDiff.x, 2) + Math.pow(velocityDiff.y, 2)
            );
            if (difMag > 1) {
              body.accelLimited = true;
              body.rigidBody.setLinearDamping(DAMP_AMOUNT);
              let callback = () => {
                if (body.merged) return;
                body.accelLimited = false;
                body.rigidBody.setLinearDamping(DEFAULT_DAMP);
              };
              scheduledEvent(NEW_DAMPENING_TIME * TICKS_PER_SECOND, callback, [
                body,
              ]);
            }
          }
          body.lastVelocity = velocity;
        } else {
          body.rigidBody.setLinearDamping(DEFAULT_DAMP);
          body.rigidBody.setAngularDamping(DEFAULT_ANGULAR_DAMP);
          body.collider.setRestitution(BALL_RESTITUTION);
        }
      }

      //DEATH CHECK
      if (CAN_DIE && body.hitYet) {
        const yVelocity = body.rigidBody.linvel().y;
        const xVelocity = body.rigidBody.linvel().x;
        const radius = body.colliderDesc.shape.radius;
        const position = body.rigidBody.translation();
        //If the body has enough velocity, ignore it
        const ignore =
          Math.sqrt(Math.pow(yVelocity, 2) + Math.pow(xVelocity), 2) > 3 ||
          Math.abs(yVelocity) + Math.abs(xVelocity) > 3;

        let tooHigh = (position.y + radius) * RAPIER_MULTIPLIER < topSensor.y;
        if (tooHigh && !ignore) {
          ballsOver++;
          if (LAST_TIME_TOO_HIGH != -1) {
            let current = CURRENT_TICK - LAST_TIME_TOO_HIGH;

            if (canvas)
              topSensor.fill = `rgb(${(current / DEATH_TICK_TIME) * 255},0,0)`;

            if (current > DEATH_TICK_TIME && CAN_DIE) {
              gameOver();

              return;
            }
          } else {
            LAST_TIME_TOO_HIGH = CURRENT_TICK;
          }
        }
      }
      return body.fruitType;
    });

    if (ballsOver == 0) {
      LAST_TIME_TOO_HIGH = -1;
      topSensor.fill = "rgb(0,0,0)";
    }

    //Update engine
    world.step(eventQueue);

    ALL_COLLISIONS = [];
    eventQueue.drainCollisionEvents((handle1, handle2, started) => {
      //Get body from handle
      ALL_COLLISIONS.push([handle1, handle2, started]);
      let bodyA = handleBodyMap[handle1];
      let bodyB = handleBodyMap[handle2];
      if (started) {
        bodyA?.onCollide?.([bodyA, bodyB, started]);
        bodyB?.onCollide?.([bodyB, bodyA, started]);
      }
      handleCollision(bodyA, bodyB, started);
    });
  };

  this.loop = () => {
    this.tick();

    if (canvas) renderFunction();
    setTimeout(this.loop, 1000 / TICKS_PER_SECOND);
    // requestAnimationFrame(this.loop);
  };
  function setGravityOn(bool) {
    //Loop through all bodies and set their gravity
    BODIES.forEach((body) => {
      if (!body.rigidBody) return;
      body.rigidBody.setGravityScale(bool ? 1 : 0);
    });
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
    CALM_NEW_FRUIT = true;

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
            Math.floor((Math.pow(random, modifier) * 12) / 2)
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
          Math.floor((Math.pow(random, modifier) * 12) / 2)
        ];
    }

    constrainMouseX();
  }
  function generateFilter(member, filter) {
    let memberFilter = "0000000000000000".split("");
    member.forEach((group) => {
      memberFilter[group] = "1";
    });
    memberFilter = memberFilter.reverse().join("");
    memberFilter = parseInt(memberFilter, 2).toString(16).toUpperCase();
    memberFilter = "0".repeat(4 - memberFilter.length) + memberFilter;

    let filterFilter = "0000000000000000".split("");
    filter.forEach((group) => {
      filterFilter[group] = "1";
    });
    filterFilter = filterFilter.reverse().join("");
    filterFilter = parseInt(filterFilter, 2).toString(16).toUpperCase();
    filterFilter = "0".repeat(4 - filterFilter.length) + filterFilter;

    const filterString = "0x" + memberFilter + filterFilter;
    return filterString;
  }
  async function handleTMerge(bodyA, bodyB) {
    if (!CAN_DIE) {
      //T animatino is happening, gotta wait
      await new Promise((resolve) => {
        let t = setInterval(() => {
          if (CAN_DIE) {
            clearInterval(t);
            resolve();
          }
        }, 100);
      });
    }
    CAN_DIE = false;
    scheduledEvent(40 * TICKS_PER_SECOND, () => {
      //Backup just incase
      CAN_DIE = true;
    });
    let both = [bodyA, bodyB];

    both.forEach((b, i) => {
      b.overrideDamping = true;
      b.rigidBody.setLinearDamping(0);
      b.rigidBody.setAngularDamping(0);

      b.rigidBody.setLinvel({ x: 0, y: 0 }, true);
      b.collider.setCollisionGroups(
        generateFilter([bodyB.fruitTypeNumber + i], [bodyB.fruitTypeNumber + i])
      );
      b.rigidBody.setGravityScale(0);
      if (i == 0) {
        let position1 = both[0].rigidBody.translation();
        let position2 = both[1].rigidBody.translation();

        let distance = Math.sqrt(
          Math.pow(position2.x - position1.x, 2) +
            Math.pow(position2.y - position1.y, 2)
        );
        var speed = 0.03 * distance * both[0].rigidBody.mass();

        let angle = Math.atan2(
          position2.y - position1.y,
          position2.x - position1.x
        );
        let xComp = Math.cos(angle) * speed;
        let yComp = Math.sin(angle) * speed;

        var force = {
          x: xComp,
          y: yComp,
        };

        both[0].rigidBody.addForce(force, true);
      }
    });
    let speedUpLoop = setInterval(() => {
      bodyA.rigidBody.addTorque(0.1 * 1, true);
      bodyB.rigidBody.addTorque(0.1 * -1, true);
    }, 1);
    const endTime = 7000;

    const times = [
      { time: 2500, strength: 5 },
      { time: 3700, strength: 10 },
      { time: 5000, strength: 20 },
    ];

    screenShake(2500, 2);

    times.forEach((time, i) => {
      setTimeout(() => {
        screenShake((times[i + 1]?.time || endTime) - time.time, time.strength);
      }, time.time);
    });

    setTimeout(() => {
      clearInterval(speedUpLoop);
      confetti(
        both[0].rigidBody.translation().x * RAPIER_MULTIPLIER,
        both[0].rigidBody.translation().y * RAPIER_MULTIPLIER,
        both[0].fruitType,
        15
      );
      confetti(
        both[1].rigidBody.translation().x * RAPIER_MULTIPLIER,
        both[1].rigidBody.translation().y * RAPIER_MULTIPLIER,
        both[1].fruitType,
        15
      );
      tMergePartTwo(
        bodyA.rigidBody.translation().x * RAPIER_MULTIPLIER,
        bodyA.rigidBody.translation().y * RAPIER_MULTIPLIER
      );
      screenShake(100, 50);
      expandingCircle(
        bodyA.rigidBody.translation().x * RAPIER_MULTIPLIER,
        bodyA.rigidBody.translation().y * RAPIER_MULTIPLIER,
        "rgba(0,0,0,0.77)"
      );
      removeBody(bodyA);
      removeBody(bodyB);
    }, endTime);
  }
  function tMergePartTwo(x, y) {
    let b = addCircle(x, y, 10);
    b.render = {
      fillStyle: "black",
      effect: "pulse",
    };
    b.collider.setCollisionGroups(generateFilter([1], [1]));
    b.rigidBody.setDominanceGroup(10);
    scheduledEvent(6 * TICKS_PER_SECOND, () => {
      console.log("CALLBACK!");
      b.rigidBody.setLinvel({ x: 0, y: 0.5 }, true);
      b.rigidBody.setGravityScale(-0.15);
      scheduledEvent(5 * TICKS_PER_SECOND, () => {
        removeBody(b);
        tMergePartThree(x);
      });
    });
  }
  function tMergePartThree(x) {
    const endTime = 5000;

    const times = [
      { time: 1000, strength: 5 },
      { time: 2000, strength: 10 },
      { time: 3000, strength: 20 },
      { time: 4000, strength: 30 },
    ];

    screenShake(2500, 2);

    times.forEach((time, i) => {
      setTimeout(() => {
        screenShake((times[i + 1]?.time || endTime) - time.time, time.strength);
      }, time.time);
    });

    setTimeout(() => {
      let newFruit = addFruit("d", x, -TYPE_MAP["d"].radius);
      newFruit.rigidBody.setLinvel({ x: 0, y: 80 }, true);
      newFruit.rigidBody.setAngvel(10, true);
      newFruit.collider.setRestitution(0.5);
      newFruit.hasFace = false;
      let stopShake = screenShake(100000, 50);

      newFruit.onCollide = () => {
        newFruit.onCollide = () => {};
        CAN_DIE = true;
        stopShake();

        confetti(
          newFruit.rigidBody.translation().x * RAPIER_MULTIPLIER,
          newFruit.rigidBody.translation().y * RAPIER_MULTIPLIER,
          newFruit.fruitType,
          15,
          8
        );

        //Give all bodies a force away from newFruit
        FRUITS.forEach((fruit) => {
          if (fruit.id == newFruit.id) return;

          let position = fruit.rigidBody.translation();
          let xDistance = position.x - newFruit.rigidBody.translation().x;
          let maxDistance = x > position.x ? x : SCREEN_WIDTH - x;
          console.log(1 - Math.abs(xDistance / maxDistance));
          let speed =
            (1 - Math.abs(xDistance / maxDistance)) *
            Math.sign(xDistance) *
            500;
          fruit.rigidBody.applyImpulse({ x: speed, y: 0 }, true);
        });
      };
    }, endTime);
  }
  function screenShake(length, strength) {
    //Shake using RENDER_OFFSET
    let shakeLoop = setInterval(() => {
      RENDER_OFFSET.x = (Math.random() - 0.5) * strength;
      RENDER_OFFSET.y = (Math.random() - 0.5) * strength;
    }, 10);
    const stop = () => {
      clearInterval(shakeLoop);
      RENDER_OFFSET = { x: 0, y: 0 };
    };
    setTimeout(stop, length || 500);
    return stop;
  }
  function mergeAllFruitsEffect(depth) {
    if (!depth) depth = 0;
    var num = -1;
    setGravityOn(false);

    //Update collision filtering so bodies only collide with others of the same type
    FRUITS.forEach((fruit) => {
      if (fruit.fruitType == "t") return;
      fruit.collider.setCollisionGroups(
        generateFilter([fruit.fruitTypeNumber], [1, fruit.fruitTypeNumber])
      );
      fruit.collider.setSolverGroups(
        generateFilter([fruit.fruitTypeNumber], [1, fruit.fruitTypeNumber])
      );
    });

    CAN_DIE = false;
    CALM_NEW_FRUIT = false;

    let cleanup = () => {
      let duplicatesFound = false;
      FRUITS = BODIES.filter((body) => body.fruitType);

      //Loop through all fruits and check if any have the same type
      FRUITS.forEach((fruit) => {
        let sameType = FRUITS.filter(
          (f) => f.fruitTypeNumber == fruit.fruitTypeNumber
        );
        if (sameType.length > 1) {
          duplicatesFound = true;
        }
      });

      if (duplicatesFound && depth < 5) {
        mergeAllFruitsEffect(depth + 1);
        return;
      }

      FRUITS.forEach((fruit) => {
        fruit.collider.setCollisionGroups(generateFilter([1], [1]));
        fruit.collider.setSolverGroups(generateFilter([1], [1]));
        fruit.passGravFilterTraits = false;
      });

      setGravityOn(true);
      CAN_DIE = true;
      CALM_NEW_FRUIT = true;
    };
    let merge = () => {
      //Kill all velocities
      BODIES.forEach((body) => {
        if (body.rigidBody) {
          body.rigidBody.setLinvel({ x: 0, y: 0 }, true);
          body.rigidBody.setAngvel(0, true);
        }
      });

      let fruitOfNum = [];
      while (fruitOfNum.length <= 1) {
        num++;
        fruitOfNum = FRUITS.filter((x) => x.fruitTypeNumber == num);
        if (num > 9) {
          cleanup();
          return;
        }
      }

      scheduledEvent(3 * TICKS_PER_SECOND, () => {
        merge();
      });

      for (var i = 0; i < fruitOfNum.length - 1; i += 2) {
        var body1 = fruitOfNum[i];
        var body2 = fruitOfNum[i + 1];

        let mergeId = Math.random();
        body1.specialMergeGroup = mergeId;
        body2.specialMergeGroup = mergeId;

        let position1 = body1.rigidBody.translation();
        let position2 = body2.rigidBody.translation();

        //Ensure that body2 is the lower one
        if (position1.y > position2.y) {
          let temp = body1;
          body1 = body2;
          body2 = temp;
        }

        position1 = body1.rigidBody.translation();
        position2 = body2.rigidBody.translation();
        let distance = Math.sqrt(
          Math.pow(position2.x - position1.x, 2) +
            Math.pow(position2.y - position1.y, 2)
        );
        var speed = 5 * distance * body1.rigidBody.mass();
        //Using trig, find the force to apply to body1 to make it move towards body2
        let angle = Math.atan2(
          position2.y - position1.y,
          position2.x - position1.x
        );
        let xComp = Math.cos(angle) * speed;
        let yComp = Math.sin(angle) * speed;

        var force = {
          x: xComp,
          y: yComp,
        };

        body1.rigidBody.addForce(force, true);

        let inheritGravAndFilter = (newFruit, mergingFruits) => {
          if (
            mergingFruits[0].passGravFilterTraits ||
            mergingFruits[1].passGravFilterTraits
          ) {
            newFruit.collider.setCollisionGroups(
              generateFilter(
                [newFruit.fruitTypeNumber],
                [1, newFruit.fruitTypeNumber]
              )
            );
            newFruit.collider.setSolverGroups(
              generateFilter(
                [newFruit.fruitTypeNumber],
                [1, newFruit.fruitTypeNumber]
              )
            );
            newFruit.rigidBody.setGravityScale(0);
            newFruit.passGravFilterTraits = true;
            newFruit.onMerge = inheritGravAndFilter;
          }
        };

        body1.passGravFilterTraits = true;
        body2.passGravFilterTraits = true;

        body1.onMerge = inheritGravAndFilter;
        body2.onMerge = inheritGravAndFilter;
      }
    };
    merge();
  }
  this.mergeAllFruitsEffect = mergeAllFruitsEffect;
  function addt(x, y, radius) {
    //Add points to array. Points make equilateral t of furthest length radius
    radius /= RAPIER_MULTIPLIER;
    const points = new Float32Array([
      0,
      -radius,
      (radius * Math.sqrt(3)) / 2,
      radius / 2,
      (-radius * Math.sqrt(3)) / 2,
      radius / 2,
    ]);
    let tColliderDesc = RAPIER.ColliderDesc.convexHull(points);
    let tBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x / RAPIER_MULTIPLIER, y / RAPIER_MULTIPLIER)
      .setCcdEnabled(true);
    let tRigidBody = world.createRigidBody(tBodyDesc);

    tColliderDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    tColliderDesc.setRestitution(BALL_RESTITUTION);
    tColliderDesc.setFriction(FLOOR_FRICTION);
    tColliderDesc.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max);
    tColliderDesc.setMass(radius * RAPIER_MULTIPLIER);
    tColliderDesc.shape.radius = radius * 0.5;
    //Damp ts cuz they damn bouncy
    tRigidBody.setLinearDamping(DAMP_AMOUNT);

    let collider = world.createCollider(tColliderDesc, tRigidBody);
    collider.setRestitution(0);
    let addition = {
      id: Math.random(),
      type: "t",
      renderType: "t",
      rigidBody: tRigidBody,
      colliderDesc: tColliderDesc,
      collider: collider,
      rigidBodyDesc: tBodyDesc,
      render: {},
    };
    setFruitStyle(addition, "t");
    BODIES.push(addition);
    return addition;
  }
  function addCircle(x, y, radius, props) {
    let ballColliderDesc = RAPIER.ColliderDesc.ball(
      radius / RAPIER_MULTIPLIER
    ).setRestitution(BALL_RESTITUTION);
    let ballBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x / RAPIER_MULTIPLIER, y / RAPIER_MULTIPLIER)
      .setCcdEnabled(true);
    let ballRigidBody = world.createRigidBody(ballBodyDesc);

    ballColliderDesc.setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS);
    ballColliderDesc.setFriction(0.2);
    ballColliderDesc.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max);

    ballColliderDesc.setMass(Math.log(radius) / Math.log(1.1) + 10);

    let collider = world.createCollider(ballColliderDesc, ballRigidBody);
    let addition = {
      id: Math.random(),
      type: "circle",
      renderType: "circle",
      rigidBody: ballRigidBody,
      rigidBodyDesc: ballBodyDesc,
      colliderDesc: ballColliderDesc,
      collider: collider,
    };

    if (props) {
      Object.keys(props).forEach((key) => {
        addition[key] = props[key];
      });
    }

    BODIES.push(addition);
    return addition;
  }
  this.addCircle = addCircle;
  function addWall(x, y, width, height) {
    let wallColliderDesc = RAPIER.ColliderDesc.cuboid(
      width / RAPIER_MULTIPLIER,
      height / RAPIER_MULTIPLIER
    );
    let wallBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(
      x / RAPIER_MULTIPLIER,
      y / RAPIER_MULTIPLIER
    );
    let wallRigidBody = world.createRigidBody(wallBodyDesc);
    wallColliderDesc.setFriction(FLOOR_FRICTION);
    let collider = world.createCollider(wallColliderDesc, wallRigidBody);
    collider.setCollisionGroups(
      generateFilter([1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    );
    collider.setSolverGroups(
      generateFilter([1], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])
    );

    let addition = {
      type: "rectangle",
      rigidBody: wallRigidBody,
      rigidBodyDesc: wallBodyDesc,
      colliderDesc: wallColliderDesc,
      render: {
        fillStyle: "black",
      },
      collider: collider,
    };
    BODIES.push(addition);
    return addition;
  }
  function removeBody(body) {
    world.removeRigidBody(body.rigidBody);
    BODIES = BODIES.filter((b) => b.id != body.id);
    FRUITS = FRUITS.filter((b) => b.id != body.id);
    clearEventsForBody(body);
  }
  this.removeBody = removeBody;
  function confetti(x, y, type, speedMod, radiusMod) {
    //Spawn confetti at points x,y. Match the style of the type
    if (!canvas) return;
    let r = TYPE_MAP[type].radius;

    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * (speedMod || 4) + 1;
      let radius;
      let confetti;
      if (type === "t") {
        radius = 15;
        confetti = addt(x, y, radius);

        confetti.rigidBody.setLinearDamping(0.1);
        confetti.rigidBody.setAngularDamping(0.1);
        confetti.overrideDamping = true;
      } else {
        radius = 5 * (radiusMod || 1);
        confetti = addCircle(
          x + Math.cos(angle) * r,
          y + Math.sin(angle) * r,
          radius
        );
      }

      setFruitStyle(confetti, type);
      delete confetti.render.effect;
      delete confetti.render.shadowBlur;
      console.log(confetti);

      confetti.circleRadius = radius;

      confetti.rigidBody.setLinvel(
        { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        true
      );
      confetti.rigidBody.setAngvel((Math.random() - 0.5) * 20, true);
      //Set collision groups
      confetti.collider.setCollisionGroups(generateFilter([15], [15]));
      confetti.collider.setSolverGroups(generateFilter([15], [15]));

      confetti.collider.setSensor(true);

      scheduledEvent(
        (2 + Math.random() * 1) * TICKS_PER_SECOND,
        () => {
          removeBody(confetti);
        },
        [confetti]
      );
    }
  }
  this.allBodies = () => {
    return BODIES;
  };
  this.allFruit = () => {
    return FRUITS;
  };
  function textPopup(x, y, textValue) {
    if (!canvas) return;

    const text = {
      id: Math.random(),
      type: "text",
      text: textValue,
      position: { x: x, y: y },
    };

    scheduledEvent(2 * TICKS_PER_SECOND, () => {
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
        opacity: 1,
      },
    };

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
      circle.render.opacity = growVelocity / initialVelocity + 0.0001;
    }, 10);
  }

  function handleCollision(bodyA, bodyB, started) {
    //If we have a fruit, mark it as hit
    if (bodyA.fruitType && bodyB.fruitType) {
      bodyA.hitYet = true;
      bodyB.hitYet = true;
    }

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

      const aPosition = bodyA.rigidBody.translation();
      const bPosition = bodyB.rigidBody.translation();

      const averageX = ((aPosition.x + bPosition.x) / 2) * RAPIER_MULTIPLIER;
      const averageY = ((aPosition.y + bPosition.y) / 2) * RAPIER_MULTIPLIER;

      const averageRotation =
        (bodyA.rigidBody.rotation() + bodyB.rigidBody.rotation()) / 2;
      const newType = nextType(bodyA.fruitType);
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

      if (newType != "d") {
        let newFruit = addFruit(newType, averageX + 1, averageY);
        newFruit.impactedByNew = CALM_NEW_FRUIT && true;
        newFruit.rigidBody.setRotation(averageRotation);
        let radius;
        let inWall;
        try {
          radius = newFruit.colliderDesc.shape.radius * RAPIER_MULTIPLIER;
          inWall = averageY + radius > SCREEN_HEIGHT;

          if (inWall) {
            newFruit.overrideDamping = true;
            newFruit.rigidBody.setLinearDamping(300);
            newFruit.rigidBody.setAngularDamping(300);
          }
        } catch (e) {
          console.log(e);
        }
        //As any good biologist knows, being sad is a dominant trait
        if (bodyA.isSad || bodyB.isSad) {
          newFruit.isSad = true;
        }
        //If it doesnt impact others, remove the flag. Note that we leave it for a second so it can spread
        scheduledEvent(
          (inWall ? 2 : newFruit.othersImpacted > 1 ? 1 : 0.1) *
            NEW_DAMPENING_TIME *
            TICKS_PER_SECOND,
          () => {
            if (inWall) {
              newFruit.overrideDamping = false;
            }
            newFruit.impactedByNew = false;
          },
          [newFruit]
        );

        //If body has a beforeMerge listner, ring its line 📞📞
        if (bodyA.onMerge) bodyA.onMerge(newFruit, [bodyA, bodyB]);
        if (bodyB.onMerge) bodyB.onMerge(newFruit, [bodyA, bodyB]);

        removeBody(bodyA);
        removeBody(bodyB);

        if (canvas) {
          //Some types have visual celebrations
          if (newType == "r") {
            //Spawn confetti at random points throughout screen
            let cel = setInterval(() => {
              let rx = Math.random() * window.innerWidth;
              let ry = Math.random() * window.innerHeight;
              confetti(rx, ry, "r");
            }, 300);

            scheduledEvent(3 * TICKS_PER_SECOND, () => {
              clearInterval(cel);
            });
          }
          if (newType == "t") {
            CAN_DIE = false;
            newFruit.rigidBody.setAngvel(10, true);
            newFruit.rigidBody.setAngularDamping(0.7);

            expandingCircle(averageX, averageY, "black");
            //Update collision filtering so bodies only collide with others of the same type
            FRUITS.forEach((fruit) => {
              fruit.collider.setCollisionGroups(
                generateFilter(
                  [fruit.fruitTypeNumber],
                  [1, fruit.fruitTypeNumber]
                )
              );
              fruit.collider.setSolverGroups(
                generateFilter(
                  [fruit.fruitTypeNumber],
                  [1, fruit.fruitTypeNumber]
                )
              );
            });
            setGravityOn(false);
            scheduledEvent(5 * TICKS_PER_SECOND, () => {
              mergeAllFruitsEffect();
            });
          }
          textPopup(averageX, averageY, `+${scoreaddition}`);
          confetti(averageX, averageY, newType);
        }
      } else {
        handleTMerge(bodyA, bodyB);
      }
    }
  }
  function markTouchingImpacted(f, depth, listOfImpacted) {
    const depthLimit = 3;
    if (depth >= depthLimit) return;
    if (!listOfImpacted) listOfImpacted = [];
    f.othersImpacted = f.othersImpacted || 0;

    FRUITS = BODIES.filter((body) => body.fruitType);

    //get all balls touching f by checking if their distance is less than the sum of their radii
    FRUITS.forEach((fruit) => {
      if (listOfImpacted.includes(fruit.id)) return;
      if (fruit.id == f.id) return;
      let distance = Math.sqrt(
        Math.pow(
          fruit.rigidBody.translation().x - f.rigidBody.translation().x,
          2
        ) +
          Math.pow(
            fruit.rigidBody.translation().y - f.rigidBody.translation().y,
            2
          )
      );
      let sumOfRadii =
        fruit.colliderDesc.shape.radius + f.colliderDesc.shape.radius;
      if (distance < sumOfRadii) {
        fruit.impactedByNew = CALM_NEW_FRUIT && true;
        listOfImpacted.push(fruit.id);
        f.othersImpacted++;
        scheduledEvent(
          NEW_DAMPENING_TIME * TICKS_PER_SECOND,
          () => {
            fruit.impactedByNew = false;
          },
          [fruit]
        );
        markTouchingImpacted(fruit, !depth ? 1 : depth + 1, listOfImpacted);
      }
    });
  }

  //     world.contactPairsWith(f.collider, (otherCollider) => {
  //         console.log(otherCollider, "colides");
  //         let otherBody = BODIES.find((b) => b.collider.handle == otherCollider.handle);
  //         if (otherBody.fruitType && !otherBody.impactedByNew) {
  //             otherBody.impactedByNew = true;
  //             scheduledEvent(NEW_DAMPENING_TIME * TICKS_PER_SECOND, () => {
  //                 otherBody.impactedByNew = false;
  //             });
  //         }
  //         if (!stop) {
  //             markTouchingImpacted(otherBody, !depth ? 1 : depth + 1);
  //         }
  //     });
  // }
  function clearEventsForBody(body) {
    SCHEDULED_EVENTS.forEach((event) => {
      if (event.bodyHandles.includes(body.rigidBody.handle)) {
        event.clear(true, false);
      }
    });
  }
  function scheduledEvent(ticks, callback, bodiesInvolved, clearCallback) {
    let id = Math.random();
    let bodyHandles = [];
    if (bodiesInvolved) {
      bodyHandles = bodiesInvolved.map((body) => body.rigidBody.handle);
    }
    const clearFunction = (callFunction, onTime) => {
      SCHEDULED_EVENTS = SCHEDULED_EVENTS.filter((event) => {
        return event.id != id;
      });
      if (callFunction) {
        if (clearCallback) clearCallback(onTime);
      }
    };
    SCHEDULED_EVENTS.push({
      ticks: ticks,
      callback: callback,
      bodyHandles: bodyHandles,
      id: id,
      clear: clearFunction,
    });
    return {
      clear: clearFunction,
    };
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
    let body;
    if (TYPE_MAP[type].type === "circle") {
      body = addCircle(x, y, TYPE_MAP[type].radius);
    } else if (TYPE_MAP[type].type === "t") {
      body = addt(x, y, TYPE_MAP[type].radius);
    }
    if (type == 0) {
      body.colliderDesc.setMass(10);
    }

    // body.rigidBodyDesc.setCanSleep(false);
    body.collider.setCollisionGroups(generateFilter([1], [1]));
    body.collider.setSolverGroups(generateFilter([1], [1]));
    body.rigidBody.setLinearDamping(DEFAULT_ANGULAR_DAMP);

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
    // body.collider.setSensor(true);
    setFruitStyle(body, type);
    if (options && options.forceRadius) body.circleRadius = options.forceRadius;
    body.fruitType = type;
    body.fruitTypeNumber = Object.keys(TYPE_MAP).indexOf(type);
    body.hitYet = false;
    body.hasFace = true;
    if (Math.random() * 1000 == 1) {
      body.isSad = true;
    } else {
      body.isSad = false;
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

    if (state.GAME_ID) {
      GAME_ID = state.GAME_ID;
    }

    MINIMIZE_DUPLICATES = state.minimizeDuplicates;
    DROPS = state.drops;
    RANDOMS_GENERATED = state.randsGenerated;
    SCORE = state.score;
    extraOptions?.onScoreChange?.(SCORE);

    FRUITS.forEach((fruit) => {
      removeBody(fruit);
    });
    state.fruits.forEach(function (fruit) {
      if (fruit.sad == undefined) {
        //We are looking at an old save
        localStorage.clear();

        scheduledEvent(1 * TICKS_PER_SECOND, () => {
          window.location.reload();
        });
      }
      let addedFruit = addFruit(
        fruit.fruitType,
        fruit.position.x * RAPIER_MULTIPLIER,
        fruit.position.y * RAPIER_MULTIPLIER,
        {
          velocity: fruit.velocity,
        }
      );

      addedFruit.rigidBody.setRotation(fruit.angle);
      addedFruit.isSad = fruit.sad;
      addedFruit.hasFace = fruit.hasFace || fruit.fruitType != "d";
    });

    randFunction = RNG(RNG_SEED);
    for (let i = 0; i < RANDOMS_GENERATED; i++) {
      randFunction();
    }
  };
  this.getFullState = () => {
    const simplifiedFruits = FRUITS.map((body) => {
      const position = body.rigidBody.translation();
      const velocity = body.rigidBody.linvel();
      const angle = body.rigidBody.rotation();
      return {
        position: position,
        velocity: velocity,
        fruitType: body.fruitType,
        angle: angle,
        sad: body.isSad,
        hasFace: body.hasFace,
      };
    });
    return {
      fruits: simplifiedFruits,
      currentType: CURRENT_TYPE,
      nextType: NEXT_TYPE,
      drops: DROPS,
      randsGenerated: RANDOMS_GENERATED,
      score: SCORE,
      minimizeDuplicates: MINIMIZE_DUPLICATES,
      GAME_ID: GAME_ID,
    };
  };
  this.getNextDropColor = () => {
    //Return fill color of next drop
    return TYPE_MAP[NEXT_TYPE].fillStyle;
  };
  this.handleClick = (e) => {
    //Clearly we are rendering on a canvas, check anyway to be safe
    if (!canvas) return;
    if (!CAN_DIE) return;

    if (CURRENT_TICK - LAST_DROP_TIME < DROP_MIN_INTERVAL) return;
    LAST_DROP_TIME = CURRENT_TICK;

    localStorage.setItem("lastInteract", GAME_ID);

    DROPS++;
    addFruit(CURRENT_TYPE, MOUSE_X, DROP_HEIGHT);

    updateCurrentAndNextType();

    setFruitStyle(displayFruit, CURRENT_TYPE);

    //Update DROP_HEIGHT so the "next up ball" moves too
    BODIES.forEach((body) => {
      if (body.id == displayFruit.id) {
        body.position.y = -9999;
      }
    });
    scheduledEvent(DROP_MIN_INTERVAL, () => {
      BODIES.forEach((body) => {
        if (body.id == displayFruit.id) {
          body.position.y = DROP_HEIGHT;
        }
      });
    });

    extraOptions?.onDrop?.();
  };
  this.handleMove = (e) => {
    //Clearly we are rendering on a canvas, check anyway to be safe
    if (!canvas) return;

    const realMouseX = e.clientX;
    const realMouseY = e.clientY;
    MOUSE_X =
      ((realMouseX - canvas.getBoundingClientRect().left) /
        canvas.getBoundingClientRect().width) *
      canvas.width;
    MOUSE_Y =
      ((realMouseY - canvas.getBoundingClientRect().top) /
        canvas.getBoundingClientRect().height) *
      canvas.height;
    constrainMouseX(realMouseX);
  };
  function constrainMouseX(realMouseX) {
    let currentRadius = TYPE_MAP[CURRENT_TYPE].radius;
    if (MOUSE_X - currentRadius < 0) {
      MOUSE_X = currentRadius;
    } else if (MOUSE_X + currentRadius > canvas.width) {
      MOUSE_X = canvas.width - currentRadius;
    }
    if (realMouseX < canvas.getBoundingClientRect().left) {
      MOUSE_X = currentRadius;
    } else if (
      realMouseX >
      canvas.getBoundingClientRect().width + canvas.getBoundingClientRect().left
    ) {
      MOUSE_X = canvas.width - currentRadius;
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
    y: DROP_HEIGHT * 2,
  };

  //Create display ball if we are gonna render
  let displayFruit = {
    renderType: "circle",
    type: "circle",
    renderFirst: true,
    position: { x: SCREEN_WIDTH / 2, y: DROP_HEIGHT },
    render: {
      fillStyle: "red",
    },
    circleRadius: 5,
    hasFace: true,
    id: "displayFruit",
  };
  if (canvas) {
    BODIES.push(displayFruit);
    setFruitStyle(displayFruit, CURRENT_TYPE);
  }

  this.resetToDefaultValues();

  document.body.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() == " ") {
      TICKS_PER_SECOND = 600;
    }
  });

  document.body.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() == " ") {
      TICKS_PER_SECOND = DEFAULT_TICKS_PER_SCEOND;
    }
  });
}
//Export the game
export default CombineGame;
