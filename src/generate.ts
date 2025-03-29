interface KeyboardState {
  name: string;
  "a-z"?: string;
  "A-Z"?: string;
  "0-9"?: string;
  continuous?: boolean;
  terminator?: string;
}

function generateKeyboardLayoutXML(state: KeyboardState): string {
  // Start building the XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE keyboard SYSTEM "file://localhost/System/Library/DTDs/KeyboardLayout.dtd">
<keyboard group="126" id="-29012" name="${state.name} keyboard" maxout="4">
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

  // Generate lowercase letter actions
  if (state["a-z"]) {
    const lowercase = state["a-z"];
    for (let i = 0; i < 26 && i < lowercase.length; i++) {
      const char = String.fromCharCode(97 + i); // 'a' starts at 97 in ASCII
      const output = lowercase[i] || "";
      xml += `
        <action id="${char}">
            <when state="none" output="${char}"/>
            <when state="${state.name}" next="${state.name}" output="${output}"/>
        </action>`;
    }
  }

  // Generate uppercase letter actions
  if (state["A-Z"]) {
    const uppercase = state["A-Z"];
    for (let i = 0; i < 26 && i < uppercase.length; i++) {
      const char = String.fromCharCode(65 + i); // 'A' starts at 65 in ASCII
      const output = uppercase[i] || "";
      xml += `
        <action id="${char}">
            <when state="none" output="${char}"/>
            <when state="${state.name}" next="${state.name}" output="${output}"/>
        </action>`;
    }
  }

  // Generate number actions
  if (state["0-9"]) {
    const numbers = state["0-9"];
    for (let i = 0; i < 10 && i < numbers.length; i++) {
      const char = String(i);
      const output = numbers[i] || "";
      xml += `
        <action id="${char}">
            <when state="none" output="${char}"/>
            <when state="${state.name}" next="${state.name}" output="${output}"/>
        </action>`;
    }
  }

  // Close actions and add terminators
  xml += `
    </actions>
    <terminators>`;

  // Add terminator for the state
  if (state.terminator) {
    xml += `
        <when state="${state.name}" output="${state.terminator}"/>`;
  }

  // Close the XML structure
  xml += `
    </terminators>
</keyboard>`;

  return xml;
}

// Example usage
const arabState: KeyboardState = {
  name: "arab",
  "a-z": "ابثدخفغحيجكلمنهپقرستوظطشضز",
  "A-Z": "ى چضےڤگخیژخا ںةڅږصط. ښچا ظ",
  "0-9": "٠١٢٣٤٥٦٧٨٩",
  continuous: true,
  terminator: "ا",
};

// Generate and log the XML
const xmlOutput = generateKeyboardLayoutXML(arabState);
console.log(xmlOutput);
