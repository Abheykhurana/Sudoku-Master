import './style/util.css';
import './style/style.css';
import Board from './components/board';

const board = new Board();

const grid = document.querySelector('#main');

//CREATING TABLE
grid.appendChild(board.render());

const arrBtn = document.querySelector('#addArrayButton');

// console.log(InputText);
// board.handleInputFromArray()
arrBtn.addEventListener('click', () => {
	const InputText = document.querySelector('#arrayInput').value;
	console.log(InputText);
	board.handleInputFromArray(InputText);
});

const solveBtn = document.querySelector('#solve');

solveBtn.addEventListener('click', board.setUpBeforeAndSolve);

const speedInp = document.querySelector('#speed');

speedInp.addEventListener('input', board.handleSpeedInput);
