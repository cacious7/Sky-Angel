import React from 'react';
import ReactDOM from 'react-dom';
import {useEffect} from 'react';

function Example() {
    return (
        <div className="container">
            <canvas width='200px' height='700px' ></canvas>
        </div>
    );
}

export default Example;

if (document.getElementById('sky-angel')) {
    ReactDOM.render(<Example />, document.getElementById('sky-angel'));
}
