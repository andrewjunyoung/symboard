import * as fs from "fs";

function generateKeyboardLayoutXML(config) {
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
        <!-- Default key maps would go here, but we're focusing on actions -->
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
            <when state="*" next="${state.name}"/>
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
    const keyboardConfig = readConfigFromFile("./config.json");

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
  } catch (error) {
    console.error("Failed to generate keyboard layout:", error);
    process.exit(1);
  }
}

main();
