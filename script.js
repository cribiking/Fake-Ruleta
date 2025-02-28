const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const participants = [];

// Define los participantes que tendrán más probabilidad de ser elegidos
const probabilities = {
    "Jon": 1000,  // Juan tiene 3 veces más probabilidad de salir
    "Sofia": 1000,  // Maria tiene 2 veces más probabilidad de salir
};

function addParticipant() {
    const input = document.getElementById("participant");
    const name = input.value.trim();

    if (name && !participants.includes(name)) {
        participants.push(name);
        input.value = "";
        updateParticipantsList();
        drawWheel();
    }
}

function updateParticipantsList() {
    const list = document.getElementById("participantsList");
    list.innerHTML = "";

    participants.forEach((name) => {
        const li = document.createElement("li");
        li.textContent = name;
        list.appendChild(li);
    });
}

function drawWheel() {
    if (participants.length === 0) return;

    const numSections = participants.length;
    const angleStep = (2 * Math.PI) / numSections;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSections; i++) {
        const startAngle = i * angleStep;
        const endAngle = startAngle + angleStep;

        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, startAngle, endAngle);
        ctx.fillStyle = i % 2 === 0 ? "#ffcc00" : "#ff6600";
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(startAngle + angleStep / 2);
        ctx.fillStyle = "black";
        ctx.font = "18px Arial";
        ctx.fillText(participants[i], 100, 10);
        ctx.restore();
    }
}

function getWeightedIndex() {
    if (participants.length === 0) return null;

    let weightedArray = [];

    // Construir un array con participantes según su peso en probabilities
    participants.forEach((name) => {
        let weight = probabilities[name] || 1; // Si no está en probabilities, tiene peso 1
        for (let i = 0; i < weight; i++) {
            weightedArray.push(name);
        }
    });

    // Seleccionar un índice aleatorio basado en el peso
    let randomIndex = Math.floor(Math.random() * weightedArray.length);
    return weightedArray[randomIndex];
}

function spinWheel() {
    if (participants.length === 0) {
        alert("No hay participantes en la ruleta.");
        return;
    }

    let rotation = Math.random() * 360 + 1800; // Gira al menos 5 vueltas
    let degrees = rotation % 360;

    canvas.style.transition = "transform 3s ease-out";
    canvas.style.transform = `rotate(${rotation}deg)`;

    setTimeout(() => {
        canvas.style.transition = "none";
        canvas.style.transform = `rotate(${degrees}deg)`;

        let winner = getWeightedIndex();
        alert("El ganador es: " + winner);

        // Eliminar al ganador de la lista
        participants.splice(participants.indexOf(winner), 1);

        // Actualizar la lista visual y redibujar la ruleta
        updateParticipantsList();
        drawWheel();

        if (participants.length === 0) {
            alert("Todos los participantes han sido eliminados.");
        }
    }, 3000);
}


drawWheel();
