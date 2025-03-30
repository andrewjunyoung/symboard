import * as fs from "fs";

function extractKeyMapSetFromXML(filePath) {
  try {
    const xmlContent = fs.readFileSync(filePath, "utf8");

    // Extract the keyMapSet content using regex
    const keyMapSetMatch = /<keyMapSet id="ANSI">([\s\S]*?)<\/keyMapSet>/i.exec(
      xmlContent
    );

    if (keyMapSetMatch && keyMapSetMatch[1]) {
      return keyMapSetMatch[1].trim();
    } else {
      throw new Error("Could not find keyMapSet in the XML file");
    }
  } catch (error) {
    throw new Error(`Failed to read or parse XML file: ${error.message}`);
  }
}

function generateKeyboardLayoutXML(config) {
  const keyMapSet = extractKeyMapSetFromXML("./data/dvorak.xml");

  // Create a mapping of qwertyTriggerKeys to the corresponding language state actions
  const triggerKeyMap = {};
  config.states.forEach((state, index) => {
    if (state.triggerState && state.qwertyTriggerKey) {
      triggerKeyMap[state.qwertyTriggerKey.toLowerCase()] = `F${index + 1}`;
    }
  });

  // Generate keyMap for index="6" (Control key combinations)
  let keyMap6 = '<keyMap index="6">\n';

  // Add keys for a-z with appropriate actions based on triggerKeys
  // Using correct macOS key codes for QWERTY layout in decimal
  const qwertyKeyMap = {
    q: "12",
    w: "13",
    e: "14",
    r: "15",
    t: "17",
    y: "16",
    u: "32",
    i: "34",
    o: "31",
    p: "35",
    a: "0",
    s: "1",
    d: "2",
    f: "3",
    g: "5",
    h: "4",
    j: "38",
    k: "40",
    l: "37",
    z: "6",
    x: "7",
    c: "8",
    v: "9",
    b: "11",
    n: "45",
    m: "46",
  };

  const dvorakKeyMap = {
    p: "15",
    y: "17",
    f: "16",
    g: "32",
    c: "34",
    r: "31",
    l: "35",
    a: "0",
    o: "1",
    e: "2",
    u: "3",
    i: "5",
    d: "4",
    h: "38",
    t: "40",
    n: "37",
    s: "41",
    q: "7",
    j: "8",
    k: "9",
    x: "11",
    b: "45",
    m: "46",
    w: "43",
    v: "47",
    z: "44",
  };
  const keyMap = dvorakKeyMap;

  // Generate key elements for all letters
  for (const [char, code] of Object.entries(keyMap)) {
    if (triggerKeyMap[char]) {
      keyMap6 += `        <key code="${code}" action="${triggerKeyMap[char]}"/>\n`;
    } else {
      keyMap6 += `        <key code="${code}" output=""/>\n`;
    }
  }

  // Add keys for 0-9 with empty output
  const numberCodes = [
    "29",
    "18",
    "19",
    "20",
    "21",
    "23",
    "22",
    "26",
    "28",
    "25",
  ]; // 0-9 in order
  for (const code of numberCodes) {
    keyMap6 += `        <key code="${code}" output=""/>\n`;
  }

  // Add other common keys with empty output
  // These would be punctuation and special keys
  keyMap6 += `        <key code="36" output=""/>\n`; // =
  keyMap6 += `        <key code="39" output=""/>\n`; // -
  keyMap6 += `        <key code="51" output=""/>\n`; // [
  keyMap6 += `        <key code="48" output=""/>\n`; // ]
  keyMap6 += `        <key code="57" output=""/>\n`; // ;
  keyMap6 += `        <key code="65" output=""/>\n`; // ,
  keyMap6 += `        <key code="67" output=""/>\n`; // .
  keyMap6 += `        <key code="66" output=""/>\n`; // /
  keyMap6 += `        <key code="68" output=""/>\n`; // \
  keyMap6 += `        <key code="54" output=""/>\n`; // return
  keyMap6 += `        <key code="73" output=""/>\n`; // space

  keyMap6 += "    </keyMap>";

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE keyboard SYSTEM "file://localhost/System/Library/DTDs/KeyboardLayout.dtd">
<keyboard group="126" id="${config.id}" name="${config.name}" maxout="4">
    <layouts>
        <layout first="0" last="0" mapSet="ANSI" modifiers="commonModifiers"/>
    </layouts>
    <modifierMap id="commonModifiers" defaultIndex="4">
        <!-- Standard modifier configurations -->
        <keyMapSelect mapIndex="0">
            <modifier keys="anyShift? caps? command"/>
        </keyMapSelect>
        <keyMapSelect mapIndex="1">
            <modifier keys="anyShift caps?"/>
            <modifier keys="anyShift? caps"/>
        </keyMapSelect>
        <keyMapSelect mapIndex="2">
            <modifier keys="anyOption"/>
        </keyMapSelect>
        <keyMapSelect mapIndex="3">
            <modifier keys="anyShift caps? anyOption command?"/>
        </keyMapSelect>
        <keyMapSelect mapIndex="4">
            <modifier keys=""/>
        </keyMapSelect>
        <keyMapSelect mapIndex="5">
            <modifier keys="anyOption? command"/>
        </keyMapSelect>
        <keyMapSelect mapIndex="6">
            <modifier keys="caps? anyOption? command? anyControl"/>
        </keyMapSelect>
    </modifierMap>
    <keyMapSet id="ANSI">
      ${keyMapSet}
      ${keyMap6}
    </keyMapSet>
    <actions>`;

  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(97 + i); // 'a' starts at 97 in ASCII
    xml += `
        <action id="${char}">
            <when state="none" output="${char}"/>`;

    config.states.forEach((state) => {
      if (state["a-z"] && i < state["a-z"].length) {
        const output = state["a-z"][i] || "";
        xml += `
            <when state="${state.name}" next="${state.name}" output="${output}"/>`;
      }
    });

    xml += `
        </action>`;
  }

  for (let i = 0; i < 26; i++) {
    const char = String.fromCharCode(65 + i); // 'A' starts at 65 in ASCII
    xml += `
        <action id="${char}">
            <when state="none" output="${char}"/>`;

    config.states.forEach((state) => {
      if (state["A-Z"] && i < state["A-Z"].length) {
        const output = state["A-Z"][i] || "";
        xml += `
            <when state="${state.name}" next="${state.name}" output="${output}"/>`;
      }
    });

    xml += `
        </action>`;
  }

  for (let i = 0; i < 10; i++) {
    const char = String(i);
    xml += `
        <action id="${char}">
            <when state="none" output="${char}"/>`;

    config.states.forEach((state) => {
      if (state["0-9"] && i < state["0-9"].length) {
        const output = state["0-9"][i] || "";
        xml += `
            <when state="${state.name}" next="${state.name}" output="${output}"/>`;
      }
    });

    xml += `
        </action>`;
  }

  config.states.forEach((state, index) => {
    xml += `
        <action id="F${index + 1}">
            <when state="none" next="${state.name}"/>
        </action>`;
  });

  xml += `
    </actions>
    <terminators>`;

  config.states.forEach((state) => {
    if (state.terminator) {
      xml += `
        <when state="${state.name}" output="${state.terminator}"/>`;
    }
  });

  xml += `
    </terminators>
</keyboard>`;

  return xml;
}

function readConfigFromFile(filePath) {
  try {
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    throw new Error(`Failed to read or parse config file: ${error.message}`);
  }
}

function main() {
  try {
    const keyboardConfig = readConfigFromFile("./test/config.json");

    // Validate the new properties
    keyboardConfig.states.forEach((state, index) => {
      if (state.triggerState && !state.qwertyTriggerKey) {
        console.warn(
          `Warning: State "${state.name}" has triggerState but no qwertyTriggerKey defined`
        );
      }
      if (!state.triggerState && state.qwertyTriggerKey) {
        console.warn(
          `Warning: State "${state.name}" has qwertyTriggerKey but no triggerState defined`
        );
      }
    });

    const xmlOutput = generateKeyboardLayoutXML(keyboardConfig);

    const outputFilename = `${keyboardConfig.name.replace(/\s+/g, "_")}.keylayout`;
    fs.writeFileSync(outputFilename, xmlOutput);

    console.log(
      `Keyboard layout for "${keyboardConfig.name}" with ${keyboardConfig.states.length} language states successfully generated.`
    );
    console.log(`Output saved to: ${outputFilename}`);
    console.log(
      `States: ${keyboardConfig.states.map((state) => state.name).join(", ")}`
    );

    // Log trigger keys information
    const triggerInfo = keyboardConfig.states
      .filter((state) => state.triggerState && state.qwertyTriggerKey)
      .map((state) => `${state.name}: Ctrl+${state.qwertyTriggerKey}`);

    if (triggerInfo.length > 0) {
      console.log(`Trigger combinations: ${triggerInfo.join(", ")}`);
    }
  } catch (error) {
    console.error("Failed to generate keyboard layout:", error);
    process.exit(1);
  }
}

main();
