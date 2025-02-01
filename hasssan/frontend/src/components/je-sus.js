let template = document.createElement("template");

template.innerHTML = `<div id="je-sus" class="je-sus"> Hello from Jesus... ! </div>`;


class Jesus extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    this.shadow.appendChild(template.content.cloneNode(true));
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'src/assets/style/je-sus.css');
    this.shadow.appendChild(linkElem);
  }

  connectedCallback() {
    console.log("Jesus is Connected");
  }
  
  disconnectedCallback() {
    console.log('Jesus is Disonnected');
  }

  static get observedAttributes() {
    return[/* array of attribute names to monitor for changes */];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // called when one of attributes listed above is modified
  }

}
customElements.define('je-sus', Jesus);

export default Jesus;
