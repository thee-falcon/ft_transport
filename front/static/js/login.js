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
        </div>
        <div class="btn-field">
          <button type="button" id="intra-btn">Login with 42</button>
        </div>

      </form>
    `;
    document.getElementById("go-to-signup").addEventListener("click", () => {
      window.location.hash = "signup";
    });
    let intraBtn = document.getElementById("intra-btn");
    let log = document.getElementById("login-btn");

    log.addEventListener('click', async function(event){ 
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
    })
    intraBtn.addEventListener('click', async function(event) {
      event.preventDefault();
      // Redirect to login42 URL for OAuth or SSO
      window.location.href = "http://localhost:8000/login42/";
    });
  
    // After redirection, check for the access and refresh tokens
    window.addEventListener('load', async function() {
      try {
          const accessToken = getCookie('access');
          const refreshToken = getCookie('refresh');
  
          if (accessToken && refreshToken) {
              localStorage.setItem("access_token", accessToken);
              localStorage.setItem("refresh_token", refreshToken);
              // localStorage.setItem("username", username);
              // const user = getCookie('username');  // Assuming username is set in the cookie
              // localStorage.setItem("username", user);
              // alert(`Welcome, ${username}!`);
  
              // Redirect to dashboard or desired page
              window.location.hash = "#dashboard";
          }
      } catch (error) {
          console.error('Error during login42 authentication:', error);
      }
    });
  
  }
}

customElements.define('signin-component', signin);
