import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { scriptMap } from "../types/Script";
import "./Keyboard.css";

interface KeyProps {
  children?: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
  isDeadKey?: boolean;
  code?: number;
}

interface KeyboardHandle {
  searchKeyOutput: (query: string) => void;
}

export async function loadKeylayoutFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.statusText}`);
    }

    const xmlText = await response.text();

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "text/xml");

    if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
      throw new Error("Error parsing XML");
    }

    const keylayoutObject = parseKeylayoutXML(xmlDoc);

    return keylayoutObject;
  } catch (error) {
    console.error("Error loading keylayout file:", error);
    return null;
  }
}

function parseKeylayoutXML(xmlDoc) {
  // Existing implementation
  const keylayout = {
    layouts: [],
    keyMapSets: {},
    keyMaps: {},
    actions: {},
    modifiers: {},
    terminators: [],
  };

  const keyboard = xmlDoc.getElementsByTagName("keyboard")[0];
  if (keyboard) {
    keylayout.name = keyboard.getAttribute("name");
    keylayout.group = keyboard.getAttribute("group");
    keylayout.id = keyboard.getAttribute("id");
  }

  const modifierMaps = xmlDoc.getElementsByTagName("modifierMap");
  for (let map of modifierMaps) {
    const id = map.getAttribute("id");
    keylayout.modifiers[id] = [];
    const keys = map.getElementsByTagName("key");
    for (let key of keys) {
      keylayout.modifiers[id].push({
        code: key.getAttribute("code"),
        modifiers: key.getAttribute("modifiers"),
      });
    }
  }

  const keyMapSets = xmlDoc.getElementsByTagName("keyMapSet");
  for (let set of keyMapSets) {
    const id = set.getAttribute("id");
    keylayout.keyMapSets[id] = [];
    const keyMaps = set.getElementsByTagName("keyMap");
    for (let map of keyMaps) {
      const index = map.getAttribute("index");
      keylayout.keyMapSets[id].push(index);
      keylayout.keyMaps[index] = {};
      const keys = map.getElementsByTagName("key");
      for (let key of keys) {
        keylayout.keyMaps[index][key.getAttribute("code")] = {
          action: key.getAttribute("action"),
          output: key.getAttribute("output"),
        };
      }
    }
  }

  const actions = xmlDoc.getElementsByTagName("action");
  for (let action of actions) {
    const id = action.getAttribute("id");
    keylayout.actions[id] = [];
    const whens = action.getElementsByTagName("when");
    for (let when of whens) {
      keylayout.actions[id].push({
        next: when.getAttribute("next"),
        output: when.getAttribute("output"),
        state: when.getAttribute("state"),
      });
    }
  }

  const terminators = xmlDoc.getElementsByTagName("terminators")[0];
  if (terminators) {
    const whens = terminators.getElementsByTagName("when");
    for (let when of whens) {
      keylayout.terminators.push({
        state: when.getAttribute("state"),
        output: when.getAttribute("output"),
      });
    }
  }

  return keylayout;
}

// Process special character codes
function processSpecialCharacter(text) {
  switch (text) {
    case "U+0022;":
      return '"';
    case "U+0026;":
      return "&";
    case "~":
      return "~"; // TODO: Special case
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

const Keyboard = forwardRef<KeyboardHandle, {}>((props, ref) => {
  // Keyboard display properties
  const [keylayout, setKeylayout] = useState<any>(null);
  const [layer, setLayer] = useState(4);
  // Key presses
  const [altPressed, setAltPressed] = useState(false);
  const [controlPressed, setControlPressed] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);
  // See everything checkbox
  const [seeEverything, setSeeEverything] = useState(false);

  // Search bar properties
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Function to get key output for a specific layer and code
  const getKeyOutputForLayer = (layerNum, code) => {
    if (
      !keylayout ||
      !keylayout.keyMaps[layerNum] ||
      !keylayout.keyMaps[layerNum][code]
    ) {
      return "";
    }

    const keyData = keylayout.keyMaps[layerNum][code];
    let text = keyData.output || "";

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
            return `${scriptMap[text].getKeyDisplayText()}`;
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
  };

  // Check if a key is a dead key
  const isKeyDead = (layerNum, code) => {
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
      // Check if any of the action's conditions have state="none" and output is null/empty
      return keylayout.actions[keyData.action].some(
        (condition) =>
          condition.state === "none" &&
          (!condition.output || condition.output === "") &&
          condition.next
      );
    }

    return false;
  };

  // Get key output for the current layer
  const getKeyOutput = (code) => {
    return getKeyOutputForLayer(layer, code);
  };

  // Check if key is a dead key in the current layer
  const checkIsDeadKey = (code) => {
    return isKeyDead(layer, code);
  };

  // Shared key component
  const KeyboardKey = ({ code, width = 1, height = 1, className = "" }) => {
    const isDead = checkIsDeadKey(code);
    const keyClassName = `key ${className} ${!seeEverything && isDead ? "dead-key" : ""}`;

    if (seeEverything) {
      // Detailed view with all layers
      const isDeadInLayer1 = isKeyDead(1, code);
      const isDeadInLayer2 = isKeyDead(2, code);
      const isDeadInLayer3 = isKeyDead(3, code);
      const isDeadInLayer4 = isKeyDead(4, code);

      return (
        <div
          className={keyClassName}
          style={{
            width: `${width * 60}px`,
            height: `${height * 60}px`,
          }}
        >
          <div
            className={`key-region key-region-nw ${isDeadInLayer1 ? "dead-region" : ""}`}
          >
            <span>{getKeyOutputForLayer(1, code)}</span>
          </div>
          <div
            className={`key-region key-region-ne ${isDeadInLayer3 ? "dead-region" : ""}`}
          >
            <span>{getKeyOutputForLayer(3, code)}</span>
          </div>
          <div
            className={`key-region key-region-sw ${isDeadInLayer4 ? "dead-region" : ""}`}
          >
            <span>{getKeyOutputForLayer(4, code)}</span>
          </div>
          <div
            className={`key-region key-region-se ${isDeadInLayer2 ? "dead-region" : ""}`}
          >
            <span>{getKeyOutputForLayer(2, code)}</span>
          </div>
        </div>
      );
    }

    // Regular key rendering
    return (
      <div
        className={keyClassName}
        style={{
          width: `${width * 60}px`,
          height: `${height * 60}px`,
        }}
      >
        <div className="key-content">{getKeyOutput(code)}</div>
      </div>
    );
  };

  // Fixed key component for function keys, etc.
  const FixedKey = ({ children, width = 1, height = 1, className = "" }) => (
    <div
      className={`key ${className}`}
      style={{
        width: `${width * 60}px`,
        height: `${height * 60}px`,
      }}
    >
      <div className="key-content">{children}</div>
    </div>
  );

  // Search implementation
  function getModifierString(indexKey) {
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

  function findKeyForState(targetState) {
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
              code: getKeyOutputForLayer(Number(indexKey), Number(keyCode)),
            };
          }
        }
      }
    }

    return null;
  }

  function findDeadKeySequence(searchOutput) {
    if (!keylayout) return null;

    for (const indexKey in keylayout.keyMaps) {
      const keyMap = keylayout.keyMaps[indexKey];

      for (const codeKey in keyMap) {
        const keyData = keyMap[codeKey];

        if (keyData.action && keylayout.actions[keyData.action]) {
          for (const state of keylayout.actions[keyData.action]) {
            if (state.output === searchOutput) {
              const stateKeyInfo = findKeyForState(state.state);

              return {
                keyPress: getModifierString(indexKey),
                code: getKeyOutputForLayer(Number(indexKey), Number(codeKey)),
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

  function findKeyByOutput(searchOutput) {
    if (!keylayout) return null;

    for (const indexKey in keylayout.keyMaps) {
      const keyMap = keylayout.keyMaps[indexKey];

      for (const codeKey in keyMap) {
        const keyData = keyMap[codeKey];

        if (
          keyData.output === searchOutput ||
          keyData.action === searchOutput
        ) {
          return {
            keyPress: getModifierString(indexKey),
            code: getKeyOutputForLayer(Number(indexKey), Number(codeKey)),
            deadKey: null,
          };
        }
      }
    }

    return findDeadKeySequence(searchOutput);
  }

  useImperativeHandle(ref, () => ({
    searchKeyOutput: (query: string) => {
      if (!keylayout) return null;

      const result = findKeyByOutput(query);
      setSearchResult(result);

      return result;
    },
  }));

  const handleSearch = () => {
    if (!searchQuery.trim() || !keylayout) return;

    const result = findKeyByOutput(searchQuery);
    setSearchResult(result);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "Alt":
          setAltPressed(true);
          return;
        case "Control":
          setControlPressed(true);
          return;
        case "Shift":
          setShiftPressed(true);
          return;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case "Alt":
          setAltPressed(false);
          return;
        case "Control":
          setControlPressed(false);
          return;
        case "Shift":
          setShiftPressed(false);
          return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    var layer = 4;
    if (shiftPressed) {
      layer = 1;
      if (altPressed) {
        layer = 3;
      }
    } else {
      if (altPressed) {
        layer = 2;
      }
    }
    // Control overrides all other keys
    if (controlPressed) {
      layer = 6;
    }
    setLayer(layer);
  }, [altPressed, controlPressed, shiftPressed]);

  useEffect(() => {
    const fetchKeylayout = async () => {
      const filePath = "/dvorak.keylayout";
      const result = await loadKeylayoutFile(filePath);

      if (result) {
        console.log("Keylayout Object:", result);
        setKeylayout(result);
      }
    };

    fetchKeylayout();
  }, []);

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        <div className="keyboard-options">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={seeEverything}
              onChange={(e) => setSeeEverything(e.target.checked)}
            />
            See everything
          </label>
          {seeEverything && (
            <div className="key-legend">
              <div className="legend-item">
                <div className="legend-color nw"></div>
                <span>Shift</span>
              </div>
              <div className="legend-item">
                <div className="legend-color ne"></div>
                <span>Alt+Shift</span>
              </div>
              <div className="legend-item">
                <div className="legend-color sw"></div>
                <span>Normal</span>
              </div>
              <div className="legend-item">
                <div className="legend-color se"></div>
                <span>Alt</span>
              </div>
              <div className="legend-item">
                <div className="legend-color dead-region"></div>
                <span>Dead Key</span>
              </div>
            </div>
          )}
        </div>

        {/* Function row */}
        <div className="keyboard-row">
          <FixedKey className="function-key">Esc</FixedKey>
          <div className="key-spacer"></div>
          <FixedKey className="function-key">F1</FixedKey>
          <FixedKey className="function-key">F2</FixedKey>
          <FixedKey className="function-key">F3</FixedKey>
          <FixedKey className="function-key">F4</FixedKey>
          <div className="key-spacer"></div>
          <FixedKey className="function-key">F5</FixedKey>
          <FixedKey className="function-key">F6</FixedKey>
          <FixedKey className="function-key">F7</FixedKey>
          <FixedKey className="function-key">F8</FixedKey>
          <div className="key-spacer"></div>
          <FixedKey className="function-key">F9</FixedKey>
          <FixedKey className="function-key">F10</FixedKey>
          <FixedKey className="function-key">F11</FixedKey>
          <FixedKey className="function-key">F12</FixedKey>
        </div>

        {/* Number row */}
        <div className="keyboard-row">
          <KeyboardKey code={50} />
          <KeyboardKey code={18} />
          <KeyboardKey code={19} />
          <KeyboardKey code={20} />
          <KeyboardKey code={21} />
          <KeyboardKey code={23} />
          <KeyboardKey code={22} />
          <KeyboardKey code={26} />
          <KeyboardKey code={28} />
          <KeyboardKey code={25} />
          <KeyboardKey code={29} />
          <KeyboardKey code={27} />
          <KeyboardKey code={24} />
          <FixedKey width={2}>Backspace</FixedKey>
        </div>

        {/* Top row */}
        <div className="keyboard-row">
          <FixedKey width={1.5}>Tab</FixedKey>
          <KeyboardKey code={12} />
          <KeyboardKey code={13} />
          <KeyboardKey code={14} />
          <KeyboardKey code={15} />
          <KeyboardKey code={16} />
          <KeyboardKey code={17} />
          <KeyboardKey code={32} />
          <KeyboardKey code={34} />
          <KeyboardKey code={31} />
          <KeyboardKey code={35} />
          <KeyboardKey code={33} />
          <KeyboardKey code={30} />
          <KeyboardKey code={42} width={1.5} />
        </div>

        {/* Home row */}
        <div className="keyboard-row">
          <FixedKey width={1.75} className="mod-key">
            Caps Lock
          </FixedKey>
          <KeyboardKey code={0} />
          <KeyboardKey code={1} />
          <KeyboardKey code={2} />
          <KeyboardKey code={3} />
          <KeyboardKey code={5} />
          <KeyboardKey code={4} />
          <KeyboardKey code={38} />
          <KeyboardKey code={40} />
          <KeyboardKey code={37} />
          <KeyboardKey code={41} />
          <KeyboardKey code={39} />
          <FixedKey width={2.4} className="mod-key">
            Enter
          </FixedKey>
        </div>

        {/* Bottom Row */}
        <div className="keyboard-row">
          <FixedKey
            width={2.25}
            className={`mod-key ${shiftPressed ? "mod-active" : ""}`}
          >
            Shift
          </FixedKey>
          <KeyboardKey code={6} />
          <KeyboardKey code={7} />
          <KeyboardKey code={8} />
          <KeyboardKey code={9} />
          <KeyboardKey code={11} />
          <KeyboardKey code={45} />
          <KeyboardKey code={46} />
          <KeyboardKey code={43} />
          <KeyboardKey code={47} />
          <KeyboardKey code={44} />
          <FixedKey
            width={3}
            className={`mod-key ${shiftPressed ? "mod-active" : ""}`}
          >
            Shift
          </FixedKey>
        </div>

        {/* Space Row */}
        <div className="keyboard-row">
          <FixedKey
            width={1.5}
            className={`mod-key ${controlPressed ? "mod-active" : ""}`}
          >
            Control
          </FixedKey>
          <FixedKey width={1.25} className="mod-key">
            Win
          </FixedKey>
          <FixedKey
            width={1.25}
            className={`mod-key ${altPressed ? "mod-active" : ""}`}
          >
            Alt
          </FixedKey>
          <FixedKey width={6.25}>Space</FixedKey>
          <FixedKey
            width={1.25}
            className={`mod-key ${altPressed ? "mod-active" : ""}`}
          >
            Alt
          </FixedKey>
          <FixedKey width={1.25} className="mod-key">
            Win
          </FixedKey>
          <FixedKey width={1.25} className="mod-key">
            Menu
          </FixedKey>
          <FixedKey
            width={1.6}
            className={`mod-key ${controlPressed ? "mod-active" : ""}`}
          >
            Control
          </FixedKey>
        </div>
      </div>
    </div>
  );
});

export default Keyboard;
