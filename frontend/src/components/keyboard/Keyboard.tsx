import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import KeyboardLegend from "./KeyboardLegend";
import { loadKeylayoutFile } from "./parser";
import {
  getKeyOutputForLayer,
  getModifierString,
  findDeadKeySequence,
  isKeyDead,
} from "./Keylayout";
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

function isCombiningCharacter(text) {
  const ranges = [
    [0x0300, 0x036f], // Combining Diacritical Marks
    [0x1ab0, 0x1aff], // Combining Diacritical Marks Extended
    [0x1dc0, 0x1dff], // Combining Diacritical Marks Supplement
    [0x20d0, 0x20ff], // Combining Diacritical Marks for Symbols
  ];

  if (!text || text.length === 0) return false;
  const codePoint = text.codePointAt(0);
  if (!codePoint) return false;

  for (const [start, end] of ranges) {
    if (codePoint >= start && codePoint <= end) {
      return true;
    }
  }

  return false;
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

  const getKeyOutput = (code) => {
    return getKeyOutputForLayer(keylayout, currState, layer, code);
  };

  const checkIsDeadKey = (code) => {
    return isKeyDead(keylayout, currState, layer, code);
  };

  const KeyboardKey = ({ code, width = 1, height = 1, className = "" }) => {
    const isDead = checkIsDeadKey(code);
    const keyOutput = getKeyOutput(code);
    const isCombining = isCombiningCharacter(keyOutput);

    const keyClassName = `key ${className} ${
      !seeEverything && isDead ? "dead-key" : ""
    } ${!seeEverything && isCombining ? "combining-key" : ""}`;

    if (seeEverything) {
      const isDeadInLayer1 = isKeyDead(1, code);
      const isDeadInLayer2 = isKeyDead(2, code);
      const isDeadInLayer3 = isKeyDead(3, code);
      const isDeadInLayer4 = isKeyDead(4, code);

      const isCombiningInLayer1 = isCombiningCharacter(
        getKeyOutputForLayer(1, code)
      );
      const isCombiningInLayer2 = isCombiningCharacter(
        getKeyOutputForLayer(2, code)
      );
      const isCombiningInLayer3 = isCombiningCharacter(
        getKeyOutputForLayer(3, code)
      );
      const isCombiningInLayer4 = isCombiningCharacter(
        getKeyOutputForLayer(4, code)
      );

      return (
        <div
          className={keyClassName}
          style={{
            width: `${width * 60}px`,
            height: `${height * 60}px`,
          }}
        >
          <div className="detailed-key">
            <div
              className={`key-region key-region-nw ${isDeadInLayer1 ? "dead-region" : ""} ${isCombiningInLayer1 ? "combining-region" : ""}`}
            >
              <span>{getKeyOutputForLayer(1, code)}</span>
            </div>
            <div
              className={`key-region key-region-ne ${isDeadInLayer3 ? "dead-region" : ""} ${isCombiningInLayer3 ? "combining-region" : ""}`}
            >
              <span>{getKeyOutputForLayer(3, code)}</span>
            </div>
            <div
              className={`key-region key-region-sw ${isDeadInLayer4 ? "dead-region" : ""} ${isCombiningInLayer4 ? "combining-region" : ""}`}
            >
              <span>{getKeyOutputForLayer(4, code)}</span>
            </div>
            <div
              className={`key-region key-region-se ${isDeadInLayer2 ? "dead-region" : ""} ${isCombiningInLayer2 ? "combining-region" : ""}`}
            >
              <span>{getKeyOutputForLayer(2, code)}</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        className={keyClassName}
        style={{
          width: `${width * 60}px`,
          height: `${height * 60}px`,
        }}
      >
        <div className="key-content">{keyOutput}</div>
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
