class signup extends HTMLElement {
 
  connectedCallback() {
    this.innerHTML = `
      <div class="contonair">
        <form id="signup-form">
          <h1>Sign Up</h1>
          <div class="input-field">
          <i class="fa-regular fa-envelope"></i>
          <input type="text" id="user" placeholder="Username" required />
        </div>
          <div class="input-field">
          <i class="fa-regular fa-envelope"></i>
          <input type="email" id="signup-email" placeholder="Email" />
        </div>        
        <div class="input-field">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="password" placeholder="Password" />
      </div>
      <div class="btn-field">
      <button type="submit" id="register">Register</button>
      <p>Already have an account? <a href="#signin">Sign in</a></p>
        </form>
    
    `;

    document.getElementById("register-form").addEventListener("submit", async function(event) {
      event.preventDefault();
      const username = document.getElementById("signup-username").value;
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("password").value;
      
      const response = await fetch('http://localhost:8000/signup/', {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken")
          },
          body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
          alert("Registration successful! Please log in.");
          window.location.hash = "signin";
      } else {
          alert("Registration failed. Check your details.");
      }
    });
  }
}

customElements.define('signup-component', signup);
