function removeBody(body, game) {
    body.removed = true;
    game.removeBody(body);
}
export default removeBody;