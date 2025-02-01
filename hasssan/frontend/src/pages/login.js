let template = document.createElement("template");

template.innerHTML = /*html*/
`<div id="login-page" class="login-page"> 
<h1>Login</h1>
  <form id="login-form">
    <div class="input-field">
      <i class="fa-regular fa-envelope"></i>
      <input type="email" id="login-user" placeholder="user" required />
    </div>
    <div class="input-field">
      <i class="fa-solid fa-lock"></i>
      <input type="password" id="login-password" placeholder="Password" />
    </div>
    <p>Lost password? <a href="#">Click here!</a></p>
    <div class="btn-field">
      <button type="submit" id="login-btn">Log In</button>
    </div>
    <router-link to="/home">
      <span slot="title">
        Jesus command you to go to HOME
      </span>
    </router-link>
    <div class="btn-field">
      <button type="button" id="go-to-signup" data-link="signup" >Don't have an account?</button>
    </div>
    <div class="btn-field">
      <button type="button" id="intra-btn">Login with 42</button>
    </div>
    <div class="btn-field">
      <button type="button" id="gmail-btn">Login with Gmail</button>
    </div>
  </form>
</div>`;


class LOGIN extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'src/assets/style/login-page.css');
    this.shadow.appendChild(linkElem);
  }

  connectedCallback() {
    console.log("LOGIN is Connected");
  }
  
  disconnectedCallback() {
    console.log('LOGIN is Disonnected');
  }

  static get observedAttributes() {
    return[/* array of attribute names to monitor for changes */];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

}
customElements.define('login-page', LOGIN);

export default LOGIN;
