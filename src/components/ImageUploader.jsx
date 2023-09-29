import { useRef } from 'react';
import Button from "@mui/material/Button";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

function ImageUploader({ buttonText, handleOpen, images, setImages }) {
    const inputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images, ...files];
        setImages(newImages);
    };

    const openFilePicker = () => {
        inputRef.current.click();
        if (handleOpen) handleOpen();
    }

    const removeImage = (index) => {
        const oldImages = [...images];
        oldImages.splice(index, 1);
        setImages(oldImages);
    }

    return (
        <div>
            <Button variant="contained" onClick={openFilePicker}>{buttonText || 'Open'}</Button>
            {/* Input to upload multiple images */}
            <input ref={inputRef} hidden type="file" multiple onChange={handleImageChange} />

            {/* Display the selected images */}
            <div style={{ display: 'flex' }}>
                {images.map((image, index) => (
                    <div key={index} style={{position: 'relative'}}>
                        <img
                            src={URL.createObjectURL(image)}
                            alt="User-selected"
                            style={{ width: '100px', margin: '10px' }}
                        />
                        <HighlightOffOutlinedIcon
                            style={{ position: 'absolute', right: '0', top: '0', color: 'red', cursor: 'pointer', 'background': '#fff', borderRadius: '50%' }}
                            onClick={() => (removeImage(index))}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ImageUploader;
