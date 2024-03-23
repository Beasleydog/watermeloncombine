import handleClick from "./handleClick";
class ELTM {
    constructor(game, canvas) {
        this.game = game;
        this.canvas = canvas;

        //Initialize powerups stuff
        const powerupFormat = {
            selected: false,
            currentCooldown: 0,
            cooldown: 0,
            name: ""
        }
        const powerupNames = ["fire", "water", "wind", "ground"];
        this.powerups = powerupNames.map(name => {
            return {
                ...powerupFormat,
                name
            }
        });
    }
    handleScreenClick(e) {
        const r = {
            intercepted: false,
            effectUsed: false
        }
        const activePowerup = this.powerups.find(p => p.selected);
        if (activePowerup) {
            r.intercepted = true;
            r.effectUsed = activePowerup.name;
            handleClick(e, this.game, this.canvas, activePowerup);
        }
        return r;
    }
    handlePowerClick(powerup) {
        let targetPowerup = this.powerups.find(p => {
            return p.name === powerup
        });
        if (targetPowerup.currentCooldown <= 0) {
            let current = targetPowerup.selected;
            this.powers = this.powerups.map(p => {
                p.selected = false;
                return p;
            });

            targetPowerup.selected = !current;
        }
        return this.powerups;
    }
}
export default ELTM;