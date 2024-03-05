import CombineGame from './GameAPI.js';

document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && e.shiftKey && e.key === "G") {
        console.log("close ball")
        parent.postMessage("closeBall", "*");
    }
});


import('@dimforge/rapier2d').then(RAPIER => {
    //Don't work on small screens. 
    //This MIGHT be to try to hide windows that accidentally got embedded in Schoology posts 😳🤫
    if (window.innerHeight > 500 || (window === window.top)) {
        document.body.style.display = "unset";
    }
    //If hash includes "noembed" then remove warnText
    // if (window.location.hash.includes("noembed")) {
    //     document.getElementById("warn").remove();
    // }

    const popSound = new Audio("pop.mp3");

    const canvas = document.getElementById("gameCanvas");
    window.onresize = () => {
        Object.assign(canvas.style, {
            ...(window.innerWidth * 777 / 1366 > window.innerHeight ? { height: `100vh`, width: `auto` } : { width: `100vw`, height: `auto` }),
        });
    }
    window.onresize();

    const score = document.getElementById("score");

    let CURRENT_MODE = "casual";
    let game = new CombineGame(RAPIER, canvas);
    game.setSeed(1);
    updateNextDropIndicator();

    function loadFromStorage() {
        let state = localStorage.getItem("state");
        if (state) {
            state = JSON.parse(state);
            //We just want to follow the seeded ball order in ranked. Minimizing duplicates is a casual mode thing
            CURRENT_MODE = state.minimizeDuplicates ? "casual" : "ranked";
            rankedToggle.checked = CURRENT_MODE === "ranked";
            game.loadFromState(state);
        }
    }
    function writeToStorage() {
        const state = game.getFullState();
        localStorage.setItem("state", JSON.stringify(state));
    }

    const options = {
        onDrop: () => {
            logFruitAdded();
            writeToStorage();
            updateNextDropIndicator();
        },
        onMerge: (data) => {
            popSound.cloneNode().play();
            writeToStorage();
        },
        onScoreChange: (scoreValue) => {
            score.innerText = scoreValue;
        },
        onGameOver: (SCORE) => {
            sendLeaderboardScore(SCORE, canvas.toDataURL());
            localStorage.removeItem("state");
            score.innerText = "0";
            updateNextDropIndicator();
        },
        onSyncFromState: () => {
            updateNextDropIndicator();
        }
    }
    game.loadExtraOptions(options);

    loadFromStorage();
    game.loop();
    window.game = game;
    document.onclick = (e) => {
        if (!e.isTrusted) return;
        if (e.target.classList.contains("nodrop")) return;
        game.handleClick(e);
    }
    document.onmousemove = game.handleMove;
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            loadFromStorage();
        }
    });

    score.onclick = () => {
        if (confirm("Are you sure you want to restart? Manually restarting means your score won't have a chance to go on the leaderboard")) {
            game.resetToDefaultValues();
            score.innerText = "0";
            writeToStorage();
            loadFromStorage();
        }
    }
    function updateNextDropIndicator() {
        score.style.borderRight = `5px solid ${game.getNextDropColor()}`
    }

    rankedToggle.oninput = (e) => {
        if (CURRENT_MODE === "ranked") {
            //Going to casual
            let sure = confirm("Ball order in casual is completely random. \n\n Switching modes mid round will clear all balls, continue?");
            if (sure) {
                game.setMinimalDuplicates(true);
                game.setSeed(Math.random() * 10000000);
                game.resetToDefaultValues();
                writeToStorage();
                loadFromStorage();
                rankedToggle.checked = false;
            } else {
                rankedToggle.checked = true;
            }
        } else {
            //Going to ranked
            let sure = confirm("Ball order in ranked is always the same. \n\n Switching modes mid round will clear all balls, continue?");
            if (sure) {
                game.setMinimalDuplicates(false);
                game.setSeed(1);
                game.resetToDefaultValues();
                writeToStorage();
                loadFromStorage();
                rankedToggle.checked = true;
            } else {
                rankedToggle.checked = false;
            }
        }
    }

    const LEADERBOARD_URL = "https://script.google.com/macros/s/AKfycbw6iTqt_fyO5OtTZ9de3pZUEglgvTH9tlVxkiPmlpkjaRpoqz0vn8IK_CddqT3F3OLsTw/exec";

    document.getElementById("leaderboardButton").onclick = () => { leaderboardPopup.style.display = "block"; }
    document.getElementById("leaderboardPopup").onclick = (e) => {
        if (e.target.id != "leaderboardPopup") return;
        leaderboardPopup.style.display = "none";
    }


    let CASUAL_LEADERBOARD = [];
    let RANKED_LEADERBOARD = [];

    let leaderboardCasFocused = true;

    leaderboardModeToggle.onclick = () => {
        leaderboardCasFocused = !leaderboardCasFocused;
        updateLeaderboardStrings();

        //Render correct leaderboard
        getLeaderboard();
    }

    function updateLeaderboardStrings() {
        leaderboardModeToggle.innerText = leaderboardCasFocused ? "Ranked" : "Casual";
        leaderboardHeader.innerText = leaderboardCasFocused ? "Casual Leaderboard" : "Ranked Leaderboard";
        leaderboardSubtitle.innerText = leaderboardCasFocused ? "Balls drop in a random order in casual mode." : "Balls always drop in the same order in ranked mode.";
    }

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
    async function sendLeaderboardScore(scoreToSend, dataURL) {
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
            score: scoreToSend,
            canvasString: imageUrl,
            mode: CURRENT_MODE
        }

        let encryptedData = btoa(JSON.stringify(data));
        encryptedData = encryptedData.split("").reverse().join("");
        let newData = await fetch(`${LEADERBOARD_URL}?data=${encodeURIComponent(encryptedData)}`);
        let newJson = await newData.json();

        leaderboardCasFocused = CURRENT_MODE === "casual";
        updateLeaderboardStrings();

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
    }
    function getLeaderboard() {
        if ((leaderboardCasFocused && CASUAL_LEADERBOARD.length > 0) || (!leaderboardCasFocused && RANKED_LEADERBOARD.length > 0)) {
            renderLeaderboard(leaderboardCasFocused ? CASUAL_LEADERBOARD : RANKED_LEADERBOARD);
            return;

        };
        let leaderboard = document.getElementById("leaderboardEntries");
        leaderboard.innerHTML = "";

        //Fetch the leaderboard and display it in the popup
        fetch(LEADERBOARD_URL + `?mode=${leaderboardCasFocused ? "casual" : "ranked"}`)
            .then((response) => response.json())
            .then((data) => {
                if (leaderboardCasFocused) {
                    CASUAL_LEADERBOARD = data;
                } else {
                    RANKED_LEADERBOARD = data;
                }
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
            }
            imageContainer.appendChild(displayImage);

            if (i == 0) {
                div.style.color = "gold";
                imageContainer.classList.add("leaderContainer");
            }
        });
    }
    getLeaderboard();

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

        //Clear leaderboards every minute
        setInterval(() => {
            CASUAL_LEADERBOARD = [];
            RANKED_LEADERBOARD = [];
        }, 60 * 1000);
    }
    function logFruitAdded() {
        if (location.href.includes("file")) return;
        if (location.href.includes("localhost")) return;

        let clicks = Number(localStorage.getItem("clicks") || 0);
        clicks++;
        localStorage.setItem("clicks", clicks);
        if (clicks == 10) {
            fetch(LEADERBOARD_URL + "?clicks=" + clicks);
            localStorage.setItem("clicks", 0);
        }
    }

})