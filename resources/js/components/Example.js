import React from 'react';
import ReactDOM from 'react-dom';
import {useEffect} from 'react';

function Example() {

    useEffect( ()=> alert('here') );

    let alert = ()=> {
        alert('here');
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example Component</div>
                        <div className="card-body">I'm an example component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Example;

if (document.getElementById('sky-angel')) {
    ReactDOM.render(<Example />, document.getElementById('sky-angel'));
}
