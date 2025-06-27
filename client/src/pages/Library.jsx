import { Box } from "@mui/material";

const Library = () => {
  return (
    <div className="library">
      <h1>Olds </h1>
      {/* Sẽ thêm danh sách bài hát sau */}
      <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
        width: "100%",
      }}
    ></Box>
    </div>
  );
};

export default Library;