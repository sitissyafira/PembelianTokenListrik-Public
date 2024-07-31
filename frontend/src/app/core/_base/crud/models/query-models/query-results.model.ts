export class QueryResultsModel {
	// fields
	items: any[];
	data: any[];
	totalCount: number;
	errorMessage: string;


	// tslint:disable-next-line:variable-name
	constructor(_items: any[] = [], _totalCount: number = 0, _errorMessage: string = '', _data: any[] = []) {
		this.items = _items;
		this.data = _items;
		this.totalCount = _totalCount;
	}
}
