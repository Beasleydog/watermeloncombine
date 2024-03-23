import hexToRgb from './utils/hexToRgb';
import BezierEasing from 'bezier-easing';

let EFFECTS = [];

const canvas = document.getElementById("effectsCanvas");
const ctx = canvas.getContext("2d");
let renderLoopActive = false;
function renderEffects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    EFFECTS.forEach(effect => {
        try {
            ctx.save();
            effect.draw();
            ctx.restore();
        } catch (e) {
            console.error(e);
        }
    });
    if (EFFECTS.length > 0) {
        renderLoopActive = true;
        requestAnimationFrame(renderEffects);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        renderLoopActive = false;
    }
}
export function addEffect(effect) {
    effect.onDone = () => {
        EFFECTS = EFFECTS.filter(e => e.id !== effect.id);
    };
    EFFECTS.push(effect);

    if (!renderLoopActive) {
        renderEffects();
    }
}
export class Effect {
    constructor(initial, final, time, timingFunction) {
        this.initial = initial;
        this.final = final || initial;
        this.time = time;
        this.startTime = Date.now();
        this.endTime = this.startTime + time;
        this.id = Math.random();
        this.timingFunction = timingFunction || "cubic-bezier(0,0,1,1)";
    }
}
export class Circle extends Effect {
    draw() {
        const props = interpolate(this.initial, this.final, this.time, this.startTime, this.timingFunction);

        applyProps(props, ctx);
        ctx.beginPath();
        ctx.arc(props.x, props.y, Math.max(props.radius, 0), 0, 2 * Math.PI);

        if (this.initial.fill) ctx.fill();
        if (this.initial.stroke) ctx.stroke();

        if (Date.now() >= this.endTime) {
            this?.onDone?.();
        }
    }
}
export class Rectangle extends Effect {
    draw() {
        const props = interpolate(this.initial, this.final, this.time, this.startTime, this.timingFunction);
        applyProps(props, ctx);

        this?.beforeDraw?.(ctx, props);

        ctx.beginPath();
        ctx.rect(props.x, props.y, props.width, props.height);
        if (this.initial.fill) ctx.fill();
        if (this.initial.stroke) ctx.stroke();

        if (Date.now() >= this.endTime) {
            this?.onDone?.();
        }
    }
}

function applyProps(props, ctx) {
    Object.keys(props).forEach(key => {
        ctx[key] = props[key];
    });
}
function interpolate(initial, final, time, startTime, timingFunction) {
    //If timingFunction exists, assume it is in css cubic-bezier format
    const valueFromBezier = (i, f) => {
        let cleanFunction = timingFunction.replace("cubic-bezier(", "").replace(")", "").split(",").map(parseFloat);
        const ease = BezierEasing(...cleanFunction);
        const percentThrough = (Date.now() - startTime) / time;
        return i + (f - i) * ease(percentThrough);
    }

    const r = {};
    Object.keys(initial).forEach(key => {
        const percentThrough = (Date.now() - startTime) / time;
        if (typeof initial[key] === "number") {
            r[key] = valueFromBezier(initial[key], final[key]);
        } else if (typeof initial[key] === "string") {
            //Assume that string is a hex color
            const initialRgb = hexToRgb(initial[key]);
            const finalRgb = hexToRgb(final[key]);

            const rVal = valueFromBezier(initialRgb.r, finalRgb.r);
            const gVal = valueFromBezier(initialRgb.g, finalRgb.g);
            const bVal = valueFromBezier(initialRgb.b, finalRgb.b);
            const aVal = valueFromBezier(initialRgb.a, finalRgb.a);
            r[key] = `rgba(${rVal},${gVal},${bVal},${aVal})`;
        }
    });
    return r;
}