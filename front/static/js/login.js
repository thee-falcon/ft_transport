

class signin extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
	<link rel="stylesheet" href="static/css/style.css">
    <div class="contonair">
      <form id="login-form">
          <h1>Sign In</h1>

          <div class="input-field">
            <i class="fa-regular fa-envelope"></i>
            <input type="text" id="user" placeholder="Username" required />
          </div>

          <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <input type="password" id="login-password" placeholder="Password" required />
          </div>

          <div class="btn-field">
            <button type="submit" id="login-btn">Log In</button>
          </div>

          <div class="btn-field">
            <button type="button" id="go-to-signup">Don't have an account?</button>
          </div>

          <div class="btn-field">
            <button type="button" id="intra-btn">Login with 42 <div class="social-container">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 137.6 96.6" width="24px" height="24px">
                <g transform="translate(-229.2,-372.70002)">
                    <polygon points="229.2,443.9 279.9,443.9 279.9,469.3 305.2,469.3 305.2,423.4 254.6,423.4 305.2,372.7 279.9,372.7 229.2,423.4" style="fill:#ffffff"/>
                    <polygon points="316.1,398.1 341.4,372.7 316.1,372.7" style="fill:#ffffff"/>
                    <polygon points="341.4,398.1 316.1,423.4 316.1,448.7 341.4,448.7 341.4,423.4 366.8,398.1 366.8,372.7 341.4,372.7" style="fill:#ffffff"/>
                    <polygon points="366.8,423.4 341.4,448.7 366.8,448.7" style="fill:#ffffff"/>
                </g>
            </svg>
            </div></button>
          </div>
      </form>
    </div>
    `;
 



    document.getElementById("go-to-signup").addEventListener("click", () => {
      window.location.hash = "signup";
    });
    let intraBtn = document.getElementById("intra-btn");
    let log = document.getElementById("login-btn");

    log.addEventListener('click', async function (event) {
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
      console.log('resoinse' , response);

      const data = await response.json();
      try {
        if (response.ok) {
          console.log("data", data);
          const accessToken = getCookie('access_token');
          const refreshToken = getCookie('refresh_token');
           const username = getCookie('username');
          console.log('Access Token:', accessToken);
          console.log('Refresh Token:', refreshToken);
          // console.log('Username:', username);
          console.log('simple login  Token  and refreshtoken ', accessToken, "refreshtoken", refreshToken);
            alert('simple login go to home');
          window.location.hash = "home";
        } else {
          alert("Login failed. Check your credentials.");
        }
      }
      catch {
        console.error('error while logiing');
      }
    })


    intraBtn.addEventListener('click', async function (event) {
      event.preventDefault();
      // Redirect to login42 URL for OAuth or SSO
      window.location.href = "http://localhost:8000/login42/";
    });
    window.addEventListener('load', async function () {
      try {
        const accessToken = getCookie('access_token');
        const refreshToken = getCookie('refresh_token');
        const username = getCookie('username');
        console.log('intra acces Token  and refreshtoken ', accessToken, "refreshtoken", refreshToken, 'username', username);
        if(accessToken &&  refreshToken)
          alert('intra login go to home');

        window.location.hash = "home";
      } catch (error) {
        console.error('Error during login42 authentication:', error);
      }
    });


  }
}





customElements.define('signin-component', signin);