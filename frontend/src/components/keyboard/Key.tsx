// const KeyboardKey = ({ code, width = 1, height = 1, className = "" }) => {
//   const isDead = checkIsDeadKey(code);
//   const keyOutput = getKeyOutput(code);
//   const isCombining = isCombiningCharacter(keyOutput);

//   const keyClassName = `key ${className} ${
//     !seeEverything && isDead ? "dead-key" : ""
//   } ${!seeEverything && isCombining ? "combining-key" : ""}`;

//   if (seeEverything) {
//     const isDeadInLayer1 = isKeyDead(1, code);
//     const isDeadInLayer2 = isKeyDead(2, code);
//     const isDeadInLayer3 = isKeyDead(3, code);
//     const isDeadInLayer4 = isKeyDead(4, code);

//     const isCombiningInLayer1 = isCombiningCharacter(
//       getKeyOutputForLayer(1, code)
//     );
//     const isCombiningInLayer2 = isCombiningCharacter(
//       getKeyOutputForLayer(2, code)
//     );
//     const isCombiningInLayer3 = isCombiningCharacter(
//       getKeyOutputForLayer(3, code)
//     );
//     const isCombiningInLayer4 = isCombiningCharacter(
//       getKeyOutputForLayer(4, code)
//     );

//     return (
//       <div
//         className={keyClassName}
//         style={{
//           width: `${width * 60}px`,
//           height: `${height * 60}px`,
//         }}
//       >
//         <div className="detailed-key">
//           <div
//             className={`key-region key-region-nw ${isDeadInLayer1 ? "dead-region" : ""} ${isCombiningInLayer1 ? "combining-region" : ""}`}
//           >
//             <span>{getKeyOutputForLayer(1, code)}</span>
//           </div>
//           <div
//             className={`key-region key-region-ne ${isDeadInLayer3 ? "dead-region" : ""} ${isCombiningInLayer3 ? "combining-region" : ""}`}
//           >
//             <span>{getKeyOutputForLayer(3, code)}</span>
//           </div>
//           <div
//             className={`key-region key-region-sw ${isDeadInLayer4 ? "dead-region" : ""} ${isCombiningInLayer4 ? "combining-region" : ""}`}
//           >
//             <span>{getKeyOutputForLayer(4, code)}</span>
//           </div>
//           <div
//             className={`key-region key-region-se ${isDeadInLayer2 ? "dead-region" : ""} ${isCombiningInLayer2 ? "combining-region" : ""}`}
//           >
//             <span>{getKeyOutputForLayer(2, code)}</span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={keyClassName}
//       style={{
//         width: `${width * 60}px`,
//         height: `${height * 60}px`,
//       }}
//     >
//       <div className="key-content">{keyOutput}</div>
//     </div>
//   );
// };
