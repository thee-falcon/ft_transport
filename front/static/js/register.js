class signup extends HTMLElement {
 
  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="static/css/style.css">
      <div class="contonair">
        <form id="signup-form">
          <h1>Sign Up</h1>
          <div class="input-field">
          <i class="fa-regular fa-envelope"></i>
          <input type="text" id="signup-Username" placeholder="Username" required />
        </div>
          <div class="input-field">
          <i class="fa-regular fa-envelope"></i>
          <input type="email" id="signup-email"placeholder="Email" />
        </div>        
        <div class="input-field">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="signup-password" placeholder="Password" />
      </div>
        <div class="input-field">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="signup-password1" placeholder="Password" />
      </div>
      <div class="btn-field">
      <button type="button" id="register">Register</button>
      <p>Already have an account? <a href="#signin">Sign in</a></p>
        </form>
    
    `;

    document.getElementById("register").addEventListener("click", async function(event) {
      console.log("bitn clicked");
      event.preventDefault();
      const username = document.getElementById("signup-Username").value;
      const email = document.getElementById("signup-email").value;
    //   const password = document.getElementById("signup-password").value;
    //   const password1 = document.getElementById("signup-password1").value;
      
    //   const response = await fetch('http://localhost:8000/signup/', {
    //       method: "POST",
    //       headers: {
    //           "Content-Type": "application/json",
    //           "X-CSRFToken": getCookie("csrftoken")
    //       },
    //       body: JSON.stringify({ username, email, password })
    //   });

    //   if (response.ok) {
    //       alert("Registration successful! Please log in.");
    //       window.location.hash = "signin";
    //   } else {
    //       alert("Registration failed. Check your details.");
    //   }


	const password = document.getElementById("signup-password").value;
    const password1 = document.getElementById("signup-password1").value;
    
    if (password !== password1) {
        alert("Passwords do not match!");
        return;
    }

    const response = await fetch('http://localhost:8000/signup/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({ username, email, password })
    });

    if (response.ok) {
        alert("Registration successful! Please log in.");
        window.location.hash = "signin";
    } else {
        alert("Registration failed. Check your details.");
    }
    });
  }
}

customElements.define('signup-component', signup);
