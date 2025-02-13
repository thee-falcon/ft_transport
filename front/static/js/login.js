 


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
      try{
      if (response.ok) {
        console.log("data", data);
        const accessToken = getCookie('access_token');
        const refreshToken = getCookie('refresh_token');
        const username = getCookie('username');
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        console.log('Username:', username);
 
 
 
       window.location.hash = "dashboard";
      } else {
          alert("Login failed. Check your credentials.");
      }
    }
    catch{
      console.error('error while logiing');
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
          const accessToken = getCookie('access_token');
          const refreshToken = getCookie('refresh_token');
          const username = getCookie('username');
            console.log('intra acces Token  and refreshtoken ',accessToken  ,"refreshtoken",refreshToken   , 'username' , username);
              window.location.hash = "#dashboard";
      } catch (error) {
          console.error('Error during login42 authentication:', error);
      }
    });
 

  }
}
 

customElements.define('signin-component', signin);
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}