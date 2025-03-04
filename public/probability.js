const numberInput = document.getElementById("numberInput");
const generateButton = document.getElementById("generateButton");
const textareaList = document.getElementById("textareaList");
const textareaListAmount = document.getElementById("textareaListAmount");
const submitButton = document.getElementById("submitButton");

function generateTextareas() {
  const numInputs = Number(numberInput.value);
  textareaList.innerHTML = "";
  textareaListAmount.innerHTML = "";

  for (let i = 0; i < numInputs; i++) {
	const textarea = document.createElement("li");
	const input = document.createElement("input");
	input.type = "number";
	input.placeholder = `Р${i + 1}`;
	textarea.appendChild(input);
	textareaList.appendChild(textarea);
  }


  for (let ii = 0; ii < numInputs; ii++) {
	const textareaAmount = document.createElement("li");
	const inputAmount = document.createElement("input");
	inputAmount.type = "number";
	inputAmount.placeholder = `Р${ii + 1} количество`;
	textareaAmount.appendChild(inputAmount);
	textareaList.appendChild(textareaAmount);
  
  }
}

function getTextareaValues() {
	const textareas = document.querySelectorAll(".textarea-list input");
	const textareasAmount = document.querySelectorAll(".textarea-list inputAmount");
	const values = Array.from(textareas).map(textarea => textarea.value);
	const valuesAmount = Array.from(textareasAmount).map(textareaAmount => textareaAmount.value);
	const arrays = [values, valuesAmount]   
}

function submitData() {
  const values = getTextareaValues();
  const jsonData = JSON.stringify(values);

  // Replace the following with your backend API endpoint
  fetch("/calculateProbability", {
	method: "POST",
	headers: {
	  "Content-Type": "application/json"
	},
	body: jsonData
  })
  .then(response => response.json())
  .then(data => {
	console.log("Data submitted:", data);
	// Add any additional logic or UI updates based on the server response
  })
  .catch(error => {
	console.error("Error submitting data:", error);
  });
}

generateButton.addEventListener("click", generateTextareas);
submitButton.addEventListener("click", submitData);

