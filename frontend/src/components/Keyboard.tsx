import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./Keyboard.css";

interface KeyProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
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
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);

  // Search bar properties
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  useImperativeHandle(ref, () => ({
    searchKeyOutput: (query: string) => {
      if (!keylayout) return;

      const result = findKeyByOutput(keylayout, query);
      setSearchResult(result);

      if (result) {
        console.log("Found key:", result);
        // You could also highlight the key here
      } else {
        console.log("No results found for:", query);
      }
    },
  }));

  const handleSearch = () => {
    if (!searchQuery.trim() || !keylayout) return;

    const result = findKeyByOutput(keylayout, searchQuery);
    setSearchResult(result);

    // Highlight the found key if available
    if (result) {
      // Implementation depends on how you want to highlight
      console.log("Found key:", result);
    }
  };

  function findKeyByOutput(keylayout, searchOutput) {
    // Search through all keyMaps
    console.log("maps", keylayout);
    for (const indexKey in keylayout.keyMaps) {
      const keyMap = keylayout.keyMaps[indexKey];

      for (const codeKey in keyMap) {
        const keyData = keyMap[codeKey];

        // Check if output matches search term
        if (
          keyData.output === searchOutput ||
          keyData.action === searchOutput
        ) {
          return {
            index: indexKey,
            code: codeKey,
          };
        }
      }
    }

    return results;
  }

  const scriptSamples = {
    arab: "ابجد",
    grek: "αβγδ",
    deva: "अआइई",
    cans: "ᐁᐯᑕᑫ",
    hira: "あいうえ",
    khmr: "កខគឃ",
    tibt: "ཀཁགང",
    mymr: "ကခဂဃ",
    taml: "அஆஇஈ",
    thaa: "ހށނރ",
    geez: "ሀለሐመ",
    cyrl: "АБВГ",
    kata: "アイウエ",
    hebr: "אבגד",
    tfng: "ⴰⴱⴲⴳ",
    sinh: "අආඇඈ",
    beng: "অআইঈ",
    mong: "ᠠᠡᠢᠣ",
    thai: "กขฃค",
    laoo: "ກຂຄງ",
  };

  const getKeyOutput = (code) => {
    if (
      !keylayout ||
      !keylayout.keyMaps[layer] ||
      !keylayout.keyMaps[layer][code]
    ) {
      return "X";
    }
    var text =
      keylayout.keyMaps[layer][code].output ||
      keylayout.keyMaps[layer][code].action ||
      "X";

    if (text in scriptSamples) {
      text += "\n" + scriptSamples[text];
    }

    return text;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Alt") {
        setAltPressed(true);
        return;
      }
      if (event.key === "Control") {
        setCtrlPressed(true);
        return;
      }
      if (event.key === "Shift") {
        setShiftPressed(true);
        return;
      }
    };

    const handleKeyUp = (event) => {
      if (event.key === "Alt") {
        setAltPressed(false);
        return;
      }
      if (event.key === "Control") {
        setCtrlPressed(false);
        return;
      }
      if (event.key === "Shift") {
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
    // Ctrl overrides all other keys
    if (ctrlPressed) {
      layer = 6;
    }
    setLayer(layer);
  }, [altPressed, ctrlPressed, shiftPressed]);

  useEffect(() => {
    const fetchKeylayout = async () => {
      const filePath = "/layout.keylayout";
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
          <Key>{getKeyOutput(50)}</Key>
          <Key>{getKeyOutput(89)}</Key>
          <Key>{getKeyOutput(91)}</Key>
          <Key>{getKeyOutput(92)}</Key>
          <Key>{getKeyOutput(86)}</Key>
          <Key>{getKeyOutput(87)}</Key>
          <Key>{getKeyOutput(88)}</Key>
          <Key>{getKeyOutput(83)}</Key>
          <Key>{getKeyOutput(84)}</Key>
          <Key>{getKeyOutput(85)}</Key>
          <Key>{getKeyOutput(82)}</Key>
          <Key>{getKeyOutput(27)}</Key>
          <Key>{getKeyOutput(24)}</Key>
          <Key width={2}>Backspace</Key>
        </div>

        {/* QWERTY row */}
        <div className="keyboard-row">
          <Key width={1.5}>Tab</Key>
          <Key>{getKeyOutput(0)}</Key>
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

        {/* ASDF row */}
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

        {/* ZXCV row */}
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

        {/* Bottom row */}
        <div className="keyboard-row">
          <Key
            width={1.5}
            className={`mod-key ${ctrlPressed ? "mod-active" : ""}`}
          >
            Ctrl
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
            className={`mod-key ${ctrlPressed ? "mod-active" : ""}`}
          >
            Ctrl
          </Key>
        </div>
      </div>
    </div>
  );
});

export default Keyboard;
