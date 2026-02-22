const ProgressBar = ({ percentage }) => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <p>Progress: {percentage}%</p>
      <div style={{ width: "100%", background: "#ddd", height: "20px" }}>
        <div
          style={{
            width: `${percentage}%`,
            background: "green",
            height: "100%"
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;