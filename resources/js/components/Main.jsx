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
        //context.fillStyle = '#74b9ff';
        //context.fillRect(0, 0, canvas.width, canvas.height);

        //load images
        plane.onload = drawImage( context );
        plane.src = 'images/plane.png';
        star.src = 'images/star.png';
        bird.src = 'images/bird.png';
        parachute.src = 'images/parachute.png';
        //cloud.src = 'images/cloud.png';
        // setPlane( prevState => { return {...prevState, src: 'images/plane.png' }  } );
        // setStar( prevState => { return {...prevState, src: 'images/star.png' }  } );
        // setBird( prevState => { return {...prevState, src: 'images/bird.png' }  } );
        // setParachute( prevState => { return {...prevState, src: 'images/parachute.png' }  } );
        // setCloud( prevState => { return {...prevState, src: 'images/cloud.png' }  } );
    }

    let drawImage = ( context ) => {
        context.drawImage(plane, 0, 0, 50, 50);
    }

    useEffect( () => draw(), [] );

    return (
        <div className="container">
            <canvas width='400px' height='400px' id='canvas'></canvas>
        </div>
    );
}

export default Main;
