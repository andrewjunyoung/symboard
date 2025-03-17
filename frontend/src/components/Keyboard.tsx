import React from "react";
import "./Keyboard.css";

interface KeyProps {
  children: React.ReactNode;
  width?: number; // Width in units (1 unit = standard key width)
  height?: number; // Height in units
  className?: string;
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
          <Key>
            ~<br />`
          </Key>
          <Key>
            !<br />1
          </Key>
          <Key>
            @<br />2
          </Key>
          <Key>
            #<br />3
          </Key>
          <Key>
            $<br />4
          </Key>
          <Key>
            %<br />5
          </Key>
          <Key>
            ^<br />6
          </Key>
          <Key>
            &<br />7
          </Key>
          <Key>
            *<br />8
          </Key>
          <Key>
            (<br />9
          </Key>
          <Key>
            )<br />0
          </Key>
          <Key>
            _<br />-
          </Key>
          <Key>
            +<br />=
          </Key>
          <Key width={2}>Backspace</Key>
        </div>

        {/* QWERTY row */}
        <div className="keyboard-row">
          <Key width={1.5}>Tab</Key>
          <Key>Q</Key>
          <Key>W</Key>
          <Key>E</Key>
          <Key>R</Key>
          <Key>T</Key>
          <Key>Y</Key>
          <Key>U</Key>
          <Key>I</Key>
          <Key>O</Key>
          <Key>P</Key>
          <Key>
            {"{"}
            <br />
            {"["}
          </Key>
          <Key>
            {"}"}
            <br />
            {"]"}
          </Key>
          <Key width={1.5}>
            |<br />\
          </Key>
        </div>

        {/* ASDF row */}
        <div className="keyboard-row">
          <Key width={1.75} className="mod-key">
            Caps Lock
          </Key>
          <Key>A</Key>
          <Key>S</Key>
          <Key>D</Key>
          <Key>F</Key>
          <Key>G</Key>
          <Key>H</Key>
          <Key>J</Key>
          <Key>K</Key>
          <Key>L</Key>
          <Key>
            :<br />;
          </Key>
          <Key>
            "<br />'
          </Key>
          <Key width={2.25} className="mod-key">
            Enter
          </Key>
        </div>

        {/* ZXCV row */}
        <div className="keyboard-row">
          <Key width={2.25} className="mod-key">
            Shift
          </Key>
          <Key>Z</Key>
          <Key>X</Key>
          <Key>C</Key>
          <Key>V</Key>
          <Key>B</Key>
          <Key>N</Key>
          <Key>M</Key>
          <Key>
            {"<"}
            <br />,
          </Key>
          <Key>
            {">"}
            <br />.
          </Key>
          <Key>
            ?<br />/
          </Key>
          <Key width={2.75} className="mod-key">
            Shift
          </Key>
        </div>

        {/* Bottom row */}
        <div className="keyboard-row">
          <Key width={1.25} className="mod-key">
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
          <Key width={1.25} className="mod-key">
            Ctrl
          </Key>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
