import './board.css';

//This will let us track which num has come in which col or sector just like a memory
import Memo2D from '../lib/memo2D';
import { getSector } from '../utils/utils';

export default class Board {
	//Previously edited cell in the dom
	prev = null;

	//1D array
	board = new Array(9);

	//1000
	speed = 10; //time difference between two cells should be

	row = null;
	column = null;
	sector = null;

	solved = false; //Will set to true once the board is solved

	setCellValue = (row, column, value, visualizeMode = true) => {
		const cell = this.board[row][column];

		cell.value = value;

		if (+cell.$el.innerText != value) {
			cell.$el.innerText = value;
		}

		if (visualizeMode) {
			if (this.prev) {
				this.prev.classList.remove('current');
			}

			cell.$el.classList.add('current');
			this.prev = cell.$el;
		}
	};

	setUpMemo = () => {
		this.board.forEach((boardRow, i) =>
			boardRow.forEach((cell, j) => {
				if (cell.value !== '') {
					if (
						!this.row.setVal(i, cell.value, true) ||
						!this.column.setVal(j, cell.value, true) ||
						!this.sector.setVal(getSector(i, j), cell.value, true)
					) {
						throw new Error('Incorrect Board!');
					}
				}
			})
		);
	};

	createNewMemo = () => {
		this.row = new Memo2D();
		this.column = new Memo2D();
		this.sector = new Memo2D();

		this.setUpMemo();
		return true;

		// try {
		// 	this.setUpMemo();
		// 	return true;
		// } catch (err) {
		// 	alert('HELLO');
		// 	return false;
		// }
	};

	getFirstUnsolved = (row, column) => {
		for (let i = row; i < 9; i += 1) {
			for (let j = i === row ? column : 0; j < 9; j += 1) {
				const { value } = this.board[i][j];

				if (value === '') {
					return [i, j];
				}
			}
		}
		return [false, false];
	};

	tryOne = (row, column, sector, num) =>
		new Promise((resolve) => {
			this.row.setVal(row, num, true);
			this.column.setVal(column, num, true);
			this.sector.setVal(sector, num, true);
			this.setCellValue(row, column, num, 'solved');

			setTimeout(() => {
				this.solveBoard(row, column).then((res) => {
					if (!res) {
						this.row.setVal(row, num, false);
						this.column.setVal(column, num, false);
						this.sector.setVal(sector, num, false);
						this.setCellValue(row, column, '', 'fault');
					}

					resolve(res);
				});
			}, this.speed);
		});

	solveBoard = async (row = 0, column = 0) => {
		const [x, y] = this.getFirstUnsolved(row, column);

		if (x === false && y === false) {
			return true;
		}

		const s = getSector(x, y);

		let solved = false;

		for (let i = 1; i <= 9; i += 1) {
			if (
				!this.row.checkIfIn(x, i) &&
				!this.column.checkIfIn(y, i) &&
				!this.sector.checkIfIn(s, i)
			) {
				solved = await this.tryOne(x, y, s, i);
			}

			if (solved) {
				this.solved = true;
				break;
			}
		}
		return solved;
	};
	//async as we want to show the animation effect of solving
	setUpBeforeAndSolve = async (event) => {
		this.solved = false;

		if (this.createNewMemo()) {
			//Won't be able to click "SOLVE BTN" while we are solving the board
			event.target.setAttribute('disabled', true);
			await this.solveBoard(); //Main function
			event.target.setAttribute('disabled', false); //removeattribute

			if (!this.solved) {
				alert('Board is not solvable');
			}
		}
	};

	handleSpeedInput = ({ target: { value } }) => {
		this.speed = +value;
	};

	handleInput = (event) => {
		// e.target.value
		const { target: element } = event; //Destructuring

		const { innerText: value, id } = element;

		const [x, y] = id.split('-');

		//Entered Wrong value ,check using regex
		if (value.length !== 0 && !/^[1-9]$/.test(value)) {
			this.setCellValue(x, y, '', false);
			return;
		}

		this.setCellValue(x, y, value.length === 0 ? '' : +value, false);
	};

	handleInputFromArray = (value) => {
		try {
			const arr = JSON.parse(value);
			arr.forEach((row, i) =>
				row.forEach((cell, j) =>
					this.setCellValue(i, j, cell === '.' ? '' : +cell, false)
				)
			);
		} catch (err) {
			alert('WRONG INPUT');
		}
	};

	render = () => {
		//Added a row of 9 cols to each outer row --> 2d Array 9*9
		for (let i = 0; i < 9; i++) {
			this.board[i] = new Array(9);
		}

		const table = document.createElement('table');

		for (let i = 0; i < 9; i++) {
			const tr = document.createElement('tr');

			for (let j = 0; j < 9; j++) {
				const td = document.createElement('td');

				td.addEventListener('input', this.handleInput);
				td.setAttribute('id', `${i}-${j}`);
				td.contentEditable = true;

				tr.appendChild(td);

				//store the object
				this.board[i][j] = {
					$el: td, //$el will point to table cell
					value: '',
				};
			}

			table.appendChild(tr);
		}
		return table;
	};
}
