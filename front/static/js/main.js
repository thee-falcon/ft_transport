 const route = {
    'signin': 'signin-component',
    'signup': 'signup-component',
    'home':   'home-component',
    'dashboard': 'dashboard-component',
    'profile':   'profile-component',
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
    console.log('path === ' ,path);
    if ((path === "home" || path === "profile" ||path === "dashboard" ) && !isAuthenticated()) {
        
        window.location.hash = "signin";
        return;
    }

    const page = route[path];
    const container = document.getElementById("view-container");

    if (!page) {
        console.log(path ,"no page awayli ??");
        window.location.hash = "signin";
        return;
    }
    console.log('how abt now path === ' ,path);
    container.innerHTML = `<${page}></${page}>`;
    container.classList.add("active");
}



window.addEventListener("hashchange", navigate);
window.addEventListener("DOMContentLoaded", navigate);

const isTokenExpired = () => {
    const expiry = localStorage.getItem('tokenExpiry');
    if (!expiry) return true;
    return Date.now() > parseInt(expiry, 10);
};

//  function refreshhhToken() {
//     console.log('Refreshing access token...');
//     const refresh_Token = getCookie('refresh_token');

//     if (!refresh_Token) {
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
