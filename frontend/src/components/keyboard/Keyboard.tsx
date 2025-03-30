import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import KeyboardLegend from "./KeyboardLegend";
import { loadKeylayoutFile } from "./parser";
import {
  getKeyOutputForLayer,
  getModifierString,
  findDeadKeySequence,
  isKeyDead,
} from "./Keylayout";
import { isCombiningCharacter } from "./Key";
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

const Keyboard = forwardRef<KeyboardHandle, {}>((props, ref) => {
  // Keyboard display properties.
  const [keylayout, setKeylayout] = useState<any>(null);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [layer, setLayer] = useState(4);
  // Options the user can configure.
  const [seeEverything, setSeeEverything] = useState(false);
  const [currState, setCurrState] = useState<string>("");
  // Key presses.
  const [altPressed, setAltPressed] = useState(false);
  const [controlPressed, setControlPressed] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);
  // Search bar properties
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Uninteresting wrapper functions
  const getKeyOutput = (code) => {
    return getKeyOutputForLayer(keylayout, currState, layer, code);
  };
  const checkIsDeadKey = (code) => {
    return isKeyDead(keylayout, currState, layer, code);
  };
  const handleKeyDown = (event) => {
    handleKeyPress(event, true);
  };
  const handleKeyUp = (event) => {
    handleKeyPress(event, false);
  };

  // Actual constants
  const keyboardLayout = {
    numberRow: [50, 18, 19, 20, 21, 23, 22, 26, 28, 25, 29, 27, 24],
    topRow: [12, 13, 14, 15, 16, 17, 32, 34, 31, 35, 33, 30],
    homeRow: [0, 1, 2, 3, 5, 4, 38, 40, 37, 41, 39],
    bottomRow: [6, 7, 8, 9, 11, 45, 46, 43, 47, 44],
  };

  const collectStates = (keylayout) => {
    if (!keylayout) return [];

    const states = new Set<string>();

    // Add states from actions
    Object.values(keylayout.actions).forEach((action: any) => {
      action.forEach((condition) => {
        if (condition.next) states.add(condition.next);
        if (condition.state && condition.state !== "none")
          states.add(condition.state);
      });
    });

    // Add states from terminators
    keylayout.terminators.forEach((terminator) => {
      if (terminator.state) states.add(terminator.state);
    });

    return Array.from(states).sort();
  };

  const KeyboardKey = ({ code, width = 1, height = 1, className = "" }) => {
    const keyOutput = getKeyOutput(code);
    const isDead = checkIsDeadKey(code);
    const isCombining = isCombiningCharacter(keyOutput);

    const keyStyle = {
      width: `${width * 60}px`,
      height: `${height * 60}px`,
    };

    const keyClassName = `key ${className} ${
      !seeEverything &&
      (isDead ? "dead-key" : "") + (isCombining ? "combining-key" : "")
    }`.trim();

    if (!seeEverything) {
      return (
        <div className={keyClassName} style={keyStyle}>
          <div className="key-content">{keyOutput}</div>
        </div>
      );
    }

    // For seeEverything mode
    const layers = [1, 2, 3, 4];
    const keyIsDeadLayers = layers.map((layer) =>
      isKeyDead(keylayout, currState, layer, code)
    );

    const keyOutputLayers = layers.map((layer) =>
      getKeyOutputForLayer(keylayout, currState, layer, code)
    );

    // Map of layer index to position class. Note the 1-offset.
    const regionPositions = {
      0: "nw", // Layer 1
      1: "se", // Layer 2
      2: "ne", // Layer 3
      3: "sw", // Layer 4
    };

    return (
      <div className={keyClassName} style={keyStyle}>
        <div className="detailed-key">
          {layers.map((layer, i) => (
            <div
              key={layer}
              className={`key-region key-region-${regionPositions[i]} ${
                keyIsDeadLayers[i] ? "dead-region" : ""
              } ${
                isCombiningCharacter(keyOutputLayers[i])
                  ? "combining-region"
                  : ""
              }`}
            >
              <span>{keyOutputLayers[i]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
            code: getKeyOutputForLayer(
              keylayout,
              currState,
              Number(indexKey),
              Number(codeKey)
            ),
            deadKey: null,
          };
        }
      }
    }

    return findDeadKeySequence(keylayout, currState, searchOutput);
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

  function handleKeyPress(event, isDown) {
    switch (event.key) {
      case "Alt":
        setAltPressed(isDown);
        return;
      case "Control":
        setControlPressed(isDown);
        return;
      case "Shift":
        setShiftPressed(isDown);
        return;
    }
  }

  useEffect(() => {
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
      const result = await loadKeylayoutFile("/dvorak.keylayout");

      if (result) {
        console.log("Keylayout Object:", result);
        setKeylayout(result);
        const states = ["default"].concat(collectStates(result));

        setAvailableStates(states);
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
                <div className="legend-color sw"></div>
                <span>Normal</span>
              </div>
              <div className="legend-item">
                <div className="legend-color nw"></div>
                <span>Shift</span>
              </div>
              <div className="legend-item">
                <div className="legend-color se"></div>
                <span>Alt</span>
              </div>
              <div className="legend-item">
                <div className="legend-color ne"></div>
                <span>Alt+Shift</span>
              </div>
            </div>
          )}
          <KeyboardLegend />

          <div className="state-selector">
            <select
              value={currState}
              onChange={(e) => setCurrState(e.target.value)}
              className="state-dropdown"
            >
              <option value="">Select a state...</option>
              {availableStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
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

        <div className="keyboard-row">
          {keyboardLayout.numberRow.map((code) => (
            <KeyboardKey key={`key-${code}`} code={code} />
          ))}
          <FixedKey width={2}>Backspace</FixedKey>
        </div>

        <div className="keyboard-row">
          <FixedKey width={1.5}>Tab</FixedKey>
          {keyboardLayout.topRow.map((code) => (
            <KeyboardKey key={`key-${code}`} code={code} />
          ))}
          <KeyboardKey code={42} width={1.5} />
        </div>

        <div className="keyboard-row">
          <FixedKey width={1.75} className="mod-key">
            Caps Lock
          </FixedKey>
          {keyboardLayout.homeRow.map((code) => (
            <KeyboardKey key={`key-${code}`} code={code} />
          ))}
          <FixedKey width={2.4} className="mod-key">
            Enter
          </FixedKey>
        </div>

        <div className="keyboard-row">
          <FixedKey
            width={2.25}
            className={`mod-key ${shiftPressed ? "mod-active" : ""}`}
          >
            Shift
          </FixedKey>
          {keyboardLayout.bottomRow.map((code) => (
            <KeyboardKey key={`key-${code}`} code={code} />
          ))}
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
