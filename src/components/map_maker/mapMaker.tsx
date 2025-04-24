import { useState } from "react";
import BackButton from "../_components/back_button";

type props = {
  setMenuState: React.Dispatch<React.SetStateAction<string>>;
};

export default function MapMaker(props: props) {
  const { setMenuState } = props;

  const [mouseActive, setMouseActive] = useState(false);
  const size = {
    width: 50,
    height: 50,
  };

  const [grid, setGrid] = useState(() =>
    Array.from({ length: size.height }, () =>
      Array.from({ length: size.width }, () => 0)
    )
  );

  const setArray = (row: number, col: number) => {
    if (!mouseActive) return;

    setGrid((prev) => {
      const newGrid = prev.map((rowArr) => [...rowArr]); // deep copy
      newGrid[row][col] === 0
        ? (newGrid[row][col] = 1)
        : (newGrid[row][col] = 0);
      return newGrid;
    });
    console.log(`Row: ${row}, Col: ${col}`);
  };

  const goArray = (row: number, col: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((rowArr) => [...rowArr]); // deep copy
      newGrid[row][col] === 0
        ? (newGrid[row][col] = 1)
        : (newGrid[row][col] = 0);
      return newGrid;
    });
    console.log(`Row: ${row}, Col: ${col}`);
  };

  window.addEventListener("onMouseDown", () => {
    setMouseActive(true);
  });

  console.log(mouseActive);

  return (
    <div>
      <BackButton setMenuState={setMenuState} />
      <div
        className="w-screen h-screen flex items-center justify-center"
        onMouseDown={() => setMouseActive(true)}
        onMouseUp={() => setMouseActive(false)}
      >
        <div className="absolute border border-green-400 w-[1500px] h-[900px] mt-[-100px] bg-white/50">
          {grid.map((rowData, row) => (
            <div key={`row-${row}`} style={{ display: "flex" }}>
              {rowData.map((cell, col) => (
                <div
                  key={`col-${col}`}
                  style={{
                    width: 15,
                    height: 15,
                    border: "1px solid black",
                    backgroundColor: cell === 1 ? "black" : "transparent",
                  }}
                  onMouseEnter={() => setArray(row, col)}
                  onMouseDown={() => goArray(row, col)}
                />
              ))}
            </div>
          ))}
          <button
            className="bg-black m-[50px] text-[20px] py-[10px] px-[15px] rounded-xl"
            onClick={() => {
              console.log(grid);
            }}
          >
            finish
          </button>
        </div>
      </div>
    </div>
  );
}
