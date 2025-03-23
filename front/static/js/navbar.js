
class Navebar extends HTMLElement {
	async connectedCallback() {
	  this.innerHTML = `
		<link rel="stylesheet" href="/static/css/navbar.css" />
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
					<img src="static/image/game.png" alt="">Game
				  </a>
				  <a href="#tournaments" class="nav" id="go-to-tournoi">
					<img src="static/image/Tournament.png" alt="">Tournaments
				  </a>
				  <a href="#profil" class="nav" id="go-to-profile">
					<img src="static/image/profile.png" alt="">Profile
				  </a>
				  <a href="#chat" class="nav" id="go-to-chat">
					<img src="static/image/Chat.png" alt="">Chat
				  </a>
				  <a href="#faq" class="nav" id="faq">
					<img src="static/image/faq.png" alt="">Faq
				  </a>
				  <a href="#about" class="nav" id="about">
					<img src="static/image/info.png" alt="">About
				  </a>
				</div>
				<!-- SignIn and SignUp buttons -->
				<div class="auth-links">
				  <a href="#" class="SignIn" id="logout">Logout</a>
				  <div class="notification-container">
					<i class="fa fa-bell"></i>
					<span id="notification-badge" class="notification-badge">0</span>
				</div>
				</div>
			  </nav>
			</div>
		  </div>
		</nav>

	  `;

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
	  const aboutLink = this.querySelector("#about");
	  if (aboutLink) {
		aboutLink.addEventListener("click", (event) => {
		  event.preventDefault();
		  fetchUserStats("about");
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
  