import { useState } from "react";

const colors = [
  { id: 1, text: "红" },
  { id: 2, text: "蓝" },
  { id: 3, text: "绿" },
  { id: 4, text: "灰", isDisabled: true },
];

function FormInputBindings() {
  const [text, setText] = useState("示例文字");
  const [checked, setChecked] = useState(["apple", "banana"]);
  const [picked, setPicked] = useState("red");
  const [selectedColorId, setSelectedColorId] = useState(2);

  function handleChange(event) {
    setText(event.target.value);
  }

  function handleCheckedChange(event) {
    const value = event.target.value;

    // 如果已选中，则从数组中移除；否则添加到数组
    setChecked((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }

  function handleRadioChange(event) {
    setPicked(event.target.value);
  }

  function handleChange(event) {
    setSelectedColorId(event.target.value);
  }

  return (
    <>
      <p>{text}</p>
      <input type="text" value={text} onChange={handleChange} />
      <p>{checked.join(",")}</p>
      <input
        type="checkbox"
        value="apple"
        checked={checked.includes("apple")}
        onChange={handleCheckedChange}
      />
      <label>Apple</label>
      <input
        type="checkbox"
        value="banana"
        checked={checked.includes("banana")}
        onChange={handleCheckedChange}
      />
      <label>Banana</label>
      <input
        type="checkbox"
        value="orange"
        checked={checked.includes("orange")}
        onChange={handleCheckedChange}
      />
      <label>Orange</label>
      {picked}
      <input
        type="radio"
        checked={picked == "red"}
        value="red"
        onChange={handleRadioChange}
      />
      <label>red</label>
      <input
        type="radio"
        checked={picked == "blue"}
        value="blue"
        onChange={handleRadioChange}
      />
      <label>blue</label>

      {selectedColorId}
      <select value={selectedColorId} onChange={handleChange}>
        {colors.map((color) => (
          <option key={color.id} value={color.id} disabled={color.isDisabled}>
            {color.text}
          </option>
        ))}
      </select>
    </>
  );
}

export default FormInputBindings;
