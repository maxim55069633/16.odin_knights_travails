const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h"];

class position {
  deep_copy_steps(previous_steps) {
    let new_record_steps = [];
    for (let i = 0; i < previous_steps.length; i++)
      new_record_steps.push(previous_steps[i]);
    return new_record_steps;
  }

  constructor(row, column, previous_steps = [], possible_next_step = []) {
    this.row = row;
    this.column = column;
    this.previous_steps = this.deep_copy_steps(previous_steps);
    this.possible_next_step = possible_next_step;
  }
}

const chess_game = (() => {
  const game_board = document.querySelector(".chess_board");
  let start_square;
  let end_square;
  let min_step = 63;
  let success_record = [];

  const select_start_and_end_squares = () => {
    start_square = new position(0, 1);
    start_square.previous_steps.push(start_square);
    const start_square_div = document.getElementById("01");
    start_square_div.style.backgroundColor = "green";

    end_square = new position(4, 4);
    const end_square_div = document.getElementById("44");
    end_square_div.style.backgroundColor = "yellow";
  };

  //   initialize the gameboard
  const create_chess_board = () => {
    for (let i = 7; i >= 0; i--) {
      const row = document.createElement("div");
      for (let j = 0; j < 8; j++) {
        const square = document.createElement("div");

        square.setAttribute("id", `${i}` + `${j}`);
        square.row = i;
        square.column = j;

        square.classList.add("square");
        if ((i + j) % 2 == 0) square.classList.add("gray");
        if (i == 0) square.classList.add(`column${j + 1}`);
        row.appendChild(square);
      }
      row.classList.add("row");
      row.classList.add(`row${i + 1}`);
      game_board.appendChild(row);
    }

    select_start_and_end_squares();
  };

  create_chess_board();

  // attention, here the parameter is the reference of the argument
  const is_legal_move = (next_move) => {
    if (
      next_move.row > 7 ||
      next_move.row < 0 ||
      next_move.column > 7 ||
      next_move.column < 0
    )
      return false;

    const previous_steps_array = next_move.previous_steps;
    for (let i = 0; i < previous_steps_array.length; i++) {
      if (
        previous_steps_array[i].row == next_move.row &&
        previous_steps_array[i].column == next_move.column
      )
        return false;
    }

    next_move.previous_steps.push(next_move);
    return true;
  };

  const next_move = (
    // attention, here the parameter is the reference of the argument
    current_square = start_square
  ) => {
    //   Every time the knight moves, there are at most 8 places it can go
    let next_move_1 = new position(
      current_square.row + 2,
      current_square.column - 1,
      current_square.previous_steps
    );
    if (is_legal_move(next_move_1))
      current_square.possible_next_step.push(next_move_1);

    let next_move_2 = new position(
      current_square.row + 1,
      current_square.column - 2,
      current_square.previous_steps
    );
    if (is_legal_move(next_move_2))
      current_square.possible_next_step.push(next_move_2);

    let next_move_3 = new position(
      current_square.row - 1,
      current_square.column - 2,
      current_square.previous_steps
    );
    if (is_legal_move(next_move_3))
      current_square.possible_next_step.push(next_move_3);

    let next_move_4 = new position(
      current_square.row - 2,
      current_square.column - 1,
      current_square.previous_steps
    );
    if (is_legal_move(next_move_4))
      current_square.possible_next_step.push(next_move_4);

    let next_move_5 = new position(
      current_square.row + 2,
      current_square.column + 1,
      current_square.previous_steps
    );
    if (is_legal_move(next_move_5))
      current_square.possible_next_step.push(next_move_5);

    let next_move_6 = new position(
      current_square.row + 1,
      current_square.column + 2,
      current_square.previous_steps
    );
    if (is_legal_move(next_move_6))
      current_square.possible_next_step.push(next_move_6);

    let next_move_7 = new position(
      current_square.row - 1,
      current_square.column + 2,
      current_square.previous_steps
    );
    if (is_legal_move(next_move_7))
      current_square.possible_next_step.push(next_move_7);

    let next_move_8 = new position(
      current_square.row - 2,
      current_square.column + 1,
      current_square.previous_steps
    );
    if (is_legal_move(next_move_8))
      current_square.possible_next_step.push(next_move_8);

    const next_round = current_square.possible_next_step;

    let path_found = false;
    for (let i = 0; i < next_round.length; i++) {
      if (
        next_round[i].row == end_square.row &&
        next_round[i].column == end_square.column
      ) {
        min_step = next_round[i].previous_steps.length - 1;

        success_record = [];
        next_round[i].previous_steps.forEach((element) => {
          success_record.push(new position(element.row, element.column));
        });

        path_found = true;
        break;
      }
    }

    if (path_found == false) {
      for (let i = 0; i < next_round.length; i++) {
        if (next_round[i].previous_steps.length >= min_step) continue;
        if (next_move(next_round[i])) break;
      }
    }

    console.log(success_record);

    return path_found;
  };

  const output = () => {
    next_move();

    const output = document.querySelector(".output_steps");
    output.textContent = `You made it in ${min_step} moves!  Here's your path:`;
    success_record.forEach((element) => {
      const step = document.createElement("p");
      step.textContent = `[${element.row + 1},${alphabet[element.column]}]`;
      output.appendChild(step);
    });
  };

  return {
    start_square,
    end_square,
    next_move,
    output,
  };
})();

chess_game.output();
