import React, { useState, useEffect } from "react";
import "./Keyboard.css";

interface KeyProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  className?: string;
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

const Keyboard: React.FC = () => {
  const [keylayout, setKeylayout] = useState(null);

  useEffect(() => {
    const fetchKeylayout = async () => {
      const filePath = "/layout.keylayout";
      const result = await loadKeylayoutFile(filePath);

      if (result) {
        console.log("Keylayout Object:", result);
        console.log("Key map for index 0:", result.keyMaps["0"]["0"].output);
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
          <div className="key-spacer small"></div>
          <Key className="function-key">F1</Key>
          <Key className="function-key">F2</Key>
          <Key className="function-key">F3</Key>
          <Key className="function-key">F4</Key>
          <div className="key-spacer small"></div>
          <Key className="function-key">F5</Key>
          <Key className="function-key">F6</Key>
          <Key className="function-key">F7</Key>
          <Key className="function-key">F8</Key>
          <div className="key-spacer small"></div>
          <Key className="function-key">F9</Key>
          <Key className="function-key">F10</Key>
          <Key className="function-key">F11</Key>
          <Key className="function-key">F12</Key>
        </div>

        {/* Number row */}
        <div className="keyboard-row">
          <Key>{keylayout ? keylayout.keyMaps["0"]["50"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["89"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["91"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["92"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["86"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["87"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["88"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["83"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["84"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["85"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["82"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["0"].output : "X"}
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["0"].output : "X"}
          </Key>
          <Key width={2}>Backspace</Key>
        </div>

        {/* QWERTY row */}
        <div className="keyboard-row">
          <Key width={1.5}>Tab</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["0"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["13"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["14"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["15"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["16"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["17"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["32"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["34"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["31"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["35"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["33"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["30"].output : "X"}</Key>
          <Key width={1.5}>
            {keylayout ? keylayout.keyMaps["0"]["42"].output : "X"}
          </Key>
        </div>

        {/* ASDF row */}
        <div className="keyboard-row">
          <Key width={1.75} className="mod-key">
            Caps Lock
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["0"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["1"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["2"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["3"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["5"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["4"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["38"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["40"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["37"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["41"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["39"].output : "X"}</Key>
          <Key width={2.4} className="mod-key">
            Enter
          </Key>
        </div>

        {/* ZXCV row */}
        <div className="keyboard-row">
          <Key width={2.25} className="mod-key">
            Shift
          </Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["6"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["7"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["8"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["9"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["11"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["45"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["46"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["43"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["47"].output : "X"}</Key>
          <Key>{keylayout ? keylayout.keyMaps["0"]["44"].output : "X"}</Key>
          <Key width={3} className="mod-key">
            Shift
          </Key>
        </div>

        {/* Bottom row */}
        <div className="keyboard-row">
          <Key width={1.5} className="mod-key">
            Ctrl
          </Key>
          <Key width={1.25} className="mod-key">
            Win
          </Key>
          <Key width={1.25} className="mod-key">
            Alt
          </Key>
          <Key width={6.25}>Space</Key>
          <Key width={1.25} className="mod-key">
            Alt
          </Key>
          <Key width={1.25} className="mod-key">
            Win
          </Key>
          <Key width={1.25} className="mod-key">
            Menu
          </Key>
          <Key width={1.6} className="mod-key">
            Ctrl
          </Key>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
