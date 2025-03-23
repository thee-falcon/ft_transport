class signup extends HTMLElement {
 
  connectedCallback() {
    this.innerHTML = `
    <link rel="stylesheet" href="static/css/style.css">
      <div class="contonair">
        <form id="signup-form">
          <h1 data-i18n="SignUp">Sign Up</h1>
          <div class="input-field">
          <i class="fa-regular fa-envelope"></i>
          <input type="text" id="signup-Username" data-i18n-placeholder="Username" placeholder="Username" required />
        </div>
          <div class="input-field">
          <i class="fa-regular fa-envelope"></i>
          <input type="email" id="signup-email" data-i18n-placeholder="Email" placeholder="Email" />
        </div>        
        <div class="input-field">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="signup-password" data-i18n-placeholder="Password" placeholder="Password" />
      </div>
        <div class="input-field">
        <i class="fa-solid fa-lock"></i>
        <input type="password" id="signup-password1" data-i18n-placeholder="ConfirmPassword" placeholder="Confirm Password" />
      </div>
      <div class="btn-field">
      <button type="button" id="register" data-i18n="RegisterNow">Register</button>
      <p><span data-i18n="AlreadyHaveAccount">Already have an account?</span> <a href="#signin" data-i18n="Login">Sign in</a></p>
        </form>
    
    `;

    document.getElementById("register").addEventListener("click", async function(event) {
      console.log("bitn clicked");
      event.preventDefault();
      const username = document.getElementById("signup-Username").value;
      const email = document.getElementById("signup-email").value;

	  const password = document.getElementById("signup-password").value;
      const password1 = document.getElementById("signup-password1").value;
    
      if (password !== password1) {
          alert(window.LanguageUtils ? window.LanguageUtils.translate("PasswordsDontMatch") : "Passwords do not match!");
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
          alert(window.LanguageUtils ? window.LanguageUtils.translate("RegistrationSuccess") : "Registration successful! Please log in.");
          window.location.hash = "signin";
      } else {
          alert(window.LanguageUtils ? window.LanguageUtils.translate("RegistrationFailed") : "Registration failed. Check your details.");
      }
    });

    function getCookie(name) {
      let match = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return match ? match[2] : null;
    }
  }
}

customElements.define('signup-component', signup);
