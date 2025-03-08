class navebar extends HTMLElement {
    async connectedCallback() {

        this.innerHTML = `
		<link rel="stylesheet" href="/static/css/navbar.css" />
		<link rel="stylesheet" href="/static/bootstrap-5.3.3-dist/css/bootstrap.min.css">
		<body class="vh-100 " >
    <nav class="navbar navbar-expand-lg navbar-dark bg-transparent" id="mainNavBar">
        <div class="container-fluid">
            <a class="navbar-brand" href="#" id="index-link">
                <img src="static/image/logo.png" alt="Logo">
            </a>
            <button class="navbar-toggler shadow-none border-1" type="button" data-bs-toggle="offcanvas" 
                    data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                <img src="static/image/menu.png" alt="">
            </button>
            <!-- sideBar -->
            <div class="sidebar offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel">
                <div class="offcanvas-header">
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <nav class="navbarMe">
                    <div class="imageLogo">
                        <a href="#home" class="logo" id="home">
                            <img src="static/image/logo.png" alt="Logo">
                        </a>
                    </div>
                    <!-- All nav elements -->
                    <div class="nav-links">
                        <a href="#game" class="nav" id="game">
                            <img src="static/image/game.png" alt="">Game
                        </a>
                        <a href="#tournaments" class="nav" id="tournaments">
                            <img src="static/image/Tournament.png" alt="">Tournaments
                        </a>
                        <a href="#profil" class="nav" id="profile">
                            <img src="static/image/profile.png" alt="">Profile
                        </a>
                        <a href="#chat" class="nav" id="chat">
                            <img src="static/image/Chat.png" alt="">Chat
                        </a>
                        <a href="#faq" class="nav" id="faq">
                            <img src="static/image/faq.png" alt="">Faq
                        </a>
                        <a href="#" class="nav" id="TournamentTree">
                            <img src="static/image/info.png" alt="">About
                        </a>
                    </div>
                    <!-- SignIn and SignUp buttons -->
                    <div class="auth-links">
                        <a href="#login" class="SignIn" id="SignIn">Sign In</a>
                        <a href="#login" class="SignIn" id="SignUp">Sign Up</a>
                    </div>
                </nav>
            </div>
        </div>
    </nav>
	
    <script src="static/bootstrap-5.3.3-dist/js/bootstrap.bundle.min.js"></script>
</body>
 


`;
       
    }
}

customElements.define('navbar-component', navebar);





