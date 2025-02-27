class Gameoption extends HTMLElement {
    async connectedCallback() {
this.innerHTML = `
<head>
<style>

</style>
</head>
<body>
    
    <div class="container">
        <div class="glass"  style="--r:-15;" >
            <div class="Game_Modes_img">
                <img src="./media/ping-pong.png" alt="">
            </div>
        <button class="button">Ping Pong</button>
        </div>
        <div class="glass" style="--r:5;" >
            <div class="Game_Modes_img">
                <img src="./media/people.png" alt="">
            </div>
          <button class="button">Multiplayer</button>
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
    }
}

customElements.define('gameoption-component', Gameoption);
