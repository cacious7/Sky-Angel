import React from 'react';
import {useEffect, useState} from 'react';

function Main() {
    //initiate state
    const [ plane, setPlane ] = useState( new Image() );
    const [ star, setStar ] = useState( new Image() );
    const [ bird, setBird ] = useState( new Image() );
    const [ parachute, setParachute ] = useState( new Image() );
    const [ cloud, setCloud ] = useState( new Image() );
    
    //draw the game animation
    let draw = () => {
        const canvas = document.getElementById('canvas');
        const context = canvas.getContext('2d'); //context

        //set background color
        context.fillStyle = '#74b9ff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //load images
        plane.x = (canvas.width-50)/2;
        plane.y = canvas.height;
        plane.onload = () => context.drawImage(plane, planeX, 0, 50, 50);
        plane.src = 'images/plane.png';
        star.src = 'images/star.png';
        bird.src = 'images/bird.png';
        parachute.src = 'images/parachute.png';
    }

    useEffect( () => draw(), [] );

    return (
        <div className="container">
            <canvas width='400px' height='400px' id='canvas'></canvas>
        </div>
    );
}

export default Main;
