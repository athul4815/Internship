let output = document.getElementById("output");
let history = document.getElementById("history");

function append(value) {
  output.value += value;
}

function clearAll() {
  output.value = "";
  history.innerText = "";
}

function deleteLast() {
  output.value = output.value.slice(0, -1);
}

function calculate() {
  try {
    let expression = output.value;
    let result = eval(expression);

    history.innerText = expression;
    output.value = result;
  } catch {
    output.value = "Error";
  }
}