export class BodyModelUpd {
	filter: any;
	page: number;
	limit: number;

	constructor(_filter: any = [],
		_page: number = 1,
		_limit: number = 10) {
		this.filter = _filter;
		this.page = _page;
		this.limit = _limit;
	}
}

