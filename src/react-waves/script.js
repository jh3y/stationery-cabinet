// import t from "prop-types";
// import styles from "./Waves.module.css";

// const defaultImage = "/images/wave--infinite.svg";

// import Wave from "./wave--infinite.svg";

// export default function Waves({
//   flip,
//   image,
//   id,
//   heights = [70, 60, 50, 40, 30, 20, 10],
//   opacity = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1],
//   saturation = [80, 80, 100, 0, 0, 0, 0],
//   lightness = [40, 50, 50, 100, 100, 100, 100],
//   widths = [800, 2400, 1200, 2400, 3600, 1200, 2800],
//   speeds = [70, 60, 50, 40, 30, 20, 10],
//   hues = [280, 20, 180, 140, 220, 280, 300],
// }) {
//   return (
//     <div
//       className={`${styles.waveContainer} ${
//         flip ? styles.waveContainerTop : styles.waveContainerBottom
//       }`}
//     >
//       {new Array(widths.length).fill().map((w, index) => (
//         <Wave
//           key={`wave-${id || new Date().getTime()}-${index}`}
//           className={styles.wave}
//           style={{
//             "--height": heights[index],
//             "--width": widths[index],
//             "--opacity": opacity[index],
//             "--speed": speeds[index] * 0.25,
//             "--hue": hues[index],
//             "--saturation": saturation[index],
//             "--lightness": lightness[index],
//             // backgroundImage: `url(${image || defaultImage})`,
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// Waves.propTypes = {
//   widths: t.arrayOf(t.number),
//   speeds: t.arrayOf(t.number),
//   opacity: t.arrayOf(t.number),
//   heights: t.arrayOf(t.number),
// };
