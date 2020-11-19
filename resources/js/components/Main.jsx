import React from 'react';
import {useEffect, useState} from 'react';

function Main() {
    //initiate state
    const [ plane, setPlane ] = useState( new Image() );
    const [ star, setStar ] = useState( new Image() );
    const [ bird, setBird ] = useState( new Image() );
    const [ parachute, setParachute ] = useState( new Image() );
    const [ cloud, setCloud ] = useState( new Image() );

    let context = {};
    let canvas = {};
    let imgMeta = {};

    //initiate context and images upon component initial render
    let init = () => {
        canvas = document.getElementById('canvas');
        context = canvas.getContext('2d'); //context

        //set background color
        context.fillStyle = '#74b9ff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        //set initial coordinates for images
        imgMeta = {
            plane: {
                x: (canvas.width-50)/2,
                y: canvas.height - 50,
                delay: 0
            },
            star: {
                x: 0,
                y: 0,
                delay: 1.5
            },
            bird: {
                x: 0,
                y: 0,
                delay: .5
            },
            parachute: {
                x: 0,
                y: 0,
                delay: 1.5
            },
            cloud: {
                x: 0,
                y: 0,
                delay: 0
            }
        }

        //load images
        plane.onload = () => context.drawImage(plane, imgMeta.plane.x, imgMeta.plane.y, 50, 50);
        star.onload = () => context.drawImage(star, imgMeta.star.x, imgMeta.star.y, 50, 50);
        bird.onload = () => context.drawImage(bird, imgMeta.bird.x, imgMeta.bird.y, 50, 50);
        parachute.onload = () => context.drawImage(parachute, imgMeta.parachute.x, imgMeta.parachute.y, 50, 50);
        cloud.onload = () => context.drawImage(cloud, imgMeta.cloud.x, imgMeta.cloud.y, 50, 50);

        plane.src = 'images/plane.png';
        star.src = 'images/star.png';
        bird.src = 'images/bird.png';
        parachute.src = 'images/parachute.png';
        cloud.src = 'images/cloud.png';

        draw();
    }
    
    
    //draw the game animation
    let draw = () => {
        //intiate image drops
        dropImage( imgMeta.cloud, context, canvas );

        requestAnimationFrame(draw);
    }

    /** Drop images from top of canvas to bottom
     * @param { Object } imgMeta the image's meta data to be droped
     * @param { Object } ctx the canvas context
     * @param { Object } cvs the canvas 
     */
    let dropImage = (imgMeta, ctx, cvs) => {
        imgMeta.y--;
    }

    useEffect( () => init(), [] );

    return (
        <div className="container">
            <canvas width='400px' height='400px' id='canvas'></canvas>
        </div>
    );
}

export default Main;
