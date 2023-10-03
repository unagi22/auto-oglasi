import {useRef} from 'react';
import Button from "@mui/material/Button";
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import Box from "@mui/material/Box";

function ImageUploader({ buttonText, handleOpen, existingImages = null, handleUpdateExistingImages = null, images, setImages, multiple = false }) {
    const inputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = multiple ? [...images, ...files] : files;
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

    function handleRemoveImage(index) {
        removeImage(index)
    }

    function handleRemoveExistingImage(index) {
        const imagesUpdated = [...existingImages];
        imagesUpdated.splice(index, 1);
        handleUpdateExistingImages(imagesUpdated);
    }

    return (
        <Box sx={{width: '100%'}}>
            <Button variant="contained" onClick={openFilePicker}>{buttonText || 'Open'}</Button>
            {/* Input to upload single or multiple images */}
            <input
                ref={inputRef}
                style={{ display: 'none' }}
                type="file" accept="image/*"
                multiple={multiple}
                onChange={handleImageChange}
            />

            {existingImages && <Box sx={{mt: 1, display: 'flex'}}>
                {existingImages.map((imageObject, index) => (
                    <div key={index} style={{position: 'relative'}}>
                        <img
                            src={imageObject.image}
                            alt="User-selected"
                            style={{ width: '100px', margin: '8px' }}
                        />
                        <HighlightOffOutlinedIcon
                            style={{ position: 'absolute', right: '0', top: '0', color: 'red', cursor: 'pointer', 'background': '#fff', borderRadius: '50%' }}
                            onClick={() => (handleRemoveExistingImage(index))}
                        />
                    </div>
                ))}
            </Box>}

            <Box sx={{mt: 1, display: 'flex'}}>
                {images.map((image, index) => (
                    <div key={index} style={{position: 'relative'}}>
                        <img
                            src={URL.createObjectURL(image)}
                            alt="User-selected"
                            style={{ width: '100px', margin: '8px' }}
                        />
                        <HighlightOffOutlinedIcon
                            style={{ position: 'absolute', right: '0', top: '0', color: 'red', cursor: 'pointer', 'background': '#fff', borderRadius: '50%' }}
                            onClick={() => (handleRemoveImage(index))}
                        />
                    </div>
                ))}
            </Box>
            {/* Display the selected images */}
            <Box sx={{ display: 'flex', mt: 1 }}>

            </Box>
        </Box>
    );
}

export default ImageUploader;
