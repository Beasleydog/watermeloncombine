const im = new Image();
im.src = "./d.png";

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
        fillStyle: "#ffffff",
        strokeStyle: "#cccccc",
        hasStroke: true,
        lineWidth: 10,
        radius: 80,
        type: "t",
    },
    d: {
        fillStyle: "#FFFFFF",
        img: im,
        radius: 150,
        type: "circle"
    }
};

export default TYPE_MAP;