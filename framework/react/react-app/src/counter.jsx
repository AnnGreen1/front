import { useState } from "react";

// React：闭包捕获的是"快照"
function Counter() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // 这个函数在 count=0 时创建
    // 捕获的 count 就是 0，不会变
    console.log(count); // 永远是创建时的值
    setCount(count + 1); // 0 + 1 = 1
    setCount(count + 1); // 0 + 1 = 1  ← 不是 1 + 1 = 2
    setCount(count + 1); // 0 + 1 = 1  ← 不是 2 + 1 = 3
    // 结果：count 变成 1，不是 3
  };

  // 每次渲染都会创建新的 handleClick
  // 新的 handleClick 捕获新的 count 值
  return <button onClick={handleClick}>{count}</button>;
}

// // 解决：用函数式更新
// setCount(prev => prev + 1)   // 不依赖闭包里的 count

export default Counter;
