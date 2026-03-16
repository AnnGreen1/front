function RenderingLists() {
  const list = [1, 2, 3, 4, 5];
  return (
    <>
      <ul>
        {list.map((num) => (
          <li key={num}>{num}</li>
        ))}
      </ul>
    </>
  );
}

export default RenderingLists;
