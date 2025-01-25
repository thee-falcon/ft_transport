import scores  from "./game.js"
import {update_score}  from "./game.js"


const scrs = new scores();

const canvas = document.getElementById('boardcanva');
const cont = canvas.getContext('2d');

function drawing()
{
    cont.font = "500px serif";
    cont.fillText("Hello world", 50, 90);
    // update_score();
}

drawing(); 