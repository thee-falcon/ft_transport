class tournament extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = 
`
<link rel="stylesheet" href="static/css/tourne.css">
</head>
<body> 
    <div class="biggie">
        <div class="containerr_above_all">
            <div class="containerr_above_all_1">
                <div class="Texts">
                    <h1>Tournament list</h1>
                    <h2>Tournament Competitors</h2>
                </div>
                <div class="Inputs">
                    <input class="containerr_above_all_1_input" type="text" placeholder="player1">
                    <input class="containerr_above_all_1_input" type="text" placeholder="player2">
                    <input class="containerr_above_all_1_input" type="text" placeholder="player3">
                    <input class="containerr_above_all_1_input" type="text" placeholder="player4">
                </div>
                <div class="buttons">
                    <a href="">Start Tournament</a>
                </div>
            </div>
            <div class="container_above_all_2">
                <img src="media/girl.png" alt="">
            </div>
        </div>
    </div>
</body>
</html>
`;
}
}
customElements.define("tournament-component", tournament);
