function drawBodiesToCanvas(ctx, bodies, MOUSE_X, MOUSE_Y) {
    bodies.forEach(body => {
        const position = body.position;

        ctx.save();
        ctx.beginPath();

        applyBodyStylesToCanvas(ctx, body);

        let radius = body.radius;

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
                ctx.arc(
                    position.x,
                    position.y,
                    radius,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
                if (body.render.hasStroke) {
                    ctx.stroke();
                }
                if (body.render.img) {
                    ctx.translate(position.x, position.y);
                    ctx.rotate(body.rotation);
                    let mult = 1.35;
                    radius *= mult;
                    ctx.drawImage(body.render.img, -radius + 10, -radius, radius * 2, radius * 2);
                    ctx.rotate(-body.rotation);
                    ctx.translate(-position.x, -position.y);

                }

                break;
            case "t":
                ctx.translate(position.x, position.y);
                ctx.rotate(body.rotation);

                //Find shift amount from center to each point assuming it is in an equilateral triangle
                const mod = 1.9;
                radius *= mod;
                const shiftAmount = radius * Math.sqrt(3) / 2;

                const pointOne = {
                    x: 0,
                    y: -radius
                };
                const pointTwo = {
                    x: -shiftAmount,
                    y: radius / 2
                };
                const pointThree = {
                    x: shiftAmount,
                    y: radius / 2
                };

                ctx.beginPath();
                ctx.moveTo(pointOne.x, pointOne.y);
                ctx.lineTo(pointTwo.x, pointTwo.y);
                ctx.lineTo(pointThree.x, pointThree.y);
                ctx.lineTo(pointOne.x, pointOne.y);

                if (body.render.hasStroke) {
                    ctx.stroke();
                }
                ctx.fill();
                ctx.closePath();
                ctx.rotate(-body.rotation);

                ctx.translate(-position.x, -position.y);
                radius /= mod;
                break;
            default:
                break;
        }

        if (body.hasFace) {

            const xDiff = MOUSE_X - position.x;
            const yDiff = MOUSE_Y - position.y;
            const diffMag = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));

            const xPercent = (xDiff / radius);
            const yPercent = (yDiff / radius);

            let xShift = xPercent * radius * .05;
            let yShift = yPercent * radius * .05;

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
            let angle = body.rotation;
            ctx.rotate(angle);
            ctx.beginPath();
            if (body.isSad) {
                ctx.arc(0, radius * .55, radius * .65, 1 * Math.PI, 0);
            } else {
                ctx.arc(0, radius * .05, radius * .65, 0, 1 * Math.PI);

            }

            //Subtract angle from shiftAngle
            shiftAngle -= angle;
            xShift = Math.cos(shiftAngle) * shiftMagnitude;
            yShift = Math.sin(shiftAngle) * shiftMagnitude;

            xShift *= 1.1;
            yShift *= .7;

            if (diffMag > radius) {
                xShift = 0;
                yShift = 0;
            }

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
        ctx.closePath();
        ctx.restore();
    });
}
function applyBodyStylesToCanvas(ctx, renderInfo) {
    const tick = Date.now() / 16.6666667;
    const RAINBOW_COLOR = `hsl(${(tick) % 360}, 100%, 50%)`;
    renderInfo = renderInfo.render;
    let fill = renderInfo.fillStyle;
    if (fill === "r") fill = RAINBOW_COLOR;

    //Apply basic styles
    ctx.fillStyle = fill;
    ctx.strokeStyle = renderInfo.strokeStyle;
    ctx.lineWidth = renderInfo.lineWidth || 0;
    ctx.shadowColor = renderInfo.shadowColor || ctx.fillStyle;
    ctx.shadowBlur = renderInfo.shadowBlur;
    ctx.globalAlpha = renderInfo.opacity;

    //Apply effects
    if (renderInfo.effect === "pulse") {
        //Apply pulsing shadow
        let blurAmount = renderInfo.shadowBlur;
        ctx.shadowBlur = blurAmount
            ? blurAmount *
            (Math.abs(((tick / 50) % blurAmount) - blurAmount / 2) /
                blurAmount)
            : 0;
    }
    if (renderInfo.effect === "dance") {
        //Make offset move in a circle
        const offset = 50;
        const x = Math.cos(tick / 500) * offset;
        const y = Math.sin(tick / 500) * offset;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
    }

}
export default drawBodiesToCanvas;