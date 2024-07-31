import bresmenu from "./menuBres";
import { environment } from "../../../environments/environment";

let tampilanMenu = [];

const menus = [
	{
		title: "Dashboard",
		role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "engineer", "user", "sdm", "mgr-finance", "customer-service"],
		root: true,
		icon: "flaticon-layer",
		page: "/dashboard",
		translate: "Dashboard",
		bullet: "dot",
	},

	// {
	// 	section: "Building Management",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance"],
	// },
	// {
	// 	title: "Contract",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon2-contract",
	// 	submenu: [
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance"],
	// 			title: "Rental Contract",
	// 			// page: "/guest-cust",
	// 			submenu: [
	// 				{
	// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
	// 					title: "Guest Profile",
	// 					page: "/guest-cust",
	// 				},
	// 				{
	// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
	// 					title: "Check In",
	// 					page: "/contract-management/contract/guest/checkin",
	// 				},
	// 				{
	// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
	// 					title: "Check Out",
	// 					page: "/contract-management/contract/guest/checkout",
	// 				},
	// 				// {
	// 				// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
	// 				// 	title: "Check Out",
	// 				// 	page: "/contract-management/contract/guest",
	// 				// },
	// 			],
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
	// 			title: "Ownership Contract",
	// 			page: "/contract-management/contract/ownership",
	// 		},
	// 		// {
	// 		// 	role: ["manager","mgr-bm", "mgr-finance", "administrator", "spv-tro", "admin-tro"],
	// 		// 	title: "Lease Contract",
	// 		// 	page: "/contract-management/contract/pp",
	// 		// },
	// 	],
	// },
	// {
	// 	title: "Utility Management",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-buildings",
	// 	submenu: [
	// 		{
	// 			title: "Electricity Consumption",
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance"],
	// 			bullet: "dot",
	// 			page: "/power-management/power/transaction",
	// 		},
	// 		{
	// 			title: "Water Consumption",
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance"],
	// 			bullet: "dot",
	// 			page: "/water-management/water/transaction",
	// 		},
	// 	],
	// },
	// {
	// 	title: "Parking",
	// 	role: ["administrator", "manager", "mgr-bm", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page: "/apark",
	// 	// submenu :[
	// 	// 	// {
	// 	// 	// role: ["administrator"],
	// 	// 	// title: "Parking",
	// 	// 	// page: "/parking",
	// 	// 	// },
	// 	// 	{
	// 	// 	role: ["administrator"],
	// 	// 	title: "Additional Parking",
	// 	// 	page: "/apark",
	// 	// 	},
	// 	// ],
	// },

	// {
	// 	title: "Revenue",
	// 	role: ["manager", "mgr-bm", "administrator", "mgr-finance", "spv-finance", "admin-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-price-tag",
	// 	page: "/rental",
	// },
	// {
	// 	title: "Galon Transaction",
	// 	role: ["manager", "mgr-bm", "administrator", "mgr-finance", "spv-finance", "admin-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-price-tag",
	// 	page: "/trgalon",
	// },
	// {
	// 	title: "Billing",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-file-2",
	// 	submenu: [
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 			title: "Cashier Payment",
	// 			page: "/pos",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 			title: "IPL Billing",
	// 			// page : "/billing",
	// 			submenu: [
	// 				{
	// 					role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 					title: "IPL Billing",
	// 					page: "/billing",
	// 				},
	// 				{
	// 					role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 					title: "History IPL Billing",
	// 					page: "/blog",
	// 				},
	// 				{
	// 					role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 					title: "Import Payment",
	// 					page: "/importpayment",
	// 				},
	// 			],
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 			title: "Rental Billing",
	// 			page: "/rntlbilling",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 			title: "Lease Billing",
	// 			page: "/lsebilling",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 			title: "Parking Billing",
	// 			page: "/prkbilling",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "mgr-finance"],
	// 			title: "Power Billing",
	// 			page: "/pwbill",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Penalty",
	// 			page: "/pinalty",
	// 		},
	// 	],
	// },
	// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	section: "Commercial",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance"],
	// },
	// {
	// 	title: "Utility Management",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-buildings",
	// 	submenu: [
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-engineer", "spv-finance", "mgr-finance"],

	// 			bullet: "dot",
	// 			title: "Power Transaction",
	// 			page: "/comTPower",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-engineer", "spv-finance", "mgr-finance"],

	// 			bullet: "dot",
	// 			title: "Water Transaction",
	// 			page: "/comTWater",
	// 		},
	// 	],
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-file-2",
	// 	title: "Billing",
	// 	page: "/billCom",
	// },

	// Transaksi Top Up
	{
		section: "Transaksi Top Up",
		role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	},
	{
		title: "Transaksi Top Up",
		role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
		bullet: "dot",
		icon: "flaticon2-writing",
		page: "/transaksi-topup",
	},
	// {
	// 	title: "History Transaksi",
	// 	role: ["manager", "mgr-bm", "mgr-finance", "administrator", "spv-finance", "admin-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon2-list",
	// 	page: "/history-topup",
	// },

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	// {
	// 	section: "Services & Helpdesk",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "spv-tro", "spv-finance", "admin-tro", "customer-service"],
	// },
	// {
	// 	role: ["manager", "administrator", "admin-tro", "spv-tro"],
	// 	bullet: "dot",
	// 	// icon: "flaticon-truck",
	// 	icon: "flaticon-bell",
	// 	title: "Notifikasi Billing",
	// 	page: "/bill-notif",
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "admin-tro", "spv-tro"],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	title: "Blast News Notification",
	// 	page: "/blast-news",
	// },
	// {
	// 	// title: "Package Management",
	// 	title: "Manajemen Paket",
	// 	role: [
	// 		"administrator",
	// 		"manager",
	// 		"mgr-bm",
	// 		"spv-tro",
	// 		"admin-tro",
	// 		"customer-service",
	// 		// new Role akses
	// 		"security",
	// 	],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	submenu: [
	// 		{
	// 			role: [
	// 				"administrator",
	// 				"manager",
	// 				"mgr-bm",
	// 				"spv-tro",
	// 				"admin-tro",
	// 				"customer-service",
	// 				// new Role akses
	// 				"security",
	// 			],

	// 			bullet: "dot",
	// 			title: "Manajemen Paket",
	// 			page: "/packages",
	// 		},
	// 		{
	// 			role: [
	// 				"administrator",
	// 				"manager",
	// 				"mgr-bm",
	// 				"spv-tro",
	// 				"admin-tro",
	// 				"customer-service",
	// 				// new Role akses
	// 				"security",
	// 			],

	// 			bullet: "dot",
	// 			title: "Lost And Found",
	// 			page: "/lostandfound",
	// 		},
	// 	],
	// },
	// {
	// 	// title: "Visitor Management",
	// 	title: "Manajemen Pengunjung",
	// 	role: [
	// 		"administrator",
	// 		"manager",
	// 		"mgr-bm",
	// 		"spv-tro",
	// 		"admin-tro",
	// 		"customer-service",
	// 		// new Role akses
	// 		"security",
	// 	],
	// 	bullet: "dot",
	// 	icon: "flaticon-event-calendar-symbol",
	// 	page: "/visitor",
	// },
	// {
	// 	// title: "Facility Reservation",
	// 	title: "Reservasi Fasilitas",
	// 	// role: ["administrator", "manager", "mgr-bm", "spv-tro", "admin-tro"],
	// 	role: [
	// 		"administrator",
	// 		"manager",
	// 		"mgr-bm",
	// 		"spv-tro",
	// 		"admin-tro",
	// 		"customer-service",
	// 		// new Role akses
	// 		"security",
	// 	],
	// 	bullet: "dot",
	// 	icon: "flaticon-event-calendar-symbol",
	// 	// page: "/facility-reservation",
	// 	// Start Sub Menu
	// 	submenu: [
	// 		{
	// 			role: [
	// 				"administrator",
	// 				"manager",
	// 				"mgr-bm",
	// 				"spv-tro",
	// 				"admin-tro",
	// 				"customer-service",
	// 				// new Role akses
	// 				"security",
	// 			],

	// 			bullet: "dot",
	// 			title: "Reservasi Fasilitas",
	// 			page: "/facility-reservation",
	// 		},
	// 		{
	// 			role: [
	// 				"administrator",
	// 				"manager",
	// 				"mgr-bm",
	// 				"spv-tro",
	// 				"admin-tro",
	// 				"customer-service",
	// 				// new Role akses
	// 				"security",
	// 			],

	// 			bullet: "dot",
	// 			title: "Setting Reservasi Fasilitas",
	// 			page: "/master-facility-reservation",
	// 		},
	// 	],
	// 	// End Sub Menu
	// },

	// {
	// 	title: "Ticketing",
	// 	role: [
	// 		"manager",
	// 		"mgr-bm",
	// 		"administrator",
	// 		"spv-tro",
	// 		"admin-tro",
	// 		"spv-engineer",
	// 		"admin-engineer",
	// 		"engineer",
	// 		"super-operator",
	// 		// // new Role akses
	// 		// "security"
	// 	],
	// 	bullet: "dot",
	// 	icon: "flaticon-security",
	// 	submenu: [
	// 		{
	// 			title: "Private Area",
	// 			role: [
	// 				"manager",
	// 				"mgr-bm",
	// 				"administrator",
	// 				"spv-tro",
	// 				"admin-tro",
	// 				"spv-engineer",
	// 				"admin-engineer",
	// 				"engineer",
	// 				"super-operator",
	// 				// // new Role akses
	// 				// "security"
	// 			],
	// 			submenu: [
	// 				{
	// 					role: [
	// 						"manager",
	// 						"mgr-bm",
	// 						"administrator",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						"spv-engineer",
	// 						"super-operator",
	// 						// // new Role akses
	// 						// "security"
	// 					],
	// 					title: "Calendar",
	// 					page: "/calendar",
	// 				},
	// 				{
	// 					// role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
	// 					role: [
	// 						"administrator",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						// // new Role akses
	// 						// "security"
	// 						"super-operator",
	// 					],
	// 					title: "Ticketing",
	// 					page: "/ticket",
	// 				},
	// 				{
	// 					role: [
	// 						// "manager", "mgr-bm",
	// 						"administrator",
	// 						"spv-tro",
	// 						"spv-engineer",
	// 						"admin-engineer",
	// 						"super-operator",
	// 						// // new Role akses
	// 						// "security"
	// 					],
	// 					title: "Ticketing (Spv)",
	// 					page: "/SpvTicket",
	// 				},
	// 				// {
	// 				// 	role: [
	// 				// 		"manager", "mgr-bm",
	// 				// 		"administrator",
	// 				// 		"spv-tro",
	// 				// 		"spv-engineer",
	// 				// 		"admin-engineer",
	// 				// 		"super-operator",
	// 				// 		// // new Role akses
	// 				// 		// "security"
	// 				// 	],
	// 				// 	title: "Ticketing (Mgr)",
	// 				// 	page: "/MgrTicket",
	// 				// },
	// 				{
	// 					role: [
	// 						"manager",
	// 						"mgr-bm",
	// 						"administrator",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						"spv-engineer",
	// 						"admin-engineer",
	// 						"engineer",
	// 						"user",
	// 						"super-operator",
	// 						// // new Role akses
	// 						// "security"
	// 					],
	// 					title: "Working Order",
	// 					// icon: "flaticon2-send-1",
	// 					page: "/deliveryorder",
	// 				},
	// 				{
	// 					title: "Rating",
	// 					role: [
	// 						"manager",
	// 						"mgr-bm",
	// 						"administrator",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						"spv-engineer",
	// 						"admin-engineer",
	// 						"user",
	// 						"super-operator",
	// 						// // new Role akses
	// 						// "security"
	// 					],
	// 					bullet: "dot",
	// 					// icon: "flaticon-star",
	// 					page: "/rating",
	// 				},
	// 			],
	// 		},
	// 		{
	// 			title: "Public Area",
	// 			role: [
	// 				"manager",
	// 				"mgr-bm",
	// 				"administrator",
	// 				"spv-tro",
	// 				"admin-tro",
	// 				"spv-engineer",
	// 				"admin-engineer",
	// 				"engineer",
	// 				"super-operator",
	// 				// // new Role akses
	// 				// "security"
	// 			],
	// 			submenu: [
	// 				{
	// 					role: [
	// 						"manager",
	// 						"mgr-bm",
	// 						"administrator",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						"spv-engineer",
	// 						"super-operator",
	// 						// // new Role akses
	// 						// "security"
	// 					],
	// 					title: "Calendar",
	// 					page: "/publiccalendar",
	// 				},
	// 				{
	// 					// role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
	// 					role: [
	// 						"administrator",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						// // new Role akses
	// 						// "security"
	// 						"super-operator",
	// 					],
	// 					title: "Ticketing",
	// 					page: "/publicticket",
	// 				},
	// 				{
	// 					role: [
	// 						// "manager", "mgr-bm",
	// 						"administrator",
	// 						"spv-tro",
	// 						"spv-engineer",
	// 						"admin-engineer",
	// 						"super-operator",
	// 						// // new Role akses
	// 						// "security"
	// 					],
	// 					title: "Ticketing (Spv)",
	// 					page: "/publicSpvTicket",
	// 				},
	// 				// {
	// 				// 	role: [
	// 				// 		"manager", "mgr-bm",
	// 				// 		"administrator",
	// 				// 		"spv-tro",
	// 				// 		"spv-engineer",
	// 				// 		"admin-engineer",
	// 				// 		"super-operator",
	// 				// 		// // new Role akses
	// 				// 		// "security"
	// 				// 	],
	// 				// 	title: "Ticketing (Mgr)",
	// 				// 	page: "/MgrTicket",
	// 				// },
	// 				{
	// 					role: [
	// 						"manager",
	// 						"mgr-bm",
	// 						"administrator",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						"spv-engineer",
	// 						"admin-engineer",
	// 						"engineer",
	// 						"user",
	// 						"super-operator",
	// 						// // new Role akses
	// 						// "security"
	// 					],
	// 					title: "Working Order",
	// 					// icon: "flaticon2-send-1",
	// 					page: "/publicdeliveryorder",
	// 				},
	// 				{
	// 					title: "Rating",
	// 					role: [
	// 						"manager",
	// 						"mgr-bm",
	// 						"administrator",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						"spv-engineer",
	// 						"admin-engineer",
	// 						"user",
	// 						"super-operator",
	// 						// // new Role akses
	// 						// "security"
	// 					],
	// 					bullet: "dot",
	// 					// icon: "flaticon-star",
	// 					page: "/publicRating",
	// 				},
	// 			],
	// 		},
	// 	],
	// },

	// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// {
	// 	section: "Inventory Management",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
	// },
	// {
	// 	title: "Inventory Product",
	// 	role: ["administrator"],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page: "/stockProduct",
	// },
	// {
	// 	title: "Stock In",
	// 	role: ["administrator", "manager", "mgr-bm", "spv-tro", "admin-tro", "customer-service"],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page: "/stockIn",
	// },
	// {
	// 	role: ["administrator"],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	title: "Request Stock Out",
	// 	page: "/requestStockOut",
	// },
	// {
	// 	title: "Stock Out",
	// 	role: ["administrator"],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page: "/stockOut",
	// },
	// {
	// 	title: "Product Out",
	// 	role: ["administrator",
	// 			"manager","mgr-bm",
	// 			"spv-tro",
	// 			"admin-tro",
	// 			"customer-service"
	// 		  ],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page : "/adjustOut",
	// },
	// {
	// 	section: "Operational",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
	// },
	// {
	// 	title: "Purchasing",
	// 	role: [
	// 		"manager",
	// 		"mgr-bm",
	// 		"administrator",
	// 		"spv-tro",
	// 		"admin-tro",
	// 		// "spv-engineer",
	// 		"admin-engineer",
	// 		"engineer",
	// 	],
	// 	bullet: "dot",
	// 	icon: "flaticon-security",
	// 	submenu: [
	// 		{
	// 			title: "Purchase Request",
	// 			role: ["administrator", "manager", "mgr-bm", "spv-tro", "admin-tro", "customer-service"],
	// 			bullet: "dot",
	// 			page: "/purchaseRequest",
	// 		},
	// 		// {
	// 		// 	title: "Quotation",
	// 		// 	role: [
	// 		// 		"administrator",
	// 		// 		"manager", "mgr-bm",
	// 		// 		"spv-tro",
	// 		// 		"admin-tro",
	// 		// 		"customer-service",
	// 		// 	],
	// 		// 	bullet: "dot",
	// 		// 	page: "/quotation",
	// 		// },
	// 		// {
	// 		// 	title: "Tabulation",
	// 		// 	role: [
	// 		// 		"administrator",
	// 		// 		"manager", "mgr-bm",
	// 		// 		"spv-tro",
	// 		// 		"admin-tro",
	// 		// 		"customer-service",
	// 		// 	],
	// 		// 	bullet: "dot",
	// 		// 	page: "/tabulation",
	// 		// },
	// 		{
	// 			title: "Purchase Order",
	// 			role: ["administrator", "manager", "mgr-bm", "spv-tro", "admin-tro", "customer-service"],
	// 			bullet: "dot",
	// 			page: "/purchaseOrder",
	// 		},
	// 		{
	// 			title: "PO Receipt",
	// 			role: ["administrator", "manager", "mgr-bm", "spv-tro", "admin-tro", "customer-service"],
	// 			bullet: "dot",
	// 			page: "/POReceipt",
	// 		},
	// 		{
	// 			title: "PO Payment",
	// 			role: ["administrator", "manager", "mgr-bm", "spv-tro", "admin-tro", "customer-service"],
	// 			bullet: "dot",
	// 			page: "/paymentPo",
	// 		},
	// 	],
	// },
	// {
	// 	title: "Request Invoice",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon2-writing",
	// 	page: "/requestInvoice",
	// },
	// {
	// 	title: "Invoice",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon2-writing",
	// 	page: "/invoice",
	// },
	// {
	// 	title: "Deposit",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon2-list",
	// 	page: "/deposit",
	// },
	// {
	// 	section: "Finance Accounting",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// },
	// {
	// 	title: "COA",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 	icon: "flaticon-coins",
	// 	submenu: [
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Account Type",
	// 			page: "/accountType",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Account",
	// 			page: "/accountGroup",
	// 		},
	// 		{
	// 			role: ["manager", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Account Category",
	// 			page: "/accountCategory",
	// 		},
	// 	],
	// },
	// {
	// 	title: "Report Finance",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon2-paper",
	// 	submenu: [
	// 		{
	// 			role: ["administrator", "mgr-finance"],
	// 			title: "General Ledger",
	// 			page: "/new-gldetail",
	// 		},
	// 		{
	// 			role: ["administrator", "mgr-finance"],
	// 			title: "Trial Balance",
	// 			page: "/new-gl",
	// 		},
	// 		{
	// 			role: ["administrator", "mgr-finance"],
	// 			title: "Profit Loss",
	// 			page: "/new-profitLoss",
	// 		},
	// 		{
	// 			role: ["administrator", "mgr-finance"],
	// 			title: "Balance Sheet",
	// 			page: "/new-trialBalance",
	// 		},
	// 	],
	// },
	// {
	// 	title: "Transactions",
	// 	role: ["manager", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-clock-2",
	// 	page: "/new-transactions",
	// },
	// // {
	// // 	title: "Account History",
	// // 	role: ["manager", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// // 	bullet: "dot",
	// // 	icon: "flaticon-clock-2",
	// // 	page: "/accountHistory",
	// // },
	// // {
	// // 	title: "Voucher Invoice",
	// // 	role: ["manager","mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// // 	bullet: "dot",
	// // 	icon: "flaticon2-line-chart",
	// // 	page: "/voucherinvoice",
	// // },
	// // {
	// // 	title: "Account Receive",
	// // 	role: ["manager","mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// // 	bullet: "dot",
	// // 	icon: "flaticon2-line-chart",
	// // 	page: "/ar",
	// // },
	// // {
	// // 	title: "Account Payable",
	// // 	role: ["manager","mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// // 	bullet: "dot",
	// // 	icon: "flaticon2-shopping-cart",
	// // 	page: "/ap",
	// // },
	// // Journal Start
	// {
	// 	title: "Journal Transaction",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 	icon: "flaticon-coins",
	// 	submenu: [
	// 		{
	// 			title: "Account Receive",
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			bullet: "dot",
	// 			// icon: "flaticon2-line-chart",
	// 			page: "/ar",
	// 		},
	// 		{
	// 			title: "Account Payment",
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			bullet: "dot",
	// 			// icon: "flaticon2-shopping-cart",
	// 			page: "/ap",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Memorial",
	// 			page: "/penyesuaian",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Amortization",
	// 			page: "/amortisasi",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Set Off",
	// 			page: "/setOff",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Write Off",
	// 			page: "/writeOff",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Debit Note",
	// 			page: "/debitnote",
	// 		},
	// 	],
	// },
	// // Journal End

	// {
	// 	title: "Cash Bank",
	// 	// title: "General Ledger",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-coins",
	// 	page: "/cashb",
	// },
	// // {
	// // 	title: "Opening Balance",
	// // 	role: [
	// // 		"manager", "mgr-bm",
	// // 		"administrator",
	// // 		"spv-finance",
	// // 		// "admin-finance", "mgr-finance"
	// // 	],
	// // 	icon: "flaticon-coins",
	// // 	page: "/openingBalance",
	// // },
	// {
	// 	title: "Budget Management",
	// 	role: ["administrator", "manager", "mgr-bm", "spv-finance", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page: "/budgeting",
	// },
	// {
	// 	title: "Petty Cash",
	// 	role: ["administrator", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon2-paper",
	// 	page: "/pettyCast",
	// },
	// {
	// 	title: "Asset",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon-folder-1",
	// 	submenu: [
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Asset Management",
	// 			page: "/am",
	// 		},
	// 		{
	// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// 			title: "Asset Depreciation",
	// 			page: "/assetDepreciation",
	// 		},
	// 	],
	// },
	// // {
	// // 	title: "Report",
	// // 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
	// // 	bullet: "dot",
	// // 	icon: "flaticon2-paper",
	// // 	submenu: [
	// // 		// {
	// // 		// 	role: ["administrator", "mgr-finance"],
	// // 		// 	title: "GL Summary",
	// // 		// 	page: "/gl",
	// // 		// },
	// // 		{
	// // 			role: ["administrator", "mgr-finance"],
	// // 			title: "General Ledger",
	// // 			page: "/gldetail",
	// // 		},
	// // 		{
	// // 			role: ["administrator", "mgr-finance"],
	// // 			title: "Trial Balance",
	// // 			page: "/gl",
	// // 		},
	// // 		{
	// // 			role: ["administrator", "mgr-finance"],
	// // 			title: "Profit Loss",
	// // 			page: "/profitLoss",
	// // 		},
	// // 		{
	// // 			role: ["administrator", "mgr-finance"],
	// // 			title: "Balance Sheet",
	// // 			page: "/trialBalance",
	// // 		},
	// // 		// {
	// // 		// 	role: ["administrator", "mgr-finance"],
	// // 		// 	title: "Cash Flow",
	// // 		// 	page: "/cashFlow",
	// // 		// },
	// // 		// {
	// // 		// 	role: ["administrator", "mgr-finance"],
	// // 		// 	title: "Account Budget",
	// // 		// 	page: "/accountBudget",
	// // 		// },
	// // 	],
	// // },
	// {
	// 	title: "AR Card",
	// 	role: ["manager", "administrator", "spv-finance", "admin-finance"],
	// 	bullet: "dot",
	// 	icon: "flaticon2-writing",
	// 	page: "/arCard",
	// },
	// {
	// 	section: "Attendance",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "spv-engineer", "sdm", "admin-engineer", "mgr-finance"],
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "sdm", "admin-tro"],
	// 	title: "ClockIn/ClockOut",
	// 	page: "/absensi",
	// },
	// {
	// 	section: "Patroli",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance", "sdm"],
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "sdm"],
	// 	title: "Patroli",
	// 	page: "/patroli",
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "sdm"],
	// 	title: "Inspeksi",
	// 	page: "/inspeksi",
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "sdm"],
	// 	title: "Checkpoint",
	// 	page: "/checkpoint",
	// },
	// {
	// 	section: "Emergency",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance", "sdm"],
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "sdm"],
	// 	title: "Emergency",
	// 	page: "/emergency",
	// },
	// {
	// 	section: "Task Management",
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance", "sdm"],
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "sdm"],
	// 	title: "Task Management Master",
	// 	page: "/taskManagementMaster",
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "sdm"],
	// 	title: "Task Management",
	// 	page: "/managementTask",
	// },
	// {
	// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "sdm"],
	// 	title: "Survey Template",
	// 	page: "/surveyTemplate",
	// },

	{
		section: "Master Data",
		role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance", "sdm"],
	},
	{
		title: "Setup Master",
		role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance", "spv-engineer", "admin-engineer", "mgr-finance", "sdm"],
		bullet: "dot",
		icon: "flaticon-interface-1",
		submenu: [
			{
				role: ["administrator", "spv-tro", "admin-tro", "manager", "mgr-bm", "spv-finance", "spv-engineer", "admin-engineer"],
				title: "Building Management",
				submenu: [
					// {
					// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
					// 	title: "Project",
					// 	page: "/bgroup",
					// },
					// {
					// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
					// 	title: "Block",
					// 	page: "/block",
					// },
					// {
					// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
					// 	title: "Floor",
					// 	page: "/floor",
					// },
					// {
					// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
					// 	title: "Unit Type",
					// 	page: "/typeunit",
					// },
					// {
					// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "mgr-finance"],
					// 	title: "Unit Rate",
					// 	page: "/rateunit",
					// },
					// {
					// 	role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-finance", "admin-finance"],
					// 	title: "Unit",
					// 	page: "/unit",
					// },
					{
						role: ["manager", "mgr-bm", "administrator", "spv-finance", "spv-engineer", "admin-engineer"],
						title: "Master Electricity",
						submenu: [
							// {
							// 	role: ["manager", "mgr-bm", "administrator", "spv-finance"],
							// 	title: "Rate",
							// 	page: "/power-management/power/rate",
							// },
							{
								role: ["manager", "mgr-bm", "administrator", "spv-finance"],
								title: "Rate Prabayar",
								page: "/power-management/power/rt-prabayar",
							},
							// {
							// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "spv-engineer", "admin-engineer"],
							// 	title: "Electricity Meter",
							// 	page: "/power-management/power/meter",
							// },
						],
					},
					// {
					// 	role: ["manager", "mgr-bm", "administrator", "spv-finance", "spv-engineer", "admin-engineer"],
					// 	title: "Master Water",
					// 	submenu: [
					// 		{
					// 			role: ["manager", "mgr-bm", "administrator", "spv-finance"],
					// 			title: "Rate",
					// 			page: "/water-management/water/rate",
					// 		},
					// 		{
					// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "spv-engineer", "admin-engineer"],
					// 			title: "Water Meter",
					// 			page: "/water-management/water/meter",
					// 		},
					// 	],
					// },
					// {
					// 	role: ["administrator"],
					// 	title: "Master Gas",
					// 	submenu: [
					// 		{
					// 			role: ["administrator"],
					// 			title: "Rate",
					// 			page: "/gas-management/gas/rate",
					// 		},
					// 		{
					// 			role: ["administrator"],
					// 			title: "Gas Meter",
					// 			page: "/gas-management/gas/meter",
					// 		},
					// 	],
					// },
					// {
					// 	role: ["manager", "mgr-bm", "administrator", "spv-finance"],
					// 	title: "Revenue Rental",
					// 	page: "/revenue",
					// },
				],
			},
			// 		{
			// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
			// 			title: "Parking",
			// 			submenu: [
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
			// 					title: "Vehicle Type",
			// 					page: "/vehicletype",
			// 				},
			// 			],
			// 		},
			// 		// {
			// 		// 	role: ["administrator"],
			// 		// 	title: "Pinalty Rate",
			// 		// 	page: "/ratePinalty",
			// 		// },
			// 		{
			// 			title: "User",
			// 			role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "spv-engineer", "sdm"],
			// 			submenu: [
			// 				{
			// 					role: ["administrator", "sdm"],
			// 					title: "Role",
			// 					page: "/role",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
			// 					title: "Customer",
			// 					page: "/customer",
			// 				},
			// 				{
			// 					role: ["administrator", "sdm"],
			// 					title: "Management",
			// 					page: "/user-management/users",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "spv-engineer", "sdm"],
			// 					title: "Engineer",
			// 					page: "/engineer",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "sdm"],
			// 					title: "Internal User",
			// 					page: "/internalUser",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "sdm"],
			// 					title: "External User",
			// 					page: "/externalUser",
			// 				},
			// 			],
			// 		},
			// 		{
			// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
			// 			title: "Asset",
			// 			submenu: [
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
			// 					title: "Fiscal Asset",
			// 					page: "/fiscal",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
			// 					title: "Fixed  Asset",
			// 					page: "/fixed",
			// 				},
			// 			],
			// 		},
			// 		{
			// 			role: ["manager", "mgr-bm", "administrator", "spv-engineer", "admin-engineer"],
			// 			title: "Helpdesk",
			// 			submenu: [
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-engineer", "admin-engineer"],
			// 					title: "Category Ticket",
			// 					submenu: [
			// 						{
			// 							role: ["manager", "mgr-bm", "administrator", "spv-engineer", "admin-engineer"],
			// 							title: "Location",
			// 							page: "/category",
			// 						},
			// 						{
			// 							role: ["manager", "mgr-bm", "administrator", "spv-engineer", "admin-engineer"],
			// 							title: "Detail Location",
			// 							page: "/defect",
			// 						},
			// 						{
			// 							role: ["manager", "mgr-bm", "administrator", "spv-engineer", "admin-engineer"],
			// 							title: "Defect",
			// 							page: "/subdefect",
			// 						},
			// 					],
			// 				},
			// 			],
			// 		},
			// 		{
			// 			role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
			// 			title: "Finance & Accounting",
			// 			submenu: [
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
			// 					title: "Bank",
			// 					submenu: [
			// 						{
			// 							role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
			// 							title: "Bank List",
			// 							page: "/bank",
			// 						},
			// 						{
			// 							role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
			// 							title: "Bank Account",
			// 							page: "/accountBank",
			// 						},
			// 					],
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance", "mgr-finance"],
			// 					title: "Tax",
			// 					page: "/tax",
			// 				},
			// 				{
			// 					role: ["administrator", "mgr-finance", "mgr-finance"],
			// 					title: "Currency",
			// 					page: "/currency",
			// 				},
			// 			],
			// 		},
			// 		{
			// 			role: ["administrator"],
			// 			title: "Inventory",
			// 			submenu: [
			// 				{
			// 					role: ["administrator"],
			// 					title: "Product Category",
			// 					page: "/productCategory",
			// 				},
			// 				{
			// 					role: ["administrator"],
			// 					title: "Product Brand",
			// 					page: "/productBrand",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-finance", "admin-finance"],
			// 					title: "Uom",
			// 					page: "/uom",
			// 				},
			// 			],
			// 		},
			// 		{
			// 			role: ["administrator"],
			// 			title: "Vendor",
			// 			submenu: [
			// 				{
			// 					role: ["administrator"],
			// 					title: "Vendor Category",
			// 					page: "/vndrCategory",
			// 				},
			// 				{
			// 					role: ["administrator"],
			// 					title: "Vendor",
			// 					page: "/vendor",
			// 				},
			// 			],
			// 		},
			// 		{
			// 			role: ["administrator", "sdm"],
			// 			title: "Department",
			// 			page: "/department",
			// 		},
			// 		{
			// 			role: ["administrator", "sdm"],
			// 			title: "Division",
			// 			page: "/division",
			// 		},
			// 		{
			// 			role: ["administrator", "sdm"],
			// 			title: "Location Building",
			// 			page: "/locationBuilding",
			// 		},
			// 		{
			// 			role: ["administrator", "sdm"],
			// 			title: "Shift",
			// 			page: "/shift",
			// 		},
			// 		{
			// 			role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro"],
			// 			title: "Facility Management",
			// 			page: "/facility",
			// 		},
			// 		{
			// 			role: ["administrator", "spv-tro", "admin-tro", "manager", "mgr-bm", "spv-finance", "spv-engineer", "admin-engineer", "mgr-finance"],
			// 			title: "Commercial",
			// 			submenu: [
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
			// 					title: "Customer",
			// 					page: "/comCustomer",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
			// 					title: "Type",
			// 					page: "/comType",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
			// 					title: "Unit",
			// 					page: "/comUnit",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
			// 					title: "Power Meter",
			// 					page: "/comPower",
			// 				},
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
			// 					title: "Water Meter",
			// 					page: "/comWater",
			// 				},
			// 			],
			// 		},
			// 		{
			// 			role: ["administrator", "spv-tro", "admin-tro", "manager", "mgr-bm", "spv-finance", "spv-engineer", "admin-engineer", "mgr-finance"],
			// 			title: "Master Sales",
			// 			submenu: [
			// 				{
			// 					role: ["manager", "mgr-bm", "administrator", "spv-tro", "admin-tro", "mgr-finance"],
			// 					title: "Rate Galon",
			// 					page: "/galon-management/galon/rate",
			// 				},
			// 			],
			// 		},
			// 	],
			// },
			// {
			// 	section: "Log History",
			// 	role: ["administrator"],
			// },
			// {
			// 	title: "Log Action",
			// 	role: ["administrator"],
			// 	bullet: "dot",
			// 	page: "/logaction",
			// },
			// {
			// 	role: ["manager", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "cashier", "collection"],
			// 	title: "Void IPL Billing",
			// 	page: "/voidBill",
			// },
			// {
			// 	role: ["manager", "administrator", "spv-finance", "admin-finance", "spv-tro", "admin-tro", "cashier", "collection"],
			// 	title: "Void Journal",
			// 	page: "/jourVoid",
			// },
			// {
			// 	title: "Purchasing",
			// 	role: ["administrator"],
			// 	submenu: [
			// 		{
			// 			role: ["administrator"],
			// 			title: "Purchase Request",
			// 			page: "/logFinance/PR",
			// 		},
			// 		{
			// 			role: ["administrator"],
			// 			title: "Purchase Order",
			// 			page: "/logFinance/PO",
			// 		},
			// 		{
			// 			role: ["administrator"],
			// 			title: "Quotation",
			// 			page: "/logFinance/QU",
			// 		},
			// 	],
			// },
			// {
			// 	title: "Finance & Accounting",
			// 	role: ["administrator"],
			// 	submenu: [
			// 		{
			// 			role: ["administrator"],
			// 			title: "AR",
			// 			page: "/logFinance/AR",
			// 		},
			// 		{
			// 			role: ["administrator"],
			// 			title: "AP",
			// 			page: "/logFinance/AP",
			// 		},
			// 	],
			// },
			// {
			// 	title: "Inventory",
			// 	role: ["administrator"],
			// 	submenu: [
			// 		{
			// 			role: ["administrator"],
			// 			title: "Product",
			// 			page: "/logFinance/PD",
			// 		},
			// 		{
			// 			role: ["administrator"],
			// 			title: "Stock In",
			// 			page: "/logFinance/SI",
			// 		},
			// 		{
			// 			role: ["administrator"],
			// 			title: "Stock Out",
			// 			// page : "/billLog",
			// 		},
			// 	],
			// },
			// {
			// 	title: "Billing",
			// 	role: ["administrator"],
			// 	submenu: [
			// 		{
			// 			role: ["administrator"],
			// 			title: "IPL",
			// 			page: "/billLog",
			// 		},
			// {
			// 	role: [
			// 		"administrator",
			// 	],
			// 	title: "Invoice",
			// 	// page : "/billLog",
			// },
			// {
			// 	role: [
			// 		"administrator",
			// 	],
			// 	title: "Deposit",
			// 	// page : "/billLog",
			// },
		],
	},
	// {
	// 	title: "Log Package",
	// 	role: ["administrator"],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page: "/pkgs",
	// },
];

if (environment.base === "BRES") {
	tampilanMenu = bresmenu;
} else {
	tampilanMenu = menus;
}

export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [],
		},
		aside: {
			self: {},
			items: tampilanMenu,
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
