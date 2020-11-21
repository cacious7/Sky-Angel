import ReactDOM from 'react-dom';
import React from 'react';
import Main from './components/Main';

//hooks the react app to the DOM
window.onload = () => {
    if (document.getElementById('sky-angel')) {
        ReactDOM.render(<Main />, document.getElementById('sky-angel'));
    }
}
