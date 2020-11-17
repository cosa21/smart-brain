import React from 'react';
import './ImageLinkForms.css';

const ImageLinkForm = () => {
    return (
        <div>
            <p className='f3'>This Magic Brain will detect faces in your picture!</p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' placeholder='Enter the URL of image' type='text'></input>
                    <button className='w-30 grow f4 link ph3 dib white bg-light-purple'>Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;