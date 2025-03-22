
function setTokenCookies(data) {
  document.cookie = `access_token=${data.access_token}; path=/`;
  document.cookie = `refresh_token=${data.refresh_token}; path=/`;
  document.cookie = `username=${data.username}; path=/`;
}

class signin extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="static/css/style.css">
    <div class="contonair">
      <form id="login-form">
          <h1>Sign In</h1>

          <!-- Existing fields -->
          <div class="input-field">
            <i class="fa-regular fa-envelope"></i>
            <input type="text" id="user" placeholder="Username" required />
          </div>

          <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <input type="password" id="login-password" placeholder="Password" required />
          </div>

          <!-- Add 2FA Code Input -->
          <div class="input-field twofa-input" style="display: none;">
            <i class="fa-solid fa-shield-halved"></i>
            <input type="text" id="login-2fa-code" placeholder="2FA Code" />
          </div>

          <div class="btn-field">
            <button type="submit" id="login-btn">Log In</button>
            <button type="button" id="intra-btn">Login with 42</button>
          </div>

          <!-- Rest of your login form -->
      </form>
    </div>`;

    this.init2FALogic();

	async function refreshhhToken() {
		console.log('Refreshing access token...');
		const refresh_Token = getCookie('refresh_token');
	
		if (!refresh_Token|| isTokenExpired()) {
			console.log("No refresh token found, user not authenticated.");

	
		try {
			const response = await fetch("http://localhost:8000/token-refresh/", {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refresh: refresh_Token }),
			});
	
			if (response.ok) {
				const data = await response.json();
				console.log("data  accces=== " , data.access);
				document.cookie = `access_token=${data.access}; path=/; SameSite=None; Secure`;
				console.log("New access token received:", data.access);
				return true;
			} else {
				console.error("Failed to refresh token. Redirecting to signin.");
				deleteCookie("access_token");
				deleteCookie("refresh_token");
				return false;
			}
		} catch (error) {
			console.error("Error refreshing token:", error);
			return false;
		}
	}
	}
	

  async function fetchUserStats(redirectPage) {
    const token = getCookie('access_token');
    if (!token) return;
    try {
        const response = await fetch("http://localhost:8000/get_user_stats/", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${getCookie(token)}`,
                "Content-Type": "application/json"
            },
            credentials: "include"
        });

        if (response.ok) {
            const responseData = await response.json();
            localStorage.setItem("userData", JSON.stringify(responseData));
            window.location.hash = redirectPage;
        }
    } catch (error) {
        console.error("Error fetching user stats:", error);
    }
}
  
    document.getElementById("go-to-signup").addEventListener("click", () => {
      window.location.hash = "signup";
    });
    let intraBtn = document.getElementById("intra-btn");
    let log = document.getElementById("login-btn");

    log.addEventListener('click', async function (event) {
      event.preventDefault();
  
      const username = document.getElementById("user").value;
      const password = document.getElementById("login-password").value;
  
      try {
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
              console.log("Response Data:", data);
              // Set cookies immediately
              const cookieOptions = "path=/; SameSite=Lax; Secure"; // Secure if using HTTPS
              document.cookie = `access_token=${data.access_token}; path=/`;
              document.cookie = `refresh_token=${data.refresh_token}; path=/`;
              document.cookie = `username=${data.username}; path=/`;
              
              // Direct redirect instead of using fetchUserStats
              window.location.hash = "home";
          } else {
              alert("Login failed. Check your credentials.");
          }
      } catch (error) {
          console.error('Login error:', error);
          alert("Network error - please try again");
      }
  });

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
          
          fetchUserStats('home');
              } catch (error) {
        console.error('Error during login42 authentication:', error);
      }
    });


  }

  init2FALogic() {
    const loginForm = this.querySelector('#login-form');
    const twofaInput = this.querySelector('.twofa-input');
    let requires2FA = false;
    let tempUsername = '';

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = this.querySelector('#user').value;
        const password = this.querySelector('#login-password').value;
        const code = this.querySelector('#login-2fa-code').value;

        try {
            if (requires2FA) {
                // Handle 2FA verification
                const response = await fetch('http://localhost:8000/verify_code/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCookie("csrftoken")
                    },
                    body: JSON.stringify({
                        username: tempUsername,
                        code: code
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    // Set cookies and proceed
                    setTokenCookies(data);
                    fetchUserStats('home');
                } else {
                    alert('Invalid 2FA code!');
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
                    // Show 2FA input
                    requires2FA = true;
                    tempUsername = username;
                    twofaInput.style.display = 'block';
                    this.querySelector('#login-btn').textContent = 'Verify Code';
                } else if (response.ok) {
                    // Regular login success
                    setTokenCookies(data);
                    fetchUserStats('home');
                } else {
                    alert("Login failed. Check your credentials.");
                }
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    });
}

setTokenCookies(data) {
  document.cookie = `access_token=${data.access_token}; path=/`;
  document.cookie = `refresh_token=${data.refresh_token}; path=/`;
  document.cookie = `username=${data.username}; path=/`;
}

  
}





customElements.define('signin-component', signin);