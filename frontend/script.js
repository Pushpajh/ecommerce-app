const backendURL = "https://YOUR_BACKEND_APP_NAME.vercel.app"; // <-- change after backend deploy

function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${backendURL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => alert("❌ Registration failed"));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${backendURL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json())
  .then(data => alert(data.message))
  .catch(err => alert("❌ Login failed"));
}
