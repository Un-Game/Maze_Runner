import Matter from "matter-js";

export default function mazeGenerator(){

    const { Bodies } = Matter;

    const map = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
}