class Navebar extends HTMLElement {
	async connectedCallback() {
	  this.innerHTML = `
		<link rel="stylesheet" href="/static/css/navbar.css" />
		<link rel="stylesheet" href="/static/css/language-selector.css" />
		<link rel="stylesheet" href="/static/bootstrap-5.3.3-dist/css/bootstrap.min.css">
		<nav class="navbar navbar-expand-lg navbar-dark bg-transparent" id="mainNavBar">
		  <div class="container-fluid">
			<a class="navbar-brand" href="#home" id="home">
			  <img src="static/image/logo.png" alt="Logo">
			</a>
			<button class="navbar-toggler shadow-none border-1" type="button" data-bs-toggle="offcanvas" 
					data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
			  <img src="static/image/menu.png" alt="">
			</button>
			<!-- sideBar -->
			<div class="sidebar offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
				 aria-labelledby="offcanvasNavbarLabel">
			  <div class="offcanvas-header">
				<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
			  </div>
			  <nav class="navbarMe">
				<div class="imageLogo">
				  <a href="#home" class="logo" id="home">
					<img src="static/image/logo.png" alt="Logo">
				  </a>
				</div>
				<!-- All nav elements -->
				<div class="nav-links">
				  <a href="#game" class="nav" id="go-to-gameoption">
					<img src="static/image/game.png" alt="">
					<span data-i18n="Game">Game</span>
				  </a>
				  <a href="#tournaments" class="nav" id="go-to-tournoi">
					<img src="static/image/Tournament.png" alt="">
					<span data-i18n="Tournaments">Tournaments</span>
				  </a>
				  <a href="#profil" class="nav" id="go-to-profile">
					<img src="static/image/profile.png" alt="">
					<span data-i18n="Profile">Profile</span>
				  </a>
				  <a href="#chat" class="nav" id="go-to-chat">
					<img src="static/image/Chat.png" alt="">
					<span data-i18n="Chat">Chat</span>
				  </a>
				  <a href="#faq" class="nav" id="faq">
					<img src="static/image/faq.png" alt="">
					<span data-i18n="Faq">Faq</span>
				  </a>
				  <a href="#" class="nav" id="TournamentTree">
					<img src="static/image/info.png" alt="">
					<span data-i18n="About">About</span>
				  </a>
				</div>
				<!-- SignIn and SignUp buttons -->
				<div class="auth-links">
				  <a href="#" class="SignIn" id="logout">
					<span data-i18n="Logout">Logout</span>
				  </a>
				  <div class="notification-container">
					<i class="fa fa-bell"></i>
					<span id="notification-badge" class="notification-badge">0</span>
				  </div>
				  <!-- Add language selector -->
				  <div id="language-selector-container"></div>
				</div>
			  </nav>
			</div>
		  </div>
		</nav>

	  `;

      // Add language selector to navbar
      console.log('Adding language selector to navbar');
      setTimeout(() => {
        const languageSelectorContainer = this.querySelector('#language-selector-container');
        console.log('Language selector container:', languageSelectorContainer);
        console.log('LanguageUtils available:', !!window.LanguageUtils);
        
        if (languageSelectorContainer && window.LanguageUtils) {
          const languageSelector = window.LanguageUtils.createLanguageSelector();
          console.log('Language selector created:', languageSelector);
          languageSelectorContainer.appendChild(languageSelector);
          console.log('Language selector added to DOM');
        } else {
          console.error('Language selector container or LanguageUtils not found');
        }
      }, 100); // Small delay to ensure LanguageUtils is loaded

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
	
		if (!refresh_Token || isTokenExpired(refresh_Token)) {
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
	  // Attach event listeners after the content is rendered
	  const gameOptionLink = this.querySelector("#go-to-gameoption");
	  if (gameOptionLink) {
		gameOptionLink.addEventListener("click", (event) => {
		  event.preventDefault();
		  fetchUserStats("gameoption");
		});
	  }
  
	  const profileLink = this.querySelector("#go-to-profile");
	  if (profileLink) {
		profileLink.addEventListener("click", (event) => {
		  event.preventDefault();
		  fetchUserStats("profile");
		});
	  }
  
	  const chatLink = this.querySelector("#go-to-chat");
	  if (chatLink) {
		chatLink.addEventListener("click", (event) => {
		  event.preventDefault();
		  fetchUserStats("chat");
		});
	  }
	  const logoutLink = this.querySelector("#logout");
	  if (logoutLink) {
		logoutLink.addEventListener("click", (event) => {
		  event.preventDefault();
		  fetchUserStats("logout");
		});
	  }
	  const tournamentLink = this.querySelector("#go-to-tournoi");
	  if (tournamentLink) {
		tournamentLink.addEventListener("click", (event) => {
		  event.preventDefault();
		  fetchUserStats("tournament");
		});
	  }
	}
  }
  
  customElements.define('navbar-component', Navebar);
  
  // Add the language selector to the navbar when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Add language selector to navbar if it exists
    const languageSelectorContainer = document.querySelector('#language-selector-container');
    if (languageSelectorContainer && window.LanguageUtils) {
        const languageSelector = window.LanguageUtils.createLanguageSelector();
        languageSelectorContainer.appendChild(languageSelector);
    }
  });
  