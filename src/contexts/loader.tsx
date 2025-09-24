export function Loader() {
  return (
    <div className="loader-overlay">
      <svg viewBox="0 0 240 240" height={240} width={240} className="loader">
        <circle
          strokeLinecap="round"
          strokeDashoffset={-330}
          strokeDasharray="0 660"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={105}
          cy={120}
          cx={120}
          className="loader-ring loader-ring-a"
        />
        <circle
          strokeLinecap="round"
          strokeDashoffset={-110}
          strokeDasharray="0 220"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={35}
          cy={120}
          cx={120}
          className="loader-ring loader-ring-b"
        />
        <circle
          strokeLinecap="round"
          strokeDasharray="0 440"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={70}
          cy={120}
          cx={85}
          className="loader-ring loader-ring-c"
        />
        <circle
          strokeLinecap="round"
          strokeDasharray="0 440"
          strokeWidth={20}
          stroke="#000"
          fill="none"
          r={70}
          cy={120}
          cx={155}
          className="loader-ring loader-ring-d"
        />
      </svg>
    </div>
  );
}
