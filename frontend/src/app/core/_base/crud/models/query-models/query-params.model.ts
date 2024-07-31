// export class QueryParamsModel {
// 	// fields
// 	filter: any;
// 	sortOrder: string; // asc || desc
// 	sortField: string;
// 	pageNumber: number;
// 	pageSize: number;
// 	page: number;
// 	limit: number;
// 	skip: number;
//
// 	// constructor overrides
// 	constructor(_filter: any,
// 		           _sortOrder: string = 'asc',
// 		           _sortField: string = '',
// 		           _pageNumber: number = 0,
// 		           _pageLimit: number = 0,
// 		           _pageSkip: number = 10,
// 		           _pageSize: number = 0) {
// 		this.filter = _filter;
// 		this.sortOrder = _sortOrder;
// 		this.sortField = _sortField;
// 		this.pageNumber = _pageNumber;
// 		this.pageSize = _pageSize;
// 		this.page = _pageNumber;
// 		this.limit = _pageLimit;
// 		this.skip = _pageLimit;
// 	}
// }


export class QueryParamsModel {
	// fields
	filter: any;
	sortOrder: string; // asc || desc
	sortField: string;
	pageNumber: number;
	pageSize: number;
	limit: number;
	skip: number;

	// constructor overrides
	constructor(_filter: any,
		_sortOrder: string = 'desc',
		_sortField: string = '',
		_pageNumber: number = 1,
		_limit: number = 10,
		_pageSize: number = 10) {
		this.filter = _filter;
		this.sortOrder = _sortOrder;
		this.sortField = _sortField;
		this.pageNumber = _pageNumber;
		this.pageSize = _pageSize;
		this.limit = _limit;
	}
}
