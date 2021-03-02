import React from 'react';
import { Button } from 'react-bootstrap';

/**
 * Displays game controls and configures them
 * @param {Object} props properties passed from parent element
 */
let Controls = (props) => {
    return (
        <section>
            <div>
                <Button>left</Button>
                <div>
                    <Button>up</Button>
                    <Button>down</Button>
                </div>
                <Button>right</Button>
            </div>
        </section>
    );
}

export default Controls;
