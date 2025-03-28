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
}

interface KeyboardHandle {
  searchKeyOutput: (query: string) => any;
}

interface SearchResult {
  keyPress: string;
  code: string;
  isDead: boolean;
  states?: string[];
}

// Keep original loading and parsing functions
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
          output: key.getAttribute("output"),
          action: key.getAttribute("action"),
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
        state: when.getAttribute("state"),
        output: when.getAttribute("output"),
        nextAction: when.getAttribute("next"),
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
}) => {
  return (
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
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [formattedResult, setFormattedResult] = useState("");

  function getKeyPressString(indexKey) {
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
        return "ctrl";
      default:
        return null;
    }
  }

  // Function to search for a character in direct output keys
  function findDirectKeyForOutput(keylayout, searchOutput) {
    for (const indexKey in keylayout.keyMaps) {
      const keyMap = keylayout.keyMaps[indexKey];

      for (const codeKey in keyMap) {
        const keyData = keyMap[codeKey];

        if (keyData.output === searchOutput) {
          const keyPress = getKeyPressString(indexKey);
          return {
            keyPress: keyPress,
            code: getKeyOutput(Number(codeKey)),
            isDead: false,
          };
        }
      }
    }
    return null;
  }

  // Function to find a character in dead key states
  function findKeyForDeadKeyOutput(keylayout, searchOutput) {
    // Step 1: Find actions that produce the desired output
    const matchingStates = [];

    for (const actionId in keylayout.actions) {
      const states = keylayout.actions[actionId];

      for (const state of states) {
        if (state.output === searchOutput) {
          matchingStates.push({
            actionId,
            state: state.state,
          });
        }
      }
    }

    if (matchingStates.length === 0) {
      return null;
    }

    // Step 2: For each matching state, find the keys that trigger that action
    const results = [];

    for (const match of matchingStates) {
      // Find all keys that use this action
      for (const indexKey in keylayout.keyMaps) {
        const keyMap = keylayout.keyMaps[indexKey];

        for (const codeKey in keyMap) {
          const keyData = keyMap[codeKey];

          if (keyData.action === match.actionId) {
            // We found a key that triggers this action
            const keyPress = getKeyPressString(indexKey);
            const keySymbol = getKeyOutput(Number(codeKey)) || keyData.action;

            // Step 3: Find how to produce the state
            const stateChain = findStateProducers(keylayout, match.state);

            results.push({
              keyPress: keyPress,
              code: keySymbol,
              isDead: true,
              state: match.state,
              stateChain: stateChain,
            });
          }
        }
      }
    }

    return results.length > 0 ? results : null;
  }

  // Find keypresses that can produce a given state
  function findStateProducers(keylayout, targetState) {
    const producers = [];

    // Check all keymaps, looking for keys that output the target state
    for (const indexKey in keylayout.keyMaps) {
      const keyMap = keylayout.keyMaps[indexKey];

      for (const codeKey in keyMap) {
        const keyData = keyMap[codeKey];

        if (keyData.output === targetState) {
          const keyPress = getKeyPressString(indexKey);
          const keySymbol = getKeyOutput(Number(codeKey));

          producers.push({
            keyPress: keyPress,
            key: keySymbol,
          });
        }
      }
    }

    return producers;
  }

  // Recursive function to build a chain of keypresses to produce a state
  function buildStateKeyChain(keylayout, targetState, visited = new Set()) {
    if (visited.has(targetState)) {
      return null; // Prevent infinite recursion
    }

    visited.add(targetState);

    // First, check if the state can be directly produced by a key
    const directProducers = findStateProducers(keylayout, targetState);
    if (directProducers.length > 0) {
      return directProducers[0]; // Return the first found producer
    }

    // Otherwise, check for states that might lead to this state via an action
    for (const actionId in keylayout.actions) {
      const states = keylayout.actions[actionId];

      for (const state of states) {
        if (state.nextAction && state.nextAction === targetState) {
          const parentProducer = buildStateKeyChain(
            keylayout,
            state.state,
            visited
          );
          if (parentProducer) {
            return {
              ...parentProducer,
              next: targetState,
            };
          }
        }
      }
    }

    return null;
  }

  // Format the search result for display
  function formatResult(result) {
    if (!result) return "Character not found";

    if (!result.isDead) {
      // Regular key
      return result.keyPress
        ? `${result.keyPress} + ${result.code}`
        : result.code;
    } else {
      // Dead key with state
      const modifierText = result.keyPress ? `${result.keyPress} + ` : "";

      // Format as requested: "ctrl + i → k → a"
      if (result.stateChain && result.stateChain.length > 0) {
        const stateKeys = result.stateChain.map((sc) => {
          const modifier = sc.keyPress ? `${sc.keyPress} + ` : "";
          return `${modifier}${sc.key}`;
        });

        return `${modifierText}${result.code} → ${stateKeys.join(" → ")} → ${result.state}`;
      } else {
        return `${modifierText}${result.code} → ${result.state}`;
      }
    }
  }

  // Main search function
  function searchKeyOutput(query) {
    if (!keylayout || !query.trim()) return null;

    // First, try direct key search
    const directResult = findDirectKeyForOutput(keylayout, query);
    if (directResult) {
      console.log("direct", directResult)
      setSearchResult(directResult);
      setFormattedResult(formatResult(directResult));
      return directResult;
    }

    // Then, try dead key search
    const deadKeyResults = findKeyForDeadKeyOutput(keylayout, query);
    if (deadKeyResults && deadKeyResults.length > 0) {
      const bestResult = deadKeyResults[0];
      console.log("best", bestResult)
      setSearchResult(bestResult);

      // Format results as requested
      const formattedResults = deadKeyResults.map(formatResult);
      setFormattedResult(formattedResults.join("\n"));

      return bestResult;
    }

    // No results found
    setSearchResult(null);
    setFormattedResult("Character not found");
    return null;
  }

  // Expose the search function via ref
  useImperativeHandle(ref, () => ({
    searchKeyOutput,
  }));

  // Handle UI search
  const handleSearch = () => {
    if (!searchQuery.trim() || !keylayout) return;
    searchKeyOutput(searchQuery);
  };

  function getKeyOutput(code) {
    if (
      !keylayout ||
      !keylayout.keyMaps[layer] ||
      !keylayout.keyMaps[layer][code]
    ) {
      return "";
    }
    var text =
      keylayout.keyMaps[layer][code].output ||
      keylayout.keyMaps[layer][code].action ||
      "";

    switch (text) {
      case "U+0022;":
        text = '"';
        break;
      case "U+0026;":
        text = "~";
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

    if (text in scriptMap) {
      return scriptMap[text].getKeyDisplayText();
    }
    return text;
  }

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
      const filePath = "/layout.keylayout";
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
      {/* Keyboard */}
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
          <Key>{getKeyOutput(50)}</Key>
          <Key>{getKeyOutput(18)}</Key>
          <Key>{getKeyOutput(19)}</Key>
          <Key>{getKeyOutput(20)}</Key>
          <Key>{getKeyOutput(21)}</Key>
          <Key>{getKeyOutput(23)}</Key>
          <Key>{getKeyOutput(22)}</Key>
          <Key>{getKeyOutput(26)}</Key>
          <Key>{getKeyOutput(28)}</Key>
          <Key>{getKeyOutput(25)}</Key>
          <Key>{getKeyOutput(29)}</Key>
          <Key>{getKeyOutput(27)}</Key>
          <Key>{getKeyOutput(24)}</Key>
          <Key width={2}>Backspace</Key>
        </div>

        {/* Top row */}
        <div className="keyboard-row">
          <Key width={1.5}>Tab</Key>
          <Key>{getKeyOutput(12)}</Key>
          <Key>{getKeyOutput(13)}</Key>
          <Key>{getKeyOutput(14)}</Key>
          <Key>{getKeyOutput(15)}</Key>
          <Key>{getKeyOutput(16)}</Key>
          <Key>{getKeyOutput(17)}</Key>
          <Key>{getKeyOutput(32)}</Key>
          <Key>{getKeyOutput(34)}</Key>
          <Key>{getKeyOutput(31)}</Key>
          <Key>{getKeyOutput(35)}</Key>
          <Key>{getKeyOutput(33)}</Key>
          <Key>{getKeyOutput(30)}</Key>
          <Key width={1.5}>{getKeyOutput(42)}</Key>
        </div>

        {/* Home row */}
        <div className="keyboard-row">
          <Key width={1.75} className="mod-key">
            Caps Lock
          </Key>
          <Key>{getKeyOutput(0)}</Key>
          <Key>{getKeyOutput(1)}</Key>
          <Key>{getKeyOutput(2)}</Key>
          <Key>{getKeyOutput(3)}</Key>
          <Key>{getKeyOutput(5)}</Key>
          <Key>{getKeyOutput(4)}</Key>
          <Key>{getKeyOutput(38)}</Key>
          <Key>{getKeyOutput(40)}</Key>
          <Key>{getKeyOutput(37)}</Key>
          <Key>{getKeyOutput(41)}</Key>
          <Key>{getKeyOutput(39)}</Key>
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
          <Key>{getKeyOutput(6)}</Key>
          <Key>{getKeyOutput(7)}</Key>
          <Key>{getKeyOutput(8)}</Key>
          <Key>{getKeyOutput(9)}</Key>
          <Key>{getKeyOutput(11)}</Key>
          <Key>{getKeyOutput(45)}</Key>
          <Key>{getKeyOutput(46)}</Key>
          <Key>{getKeyOutput(43)}</Key>
          <Key>{getKeyOutput(47)}</Key>
          <Key>{getKeyOutput(44)}</Key>
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
