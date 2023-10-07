import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

export default function AppModal({
  buttonHidden = false,
  buttonText = "Open",
  title = "",
  contents,
  handleOpen,
  handleClose,
  open,
}) {
  return (
    <React.Fragment>
      {!buttonHidden && (
        <Button variant="outlined" color="neutral" onClick={handleOpen}>
          {buttonText}
        </Button>
      )}
      <Modal
        aria-labelledby="modal-title"
        aria-describedby="modal-desc"
        open={open}
        onClose={handleClose}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: "md",
          width: '50%',
          minHeight: '50%',
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography component="h2" id="modal-title" level="h4" textColor="inherit" fontWeight="lg" mb={1}>
          {title}
        </Typography>
        {contents}
      </Sheet>
      </Modal>
    </React.Fragment>
  );
}
