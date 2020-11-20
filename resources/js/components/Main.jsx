import React from 'react';
import {useEffect, useState, useRef} from 'react';

function Main() {
    //initiate state
    const [ plane, setPlane ] = useState( new Image() );
    const [ star, setStar ] = useState( new Image() );
    const [ bird, setBird ] = useState( new Image() );
    const [ parachute, setParachute ] = useState( new Image() );
    const [ cloud, setCloud ] = useState( new Image() );
    const [ fuel, setFuel ] = useState(10);
    const [ stars, setStars ] = useState(0);

    let context = useRef({});
    let canvas = useRef({});
    let imgMeta = useRef({});
    let gameOver = useRef(false);

    //initialize context, variables and images upon component initial render
    let init = () => {
        canvas.current = document.getElementById('canvas');
        context.current = canvas.current.getContext('2d'); //context.current

        //set background color
        context.current.fillStyle = '#74b9ff';
        context.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

        //set initial coordinates for images
        imgMeta.current = {
            plane: {
                imgs: [ //plane will always have only one object under imgs
                    {
                        x: (canvas.current.width - 75)/2, 
                        y: canvas.current.height - 50
                    }
                ],
                size: {
                    width: 50,
                    height: 50
                },
                gravity: 2,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 1300
                }, //counts time in milliseconds
                maxDrop: 5, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            bird: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 30,
                    height: 30
                },
                gravity: 3,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 2300
                }, //counts time in milliseconds
                maxDrop: 12, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            star: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 50,
                    height: 50
                },
                gravity: 2.5,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 4000
                }, //counts time in milliseconds
                maxDrop: 3, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            parachute: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 50,
                    height: 50
                },
                gravity: 2.5,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 3000
                }, //counts time in milliseconds
                maxDrop: 2, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            cloud: {
                imgs: [], //will usually have multiple object, so we inialize it as an empty array
                size: {
                    width: 50,
                    height: 50
                },
                gravity: 6,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 1200
                }, //counts time in milliseconds
                maxDrop: 15, // maximum number of images droped at a go //counts time in milliseconds
                area: { //arrays that take objects of coordinates of each side of an object
                    top: [],
                    bottom: [],
                    right: [],
                    left: []
                }
            },
            loadedImages: 0,
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

        //set control key event listener
        document.onkeyup = controlKeyMonitor;
    }
    
    //draw the game animation
    let draw = (timestamp) => {
        //if images weren't loaded, return
        if(imgMeta.current.loadedImages != 5){
            alert( '!failed to load images' );
            return;
        }

        //clear canvas to prevent drawing multiple duplicate images
        context.current.clearRect(0, 0, canvas.current.width, canvas.current.height);

        //set background color
        context.current.fillStyle = '#74b9ff';
        context.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

        //let collionDetected = collisionDetected('bird', bird);

        //#PLANE
        //load plane
        drawImages('plane');
        
        //fuel monitoring
        fuelMonitor(timestamp);

        //#CLOUDS
        animateImg('cloud', timestamp);

        //#BIRDS
        animateImg('bird', timestamp);

        //#PARACHUTES
        animateImg('parachute', timestamp);

        //#STARS
        animateImg('star', timestamp);

        //collionDetected = collisionDetected('bird', bird);

        //get animation fram
        requestAnimationFrame(draw);
    }

    //control keys mmonitor
    let controlKeyMonitor = (e) => {
        e.preventDefault();
        const leftArrow = 37;
        const upArrow = 38;
        const rightArrow = 39;
        const downArrow = 40;

        switch(e.keyCode){
            case leftArrow:
                if(imgMeta.current.plane.imgs[0].x > 10){
                    imgMeta.current.plane.imgs[0].x--;
                }
            break;
            case upArrow:
                if(imgMeta.current.plane.imgs[0].y > 10){
                    imgMeta.current.plane.imgs[0].x--;
                }
            break;
            case rightArrow:
                if(canvas.width - imgMeta.current.plane.imgs[0].x > 10){
                    imgMeta.current.plane.imgs[0].x++;
                }
            break;
            case downArrow:
                if(canvas.height - imgMeta.current.plane.imgs[0].y > 50){
                    imgMeta.current.plane.imgs[0].y++;
        --}
            break;
        }
        console.log( e.keyCode );
    }

    //monitor the fuel
    let fuelMonitor = (timestamp) => {
        timeMonitor('plane', timestamp);
        if( imgMeta.current.plane.time.elapsed >= 1000 ){
            resetTimeMonitor('plane');
            setFuel( prevState => prevState -= 1 );
            if(fuel == 0) gameOver = true;
        }

        let detected = collisionDetected('parachute');
        if(detected.status){
            setFuel( prevState => prevState += 1);
        }
    }

    //Count a loaded image
    //if loaded images are already 4, increase counter one last time
    //and call the animation
    let countLoadedImages = () => {
        if(imgMeta.current.loadedImages === 4){
            imgMeta.current.loadedImages += 1;
            requestAnimationFrame(draw);
        }else{
            imgMeta.current.loadedImages += 1;
        }
    };

    let collisionDetected = (name) => {
        let planeMeta = imgMeta.current.plane;
        let imgCoords = imgMeta.current[name].imgs;

        if(imgCoords.length == 0) return false;

        //The x position of the img is >=  the x position of the plane
        //The x position of the img is <= the x position of the plane plus its width
        //The y position of the img is >= the y position of the plane
        //The y position of the img is <= the y position of the plane plus its height
        let imgIndex = null;
        let detected = imgCoords.some( (img, i) => {
            if( (img.x >= planeMeta.imgs[0].x && ( img.x <= planeMeta.imgs[0].x + planeMeta.size.width ))
            && (img.y >= planeMeta.imgs[0].y && ( img.y <= planeMeta.imgs[0].y + planeMeta.size.height))){
                imgIndex = i;
                return true;
            }else{
                return false;
            }
        });

        //if detected, remove img that collided with plane
        if(detected){
            deleteImg(name, imgIndex);
        }   
        
        //if(detected) console.log('Collision Detected with ' + name);

        return { status: detected, img: imgIndex };
    }

    //remove an image from animation
    let deleteImg = (name, index) => {
        let imgs = imgMeta.current[name].imgs;
        imgs.splice( index, 1 );
        //console.log(imgs);
    }

    let animateImg = (name, timestamp) => {
        //load image at random x positions after a delay
        timeMonitor(name, timestamp);
        if(imgMeta.current[name].time.elapsed > imgMeta.current[name].time.visibility){
            resetTimeMonitor(name);
            randomX(name, Math.random() * imgMeta.current[name].maxDrop);
        }

        //draw and drop cloud images
        drawImages(name);

        //if bird collided, game over
        let detectedBird = collisionDetected('bird');
        if(Boolean(detectedBird.status)){
            gameOver.current = true;
        }

        //check fuel monitor for parachute collision reaction

        //if star collided, increase star count
        let detectedStar = collisionDetected('star');
        if(Boolean(detectedStar.status)){
            setStars( prevState => prevState += 1);
        }

        dropImages(name);
    };

    /**
     * Stops time monitoring for a specific image
     * @param {String} name name of the image to stop time monitoring
     */
    let resetTimeMonitor = (name) => {
        imgMeta.current[name].time.monitor = false;
        imgMeta.current[name].time.start = null;
        imgMeta.current[name].time.current = null;
        imgMeta.current[name].time.elapsed = 0;

    }

    /**
     * Monitors and counts time elapsed
     * @param {String} name the name of the image monitoring time
     * @param {Number} timestamp timestamp gotten from requestAnimationFrame
     * @return {Number} the time elapsed
     */
    let timeMonitor = ( name, timestamp ) => {
        const startTime = imgMeta.current[name].time.start;
        const monitoring = imgMeta.current[name].time.monitoring;
        //if start time has been set / time monitoring has began
        //return time difference
        //else return 0
        if(Boolean(startTime) && Boolean(monitoring)){
            imgMeta.current[name].time.current = timestamp;
            imgMeta.current[name].time.elapsed = imgMeta.current[name].time.current - startTime;
            return imgMeta.current[name].time.elapsed;
        }else{
            imgMeta.current[name].time.monitoring = true;
            imgMeta.current[name].time.start = timestamp;
            return imgMeta.current[name].time.elapsed;
        }

    }


    /**
     * Draws images on the canvas
     * @param {String} name name of the images to e drawn
     */
    let drawImages = (name) => {
        switch(name){
            case 'cloud':
                const cloudMeta = imgMeta.current.cloud;
                for( let img of cloudMeta.imgs ){
                    context.current.drawImage(cloud, img.x, img.y, cloudMeta.size.width, cloudMeta.size.height);
                }
            break;
            case 'bird':
                const birdMeta = imgMeta.current.bird;
                for( let img of birdMeta.imgs ){
                    context.current.drawImage(bird, img.x, img.y, birdMeta.size.width, birdMeta.size.height);
                }
            break;
            case 'parachute':
                const parachuteMeta = imgMeta.current.parachute;
                for( let img of parachuteMeta.imgs ){
                    context.current.drawImage(parachute, img.x, img.y, parachuteMeta.size.width, parachuteMeta.size.height);
                }
            break;
            case 'star':
                const starMeta = imgMeta.current.star;
                for( let img of starMeta.imgs ){
                    context.current.drawImage(star, img.x, img.y, starMeta.size.width, starMeta.size.height);
                }
            break;
            case 'plane':
                const planeMeta = imgMeta.current.plane;
                for( let img of planeMeta.imgs ){
                    context.current.drawImage(plane, img.x, img.y, planeMeta.size.width, planeMeta.size.height);
                }
            break;
        }
    }

    /**
     * Randomize the position at which images are drawn along the X axis of the canvas
     * @param {String} name the name of the image to be drawn
     * @param {Number} num the number of images to be drawn
     */
    const randomX = (name, num) => {
        imgMeta.current[name].imgs = []; //reset the array to prevent piling more objects than desired
        let coords = {};
        for(let i = 0; i < num; i++){
            coords = { x: Math.random() * (canvas.current.width-50), y: 0 }
            imgMeta.current[name].imgs.push( coords );
        }
    }

    /** Drop images from top of canvas to bottom
     * @param { Object } img the image's meta data to be dropped
     * @param { Object } speed the speed to drop the image at
     * @return { Void }
     */
    let dropImages = (name) => {
        imgMeta.current[name].imgs.forEach( img => img.y += imgMeta.current[name].gravity );
    }

    useEffect( () => init(), []);

    return (
        <div className="container">
            <div style={ { display: 'flex' } }> <p><strong>Fuel:</strong> {fuel}, <strong>Stars:</strong> {stars}</p> </div>
            <canvas width='400px' height='400px' id='canvas'>
                Your browser does not support Canvas, please use a more recent browser such as google chrome!
            </canvas>
        </div>
    );
}

export default Main;
