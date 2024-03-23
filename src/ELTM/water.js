import removeBody from './removeBody';
import { addEffect, Circle, Rectangle } from './effects';
let WATER_PARTICLES = [];
function waterify(body, game) {
    const waterFruitType = body.fruitTypeNumber;
    const waterId = body.id;
    const bodyPosition = body.rigidBody.translation();
    bodyPosition.x *= game.RAPIER_MULTIPLIER;
    bodyPosition.y *= game.RAPIER_MULTIPLIER;
    const bodyRadius = body.circleRadius;
    const baseParticleSize = 4;
    let particleAmount = (bodyRadius * bodyRadius) / (baseParticleSize * baseParticleSize);
    particleAmount = Math.pow(particleAmount, 3 / 4) * 2.25;
    particleAmount = Math.max(particleAmount, 500);

    const fillStyle = body.render.fillStyle;
    removeBody(body, game);


    //Lil special effect nun crazy
    addEffect(
        new Circle(
            {
                x: bodyPosition.x,
                y: bodyPosition.y,
                radius: 0,
                fillStyle: body.render.fillStyle,
                strokeStyle: body.render.fillStyle,
                lineWidth: 0,
                fill: true,
                stroke: true
            },
            {
                x: bodyPosition.x,
                y: bodyPosition.y,
                radius: bodyRadius,
                fillStyle: `${body.render.fillStyle}00`,
                strokeStyle: body.render.fillStyle,
                lineWidth: 5
            },
            250,
            "cubic-bezier(0,0,.28,1.12)"
        )
    );

    const particlesMade = [];
    const bodiesWatered = [];
    const wateredEffects = [];
    for (let i = 0; i < particleAmount; i++) {
        let particleSize = baseParticleSize + (Math.random() - .8) * 1.5;
        const xShift = (Math.random() - .5) * 2 * bodyRadius;
        const yShift = Math.sqrt(bodyRadius * bodyRadius - xShift * xShift) * (Math.random() - .5) * 2;

        //Make sure particles are not too close to each other
        let tooClose = false;
        for (let j = 0; j < particlesMade.length; j++) {
            const dif = Math.sqrt((xShift - particlesMade[j].xShift) ** 2 + (yShift - particlesMade[j].yShift) ** 2);
            if (dif < particleSize + particlesMade[j].particleSize) {
                tooClose = true;
                break;
            }
        }
        if (tooClose) {
            continue;
        }

        particlesMade.push({ xShift, yShift, particleSize });
        const x = bodyPosition.x + xShift;
        const y = bodyPosition.y + yShift;
        const particle = game.addCircle(x, y, particleSize, {
            render: {
                dontRender: true,
                fillStyle: fillStyle
            },
            overrideDamping: true,
            waterId: waterId,
            circleRadius: particleSize,
        });
        // particle.colliderDesc.setMass(0.0000000000000000000000000000001);
        // particle.colliderDesc.setDensity(0.000000000000000000000000001);
        particle.colliderDesc.setMass(1);
        // particle.colliderDesc.setDensity(1);
        particle.colliderDesc.setFriction(1);
        particle.collider.setRestitution(0);
        particle.rigidBody.setLinearDamping(200);
        particle.rigidBody.setAngularDamping(0);

        particle.rigidBody.setDominanceGroup(-1);
        setTimeout(() => {
            if (particle.removed) return;
            particle.rigidBody.setDominanceGroup(0);
        }, 100);
        WATER_PARTICLES.push(particle);
        particle.onCollide = (involved) => {
            let other = involved[1];
            if (particle.removed || other.removed) return;
            if (other.fruitTypeNumber === waterFruitType) {
                //First time this little guy has interacted with ltm stuff, they grow up so fast 🥹
                if (!other.eltm) other.eltm = {};

                if (!bodiesWatered.includes(other)) {
                    bodiesWatered.push(other);
                }

                const targetWater = particlesMade.length / 3;
                other.eltm.wateredAmount = other.eltm.wateredAmount ? other.eltm.wateredAmount + 1 : 1;
                other.eltm.targetWater = targetWater;

                let otherPosition = other.rigidBody.translation();
                otherPosition.x *= game.RAPIER_MULTIPLIER;
                otherPosition.y *= game.RAPIER_MULTIPLIER;

                //Half of the water is prolly enough
                if (other.eltm.wateredAmount > targetWater) {
                    //Watered enough, let it grow!!
                    let nextType = Object.keys(game.TYPE_MAP)[waterFruitType + 1];
                    console.log(other.eltm.wateredAmountEffect.onDone, other.eltm.wateredAmountEffect);
                    other.eltm.wateredAmountEffect.onDone();
                    removeBody(other, game);
                    game.addFruit(nextType, otherPosition.x, otherPosition.y);
                } else {
                    //Not enough water, guess ill die
                    particle.markedForRemove = true;
                    removeBody(particle, game);
                    WATER_PARTICLES = WATER_PARTICLES.filter(p => !p.markedForRemove);


                    if (!other.eltm.wateredAmountEffect) {
                        let wateredAmountEffect = new Rectangle(
                            {
                                //Can use bodyRadius here cuz we know that any fruit that can be watered would have to be the same type
                                x: otherPosition.x - bodyRadius,
                                y: otherPosition.y + bodyRadius,
                                width: bodyRadius * 2,
                                height: 0,
                                fillStyle: "#030303",
                                strokeStyle: fillStyle,
                                lineWidth: 0,
                                globalAlpha: .2,
                                fill: true,
                                stroke: true
                            },
                            undefined,
                            99999999999999
                        );
                        wateredAmountEffect.beforeDraw = (ctx, props) => {
                            console.log("clipping");

                            if (other.removed || other.merged) {
                                wateredAmountEffect.onDone();
                                return;
                            }
                            const bodyPosition = other.rigidBody.translation();
                            bodyPosition.x *= game.RAPIER_MULTIPLIER;
                            bodyPosition.y *= game.RAPIER_MULTIPLIER;
                            const bodyRadius = other.circleRadius;
                            const height = other.eltm.wateredAmount / other.eltm.targetWater * bodyRadius * 2;


                            ctx.beginPath();
                            ctx.arc(bodyPosition.x, bodyPosition.y, bodyRadius, 0, 2 * Math.PI);
                            ctx.clip();


                            wateredAmountEffect.initial.x = bodyPosition.x - bodyRadius;
                            wateredAmountEffect.initial.y = bodyPosition.y + bodyRadius - height;
                            wateredAmountEffect.initial.height = height;
                        }
                        wateredEffects.push(wateredAmountEffect);
                        addEffect(wateredAmountEffect);
                        other.eltm.wateredAmountEffect = wateredAmountEffect;
                    }
                }
            } else if (other.waterId && other.waterId == waterId && !involved[3]) {
                if (particle.removed || other.removed) return;

                //Give both bodies a small force towards each other
                //try to add some surface tension
                const otherPosition = other.rigidBody.translation();
                const thisPosition = particle.rigidBody.translation();
                const dif = {
                    x: otherPosition.x - thisPosition.x,
                    y: otherPosition.y - thisPosition.y
                }
                const distance = Math.sqrt(dif.x ** 2 + dif.y ** 2);
                const angle = Math.atan2(dif.y, dif.x);
                const force = 1 / (distance ** 2) * .1;
                const forceX = Math.cos(angle) * force;
                const forceY = Math.sin(angle) * force;
                particle.rigidBody.applyImpulse({ x: forceX, y: forceY });
                other.rigidBody.applyImpulse({ x: -forceX, y: -forceY });
            }
        }
    }

    setTimeout(() => {
        let count = WATER_PARTICLES.length;
        WATER_PARTICLES.forEach(particle => {
            setTimeout(() => {
                if (particle.markedForRemove) return;
                if (waterId !== particle.waterId) return;

                particle.markedForRemove = true;
                removeBody(particle, game);
                WATER_PARTICLES = WATER_PARTICLES.filter(p => !p.markedForRemove);

                count--;
                if (count === 0) {
                    bodiesWatered.forEach(body => {
                        if (body.removed || body.merged) return;
                        body.eltm.wateredAmountEffect.onDone();
                        body.eltm.wateredAmountEffect = null;
                    });
                    wateredEffects.forEach(effect => effect.onDone());
                }
            }, Math.random() * 1000)
        }
        );
    }, 10 * 1000);

    renderWater(game);
}

const canvas = document.getElementById("waterCanvas");
const ctx = canvas.getContext("2d");
function renderWater(game) {
    //Using seperate canvas for water so we have to render seperately
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    WATER_PARTICLES.forEach(particle => {
        if (particle.markedForRemove) return;
        particle.rigidBody.setLinearDamping(2);


        const position = particle.rigidBody.translation();
        position.x *= game.RAPIER_MULTIPLIER;
        position.y *= game.RAPIER_MULTIPLIER;
        ctx.beginPath();
        ctx.arc(position.x, position.y, particle.circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = particle.render.fillStyle;
        ctx.fill();
    });

    if (WATER_PARTICLES.length > 0) {
        requestAnimationFrame(() => {
            renderWater(game)
        });
    }
}
export default waterify;