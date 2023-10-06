import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/material/Box";

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
        sx={{
          overflow: "auto",
          height: "80vh",
          width: "80vw",
          m: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: "md",
              p: 3,
              boxShadow: "lg",
            }}
          >
            <ModalClose variant="plain" sx={{ m: 1 }} />
            {contents}
          </Sheet>
        </Box>
      </Modal>
    </React.Fragment>
  );
}
