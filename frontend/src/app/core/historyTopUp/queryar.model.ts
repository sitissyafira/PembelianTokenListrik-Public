export class QueryHistoryTopUpModel {
	// fields
	filter: any;
	fromDate: any;
	toDate: any;
	sortOrder: string; // asc || desc
	sortField: string;
	pageNumber: number;
	limit: number;

	// constructor overrides
	constructor(
		_filter: any,
		_fromDate = undefined,
		_toDate = undefined,
		_sortOrder: string = 'asc',
		_sortField: string = '',
		_pageNumber: number = 0,
		_limit: number = 10
	) {
		this.filter = _filter;
		this.fromDate = _fromDate;
		this.toDate = _toDate;
		this.sortOrder = _sortOrder;
		this.sortField = _sortField;
		this.pageNumber = _pageNumber;
		this.limit = _limit;
	}
}
