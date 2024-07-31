import { AccountGroupModel } from '../accountGroup/accountGroup.model';
import { User } from '../auth';
import { BaseModel } from '../_base/crud';



export class ArModel extends BaseModel {
	// START
	_id: string;
	namePrabayar: string;
	totalBiaya: Number;
	idRate: string;
	idUnit: string;
	topup_number: string;
	bank_tf: string;
	account_no: Number;
	account_name: string;
	card_no: Number;
	name_card: string;
	tglTransaksi: string;
	cdTransaksi: string;
	rate: Number;
	adminRate: Number;
	nameUnit: string;
	companyBank: string;
	nameCompany: string;
	accountNumberCompany: Number;
	mtdPembayaran: string;
	namaCust: string;
	unit: string;
	idEngineer: string;
	noToken: Number;
	engineer: string;
	proof_of_payment: string;
	prgrTransaksi: string;
	imagePayment: string;
	statusPayment: string;
	// END


	depositTo: AccountGroupModel;
	glaccount: AccountGroupModel;
	voucherno: string;
	memo: string; // number
	date: string;
	amount: Number;
	createdBy: User;
	crtdate: string;
	status: boolean;
	// generateFrom: 




	clear(): void {
		// START
		this._id = undefined;
		this.namePrabayar = undefined;
		this.totalBiaya = undefined;
		this.idRate = undefined;
		this.idUnit = undefined;
		this.topup_number = undefined;
		this.bank_tf = undefined;
		this.account_no = undefined;
		this.account_name = undefined;
		this.card_no = undefined;
		this.name_card = undefined;
		this.tglTransaksi = undefined;
		this.cdTransaksi = undefined;
		this.rate = undefined;
		this.adminRate = undefined;
		this.nameUnit = undefined;
		this.companyBank = undefined;
		this.nameCompany = undefined;
		this.accountNumberCompany = undefined;
		this.mtdPembayaran = undefined;
		this.namaCust = undefined;
		this.unit = undefined;
		this.idEngineer = undefined
		this.noToken = undefined;
		this.engineer = undefined
		this.proof_of_payment = undefined
		this.prgrTransaksi = undefined
		this.imagePayment = undefined
		this.statusPayment = undefined
		// END

		this.depositTo = undefined;
		this.glaccount = undefined;
		this.voucherno = "";
		this.memo = "";
		this.date = "";
		this.amount = 0;
		this.createdBy = undefined;
		this.crtdate = "";
		this.status = undefined;
	}
}
