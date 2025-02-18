// Player data
console.log('playerProfile.js loaded');
const playerData = {
    profile: {
        fullName: 'omar makran',
        nickname: 'thefalcon',
        level: 'lvl dyal do3afa wsf',
        description: 'wtiriri mea bnt tmaarrraaa',
        rank: 'rank: bios alm3lm',
        gamesWon: 100,
        gamesLost: 100,
        currentStrike: 3
    },
    matches: [
        { time: '20:11', player1: 'thefalcon', player2: 'Deadpool69', result: 'WIN' },
        { time: '20:11', player1: 'thefalcon', player2: 'Doctor Strange', result: 'LOSE' },
        { time: '20:11', player1: 'THOR', player2: 'thefalcon', result: 'LOSE' },
        { time: '20:11', player1: 'Wanda', player2: 'thefalcon', result: 'WIN' },
        { time: '20:11', player1: 'thefalcon', player2: 'Iron MAN', result: 'WIN' }
    ]
};

// DOM Elements
let editProfileBtn;
let gameButtons;
let socialIcons;

// Initialize the profile
function initializeProfile() {
    // Update profile information
    updateProfileInfo();
    
    // Set up event listeners
    setupEventListeners();
}

// Update profile information
function updateProfileInfo() {
    // Update player stats
    document.querySelector('.info-won').textContent = `games won: ${playerData.profile.gamesWon}`;
    document.querySelector('.info-lose').textContent = `games lose: ${playerData.profile.gamesLost}`;
    
    // Update player details
    document.querySelector('.info-fullname').textContent = playerData.profile.fullName;
    document.querySelector('.info-nickname').textContent = playerData.profile.nickname;
    document.querySelector('.info-level').textContent = playerData.profile.level;
    document.querySelector('.info-description').textContent = playerData.profile.description;
    document.querySelector('.info-rank').textContent = playerData.profile.rank;
    
    // Update strike value
    document.querySelector('.strike-value').textContent = playerData.profile.currentStrike;
}

// Set up event listeners
function setupEventListeners() {
    // Edit profile button
    editProfileBtn = document.querySelector('.gameEdit');
    editProfileBtn.addEventListener('click', handleEditProfile);
    
    // Game status buttons
    gameButtons = document.querySelectorAll('.gameStatus');
    gameButtons.forEach(button => {
        button.addEventListener('click', handleGameAction);
    });
    
    // Social icons
    socialIcons = document.querySelectorAll('.social-icons i');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', handleSocialClick);
    });
}

// Event Handlers
function handleEditProfile() {
    console.log('Edit profile clicked');
    // Add your edit profile logic here
}

function handleGameAction(event) {
    const action = event.target.textContent.trim();
    console.log(`Game action clicked: ${action}`);
    // Add your game action logic here
}

function handleSocialClick(event) {
    const platform = event.target.classList.contains('fa-instagram') ? 'Instagram' :
                    event.target.classList.contains('fa-discord') ? 'Discord' :
                    event.target.classList.contains('fa-facebook') ? 'Facebook' : 'Unknown';
    
    console.log(`Social platform clicked: ${platform}`);
    // Add your social platform logic here
}

// Animation effects
function addHoverEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.05)';
            button.style.transition = 'transform 0.3s ease';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProfile();
    addHoverEffects();
});