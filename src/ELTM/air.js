function applyAir(body, game) {
    //Give body a negative gravity
    const newGrav = -.3;
    body.rigidBody.setGravityScale(newGrav);
    body.rigidBody.setDominanceGroup(10);
    body.overrideDamping = true;
    body.rigidBody.setLinearDamping(0.1);

    const clearEffect = () => {
        clearInterval(checkInteravl);

        if (body.merged || body.removed) return;
        body.rigidBody.setGravityScale(1);
        body.overrideDamping = false;
        body.rigidBody.setDominanceGroup(0);
    }

    let checkInteravl = setInterval(() => {
        if (body.merged || body.removed) {
            clearEffect();
            return;
        }

        const yPos = body.rigidBody.translation().y * game.RAPIER_MULTIPLIER;
        console.log(yPos, game.DEFAULT_DROP_HEIGHT, "checking");
        if (yPos < game.DEFAULT_DROP_HEIGHT) {
            clearEffect();
        }
    }, 100);

    //Lil backup never hurt nobody
    setTimeout(clearEffect, 10 * 1000);
}

export default applyAir;