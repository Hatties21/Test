import { Box } from "@mui/material";

const Library = () => {
  return (
    <div className="library" style={{ position: "relative" }}>
      {/* Floating Box */}
      <Box
        sx={{
          position: "absolute",
          top: "50px",
          right: "50px",
          width: 300,
          padding: 3,
          bgcolor: "background.paper",
          boxShadow: 3,
          borderRadius: 2,
          zIndex: 1000,
        }}
      >
        {/* Nội dung floating box */}
        <p>Hello</p>
      </Box>
    </div>
  );
};

export default Library;
