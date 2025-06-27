const Album = () => {
  return (
    <div className="album">
      <h1> Nega </h1>
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

export default Album;