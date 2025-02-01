class signin extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <h1>Login</h1>
      <form id="login-form">
        <div class="input-field">
          <i class="fa-regular fa-envelope"></i>
          <input type="username" id="user" placeholder="user" required />
        </div>
        <div class="input-field">
          <i class="fa-solid fa-lock"></i>
          <input type="password" id="login-password" placeholder="Password" />
        </div>
        <p>Lost password? <a href="#">Click here!</a></p>
        <div class="btn-field">
          <button type="submit" id="login-btn">Log In</button>
        </div>
        <div class="btn-field">
          <button type="button" id="go-to-signup">Don't have an account?</button>
        </div>
      </form>
    `;

    document.getElementById("go-to-signup").addEventListener("click", () => {
      window.location.hash = "signup";
    });

    document.getElementById("login-form").addEventListener("submit", async function(event) {
      event.preventDefault();
      
      const username = document.getElementById("user").value;
      const password = document.getElementById("login-password").value;
      
      const response = await fetch('http://localhost:8000/login/', {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken")
          },
          body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (response.ok) {
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);
          localStorage.setItem("username", username);
          alert(`Welcome, ${data.username}!`);   
          window.location.hash = "dashboard";
      } else {
          alert("Login failed. Check your credentials.");
      }
    });
  }
}

customElements.define('signin-component', signin);
