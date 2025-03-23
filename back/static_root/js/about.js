


class about extends HTMLElement {
    async connectedCallback() {
        
        this.innerHTML = /*html*/`

		<link rel="stylesheet" href="/static/css/about.css" />
			<div class="koom">

				<div class="about_container">
					<div class="about_text">
						<h2>About Us:</h2>
						<h2>Where Ping-Pong Skills<br>Flourish .</h2>
						<h4>A new way to hit the Ball .</h4>
						<p>Use  Our Ping-Pong Platform to became one of the top <br>
							tier Player in the world . <br>
							By enhancing your skills while playing many matches <br>
							and became on of our <br>
							tournaments champions  </p>
							<p>It’s more  then just a game , u should see ping-pong as<br>
								a way to relax , entertain and most important to <br>
								reconnect with ur aura powers and your inner self. <br>
								Enjoy       </p>
								
							</div>
							<div class="about_img">
								<img src="/static/image/Screen Shot 2024-10-02 at 4.18.58 AM.png" alt="">
							</div>
						</div>    
			</div>

       `;
     
    }
}

customElements.define('about-component', about);