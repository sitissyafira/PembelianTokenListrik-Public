export class QueryResultsModelUpd {
	// fields
	items: any[];
	data: any[];
	totalCount: number;
	allTotalCount: number
	allBillingAmount: number;
	errorMessage: string;

	// tslint:disable-next-line:variable-name
	constructor(_items: any[] = [],_allTotalCount:number = 0, _totalCount: number = 0, _allBillingAmount: number = 0, _errorMessage: string = '', _data: any[] = []) {
		this.items = _items;
		this.data = _items;
		this.totalCount = _totalCount;
		this.allTotalCount = _allTotalCount;
		this.allBillingAmount = _allBillingAmount;
	}
}

