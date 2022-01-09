export default class Memo2D {
	store = new Map();

	checkIfIn = (pos, value) =>
		this.store.get(pos) && this.store.get(pos).get(value);

	setVal = (row, column, value) => {
		//If the row exists
		if (this.store.get(row)) {
			//Entering value & if there already exists a value--> cell is not empty
			if (value && this.store.get(row).get(column)) {
				return false;
			}

			this.store.get(row).set(column, value);
			return true;
		}

		//Internal map doesn't exists
		this.store.set(row, new Map([[column, value]]));
		return true;
	};
}
