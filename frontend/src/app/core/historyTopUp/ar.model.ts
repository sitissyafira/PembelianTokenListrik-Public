import { AccountGroupModel } from '../accountGroup/accountGroup.model';
import { User } from '../auth';
import { BaseModel } from '../_base/crud';



export class HistoryTopUpModel extends BaseModel {
	_id: string;
	depositTo: AccountGroupModel;
	glaccount: AccountGroupModel;
	voucherno: string;
	rate: string; //number
	memo: string; // number
	date: string;
	amount: Number;
	createdBy: User;
	crtdate: string;
	status: boolean;
	// generateFrom: 
	startDate : any;
	endDate : any;



	clehistorytopup(): void {
		this._id = undefined;
		this.depositTo = undefined;
		this.glaccount = undefined;
		this.voucherno = "";
		this.rate = "";
		this.memo = "";
		this.date = "";
		this.amount = 0;
		this.createdBy = undefined;
		this.crtdate = "";
		this.status = undefined;
	}
}
