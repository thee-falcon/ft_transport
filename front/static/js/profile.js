class profile extends HTMLElement {
    async connectedCallback() {
        const username =getCookie('username');
        const first_name = getCookie('first_name');
        const lastname  =  getCookie('last_name');
        const profilePicture = getCookie('profile_picture');
        console.log("picture" , profilePicture);
        const email = getCookie('email');
        const matches_won = getCookie('matches_won');
        const matches_lost =  getCookie('matches_lost');
        const tournaments_won =  getCookie('tournaments_won');
        const tournaments_lost =  getCookie('tournaments_lost');
        
                    this.innerHTML = `
    <div id="lo">
        <div class="dash-dashboard-container">
            <div class="dash-col1">
                    <div class="dash-card1">
                        <div class="dash-card1-enlign-friends">
                            <p>En ligne friends</p>
                            <div class="dash-friends-list">
                                <div class="dash-friends1">
                                    <img class="dash-friends1-Players" alt="" src="/media/defaultprofilepic.png">
                                    <p class="dash-friends1-name">Doctor Strange</p>
                                    <a href="" class="dash-Start"> Send</a>
                                </div>
                                <div class="dash-friends2">
                                    <img class="dash-friends2-Players" alt="" src="/media/Screen Shot 2024-10-02 at 2.05.14 AM.png">
                                    <p class="dash-friends2-name">Doctor Strange</p>
                                    <a href="" class="dash-Start"> Send</a>
                                </div>
                                <div class="dash-friends3">
                                    <img class="dash-friends3-Players" alt="" src="/media/defaultprofilepic.png">
                                    <p class="dash-friends3-name">Doctor Strange</p>
                                    <a href="" class="dash-Start"> Send</a>
                                </div>
                                <div class="dash-friends4">
                                    <img class="dash-friends4-Players" alt="" src="/media/Screen Shot 2024-10-02 at 2.05.14 AM.png">
                                    <p class="dash-friends4-name">Doctor Strange</p>
                                    <a href="" class="dash-Start"> Send</a>
                                </div>
                                <div class="dash-friends5">
                                    <img class="dash-friends5-Players" alt="" src="/media/defaultprofilepic.png">
                                    <p class="dash-friends5-name">Doctor Strange</p>
                                    <a href="" class="dash-Start"> Send</a>
                                </div>
                            </div> 
                        </div>
                        <div class="dash-card1-enlign-tournaments">
                            <p>Club Badge</p>
                            <div class="dash-Tournaments-list">
                                <img src="/media/badge1.png" alt="">
                            </div>
                        </div>
                    </div>    
            </div>
            <div class="dash-col2">

                    <div class="dash-card2">
                        <div class="dash-card2-col1">
                            <div class="dash-card2-content">
                                <h1>Sharpen Your Skills with Our Diverse Games</h1>
                                <h3>"JS-US Pong where Ping Pong skills Flourish"</h3>
                            </div>
                            <div class="dash-card2-buttons">     
                                <a href="" class="dash-Start">Start Game</a>
                                <a href="" class="dash-Start">Start Gym</a>
                                <a href="" class="dash-Start">Start Tournament</a>
                            </div>
                        </div>
                        <div class="dash-card2-image">
                            <img src="/media/raquets.png" alt="">
                        </div>
                    </div>
                    <div class="dash-card3">
                        <div class="dash-card3-part1">
                            <h3>Won<br>Matches :</h3>
                            <h1>${matches_won}</h1>
                        </div>
                        <div class="dash-card3-part2">
                            <h3>Lost<br>Matches :</h3>
                            <h1>${matches_lost}</h1>
                        </div>
                        <div class="dash-card3-part3">
                            <h3>Club<br>Rank :</h3>
                            <h1>69</h1>
                        </div>
                        <div class="dash-card3-part4">
                            <h3>Tornaments<br>Won :</h3>
                            <h1>${tournaments_won}</h1>
                        </div>
                        <div class="dash-card3-part5">
                            <h3>Tornaments<br>Lost :</h3>
                            <h1>${tournaments_lost}</h1>
                        </div>
                        <div class="dash-card3-part6">
                            <h3>Succes<br>Rate (%):</h3>
                            <h1>86</h1>
                        </div>
                    </div>
                    <div class="dash-card4">
                        <div class="dash-changing-catalog">
                            <p>statistics slider</p>
                        </div>
                        <div class="dash-statistics-graphs">
                            <p>statistics</p>
                        </div>
                        <!-- here should be the statistics diagarams of loses and wones -->
                    </div>
            </div>
            <div class="dash-col3">
                    
                    <div class="dash-card5">
                        <div class="dash-card5-profile-infos">
                            <div class="dash-card5-profile-infos-part1">
                  
                                <img    src=${profilePicture}  alt="">
                            </div>
                            <div class="dash-card5-profile-infos-part2"> 
                                <p class="dash-name">  ${first_name} ${lastname} </p>
                                <p class="dash-nickname"> ${username} </p>
                                <p class="dash-level"> LvL 0</p>
                                <p class="dash-description"> "the Conquer of PING-PONG Realm" </p>
                                <p class="dash-email"> ${email} </p>
                            </div>
                        </div>
                        <div class="dash-card5-settings">
                            <div class="dash-card5-part1">
                                <p>Settings:</p>
                            </div>
                            <div class="dash-card5-part2">
                                <div class="dash-input1">
                                    <p>Edit  Name</p>
                                    <input type="text" placeholderr="   new Name">
                                </div>
                                <div class="dash-input2">
                                    <p>Edit NickName</p>
                                    <input type="text" placeholderr="   new Nickname">
                                </div>
                                <div class="dash-input3">
                                    <p>Edit Description</p>
                                    <input type="text" placeholderr="   new Description">
                                </div>
                                <div class="dash-input4">
                                    <p>Edit Avatar</p>
                                    <input type="text" placeholderr="   new profile Picture">
                                </div>
                                <div class="dash-input5">
                                    <p>Edit  Email</p>
                                    <input type="text" placeholderr="   new Email">
                                </div>
                                <div class="dash-input6">
                                    <p>Edit  Password</p>
                                    <input type="text" placeholderr="   new Password">
                                </div>    
                                <div class="dash-save_changes1">
                                    <a href="" class="dash-Start">Save Changes</a>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>`;
 

}
}
customElements.define('profile-component', profile);
