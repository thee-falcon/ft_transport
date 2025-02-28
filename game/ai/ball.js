function drawball(style,side)
{   
    if(side == RIGHT)
    {
        cont.fillStyle = '#006AFF'
        
    }
    else if(side === LEFT)
    {
        cont.fillStyle = '#FF0000'
    }
    else
    {
        cont.fillStyle = '#E5F690FF'
    }
    cont.beginPath();
    cont.arc(ballx, bally, radius, 0, Math.PI * 2);

    cont.fill();
    cont.closePath();
}


function drawStar(context, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes; 

    context.beginPath();
    context.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        context.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;

        context.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
    }

    context.lineTo(cx, cy - outerRadius);
    context.closePath();
    context.fillStyle = '#E5F690FF';
    context.fill();
}