import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { scriptMap } from "../types/Script";
import "./Keyboard.css";

interface KeyProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
  isDeadKey?: boolean;
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

const Key: React.FC<KeyProps> = ({
  children,
  width = 1,
  height = 1,
  className = "",
  isDeadKey = false,
}) => {
  const keyClassName = `key ${className} ${isDeadKey ? "dead-key" : ""}`;

  return (
    <div
      className={keyClassName}
      style={{
        width: `${width * 60}px`,
        height: `${height * 60}px`,
      }}
    >
      <div className="key-content">{children}</div>
    </div>
  );
};

const Keyboard = forwardRef<KeyboardHandle, {}>((props, ref) => {
  // Keyboard display properties
  const [keylayout, setKeylayout] = useState(null);
  const [layer, setLayer] = useState(4);
  // Key presses
  const [altPressed, setAltPressed] = useState(false);
  const [controlPressed, setControlPressed] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);

  // Search bar properties
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useImperativeHandle(ref, () => ({
    searchKeyOutput: (query: string) => {
      if (!keylayout) return;

      const result = findKeyByOutput(keylayout, query);
      setSearchResult(result);

      return result;
    },
  }));

  const handleSearch = () => {
    if (!searchQuery.trim() || !keylayout) return;

    const result = findKeyByOutput(keylayout, searchQuery);
    setSearchResult(result);
  };

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

  function findKeyForState(keylayout, targetState) {
    for (const indexKey in keylayout.keyMaps) {
      const keyMap = keylayout.keyMaps[indexKey];
      for (const keyCode in keyMap) {
        const keyData = keyMap[keyCode];
        const action = keylayout.actions[keyData.action];

        for (const i in action) {
          const condition = action[i];
          if (
            condition.state === "none" &&
            condition.output === null &&
            condition.next === targetState
          ) {
            return {
              keyPress: getModifierString(indexKey),
              code: getKeyOutput(Number(keyCode)),
            };
          }
        }
      }
    }

    return null;
  }

  function findDeadKeySequence(keylayout, searchOutput) {
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
                code: getKeyOutput(Number(codeKey)),
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

  function findKeyByOutput(keylayout, searchOutput) {
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
            code: getKeyOutput(Number(codeKey)),
            deadKey: null,
          };
        }
      }
    }

    return findDeadKeySequence(keylayout, searchOutput);
  }

  const isDeadKey = (code) => {
    if (
      !keylayout ||
      !keylayout.keyMaps[layer] ||
      !keylayout.keyMaps[layer][code]
    ) {
      return false;
    }

    const keyData = keylayout.keyMaps[layer][code];

    // If the key has an action and that action exists in the actions map
    if (keyData.action && keylayout.actions[keyData.action]) {
      // Check if any of the action's conditions have state="none" and output is null/empty
      return keylayout.actions[keyData.action].some(
        (condition) =>
          condition.state === "none" &&
          (!condition.output || condition.output === "")
      );
    }

    return false;
  };

  const getKeyOutput = (code) => {
    if (
      !keylayout ||
      !keylayout.keyMaps[layer] ||
      !keylayout.keyMaps[layer][code]
    ) {
      return "";
    }

    const keyData = keylayout.keyMaps[layer][code];
    let text = keyData.output || "";

    // If it has an action, check what to display
    if (keyData.action && keylayout.actions[keyData.action]) {
      if (isDeadKey(code)) {
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
          return `${terminatorOutput}`; // ${text}`;
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

    switch (text) {
      case "U+0022;":
        text = '"';
        break;
      case "U+0026;":
        text = "~";
        break;
      case "~": // TODO: I don't know why this is true
        text = "&";
        break;
      case "U+0027;":
        text = "'";
        break;
      case "U+003C;":
        text = "<";
        break;
      case "U+003E;":
        text = ">";
        break;
      default:
        break;
    }

    return text;
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
        console.log("Key map for index 0:", result.keyMaps[layer]["0"].output);
        setKeylayout(result);
      }
    };

    fetchKeylayout();
  }, []);

  return (
    <div className="keyboard-container">
      <div className="keyboard">
        {/* Function row */}
        <div className="keyboard-row">
          <Key className="function-key">Esc</Key>
          <div className="key-spacer"></div>
          <Key className="function-key">F1</Key>
          <Key className="function-key">F2</Key>
          <Key className="function-key">F3</Key>
          <Key className="function-key">F4</Key>
          <div className="key-spacer"></div>
          <Key className="function-key">F5</Key>
          <Key className="function-key">F6</Key>
          <Key className="function-key">F7</Key>
          <Key className="function-key">F8</Key>
          <div className="key-spacer"></div>
          <Key className="function-key">F9</Key>
          <Key className="function-key">F10</Key>
          <Key className="function-key">F11</Key>
          <Key className="function-key">F12</Key>
        </div>

        {/* Number row */}
        <div className="keyboard-row">
          <Key isDeadKey={isDeadKey(50)}>{getKeyOutput(50)}</Key>
          <Key isDeadKey={isDeadKey(18)}>{getKeyOutput(18)}</Key>
          <Key isDeadKey={isDeadKey(19)}>{getKeyOutput(19)}</Key>
          <Key isDeadKey={isDeadKey(20)}>{getKeyOutput(20)}</Key>
          <Key isDeadKey={isDeadKey(21)}>{getKeyOutput(21)}</Key>
          <Key isDeadKey={isDeadKey(23)}>{getKeyOutput(23)}</Key>
          <Key isDeadKey={isDeadKey(22)}>{getKeyOutput(22)}</Key>
          <Key isDeadKey={isDeadKey(26)}>{getKeyOutput(26)}</Key>
          <Key isDeadKey={isDeadKey(28)}>{getKeyOutput(28)}</Key>
          <Key isDeadKey={isDeadKey(25)}>{getKeyOutput(25)}</Key>
          <Key isDeadKey={isDeadKey(29)}>{getKeyOutput(29)}</Key>
          <Key isDeadKey={isDeadKey(27)}>{getKeyOutput(27)}</Key>
          <Key isDeadKey={isDeadKey(24)}>{getKeyOutput(24)}</Key>
          <Key width={2}>Backspace</Key>
        </div>

        {/* Top row */}
        <div className="keyboard-row">
          <Key width={1.5}>Tab</Key>
          <Key isDeadKey={isDeadKey(12)}>{getKeyOutput(12)}</Key>
          <Key isDeadKey={isDeadKey(13)}>{getKeyOutput(13)}</Key>
          <Key isDeadKey={isDeadKey(14)}>{getKeyOutput(14)}</Key>
          <Key isDeadKey={isDeadKey(15)}>{getKeyOutput(15)}</Key>
          <Key isDeadKey={isDeadKey(16)}>{getKeyOutput(16)}</Key>
          <Key isDeadKey={isDeadKey(17)}>{getKeyOutput(17)}</Key>
          <Key isDeadKey={isDeadKey(32)}>{getKeyOutput(32)}</Key>
          <Key isDeadKey={isDeadKey(34)}>{getKeyOutput(34)}</Key>
          <Key isDeadKey={isDeadKey(31)}>{getKeyOutput(31)}</Key>
          <Key isDeadKey={isDeadKey(35)}>{getKeyOutput(35)}</Key>
          <Key isDeadKey={isDeadKey(33)}>{getKeyOutput(33)}</Key>
          <Key isDeadKey={isDeadKey(30)}>{getKeyOutput(30)}</Key>
          <Key width={1.5} isDeadKey={isDeadKey(42)}>
            {getKeyOutput(42)}
          </Key>
        </div>

        {/* Home row */}
        <div className="keyboard-row">
          <Key width={1.75} className="mod-key">
            Caps Lock
          </Key>
          <Key isDeadKey={isDeadKey(0)}>{getKeyOutput(0)}</Key>
          <Key isDeadKey={isDeadKey(1)}>{getKeyOutput(1)}</Key>
          <Key isDeadKey={isDeadKey(2)}>{getKeyOutput(2)}</Key>
          <Key isDeadKey={isDeadKey(3)}>{getKeyOutput(3)}</Key>
          <Key isDeadKey={isDeadKey(5)}>{getKeyOutput(5)}</Key>
          <Key isDeadKey={isDeadKey(4)}>{getKeyOutput(4)}</Key>
          <Key isDeadKey={isDeadKey(38)}>{getKeyOutput(38)}</Key>
          <Key isDeadKey={isDeadKey(40)}>{getKeyOutput(40)}</Key>
          <Key isDeadKey={isDeadKey(37)}>{getKeyOutput(37)}</Key>
          <Key isDeadKey={isDeadKey(41)}>{getKeyOutput(41)}</Key>
          <Key isDeadKey={isDeadKey(39)}>{getKeyOutput(39)}</Key>
          <Key width={2.4} className="mod-key">
            Enter
          </Key>
        </div>

        {/* Bottom Row */}
        <div className="keyboard-row">
          <Key
            width={2.25}
            className={`mod-key ${shiftPressed ? "mod-active" : ""}`}
          >
            Shift
          </Key>
          <Key isDeadKey={isDeadKey(6)}>{getKeyOutput(6)}</Key>
          <Key isDeadKey={isDeadKey(7)}>{getKeyOutput(7)}</Key>
          <Key isDeadKey={isDeadKey(8)}>{getKeyOutput(8)}</Key>
          <Key isDeadKey={isDeadKey(9)}>{getKeyOutput(9)}</Key>
          <Key isDeadKey={isDeadKey(11)}>{getKeyOutput(11)}</Key>
          <Key isDeadKey={isDeadKey(45)}>{getKeyOutput(45)}</Key>
          <Key isDeadKey={isDeadKey(46)}>{getKeyOutput(46)}</Key>
          <Key isDeadKey={isDeadKey(43)}>{getKeyOutput(43)}</Key>
          <Key isDeadKey={isDeadKey(47)}>{getKeyOutput(47)}</Key>
          <Key isDeadKey={isDeadKey(44)}>{getKeyOutput(44)}</Key>
          <Key
            width={3}
            className={`mod-key ${shiftPressed ? "mod-active" : ""}`}
          >
            Shift
          </Key>
        </div>

        {/* Space Row */}
        <div className="keyboard-row">
          <Key
            width={1.5}
            className={`mod-key ${controlPressed ? "mod-active" : ""}`}
          >
            Control
          </Key>
          <Key width={1.25} className="mod-key">
            Win
          </Key>
          <Key
            width={1.25}
            className={`mod-key ${altPressed ? "mod-active" : ""}`}
          >
            Alt
          </Key>
          <Key width={6.25}>Space</Key>
          <Key
            width={1.25}
            className={`mod-key ${altPressed ? "mod-active" : ""}`}
          >
            Alt
          </Key>
          <Key width={1.25} className="mod-key">
            Win
          </Key>
          <Key width={1.25} className="mod-key">
            Menu
          </Key>
          <Key
            width={1.6}
            className={`mod-key ${controlPressed ? "mod-active" : ""}`}
          >
            Control
          </Key>
        </div>
      </div>
    </div>
  );
});

export default Keyboard;
