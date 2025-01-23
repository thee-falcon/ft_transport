import scores  from "./game.js"
import {update_score}  from "./game.js"


const scrs = new scores();

const canvas = document.getElementById('boardcanva');
const cont = canvas.getContext('2d');

function drawing()
{
    canvas.height = 80;
    canvas.width = 1272;
    update_score();
}