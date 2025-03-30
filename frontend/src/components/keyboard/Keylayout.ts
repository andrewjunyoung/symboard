import { scriptMap } from "../../types/Script";

export function processSpecialCharacter(text) {
  switch (text) {
    case "U+0022;":
      return '"';
    case "U+0026;":
      return "&";
    case "U+0027;":
      return "'";
    case "U+003C;":
      return "<";
    case "U+003E;":
      return ">";
    default:
      return text;
  }
}

export const getKeyOutputForLayer = (keylayout, currState, layerNum, code) => {
  if (
    !keylayout ||
    !keylayout.keyMaps[layerNum] ||
    !keylayout.keyMaps[layerNum][code]
  ) {
    return "";
  }

  const keyData = keylayout.keyMaps[layerNum][code];
  let text = keyData.output || "";

  // If we have a selected state (not "default" or empty), only show keys that produce output in that state
  if (currState && currState !== "default" && currState !== "") {
    // If the key has an action, check if it produces output in the selected state
    if (keyData.action && keylayout.actions[keyData.action]) {
      const stateAction = keylayout.actions[keyData.action].find(
        (condition) => condition.state === currState
      );

      if (stateAction && stateAction.output) {
        return processSpecialCharacter(stateAction.output);
      } else {
        // This key doesn't produce output in the selected state
        return "";
      }
    } else {
      // Key doesn't have an action, so it can't produce state-specific output
      return "";
    }
  } else {
    // Regular behavior for default/none state
    // If it has an action, check what to display
    if (keyData.action && keylayout.actions[keyData.action]) {
      // Check if it's a dead key
      const isDeadKeyAction = keylayout.actions[keyData.action].some(
        (condition) =>
          condition.state === "none" &&
          (!condition.output || condition.output === "") &&
          condition.next
      );

      if (isDeadKeyAction) {
        const noneStateAction = keylayout.actions[keyData.action].find(
          (condition) =>
            condition.state === "none" &&
            (!condition.output || condition.output === "")
        );

        if (noneStateAction && noneStateAction.next) {
          text = noneStateAction.next;
          const terminator = keylayout.terminators.find(
            (term) => term.state === text
          );
          const terminatorOutput = terminator ? terminator.output : "";

          if (text in scriptMap) {
            return `${scriptMap[text].getShortDisplayText()}`;
          }
          return `${terminatorOutput}`;
        }
      } else {
        // Find the output for the "none" state
        const noneStateAction = keylayout.actions[keyData.action].find(
          (condition) => condition.state === "none"
        );

        if (noneStateAction && noneStateAction.output) {
          text = noneStateAction.output;
        } else {
          text = keyData.action || "";
        }
      }
    } else if (!text) {
      text = keyData.action || "";
    }

    return processSpecialCharacter(text);
  }
};

export const isKeyDead = (keylayout, currState, layerNum, code) => {
  if (
    !keylayout ||
    !keylayout.keyMaps[layerNum] ||
    !keylayout.keyMaps[layerNum][code]
  ) {
    return false;
  }

  const keyData = keylayout.keyMaps[layerNum][code];

  // If the key has an action and that action exists in the actions map
  if (keyData.action && keylayout.actions[keyData.action]) {
    // If we have a selected state (not "default" or empty), check if it's dead in that state
    if (currState && currState !== "default" && currState !== "") {
      // Check if this state leads to a next state (making it a dead key)
      return keylayout.actions[keyData.action].some(
        (condition) =>
          condition.state === currState &&
          (!condition.output || condition.output === "") &&
          condition.next
      );
    } else {
      // Default behavior - check the "none" state
      return keylayout.actions[keyData.action].some(
        (condition) =>
          condition.state === "none" &&
          (!condition.output || condition.output === "") &&
          condition.next
      );
    }
  }

  return false;
};

export function getModifierString(indexKey) {
  switch (indexKey) {
    case "1":
      return "shift";
    case "2":
      return "alt";
    case "3":
      return "alt + shift";
    case "4":
      return "";
    case "6":
      return "control";
    default:
      return null;
  }
}

export function findKeyForState(keylayout, targetState) {
  if (!keylayout) return null;

  for (const indexKey in keylayout.keyMaps) {
    const keyMap = keylayout.keyMaps[indexKey];
    for (const keyCode in keyMap) {
      const keyData = keyMap[keyCode];
      const action = keylayout.actions[keyData.action];

      if (!action) continue;

      for (const i in action) {
        const condition = action[i];
        if (
          condition.state === "none" &&
          condition.output === null &&
          condition.next === targetState
        ) {
          return {
            keyPress: getModifierString(indexKey),
            code: getKeyOutputForLayer(
              keylayout,
              Number(indexKey),
              Number(keyCode)
            ),
          };
        }
      }
    }
  }

  return null;
}

export function findDeadKeySequence(keylayout, currState, searchOutput) {
  if (!keylayout) return null;

  for (const indexKey in keylayout.keyMaps) {
    const keyMap = keylayout.keyMaps[indexKey];

    for (const codeKey in keyMap) {
      const keyData = keyMap[codeKey];

      if (keyData.action && keylayout.actions[keyData.action]) {
        for (const state of keylayout.actions[keyData.action]) {
          if (state.output === searchOutput) {
            const stateKeyInfo = findKeyForState(keylayout, state.state);

            return {
              keyPress: getModifierString(indexKey),
              code: getKeyOutputForLayer(keylayout, currState, Number(indexKey), Number(codeKey)),
              deadKey: {
                state: state.state,
                press: stateKeyInfo ? stateKeyInfo.keyPress : null,
                code: stateKeyInfo ? stateKeyInfo.code : null,
              },
            };
          }
        }
      }
    }
  }

  return null;
}
