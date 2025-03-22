function setTokenCookies(data) {
  document.cookie = `access_token=${data.access_token}; path=/`;
  document.cookie = `refresh_token=${data.refresh_token}; path=/`;
  document.cookie = `username=${data.username}; path=/`;
}

class signin extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="/static/css/style.css">
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

          <div class="input-field twofa-input" style="display: none;">
            <i class="fa-solid fa-shield-halved"></i>
            <input type="text" id="login-2fa-code" placeholder="2FA Code" />
          </div>

          <div class="btn-field">
            <button type="submit" id="login-btn">Log In</button>
            <button type="button" id="intra-btn">Login with 42</button>
          </div>
      </form>
    </div>`;

    this.init2FALogic();
  }

  init2FALogic() {
    const loginForm = this.querySelector('#login-form');
    const twofaInput = this.querySelector('.twofa-input');
    let requires2FA = false;
    let tempUsername = '';

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = this.querySelector('#user').value;
        const password = this.querySelector('#login-password').value;
        const code = this.querySelector('#login-2fa-code').value;

        try {
          if (requires2FA) {
            // Handle 2FA verification during login
            const response = await fetch('http://localhost:8000/login/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie("csrftoken")
              },
              body: JSON.stringify({
                username: tempUsername,
                password: this.querySelector('#login-password').value,
                code: code
              })
            });

            const data = await response.json();
            
            if (response.ok) {
              setTokenCookies(data);
              window.location.hash = "home";
            } else {
              alert(data.detail || 'Invalid 2FA code!');
            }
          } else {
            // Initial login attempt
            const response = await fetch('http://localhost:8000/login/', {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
              },
              body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            
            if (response.status === 202) {
              requires2FA = true;
              tempUsername = username;
              twofaInput.style.display = 'block';
              this.querySelector('#login-btn').textContent = 'Verify Code';
              alert('Please check your email for the verification code');
            } else if (response.ok) {
              setTokenCookies(data);
              window.location.hash = "home";
            } else {
              alert(data.detail || "Login failed. Check your credentials.");
            }
          }
        } catch (error) {
          console.error('Login error:', error);
          alert("Network error - please try again");
        }
      });
    }

    const intraBtn = this.querySelector("#intra-btn");
    if (intraBtn) {
      intraBtn.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = "http://localhost:8000/login42/";
      });
    }
  }
}

function setTokenCookies(data) {
  document.cookie = `access_token=${data.access_token}; path=/`;
  document.cookie = `refresh_token=${data.refresh_token}; path=/`;
  document.cookie = `username=${data.username}; path=/`;
}

customElements.define('signin-component', signin);
