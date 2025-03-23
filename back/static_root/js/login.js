class signin extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="static/css/style.css">
    <div class="contonair">
      <form id="login-form">
          <h1 data-i18n="Login">Sign In</h1>

          <div class="input-field">
            <i class="fa-regular fa-envelope"></i>
            <input type="text" id="user" data-i18n-placeholder="Username" placeholder="Username" required />
          </div>

          <div class="input-field">
            <i class="fa-solid fa-lock"></i>
            <input type="password" id="login-password" data-i18n-placeholder="Password" placeholder="Password" required />
          </div>

          <div class="btn-field">
            <button type="submit" id="login-btn" data-i18n="Login">Log In</button>
          </div>

          <div class="btn-field">
            <button type="button" id="go-to-signup" data-i18n="DontHaveAccount">Don't have an account?</button>
          </div>

          <div class="btn-field">
            <button type="button" id="intra-btn">
              <span data-i18n="Login">Login</span> 
              <span data-i18n="With">with</span> 42 
              <div class="social-container">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 137.6 96.6" width="24px" height="24px">
                    <g transform="translate(-229.2,-372.70002)">
                        <polygon points="229.2,443.9 279.9,443.9 279.9,469.3 305.2,469.3 305.2,423.4 254.6,423.4 305.2,372.7 279.9,372.7 229.2,423.4" style="fill:#ffffff"/>
                        <polygon points="316.1,398.1 341.4,372.7 316.1,372.7" style="fill:#ffffff"/>
                        <polygon points="341.4,398.1 316.1,423.4 316.1,448.7 341.4,448.7 341.4,423.4 366.8,398.1 366.8,372.7 341.4,372.7" style="fill:#ffffff"/>
                        <polygon points="366.8,423.4 341.4,448.7 366.8,448.7" style="fill:#ffffff"/>
                    </g>
                </svg>
              </div>
            </button>
          </div>
      </form>
    </div>
    `;
 
    function getCookie(name) {
      let match = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return match ? match[2] : null;
    }
    
    function deleteCookie(name) {
      document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=None; Secure';
    }
    
    function isTokenExpired(token) {
      if (!token) return true; 
  
      try {
        const base64Url = token.split('.')[1];  
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  
        const payload = JSON.parse(atob(base64));  
        
        const currentTime = Math.floor(Date.now() / 1000);  
        return payload.exp < currentTime; 
      } catch (error) {
        console.error("Invalid token format:", error);
        return true;  
      }
    }

	async function refreshhhToken() {
		console.log('Refreshing access token...');
		const refresh_Token = getCookie('refresh_token');
	
		if (!refresh_Token|| isTokenExpired(refresh_Token)) {
			console.log("No refresh token found, user not authenticated.");
      return false;
    }

	
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
	

    async function fetchUserStats(redirectPage) {
      let token = getCookie("access_token");
  
      // If token is expired, refresh it
      if (isTokenExpired(token)) {
          console.log("Access token expired, attempting refresh...");
          const refreshed = await refreshhhToken();
          if (!refreshed) {
              console.error("Failed to refresh token. Redirecting to signin.");
              // window.location.hash = "signin";
              // return;
          }
          token = getCookie("access_token"); // Get the new token
      }
  
      // Proceed with API request
      try {
          const response = await fetch("http://localhost:8000/get_user_stats/", {
              method: "GET",
                  headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json"
              },
              credentials: "include"
          });
  
          const responseData = await response.json();
          if (response.ok) {
              localStorage.setItem("userData", JSON.stringify(responseData));
              console.log("User data retrieved:", responseData);
              window.location.hash = redirectPage;
          } else {
              console.error("Error fetching stats:", responseData);
          }
      } catch (error) {
          console.error("Error:", error);
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
          console.log('Access Token:', accessToken);
          console.log('Refresh Token:', refreshToken);
          // console.log('Username:', username);
          console.log('simple login  Token  and refreshtoken ', accessToken, "refreshtoken", refreshToken);
            alert('simple login go to home');
            fetchUserStats('home');
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
          
          fetchUserStats('home');
              } catch (error) {
        console.error('Error during login42 authentication:', error);
      }
    });


  }
}





customElements.define('signin-component', signin);