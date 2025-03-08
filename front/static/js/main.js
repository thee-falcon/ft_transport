const route = {
    'signin': 'signin-component',
    'signup': 'signup-component',
    'home':   'home-component',
    'dashboard': 'dashboard-component',
    'profile':   'profile-component',
    'gameoption': 'gameoption-component',
    'training': 'training-component',
    'normal': 'normal-mode',
    'multiplayer': 'multiplayer-mode',
    'tournament': 'tournament-component',
	'chat': 'chat-component',
	'navbar': 'navbar-component',

};

function getCookie(name) {
    let match = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return match ? match[2] : null;
}

function isAuthenticated() {
    console.log('Entering authentication');

    const refresh_Token = getCookie("refresh_token");
    const access_Token = getCookie("access_token");
    if ((!refresh_Token || !access_Token)  ) {
        console.log("Not authenticated: missing tokens redrecting to signin ");

        return false;
    }



    console.log('User is authenticated');
    return true;
}






async function navigate() {
    const path = window.location.hash.substring(1) || "signin";
    console.log("Navigating to:", path); // ✅ Debugging

    if ((path === "home" || path === "profile" || path==="tournament" || path==="chat" || path === "dashboard" || path === "gameoption" || path === "normal" || path === "training" || path === "multiplayer" ) && !isAuthenticated()) {
        console.log("User not authenticated, redirecting to signin.");
        window.location.hash = "signin";
        return;
    }

	 // Get the navbar container element
	//  const navbarContainer = document.getElementById('navbar-container');
    
	//  // Only show the navbar if the route is not 'home'
	//  if (path === 'home' || path === 'signin') {
	// 	 navbarContainer.innerHTML = '';
	//  } else {
	// 	 // Optional: avoid re-rendering if it already exists
	// 	 if (!document.querySelector('navbar-component')) {
	// 		 navbarContainer.innerHTML = '<navbar-component></navbar-component>';
	// 	 }
	//  }

    const page = route[path];
    const container = document.getElementById("view-container");

    if (!page) {
        console.log("No page found for:", path);
        window.location.hash = "signin";
        return;
    }

    console.log("Loading component:", page); // ✅ Debugging
    container.innerHTML = `<${page}></${page}>`;
}



window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", navigate);


function isTokenExpired() {
    const expiresAt = getCookie("expires_at");

    if (!expiresAt) {
        console.warn("No expires_at cookie found!");
        return true;  // Treat it as expired if missing
    }

    const now = Math.floor(Date.now() / 1000);  // Current time in seconds
    return now >= expiresAt;
}

// Example usage
// if (isTokenExpired()) {
//     console.log("Token expired! Refresh needed.");
// } else {
//     console.log("Token is still valid.");
// }

// async  function refreshhhToken() {
//     console.log('Refreshing access token...');
//     const refresh_Token = getCookie('refresh_token');

//     if (!refresh_Token|| isTokenExpired()) {
//         console.log("No refresh token found, user not authenticated.");
//         return false;
//     }

//     try {
//         const response = await fetch("http://localhost:8000/token-refresh/", {
//             method: "POST",
//             credentials: "include",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ refresh: refresh_Token }),
//         });

//         if (response.ok) {
//             const data = await response.json();
//             document.cookie = `access_token=${data.access}; path=/; SameSite=None; Secure`;
//             console.log("New access token received:", data.access);
//             return true;
//         } else {
//             console.error("Failed to refresh token. Redirecting to signin.");
//             deleteCookie("access_token");
//             deleteCookie("refresh_token");
//             return false;
//         }
//     } catch (error) {
//         console.error("Error refreshing token:", error);
//         return false;
//     }
// }