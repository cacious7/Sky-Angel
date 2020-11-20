import React from 'react';
import {useEffect, useState, useRef} from 'react';

function Main() {
    //initiate state
    const [ plane, setPlane ] = useState( new Image() );
    const [ star, setStar ] = useState( new Image() );
    const [ bird, setBird ] = useState( new Image() );
    const [ parachute, setParachute ] = useState( new Image() );
    const [ cloud, setCloud ] = useState( new Image() );

    let context = useRef({});
    let canvas = useRef({});
    let imgMeta = useRef({});

    //initiate context.current and images upon component initial render
    let init = () => {
        canvas.current = document.getElementById('canvas');
        context.current = canvas.current.getContext('2d'); //context.current

        //set background color
        context.current.fillStyle = '#74b9ff';
        context.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

        //set initial coordinates for images
        imgMeta.current = {
            plane: {
                x: (canvas.current.width-50)/2,
                y: canvas.current.height - 50,
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
            },
            loadedImages: 0
        }

        //count how many images have loaded
        plane.onload = countLoadedImages;
        star.onload = countLoadedImages;
        bird.onload = countLoadedImages;
        parachute.onload = countLoadedImages;
        cloud.onload = countLoadedImages;

        //give images their src to load from
        plane.src = 'images/plane.png';
        star.src = 'images/star.png';
        bird.src = 'images/bird.png';
        parachute.src = 'images/parachute.png';
        cloud.src = 'images/cloud.png';
    }

    //Count a loaded image
    //if loaded images are already 4, increase counter one last time
    //and call the animation
    let countLoadedImages = () => {
        if(imgMeta.current.loadedImages === 4){
            imgMeta.current.loadedImages += 1;
            draw();
            //requestAnimationFrame(draw);
        }else{
            imgMeta.current.loadedImages += 1;
        }
    };
    
    
    //draw the game animation
    let draw = () => {
        if(imgMeta.current.loadedImages === 5){
            context.current.drawImage(plane, imgMeta.current.plane.x, imgMeta.current.plane.y, 50, 50);
            // context.current.drawImage(star, imgMeta.current.star.x, imgMeta.current.star.y, 50, 50);
            // context.current.drawImage(bird, imgMeta.current.bird.x, imgMeta.current.bird.y, 50, 50);
            // context.current.drawImage(parachute, imgMeta.current.parachute.x, imgMeta.current.parachute.y, 50, 50);
            context.current.drawImage(cloud, imgMeta.current.cloud.x, imgMeta.current.cloud.y, 50, 50);
        }else{
            alert( '!failed to load images' );
        }
        
        
        //intiate image drops
        //dropImage( imgMeta.current.cloud, context.current, canvas );
        imgMeta.current.cloud.y += 10;
        requestAnimationFrame(draw);
    }

    /** Drop images from top of canvas to bottom
     * @param { Object } imgMeta the image's meta data to be droped
     * @param { Object } ctx the canvas context.current
     * @param { Object } cvs the canvas 
     */
    let dropImage = (imgMeta, ctx, cvs) => {
        imgMeta.current.y--;
    }

    useEffect( () => init(), [] );

    return (
        <div className="container">
            <canvas width='400px' height='400px' id='canvas'></canvas>
        </div>
    );
}

export default Main;
