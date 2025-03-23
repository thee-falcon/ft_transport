

class faq extends HTMLElement {
    async connectedCallback() {
        
        this.innerHTML = /*html*/`

			
		<link rel="stylesheet" href="/static/css/faq.css" />
				<div class="faq_container">
					<div class="faq_header">
						
						<div class="faq_text">
							<h1>Frequently Asked Questions </h1>
							<h4>Quick answers to questions you may have. can’t find what you’re looking for ? Check out our full documentation</h4>
						</div>
						
					</div>
					<div class="faq_questions">
						<div class="row1">
							<div class="questions">
								<h4>Quick answers to questions you may have ? </h4>
								<h5>It’s more  then just a game , u should see ping-pong as<br>
									a way to relax , entertain and most important to <br>
									reconnect with ur aura powers </h5>
								</div>
								<div class="questions">
									<h4>Quick answers to questions you may have ? </h4>
									<h5>It’s more  then just a game , u should see ping-pong as<br>
										a way to relax , entertain and most important to <br>
										reconnect with ur aura powers </h5>
								</div>
						</div>
						<div class="row2">
							<div class="questions">
								<h4>Quick answers to questions you may have ? </h4>
								<h5>It’s more  then just a game , u should see ping-pong as<br>
									a way to relax , entertain and most important to <br>
									reconnect with ur aura powers </h5>
								</div>
								<div class="questions">
									<h4>Quick answers to questions you may have ? </h4>
									<h5>It’s more  then just a game , u should see ping-pong as<br>
										a way to relax , entertain and most important to <br>
										reconnect with ur aura powers </h5>
									</div>
						</div>
						<div class="row3">
							<div class="questions">
								<h4>Quick answers to questions you may have ? </h4>
								<h5>It’s more  then just a game , u should see ping-pong as<br>
									a way to relax , entertain and most important to <br>
									reconnect with ur aura powers </h5>
								</div>
								<div class="questions">
									<h4>Quick answers to questions you may have ? </h4>
									<h5>It’s more  then just a game , u should see ping-pong as<br>
										a way to relax , entertain and most important to <br>
										reconnect with ur aura powers </h5>
									</div>
						</div>
					</div>
				</div>

       `;
     
    }
}

customElements.define('faq-component', faq);