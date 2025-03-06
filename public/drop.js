document.getElementById("submitButton").addEventListener("click", () => {
	const data = {
		linesLen: Number.parseFloat(document.getElementById("linesLen").value) || -1,
		needleLen: Number.parseFloat(document.getElementById("needleLen").value) || -1,
		fieldLenX: Number.parseFloat(document.getElementById("fieldLenX").value) || -1,
		fieldLenY: Number.parseFloat(document.getElementById("fieldLenY").value) || -1,
		iterations: Number.parseInt(document.getElementById("iterations").value) || -1
	};
	const jsonData = JSON.stringify(data);
	console.log(jsonData);

	 //Validate input is a number
	if (Number.isNaN(data.linesLen) || Number.isNaN(data.needleLen) || Number.isNaN(data.fieldLenX) || Number.isNaN(data.fieldLenY) || Number.isNaN(data.iterations)) {
		document.getElementById("crossings").textContent = "Invalid input - please enter a number.";
		document.getElementById("crossingRate").textContent = "Invalid input - please enter a number.";
		return;
	}

	const needleLen = data.needleLen // for drawing needles later
	// Validate the canvas and context (to draw the needles)
	const canvas = document.getElementById("field");
	canvas.height = data.fieldLenY;
	canvas.width = data.fieldLenX;
	const fc = canvas.getContext("2d");
	// Draw the canvas
	drawFieldLines(fc, data.linesLen, data.fieldLenX, data.fieldLenY);

	// Send input to the server
	fetch("/calculate", {
		method: "POST",
		headers: {"Content-Type":"application/json"},
		body: jsonData
	})
	.then(response => {
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return response.json();
	})
	.then(data => {
		console.log("Success", data);
		document.getElementById("crossings").textContent = `Количество раз, когда иголка пересекла линию: ${data.crossings}`;
		document.getElementById("crossingRate").textContent = `Вероятность пересечения иголкой линии: ${data.crossingRate}`;
		document.getElementById("pi").textContent = `Число Пи: ${data.pi}`;
		

		document.getElementById("dropRes").innerHTML = "";
		for (const drop of data.drops){
			const output = `Coordinates:         (${drop.coordsX}, ${drop.coordsY})<br/>
							Angle (radian):          ${drop.angle}<br/>
							Perpendicular Length: ${drop.perp}<br/>
							Crossed Line:         ${drop.isCr}<br/><br/>`;
			document.getElementById("dropRes").innerHTML += output;
		}

		// Draw the needles
		drawNeedles(fc, data.drops, needleLen);
	})
	.catch((error) => console.error("Error:", error));
});

function drawFieldLines(fc, linesLen, fieldLenX, fieldLenY) {
	fc.clearRect(0, 0, fieldLenX, fieldLenY); // erase whole canvas
	fc.strokeStyle = "#C0C0C0"; // Light gray lines
		for (let i = 0; i <= fieldLenY; i += linesLen) {
			fc.beginPath();
			fc.moveTo(0, i);
			fc.lineTo(fieldLenX, i);
			fc.stroke();
		}
}

// Randomly decide direction of a needle
function getNeedleCoords(x, y, perp, perpHor) {
	let needleCoords = {
		xStart: 0,
		yStart: 0,
		xEnd: 0,
		yEnd: 0
	}
	choice = Math.floor(Math.random() * 2);
	if (choice === 0){
		needleCoords = {
			xStart: x + perpHor,
			yStart: y - perp,
			xEnd: x - perpHor,
			yEnd: y + perp
		}
	} else {
		needleCoords = {
			xStart: x + perpHor,
			yStart: y - perp,
			xEnd: x - perpHor,
			yEnd: y + perp
		}
	}
	return needleCoords;
}

function drawNeedles(fc, drops) {
	for (const drop of drops) {
		const x = drop.coordsX;
		const y = drop.coordsY;
		const perp = drop.perp
		const perpHor = drop.perpHor

		const nc = getNeedleCoords(x, y, perp, perpHor)

		// Draw the needle
		fc.beginPath();
		fc.moveTo(nc.xStart, nc.yStart);
		fc.lineTo(nc.xEnd, nc.yEnd);
		fc.strokeStyle = drop.isCr ? "green" : "red"; // Green if crossed, red otherwise
		fc.stroke();
		
		// Optionally draw the end of the needle as a circle
		fc.beginPath();
		fc.arc(nc.xStart, nc.yStart, 2, 0, Math.PI * 2); // small circle at the end
		fc.stroke();
	}
}
