class Gameoption extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = `
        <link rel="stylesheet" href="static/css/gameoption.css">

<body>
    
    <div class="container">
        <div class="glass"  style="--r:-15;" >
            <div class="Game_Modes_img">
                <img src="./media/ping-pong.png" alt="">
            </div>
        <button class="button" id="normal-mode">Ping Pong</button>
        </div>
        <div class="glass" style="--r:5;" >
            <div class="Game_Modes_img">
                <img src="./media/people.png" alt="">
            </div>
          <button class="button"id="multiplayer-mode">Multiplayer</button>
        </div>
        <div class="glass" style="--r:25;" >
            <div class="Game_Modes_img">
                <img src="./media/processor.png" alt="">
            </div>
          <button class="button">Ai Mode</button>
        </div>
      </div>
      
</body>
 


`;
        let gotonormal = document.getElementById("normal-mode");
        gotonormal.addEventListener('click', function (event) {
            event.preventDefault();
            // console.log(window.location.hash);
            // console.log(window.location.host);
            // console.log(window.location.hostname);
            // console.log(window.location.href);
            window.location.hash = "normal";
            // console.log(window.location.hash);

        });
        let gotomultiplayer = document.getElementById("multiplayer-mode");
        gotomultiplayer.addEventListener('click', function (event) {
            event.preventDefault();
            // console.log(window.location.hash);
            // console.log(window.location.host);
            // console.log(window.location.hostname);
            // console.log(window.location.href);
            window.location.hash = "multiplayer";
            // console.log(window.location.hash);

        });
    }
}

customElements.define('gameoption-component', Gameoption);

