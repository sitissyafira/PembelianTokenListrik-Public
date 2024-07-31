// Angular
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// Components
import { BaseComponent } from "./views/theme/base/base.component";
import { ErrorPageComponent } from "./views/theme/content/error-page/error-page.component";
// Auth
import { AuthGuard } from "./core/auth";

const routes: Routes = [
	{
		path: "auth",
		loadChildren: () => import("./views/pages/auth/auth.module").then((m) => m.AuthModule),
	},
	{
		path: "pos",
		canActivate: [AuthGuard],
		loadChildren: () => import("./views/pages/pos/pos.module").then((m) => m.PosModule),
	},

	{
		path: "",
		component: BaseComponent,
		canActivate: [AuthGuard],
		data: {
			expectedRole: [
				"administrator",
				"manager", "mgr-bm",
				"spv-tro",
				"admin-tro",
				"spv-finance",
				"admin-finance",
				"spv-engineer",
				"engineer",
				"user",
				"sdm",
				"admin-engineer",
			],
		},
		children: [
			{
				path: "dashboard",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"administrator",
						"spv-tro",
						"admin-tro",
						"spv-finance",
						"admin-finance",
						"spv-engineer",
						"admin-engineer",
						"manager", "mgr-bm",
						"engineer",
						"user",
						"sdm",
						"admin-engineer",
						"mgr-finance"
					],
				},
				loadChildren: () => import("./views/pages/dashboard/dashboard.module").then((m) => m.DashboardModule),
			},
			{
				path: "bgroup",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "spv-tro", "admin-tro", "manager", "mgr-bm"],
				},
				loadChildren: () => import("./views/pages/blockgroup/block-group.module").then((m) => m.BlockGroupModule),
			},

			{
				path: "deposit",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "manager", "mgr-bm", "spv-finance", "admin-finance"],
				},
				loadChildren: () => import("./views/pages/deposit/deposit.module").then((m) => m.DepositModule),
			},
			{
				path: "defect",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-engineer", "admin-engineer"],
				},
				loadChildren: () => import("./views/pages/defect/defect.module").then((m) => m.DefectModule),
			},
			{
				path: "tax",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/masterData/tax/tax.module").then((m) => m.TaxModule),
			},
			{
				path: "category",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-engineer", "admin-engineer"],
				},
				loadChildren: () => import("./views/pages/category/category.module").then((m) => m.CategoryModule),
			},
			{
				path: "block",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
				},
				loadChildren: () => import("./views/pages/block/block.module").then((m) => m.BlockModule),
			},
			{
				path: "apark",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/addpark/addpark.module").then((m) => m.AddparkModule),
			},
			{
				path: "SpvTicket",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"spv-engineer",
						"admin-engineer",

						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/ticketSpv/ticket.module").then((m) => m.TicketSpvModule),
			},
			{
				path: "publicSpvTicket",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"spv-engineer",
						"admin-engineer",

						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/ticketSpvpublic/ticket.module").then((m) => m.TicketSpvModule),
			},
			// {
			// 	path: "MgrTicket",
			// 	canActivate: [AuthGuard],
			// 	data: {
			// 		expectedRole: [
			// 			"manager", "mgr-bm",
			// 			"administrator",
			// 			"spv-tro",
			// 			"spv-engineer",
			// 			"admin-engineer",
			// 			"super-operator",
			// 			// // new Role akses
			// 			// "security"
			// 		],
			// 	},
			// 	loadChildren: () =>
			// 		import("./views/pages/ticketMgr/ticket.module").then(
			// 			(m) => m.TicketMgrModule
			// 		),
			// },
			{
				path: "ticket",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"spv-engineer",
						"admin-engineer",
						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/ticket/ticket.module").then((m) => m.TicketModule),
			},
			// },
			{
				path: "publicticket",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"spv-engineer",
						"admin-engineer",
						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/ticketpublic/ticket.module").then((m) => m.TicketModule),
			},
			{
				path: "calendar",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"spv-engineer",
						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/calendar-helpdesk/calendar-helpdesk.module").then((m) => m.CalendarHelpdeskModule),
			},
			{
				path: "publiccalendar",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"spv-engineer",
						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/calendarpublic/calendar-helpdesk.module").then((m) => m.CalendarHelpdeskModule),
			},
			{
				path: "UserTicket",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/ticketUser/ticketUser.module").then((m) => m.TicketUserModule),
			},

			{
				path: "deliveryorder",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"spv-engineer",
						"admin-engineer",
						"user",
						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/deliveryorder/deliveryorder.module").then((m) => m.DeliveryorderModule),
			},
			{
				path: "publicdeliveryorder",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"spv-engineer",
						"admin-engineer",
						"user",
						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/deliveryorderpublic/deliveryorder.module").then((m) => m.DeliveryorderModule),
			},
			{
				path: "rating",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"spv-engineer",
						"admin-engineer",
						"user",
						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/rating/rating.module").then((m) => m.RatingModule),
			},
			{
				path: "publicRating",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"spv-engineer",
						"admin-engineer",
						"user",
						"super-operator",
						// // new Role akses
						// "security"
					],
				},
				loadChildren: () => import("./views/pages/publicrating/rating.module").then((m) => m.RatingModule),
			},
			{
				path: "engineer",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager", "mgr-bm",
						"administrator",
						"spv-tro",
						"spv-engineer",
						"sdm"
					],
				},
				loadChildren: () => import("./views/pages/engineer/engineer.module").then((m) => m.EngineerModule),
			},
			{
				path: "accountBank",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/masterData/bank/accountBank/accountBank.module").then((m) => m.AccountBankModule),
			},
			{
				path: "building",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/building/building.module").then((m) => m.BuildingModule),
			},
			{
				path: "floor",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
				},
				loadChildren: () => import("./views/pages/floor/floor.module").then((m) => m.FloorModule),
			},
			{
				path: "accountType",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/accountType/accountType.module").then((m) => m.AccountTypeModule),
			},
			{
				path: "accountCategory",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/accountCategory/accountCategory.module").then((m) => m.AccountCategoryModule),
			},
			{
				path: "new-transactions",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/newTransactions/transactions.module").then((m) => m.TransactionsModule),
			},
			{
				path: "accountHistory",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/accountHistory/accountHistory.module").then((m) => m.AccountHistoryModule),
			},
			{
				path: "accountGroup",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/accountGroup/accountGroup.module").then((m) => m.AccountGroupModule),
			},
			{
				path: "role",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "sdm"],
				},
				loadChildren: () => import("./views/pages/role/role.module").then((m) => m.RoleModule),
			},
			{
				path: "parking",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/parking/parking.module").then((m) => m.ParkingModule),
			},
			{
				path: "subdefect",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-engineer", "admin-engineer"],
				},
				loadChildren: () => import("./views/pages/subdefect/subdefect.module").then((m) => m.SubdefectModule),
			},
			{
				path: "vehicletype",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
				},
				loadChildren: () => import("./views/pages/vehicletype/vehicletype.module").then((m) => m.VehicletypeModule),
			},
			{
				path: "typeunit",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
				},
				loadChildren: () => import("./views/pages/unittype/unittype.module").then((m) => m.UnitTypeModule),
			},
			{
				path: "rateunit",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator"],
				},
				loadChildren: () => import("./views/pages/unitrate/unitrate.module").then((m) => m.UnitRateModule),
			},
			{
				path: "ratePinalty",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator"],
				},
				loadChildren: () => import("./views/pages/ratePinalty/ratePinalty.module").then((m) => m.RatePinaltyModule),
			},
			{
				path: "revenue",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance"],
				},
				loadChildren: () => import("./views/pages/revenue/revenue.module").then((m) => m.RevenueModule),
			},
			{
				path: "trgalon",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance"],
				},
				loadChildren: () => import("./views/pages/trGalon/trGalon.module").then((m) => m.TrGalonModule),
			},

			{
				path: "rental",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/bm/rental/rental.module").then((m) => m.RentalModule),
			},
			{
				path: "am",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/asset/assetManagement/am.module").then((m) => m.AmModule),
			},

			{
				path: "assetDepreciation",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/asset/assetDepreciation/ad.module").then((m) => m.AdModule),
			},
			{
				path: "unit",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance"],
				},
				loadChildren: () => import("./views/pages/unit/unit.module").then((m) => m.UnitModule),
			},
			{
				path: "customer",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
				},
				loadChildren: () => import("./views/pages/customer/customer.module").then((m) => m.CustomerModule),
			},
			{
				path: "internalUser",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager", "mgr-bm",
						"administrator",
						"spv-tro",
						"sdm",
						"admin-tro",
					],
				},
				loadChildren: () =>
					import("./views/pages/internalUser/internalUser.module").then(
						(m) => m.InternalUserModule
					),
			},
			{
				path: "externalUser",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager", "mgr-bm",
						"administrator",
						"spv-tro",
						"sdm",
						"admin-tro",
					],
				},
				loadChildren: () =>
					import("./views/pages/externalUser/externalUser.module").then(
						(m) => m.ExternalUserModule
					),
			},
			{
				path: "absensi",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager", "mgr-bm",
						"administrator",
						"spv-tro",
						"sdm",
						"admin-tro",
					],
				},
				loadChildren: () =>
					import("./views/pages/absensi/absensi.module").then(
						(m) => m.AbsensiModule
					),
			},
			{
				path: "inspeksi",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager", "mgr-bm",
						"administrator",
						"spv-tro",
						"sdm",
						"admin-tro",
					],
				},
				loadChildren: () =>
					import("./views/pages/inspeksi/inspeksi.module").then(
						(m) => m.InspeksiModule
					),
			},
			{
				path: "patroli",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager", "mgr-bm",
						"administrator",
						"spv-tro",
						"sdm",
						"admin-tro",
					],
				},
				loadChildren: () =>
					import("./views/pages/patroli/patroli.module").then(
						(m) => m.PatroliModule
					),
			},
			{
				path: "emergency",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager", "mgr-bm",
						"administrator",
						"spv-tro",
						"sdm",
						"admin-tro",
					],
				},
				loadChildren: () =>
					import("./views/pages/emergency/emergency.module").then(
						(m) => m.EmergencyModule
					),
			},
			{
				path: "managementTask",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager", "mgr-bm",
						"administrator",
						"spv-tro",
						"sdm",
						"admin-tro",
					],
				},
				loadChildren: () =>
					import("./views/pages/managementTask/managementTask.module").then(
						(m) => m.ManagementTaskModule
					),
			},
			{
				path: "taskManagementMaster",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager", "mgr-bm",
						"administrator",
						"spv-tro",
						"sdm",
						"admin-tro",
					],
				},
				loadChildren: () =>
					import("./views/pages/taskManagementMaster/taskManagementMaster.module").then(
						(m) => m.TaskManagementMasterModule
					),
			},
			{
				path: "guest-cust",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
				},
				loadChildren: () => import("./views/pages/renter/renter.module").then((m) => m.RenterModule),
			},
			{
				path: "power-management",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer"],
				},
				loadChildren: () => import("./views/pages/power/power.module").then((m) => m.PowerModule),
			},
			{
				path: "galon-management",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer"],
				},
				loadChildren: () => import("./views/pages/galon/galon.module").then((m) => m.GalonModule),
			},
			{
				path: "data-transfer",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/datatransfer/datatransfer.module").then((m) => m.DataTransferModule),
			},
			{
				path: "contract-management",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/contract/contract.module").then((m) => m.ContractModule),
			},
			{
				path: "water-management",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer"],
				},
				loadChildren: () => import("./views/pages/water/water.module").then((m) => m.WaterModule),
			},
			{
				path: "gas-management",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/gas/gas.module").then((m) => m.GasModule),
			},
			{
				path: "billing-management",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator"],
				},
				loadChildren: () => import("./views/pages/billing/billing.module").then((m) => m.BillingModule),
			},
			{
				path: "pinalty",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/pinalty/pinalty.module").then((m) => m.PinaltyModule),
			},

			{
				path: "user-management",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "sdm"],
				},
				loadChildren: () => import("./views/pages/user-management/user-management.module").then((m) => m.UserManagementModule),
			},
			{
				path: "bank",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/masterData/bank/bank/bank.module").then((m) => m.BankModule),
			},
			{
				path: "invoice",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
				},
				loadChildren: () => import("./views/pages/invoice/invoice.module").then((m) => m.InvoiceModule),
			},
			{
				path: "pwbill",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/powbill/powbill.module").then((m) => m.PowbillModule),
			},
			{
				path: "import",
				loadChildren: () => import("./views/pages/import/import.module").then((m) => m.ImportModule),
			},

			//Billing
			{
				path: "billing",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/billing/billing.module").then((m) => m.BillingModule),
			},
			{
				path: "importpayment",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/importPayment/importpayment.module").then((m) => m.ImportpaymentModule),
			},
			{
				path: "blog",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/blog/billing.module").then((m) => m.BLogModule),
			},

			{
				path: "rntlbilling",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/rentalbilling/rentalbilling.module").then((m) => m.RentalbillingModule),
			},
			{
				path: "lsebilling",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/lsebilling/lsebilling.module").then((m) => m.LsebillingModule),
			},
			{
				path: "prkbilling",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/prkbilling/prkbilling.module").then((m) => m.PrkbillingModule),
			},

			//Master Asset
			{
				path: "fixed",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
				},
				loadChildren: () => import("./views/pages/masterData/asset/fixed/fixed.module").then((m) => m.FixedModule),
			},
			{
				path: "fiscal",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
				},
				loadChildren: () => import("./views/pages/masterData/asset/fiscal/fiscal.module").then((m) => m.FiscalModule),
			},
			{
				path: "uom",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
				},
				loadChildren: () => import("./views/pages/masterData/asset/uom/uom.module").then((m) => m.UomModule),
			},
			{
				path: "cashb",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/cashb/cashb.module").then((m) => m.CashbModule),
			},

			// Finance

			{
				path: "voucherinvoice",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
				},
				loadChildren: () => import("./views/pages/finance/voucherinvoice/voucherinvoice.module").then((m) => m.VoucherinvoiceModule),
			},
			{
				path: "ar",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/ar/ar.module").then((m) => m.ArModule),
			},
			{
				path: "ap",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/ap/ap.module").then((m) => m.ApModule),
			},
			{
				path: "new-gl",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/newFinance/gl/gl.module").then((m) => m.GlModule),
			},
			{
				path: "gl",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/gl/gl.module").then((m) => m.GlModule),
			},
			{
				path: "new-gldetail",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/newFinance/gldetail/gldetail.module").then((m) => m.GldetailModule),
			},
			{
				path: "gldetail",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/gldetail/gldetail.module").then((m) => m.GldetailModule),
			},
			{
				path: "new-profitLoss",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/newFinance/profitLoss/profitLoss.module").then((m) => m.ProfitLossModule),
			},
			{
				path: "profitLoss",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/profitLoss/profitLoss.module").then((m) => m.ProfitLossModule),
			},
			{
				path: "cashFlow",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/cashFlow/cashFlow.module").then((m) => m.CashFlowModule),
			},
			{
				path: "accountBudget",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/accountBudget/accountBudget.module").then((m) => m.AccountBudgetModule),
			},
			{
				path: "new-trialBalance",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/newFinance/trialBalance/trialBalance.module").then((m) => m.TrialBalanceModule),
			},
			{
				path: "trialBalance",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/trialBalance/trialBalance.module").then((m) => m.TrialBalanceModule),
			},

			// Services
			{
				path: "packages",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"customer-service",
						// new Role akses
						"security",
					],
				},
				loadChildren: () => import("./views/pages/services/packages/packages.module").then((m) => m.PackagesModule),
			},
			{
				path: "lostandfound",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"customer-service",
						// new Role akses
						"security",
					],
				},
				loadChildren: () => import("./views/pages/services/lostfoundpackages/packages.module").then((m) => m.PackagesModule),
			},
			{
				path: "pkgs",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator"],
				},
				loadChildren: () => import("./views/pages/log/pkgs/pkgs.module").then((m) => m.PkgsModule),
			},
			{
				path: "visitor",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						"customer-service",
						// new Role akses
						"security",
					],
				},
				loadChildren: () => import("./views/pages/services/visitor/visitor.module").then((m) => m.VisitorModule),
			},
			{
				path: "bill-notif",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "administrator", "admin-tro", "spv-tro"],
				},
				loadChildren: () => import("./views/pages/billingNotif/billingNotif.module").then((m) => m.billingNotifModule),
			},
			{
				path: "blast-news",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "admin-tro", "spv-tro"],
				},
				loadChildren: () => import("./views/pages/services/blast-notification/blast-notification.module").then((m) => m.BlastNotificationModule),
			},
			{
				path: "facility-reservation",
				canActivate: [AuthGuard],
				data: {
					expectedRole: [
						"manager",
						"mgr-bm",
						"administrator",
						"spv-tro",
						"admin-tro",
						//  new Role akses
						"security",
					],
				},
				loadChildren: () => import("./views/pages/services/facility-reservation/facility/facility.module").then((m) => m.FacilityReservationModule),
			},
			{
				path: "master-facility-reservation",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
				},
				loadChildren: () => import("./views/pages/services/facility-reservation/master/master.module").then((m) => m.MasterMasterReservationModule),
			},

			{
				path: "openingBalance",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/masterData/openingBalance/openingBalance.module").then((m) => m.OpeningBalanceModule),
			},
			// {
			// 	path: "productList",
			// 	canActivate: [AuthGuard],
			// 	data: {
			// 		expectedRole: [
			// 			"manager","mgr-bm",
			// 			"administrator",
			// 			"spv-finance",
			// 		],
			// 	},
			// 	loadChildren: () =>
			// 		import("./views/pages/inventoryManagement/product/product.module").then(
			// 			m => m.ProductModule
			// 		),
			// },
			// {
			// 	path: "adjustIn",
			// 	canActivate: [AuthGuard],
			// 	data: {
			// 		expectedRole: [
			// 			"manager","mgr-bm",
			// 			"administrator",
			// 			"spv-finance",
			// 		],
			// 	},
			// 	loadChildren: () =>
			// 		import("./views/pages/inventoryManagement/adjustIn/adjustIn.module").then(
			// 			m => m.AdjustInModule
			// 		),
			// },
			// {
			// 	path: "adjustOut",
			// 	canActivate: [AuthGuard],
			// 	data: {
			// 		expectedRole: [
			// 			"manager","mgr-bm",
			// 			"administrator",
			// 			"spv-finance",
			// 		],
			// 	},
			// 	loadChildren: () =>
			// 		import("./views/pages/inventoryManagement/adjustOut/adjustOut.module").then(
			// 			m => m.AdjustOutModule
			// 		),
			// },

			{
				path: "facility",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
				},
				loadChildren: () => import("./views/pages/masterData/facility/facility.module").then((m) => m.FacilityModule),
			},
			{
				path: "budgeting",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/services/budgeting/budgeting.module").then((m) => m.BudgetingModule),
			},

			{
				path: "productCategory",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/masterData/productCategory/productCategory.module").then((m) => m.ProductCategoryModule),
			},
			{
				path: "productBrand",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/masterData/productBrand/productBrand.module").then((m) => m.ProductBrandModule),
			},
			{
				path: "currency",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/masterData/currency/currency.module").then((m) => m.CurrencyModule),
			},
			{
				path: "vndrCategory",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/masterData/vndrCategory/vnrdrCategory.module").then((m) => m.VndrCategoryModule),
			},
			{
				path: "vendor",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/masterData/vendor/vendor.module").then((m) => m.VendorModule),
			},
			{
				path: "department",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "sdm"],
				},
				loadChildren: () => import("./views/pages/masterData/department/department.module").then((m) => m.DepartmentModule),
			},
			{
				path: "division",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "sdm"],
				},
				loadChildren: () => import("./views/pages/masterData/division/division.module").then((m) => m.DivisionModule),
			},
			{
				path: "locationBuilding",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "sdm"],
				},
				loadChildren: () =>
					import(
						"./views/pages/masterData/locationBuilding/locationBuilding.module"
					).then((m) => m.LocationBuildingModule),
			},
			{
				path: "shift",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "sdm"],
				},
				loadChildren: () =>
					import(
						"./views/pages/masterData/shift/shift.module"
					).then((m) => m.ShiftModule),
			},
			{
				path: "checkpoint",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm",
						"administrator",
						"spv-finance",
						"admin-finance",
						"spv-tro",
						"sdm",
						"admin-tro",],
				},
				loadChildren: () =>
					import(
						"./views/pages/masterData/checkpoint/checkpoint.module"
					).then((m) => m.CheckpointModule),
			},
			{
				path: "surveyTemplate",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm",
						"administrator",
						"spv-finance",
						"admin-finance",
						"spv-tro",
						"sdm",
						"admin-tro",],
				},
				loadChildren: () =>
					import(
						"./views/pages/masterData/surveyTemplate/surveyTemplate.module"
					).then((m) => m.SurveyTemplateModule),
			},

			{
				path: "stockProduct",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/inventorymanagement/stockProduct/stockProduct.module").then((m) => m.StockProductModule),
			},
			{
				path: "stockIn",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/inventorymanagement/stockIn/stockIn.module").then((m) => m.StockInModule),
			},
			{
				path: "requestStockOut",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/inventorymanagement/requestStockOut/requestStockOut.module").then((m) => m.RequestStockOutModule),
			},
			{
				path: "stockOut",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/inventorymanagement/stockOut/stockOut.module").then((m) => m.StockOutModule),
			},
			{
				path: "pettyCast",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/purchaseManagement/pettyCast/pettyCast.module").then((m) => m.PettyCastModule),
			},
			{
				path: "requestInvoice",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/requestInvoice/requestInvoice.module").then((m) => m.RequestInvoiceModule),
			},
			{
				path: "logFinance",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/log/logFinance/logFinance.module").then((m) => m.LogFinanceModule),
			},
			{
				path: "billLog",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro"],
				},
				loadChildren: () => import("./views/pages/log/invoice/billLog/billLog.module").then((m) => m.BillLogModule),
			},
			{
				path: "purchaseRequest",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/purchaseManagement/purchaseRequest/purchaseRequest.module").then((m) => m.purchaseRequestModule),
			},
			{
				path: "purchaseOrder",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/purchaseManagement/purchaseOrder/purchaseOrder.module").then((m) => m.purchaseOrderModule),
			},
			{
				path: "POReceipt",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () =>
					import(
						"./views/pages/purchaseManagement/poReceipt/poReceipt.module"
					).then((m) => m.poReceiptModule),
			},
			{
				path: "paymentPo",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () =>
					import(
						"./views/pages/purchaseManagement/paymentPo/paymentPo.module"
					).then((m) => m.paymentPoModule),
			},
			{
				path: "quotation",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/purchaseManagement/quotation/quotation.module").then((m) => m.QuotationModule),
			},
			{
				path: "tabulation",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () =>
					import(
						"./views/pages/purchaseManagement/tabulation/tabulation.module"
					).then((m) => m.TabulationModule),
			},

			{
				path: "comCustomer",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/commersil/master/comCustomer/comCustomer.module").then((m) => m.ComCustomerModule),
			},
			{
				path: "comType",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/commersil/master/comType/comType.module").then((m) => m.ComTypeModule),
			},
			{
				path: "comUnit",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/commersil/master/comUnit/comUnit.module").then((m) => m.ComUnitModule),
			},
			{
				path: "comPower",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/commersil/master/comPower/comPower.module").then((m) => m.ComPowerModule),
			},
			{
				path: "comWater",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/commersil/master/comWater/comWater.module").then((m) => m.ComWaterModule),
			},
			{
				path: "comTPower",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "mgr-finance", "spv-engineer", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/commersil/master/comTPower/comTPower.module").then((m) => m.ComTPowerModule),
			},
			{
				path: "comTWater",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "mgr-finance", "spv-engineer", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/commersil/master/comTWater/comTWatermodule").then((m) => m.ComTWaterModule),
			},
			{
				path: "billCom",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "spv-finance", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/commersil/master/billCom/billCom.module").then((m) => m.BillComModule),
			},
			{
				path: "transaksi-topup",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "spv-finance", "admin-tro", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/transaksiTopUp/topUp/ar.module").then((m) => m.ArModule),
			},
			// Jurnal Start
			{
				path: "penyesuaian",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/journal/adjustment/adjustment.module").then((m) => m.AdjustmentModule),
			},
			{
				path: "amortisasi",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/journal/amortization/amortization.module").then((m) => m.AmortizationModule),
			},
			{
				path: "setOff",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/journal/setOff/setOff.module").then((m) => m.SetOffModule),
			},
			{
				path: "writeOff",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/journal/writeOff/writeOff.module").then((m) => m.WriteOffModule),
			},
			{
				path: "debitnote",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/finance/journal/debitNote/debitNote.module").then((m) => m.DebitNoteModule),
			},
			// Jurnal End

			{
				path: "history-topup",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "mgr-finance"],
				},
				loadChildren: () => import("./views/pages/historyTopUp/ar.module").then((m) => m.ArModule),
			},
			{
				path: "arCard",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "administrator", "spv-finance", "admin-finance"],
				},
				loadChildren: () => import("./views/pages/arCard/arCard.module").then((m) => m.ArCardModule),
			},
			// Void Billing
			{
				path: "voidBill",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "cashier", "collection"],
				},
				loadChildren: () => import("./views/pages/void/voidBill/voidBill.module").then((m) => m.VoidBillModule),
			},
			// Void Journal
			{
				path: "jourVoid",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["manager", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "cashier", "collection"],
				},
				loadChildren: () => import("./views/pages/void/jourVoid/jourVoid.module").then((m) => m.JourVoidModule),
			},

			{
				path: "logaction",
				canActivate: [AuthGuard],
				data: {
					expectedRole: ["administrator"],
				},
				loadChildren: () => import("./views/pages/log/logaction/logaction.module").then((m) => m.LogactionModule),
			},
			{
				path: "error/403",
				component: ErrorPageComponent,
				data: {
					type: "error-v6",
					code: 403,
					title: "403... Access forbidden",
					desc: "Looks like you don't have permission to access for requested page.<br> Please, contact administrator",
				},
			},
			{ path: "error/:type", component: ErrorPageComponent },
			{ path: "", redirectTo: "/dashboard", pathMatch: "full" },
			{ path: "**", redirectTo: "/dashboard", pathMatch: "full" },
		],
	},

	{ path: "**", redirectTo: "error/403", pathMatch: "full" },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule { }
