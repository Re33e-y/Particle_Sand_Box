let count = 0;
function submitFeedback() {
  const name = document.getElementById("name").value.trim();
  const feedback = document.getElementById("feedback").value.trim();

  if (name === "" || feedback === "") {
    document.getElementById("err-msg").innerHTML =
      `Please provide name and feedback`;
    return;
  }
  count++;
  document.getElementById("count").textContent = count;

  let lname = document.createElement("section");
  let lfdb = document.createElement("section");
  lname.className = "feedback-meta";
  lname.textContent = name;
  lfdb.className = "feedback-text";
  lfdb.textContent = feedback;
  let element = document.createElement("li");

  element.appendChild(lname);
  element.appendChild(lfdb);

  const list = document.getElementById("feedback-list");
  list.appendChild(element);

  document.getElementById("name").value = "";
  document.getElementById("feedback").value = "";
}
