
 
function renderView(viewFunction, viewName) {
    const container = document.getElementById('view-container');
    container.innerHTML = viewFunction();
    container.classList.add('active');
    window.location.hash = viewName;   
}


 function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.exp * 1000 < Date.now();
    } catch (e) {
        return true;  // If token is invalid, treat it as expired
    }
}


function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) {
            return cookieValue;
        }
    }
    return null;
}

function refreshToken() {
    const refresh_token = getCookie("refresh"); // Get refresh token from cookies
    if (!refresh_token) {
        console.log("No refresh token found, user needs to log in.");
        return Promise.resolve(null);
    }

    return fetch("http://localhost:8000/token-refresh/", {
        method: "POST",
        credentials: "include",  
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refresh_token }) // Send refresh token
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                console.error("Failed to refresh token:", errorData);
                return null;
            });
        }
        return response.json();
    })
    .then(data => {
        if (data && data.access) {
            // Store the new access token in cookies
            document.cookie = `access=${data.access}; path=/; SameSite=None; Secure`;
            console.log("Token refreshed:", data.access);
            return data.access;
        }
        return null;
    })
    .catch(error => {
        console.error("Error refreshing token:", error);
        return null;
    });
}

window.addEventListener("hashchange", function () {
    handleRouteChange();
});

function handleRouteChange() {
    const route = window.location.hash.slice(1); // Remove "#"
    
    const routes = {
        "dashboard": renderMainView,
        "login": renderLoginView,
        "signup":renderSignupView,

    };

    if (routes[route]) {
        renderView(routes[route], route);
    } else {
        renderView(renderLoginView, "login"); // Default to login
    }
}

// Ensure the correct view loads when the page is refreshed
window.onload = function () {
    handleRouteChange();
};

document.addEventListener('DOMContentLoaded', () => {
    // initializeGoogle();
});

renderMainView();
renderLoginView();
renderSignupView();
 



    document.getElementById("go-to-signup").addEventListener("click", () => {
      window.location.hash = "signup";
    });

    document.getElementById("login-form").addEventListener("submit", async function(event) {
      event.preventDefault();
      
      // const username = document.getElementById("user").value;
      // const password = document.getElementById("login-password").value;
      const dataa = {
        username: document.getElementById('user').value,
        password: document.getElementById('login-password').value,
    };
      const response = await fetch('http://localhost:8000/login/', {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken")
          },
          body: JSON.stringify(dataa),
      });

      if (response.ok) {
        const data = await response.json();
          // localStorage.setItem("access_token", data.access);
          // localStorage.setItem("refresh_token", data.refresh);
          // localStorage.setItem("username", username);
                   document.cookie = `username=${data.username}; path=/; SameSite=None; Secure`;
                    document.cookie = `refresh=${data.access}; path=/; SameSite=None; Secure`;
                    document.cookie = `access=${data.refresh}; path=/; SameSite=None; Secure`;
          window.location.hash = "dashboard";
      } else {
          alert("Login failed. Check your credentials.");
      }
    });























document.addEventListener('DOMContentLoaded', () => {
    renderView(renderLoginView,"login");
    document.addEventListener('click', async (event) => {


        const target = event.target;
        if (target.id === 'go-to-signup') {
            console.log("'signup button clicked!'");
            renderView(renderSignupView);
        }
        else if (target.id === 'register') {
            console.log("'register button clicked!'");
            const data = {
                 
                username: document.getElementById('signup-username').value,
                email: document.getElementById('signup-email').value,
                password: document.getElementById('password').value,
               
                // password2: document.getElementById('confirm-password'),
            };
     
                // check for fields password wkda !!!!!


            // Send the data directly without nesting
            try {
                const response = await fetch('http://localhost:8000/signup/', {
                    method: 'POST',
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(data),   // Send data directly
                });
                console.log(data.email, data.password, data.username);
                if (response.ok) {
                    const responseData = await response.json();
                    console.log('Server response', responseData.message);

                    alert('Account created successfully! Redirecting to login page...');

                    renderView(renderLoginView);
                } else {
                    const errorData = await response.json();
                    console.log('Fetch error:', errorData);
                    alert('Error: ' + errorData.message);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        }

        else if (target.id === 'login-btn') {
            const data = {
                username: document.getElementById('login-user').value,
                password: document.getElementById('login-password').value,
            };
            const csrfToken = getCookie('csrftoken');  
            try {
                const response = await fetch('http://localhost:8000/login/', {
                    method: 'POST',
                    mode: "cors",
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken  // Send CSRF token with the request
                    },
                    body: JSON.stringify(data),
                });
        
                if (response.ok) {
                    const responseData = await response.json();
                    console.log("Server response:", responseData);
        
                    document.cookie = `username=${data.username}; path=/; SameSite=None; Secure`;
                    document.cookie = `refresh=${responseData.refresh}; path=/; SameSite=None; Secure`;
                    document.cookie = `access=${responseData.access}; path=/; SameSite=None; Secure`;
                    console.log(getCookie("refresh")); 
                    const accessToken = getCookie("access"); // Or use localStorage/sessionStorage if that's how you're storing them
                    const refreshTokenn = getCookie("refresh");
                    if (!accessToken || !refreshTokenn) {
                        console.log("no token and no refresh token");
                        window.location.hash = "login"; 
                    }else{
                    refreshToken().then(newAccessToken => {
                        if (newAccessToken && !isTokenExpired(newAccessToken)) {
                            renderView(renderMainView, "dashboard");
                        } else {
                            alert("User needs to log in again.");
                            window.location.hash = "login";
                        }
                    });
                }
                    // renderView(renderMainView, "dashboard");
                    alert('Account logged in successfully!');
        
                    // Handle superuser redirect
                    if (responseData.redirect_url) {
                        alert('Redirecting to admin panel...');
                        window.location.href = responseData.redirect_url; // Redirect superuser to admin panel
                    } else {
                        // For regular users
                        if (responseData.user || responseData.username) {
                            alert(`Welcome, ${responseData.username}!`);                            
                            const userInfoElement = document.getElementById('user-info');
                            if (userInfoElement) {
                                userInfoElement.innerHTML = `Welcome, ${responseData.username}`;                                 
                                }
                        } else {
                            alert('User information is missing in the response.');
                        }
                    }
                } else {
                    const errorData = await response.json();
                    console.log('Fetch error:', errorData);
                    alert('Error: ' + errorData.message);
                }
            } catch (error) {
                console.log('Error:', error);
            }
        
            console.log("'Login button clicked!'");


        }else if (target.id === 'go-to-login') {
            renderView(renderLoginView);
        } else if (target.id === 'logout') {
            renderView(renderLoginView);
        } else if (target.id === 'intra-btn') {
            const email = document.getElementById('login-email').value;
            alert('Intra login');
        } else if (target.id === 'gmail-btn') {
                console.log("google");

        }
    });
});