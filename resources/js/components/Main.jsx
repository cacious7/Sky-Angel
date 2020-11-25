import React from 'react';
import {useState, useRef} from 'react';
import Game from './Game';
import GameOver from './GameOver';
import StartGame from './StartGame';
import $ from 'jquery';

/**
 * Handles the game's main logic and controls its flow
 * @return {void}
 */
let Main = () => {
    //initialize state
    const [ plane, setPlane ] = useState( new Image() );
    const [ star, setStar ] = useState( new Image() );
    const [ bird, setBird ] = useState( new Image() );
    const [ parachute, setParachute ] = useState( new Image() );
    const [ cloud, setCloud ] = useState( new Image() );
    const [ fuel, setFuel ] = useState(20);
    const [ stars, setStars ] = useState(0);
    const [ flyTime, setFlyTime ] = useState(0);
    const [ pauseText, setPauseText ] = useState('Pause');
    const [ gameStarted, setGameStarted ] = useState(false);
    const [ players, setPlayers ] = useState([]);

    //these variables' current values are well accessible 
    //even if the draw function is called by a useEffect function
    //making it a little easier to manage the state of the game
    let context = useRef({});
    let canvas = useRef({});
    let imgMeta = useRef({});
    let gameOver = useRef(false);
    let stopGame = useRef(false);
    let paused = useRef(false);
    let animationRef = useRef(0);

    /**
     * initialize context, variables and images when beginning the game
     * @return {void}
     */
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
                flyTime: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 1300
                },
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
                gravity: 2.5,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 4000
                }, //counts time in milliseconds
                maxDrop: 7, // maximum number of images droped at a go //counts time in milliseconds
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
                gravity: 3.5,
                time: {
                    monitoring: false,
                    start: null,
                    current: null,
                    elapsed: 0,
                    visibility: 1800
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
        document.onkeydown = controlKeyMonitor;
    }
    
    /**
     * Draws the game and keeps it animated recursively
     * @param {Number} timestamp The timestamp gotten from the animation frame
     * @return {void}
     */
    let draw = (timestamp) => {
        //if images weren't loaded, return
        if(imgMeta.current.loadedImages != 5){
            alert( '!failed to load images' );
            return;
        }

        //if game is paused, dont animate
        if( !paused.current ){
            //clear canvas to prevent drawing multiple duplicate images
            context.current.clearRect(0, 0, canvas.current.width, canvas.current.height);

            //set background color
            context.current.fillStyle = '#74b9ff';
            context.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

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
        }
        //request animation frame if the game is not over yet
        if(!stopGame.current)
        requestAnimationFrame(draw);
    }

    /**
     * Enables and monitors the use of the control keys
     * for the game
     * @param {Object} e the event triggered
     * @return {void}
     */
    let controlKeyMonitor = (e) => {
        const leftArrow = 37;
        const upArrow = 38;
        const rightArrow = 39;
        const downArrow = 40;
        const speed = 30;
        const spacebar = 32;

        switch(e.keyCode){
            case leftArrow:
                if(imgMeta.current.plane.imgs[0].x > 15){
                    imgMeta.current.plane.imgs[0].x -= speed;
                }
            break;
            case upArrow:
                if(imgMeta.current.plane.imgs[0].y > 20){
                    imgMeta.current.plane.imgs[0].y -= speed;
                }
            break;
            case rightArrow:
                if(canvas.current.width - imgMeta.current.plane.imgs[0].x > 80){
                    imgMeta.current.plane.imgs[0].x += speed;
                }
            break;
            case downArrow:
                if(canvas.current.height - imgMeta.current.plane.imgs[0].y > 50){
                    imgMeta.current.plane.imgs[0].y += speed;
                }   
            break;
            case spacebar:
                handlePause(e);
            break;
        }
    }

    /**
     * Has a timer that resets every second
     * Which is used to monitor fuel and fly time
     * It also sets the game over status based on the fuel
     * @param {Number} timestamp the time in milliseconds  
     * @return {void}
     */
    let fuelMonitor = (timestamp) => {
        timeMonitor('plane', timestamp, false);
        if( imgMeta.current.plane.time.elapsed >= 1000 ){
            resetTimeMonitor('plane', false);
            setFuel( prevState => { 
                //set gameOver to true if fuel is about to be set to 0
                if(prevState <= 0) gameOver.current = true;
                return prevState -= 1 
            } );
            setFlyTime( prevState => prevState += 1 );
        }

        let detected = collisionDetected('parachute');
        if(detected.status){
            setFuel( prevState => prevState += 1);
        }
    }

    /**
     * Count loaded images, one at a time
     * if loaded images are already 4, increase counter one last time
     * and call the animation
     * @return {void}
     */
    let countLoadedImages = () => {
        if(imgMeta.current.loadedImages === 4){
            imgMeta.current.loadedImages += 1;
            animationRef = requestAnimationFrame(draw);
        }else{
            imgMeta.current.loadedImages += 1;
        }
    };

    /**
     * Detect collision of the plane with another image type
     * @param {String} name nae of type of image to detect collision with
     * @return {Object} indicating the status of the detection and the index of the image in the image type array
     */
    let collisionDetected = (name) => {
        //COLLISION IS DETECTED:
        //When any of the four corners of an image is found inside the area of the plane.
        //Given the coordinates of one corner, x and y, there is collision if all of the following rules are true
        //
        //1. The x position of the plane is < the x position of the image 
        //&& The y position of the plane is < the y position of the image
        //
        //2. The x position of the plane + its width is > the x position of the image
        //&& The y position of the plane is < the y position of the image
        //
        //3. The x position of the plane is < the x position of the image
        //&& the y position of the plane + its height is > the y position of the image
        //
        //4. The x position of the plane + its width is > the x position of the image
        //&& The y position of the plane + its height is > the y position of the image 
        //
        //if Xp and Yp = Plane coordinates and Xo and Yo = Image or object coordinates
        //and if w= width and h = height, the the general long formula is:
        //
        //1. Xp < Xo && Yp < Yo &&
        //2. Xp+w > Xo && Yp < Yo &&
        //3. Xp < Xo && Yp+h > Yo &&
        //4. Xp+w > Xo && Yp+h > Yo
        //
        //However, after removing all duplicated predicates, we get a shorter formula as follows:
        // Xp < Xo && Xp+w > Xo && 
        // Yp < Yo && Yp+h > Yo
        
        let planeSize = imgMeta.current.plane.size;
        let planeCoords = imgMeta.current.plane.imgs[0];
        let imgData = imgMeta.current[name];
        let imgIndex = null;

        //if there are no images, return false
        if(imgData.imgs.length == 0) return { status: false, img: null };

        //get all four corner coordinates of all images of this type
        let imgCoords = getImageCoords(imgData);

        //check if any of the corners of any image collide
        let detected = imgCoords.some( (img, i) => {
            //if any of these four coner coords collides, the collision is detected
            let collision = Object.keys(img).some( key => {
                if(planeCoords.x < img[key].x && planeCoords.x + planeSize.width > img[key].x && 
                    planeCoords.y < img[key].y && planeCoords.y + planeSize.height > img[key].y ){
                        imgIndex = i;
                        return true;
                    }else{
                        return false;
                    }
            });
            return collision;
        } );

        //if detected, remove img that collided with plane
        if(detected){
            deleteImg(name, imgIndex);
        }   

        return { status: detected, img: imgIndex };
    }

    /**
     * Gets an image type and returns all the four corner coordinates of each image
     * @param {Object} imgData the object containing all the image cordinates and size of the images of its type
     * @return {Array} an object containing all the images of the provided type with all the four corner coordinates
     * provided as a, b, c and d
     */
    let getImageCoords = (imgData) => {
        let imgSize = imgData.size;
        let imgsFourCornerCoords = imgData.imgs.map( (img) => {
            return {
                a: {
                    x: img.x,
                    y: img.y
                },
                b: {
                    x: img.x + imgSize.width,
                    y: img.y
                },
                c: {
                    x: img.x,
                    y: img.y + imgSize.height
                },
                d: {
                    x: img.x + imgSize.width,
                    y: img.y + imgSize.height
                }
            };
        } );

        return imgsFourCornerCoords;
    }

    /**
     * Deletes a specific single image of a certain type from the animation
     * @param {String} name the name of the type of image to delete
     * @param {Number} index the index of the image to delete
     * @return {void}
     */
    let deleteImg = (name, index) => {
        let imgs = imgMeta.current[name].imgs;
        imgs.splice( index, 1 );
    }


    /**
     * Animates an image type
     * @param {String} name the name of the image type to animate
     * @param {Number} timestamp the timestamp retrieved from the animation frame
     * @return {void}
     */
    let animateImg = (name, timestamp) => {
        //load image at random x positions after a delay
        timeMonitor(name, timestamp);
        if(imgMeta.current[name].time.elapsed > imgMeta.current[name].time.visibility){
            resetTimeMonitor(name, false);
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
     * resets time monitoring for a specific image type
     * @param {String} name name of the image to stop time monitoring
     * @return {void}
     */
    let resetTimeMonitor = (name) => {
        imgMeta.current[name].time.monitor = false;
        imgMeta.current[name].time.start = null;
        imgMeta.current[name].time.current = null;
        imgMeta.current[name].time.elapsed = 0;
    }

    /**
     * Monitors and counts time elapsed for a specific image type
     * @param {String} name the name of the image monitoring time
     * @param {Number} timestamp timestamp gotten from requestAnimationFrame
     * @return {Number} the time elapsed
     */
    let timeMonitor = ( name, timestamp) => {
        const startTime = imgMeta.current[name].time.start;
        const monitoring = imgMeta.current[name].time.monitoring;
        //if start time has been set (time monitoring has began)
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
     * @param {String} name name of the image type to drawn
     * @return {void}
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
     * @return {void}
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
     * @param { String } name the name of the type of image to drop
     * @return { Void }
     */
    let dropImages = (name) => {
        imgMeta.current[name].imgs.forEach( img => img.y += imgMeta.current[name].gravity );
    }

    /**
     * Toggle between game pause and play state
     * @param {Event} e the event that has been triggered
     * @return {void}
     */
    let handlePause = (e) => {
        e.preventDefault();

        //toggle pause status
        paused.current = !paused.current;
        setPauseText( paused.current ? 'Play' : 'Pause' );
    }

    /**
     * starts the game
     * @param {Object} e event triggered 
     * @return {void}
     */
    let startGame = (e) => {
        setGameStarted(true);
    }

    /**
     * Ends the game by resetting the game's status 
     * and theryby allowing a fresh start
     * @param {Object} e event triggered 
     * @return {void}
     */
    let endGame = (e) => {
        resetGameData();
    }

    /**
     * Reset All game data except for images
     * @return {void}
     */
    let resetGameData = () => {
        setFuel(20);
        setStars(0);
        setFlyTime(0);
        setPauseText('pause');
        setGameStarted(false);
        setPlayers([]);
    
        context.current = {};
        canvas.current = {};
        imgMeta.current = {};
        gameOver.current = false;
        stopGame.current = false;
        paused.current = false;
        animationRef.current = 0;
    }

    /**
     * Displays the correct component or screen
     * based on the status of the game
     * @return {void}
     */
    let displayByGameStatus = () => {
        if(!gameStarted){
            return(
                <StartGame startGame={startGame} getPlayers={getPlayers} players={players} setPlayers={setPlayers}/>
            );
        }else if(!gameOver.current && gameStarted){
            return(
            <Game init={init} fuel={fuel} stars={stars} flyTime={flyTime} handlePause={handlePause} pauseText={pauseText}/>
            );
        }else if(gameOver.current){
            return(
                <GameOver handleSave={handleSave} stopGame={stopGame} endGame={endGame} />
            );
        }
    }

    /**
     * Saves the user's game data to the database
     * @param {Object} e event triggered 
     * @return {void}
     */
    let handleSave = (e) => {
        e.preventDefault();

        const name = document.getElementById('playerName').value;
        const token = $('meta[name="csrf-token"]').attr('content');

        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': token
            }
        });

        let infoText = document.getElementById('save-info');

        $.ajax({
            url: saveUrl,
            method: 'post',
            data: { name: name, time: flyTime, stars: stars },
            success: (res) => {
                infoText.innerText = res.success;
            },
            error: (err) => {
                infoText.innerText = err.responseText;
            }
        });
    }
    
    /**
     * Gets the players' data from the database
     * @return {void}
     */
    let getPlayers = () => {
        $.ajax({
            url: getPlayersUrl,
            method: 'get',
            success: (res) => {
                res.success.forEach( (player) => {
                    player.score = player.stars + player.time;
                } );
                setPlayers(res.success);
            },
            error: (err) => {
                let databaseDisconnected = /SQLSTATE\[HY000\] \[2002\] no connection/i.test(err.responseJSON.message);
                databaseDisconnected ? alert('ALERT: There is no connection to the database, please contact the admin.')
                : console.log('error', err);
            }
        });
    }
    
    return (
        displayByGameStatus()
    );
}

export default Main;
