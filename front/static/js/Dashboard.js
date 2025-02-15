class dashboard extends HTMLElement {
    async connectedCallback() {
                    this.innerHTML = `
    <div id="lo">
        <div class="dashboard-container">
            <div class="col1">
                    <div class="card1">
                        <div class="card1-enlign-freinds">
                            <p>En ligne freinds</p>
                            <div class="freinds-list">
                                <div class="friends1">
                                    <img class="freinds1-Players" alt="" src="../image/defaultprofilepic.png">
                                    <p class="freinds1-name">Doctor Strange</p>
                                    <a href="" class="Start"> Send</a>
                                </div>
                                <div class="friends2">
                                    <img class="freinds2-Players" alt="" src="../image/Screen Shot 2024-10-02 at 2.05.14 AM.png">
                                    <p class="freinds2-name">Doctor Strange</p>
                                    <a href="" class="Start"> Send</a>
                                </div>
                                <div class="friends3">
                                    <img class="freinds3-Players" alt="" src="../image/defaultprofilepic.png">
                                    <p class="freinds3-name">Doctor Strange</p>
                                    <a href="" class="Start"> Send</a>
                                </div>
                                <div class="friends4">
                                    <img class="freinds4-Players" alt="" src="../image/Screen Shot 2024-10-02 at 2.05.14 AM.png">
                                    <p class="freinds4-name">Doctor Strange</p>
                                    <a href="" class="Start"> Send</a>
                                </div>
                                <div class="friends5">
                                    <img class="freinds5-Players" alt="" src="../image/defaultprofilepic.png">
                                    <p class="freinds5-name">Doctor Strange</p>
                                    <a href="" class="Start"> Send</a>
                                </div>
                            </div> 
                        </div>
                        <div class="card1-enlign-tournaments">
                            <p>Club Badge</p>
                            <div class="Tournaments-list">
                                <img src="../image/badge1.png" alt="">
                            </div>
                        </div>
                    </div>    
            </div>
            <div class="col2">

                    <div class="card2">
                        <div class="card2-col1">
                            <div class="card2-content">
                                <h1>Sharpen Your Skills with Our Diverse Games</h1>
                                <h3>"JS-US Pong where Ping Pong skills Flourish"</h3>
                            </div>
                            <div class="card2-buttons">     
                                <a href="" class="Start">Start Game</a>
                                <a href="" class="Start">Start Gym</a>
                                <a href="" class="Start">Start Tournament</a>
                            </div>
                        </div>
                        <div class="card2-image">
                            <img src="../image/raquets.png" alt="">
                        </div>
                    </div>
                    <div class="card3">
                        <div class="card3-part1">
                            <h3>Won<br>Matches :</h3>
                            <h1>86</h1>
                        </div>
                        <div class="card3-part2">
                            <h3>Lost<br>Matches :</h3>
                            <h1>86</h1>
                        </div>
                        <div class="card3-part3">
                            <h3>Club<br>Rank :</h3>
                            <h1>86</h1>
                        </div>
                        <div class="card3-part4">
                            <h3>Tornaments<br>Won :</h3>
                            <h1>86</h1>
                        </div>
                        <div class="card3-part5">
                            <h3>Tornaments<br>Lost :</h3>
                            <h1>86</h1>
                        </div>
                        <div class="card3-part6">
                            <h3>Succes<br>Rate (%):</h3>
                            <h1>86</h1>
                        </div>
                    </div>
                    <div class="card4">
                        <div class="changing-catalog">
                            <p>statistics slider</p>
                        </div>
                        <div class="statistics-graphs">
                            <p>statistics</p>
                        </div>
                        <!-- here should be the statistics diagarams of loses and wones -->
                    </div>
            </div>
            <div class="col3">
                    
                    <div class="card5">
                        <div class="card5-profile-infos">
                            <div class="card5-profile-infos-part1">
                  
                                <img src="../image/defaultprofilepic.png" alt="">
                            </div>
                            <div class="card5-profile-infos-part2"> 
                                <p class="name"> MOHAMED BOUDRIOUA </p>
                                <p class="nickname"> Excalibur66 </p>
                                <p class="level"> LvL 15</p>
                                <p class="description"> "the Conquer of PING-PONG Realm" </p>
                                <p class="email"> joumanji22@gmail </p>
                            </div>
                        </div>
                        <div class="card5-settings">
                            <div class="card5-part1">
                                <p>Settings:</p>
                            </div>
                            <div class="card5-part2">
                                <div class="input1">
                                    <p>Edit  Name</p>
                                    <input type="text" placeholder="   new Name">
                                </div>
                                <div class="input2">
                                    <p>Edit NickName</p>
                                    <input type="text" placeholder="   new Nickname">
                                </div>
                                <div class="input3">
                                    <p>Edit Description</p>
                                    <input type="text" placeholder="   new Description">
                                </div>
                                <div class="input4">
                                    <p>Edit Avatar</p>
                                    <input type="text" placeholder="   new profile Picture">
                                </div>
                                <div class="input5">
                                    <p>Edit  Email</p>
                                    <input type="text" placeholder="   new Email">
                                </div>
                                <div class="input6">
                                    <p>Edit  Password</p>
                                    <input type="text" placeholder="   new Password">
                                </div>    
                                <div class="save_changes1">
                                    <a href="" class="Start">Save Changes</a>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>
    </div>`;
 

}
}
customElements.define('dashboard-component', dashboard);