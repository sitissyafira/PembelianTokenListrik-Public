const menus = 
	[
	{

		title: "Dashboard",
		role: [
			"manager",
			"administrator",
			"spv-tro",
			"admin-tro",
			"spv-finance",
			"admin-finance",
			"spv-engineer",
			"admin-engineer",
			"engineer",
			"user",
			"customer-service",
		],
		root: true,
		icon: "flaticon-layer",
		page: "/dashboard",
		translate: "Dashboard",
		bullet: "dot",
	},
	
	{ 
		section: "Building Management", 
		role: [
			"manager",
			"administrator",
			"spv-tro",
			"admin-tro",
			"spv-finance",
			"admin-finance",
			"spv-engineer",
			"admin-engineer"
		]
	},
	{
		title: "Contract",
		role: [
			"manager",
			"administrator",
			"spv-tro",
			"admin-tro"
		],
		bullet: "dot",
		icon: "flaticon2-contract",
		submenu: [
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro"
				],
				title: "Tenant Contract",
				page: "/contract-management/contract/lease",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro"
				],
				title: "Ownership Contract",
				page: "/contract-management/contract/ownership",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro"
				],
				title: "Lease Contract",
				page: "/contract-management/contract/pp",
			},
		],
	},
	{
		title: "Utility Management",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance",
			"spv-engineer",
			"admin-engineer"
		],
		bullet: "dot",
		icon: "flaticon-buildings",
		submenu: [
			{
				title: "Electricity Consumption",
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance",
					"spv-engineer",
					"admin-engineer"
				],
				bullet: "dot",
				page: "/power-management/power/transaction",
			},
			{
				title: "Water Consumption",
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance",
					"spv-engineer",
					"admin-engineer"
				],
				bullet: "dot",
				page: "/water-management/water/transaction",
			},
		],
	},
	{
		title: "Parking",
		role: [
		"administrator",
		"manager"]
		,
		bullet: "dot",
		icon: "flaticon-truck",
		page: "/apark",
		// submenu :[
		// 	// {
		// 	// role: ["administrator"],
		// 	// title: "Parking",
		// 	// page: "/parking",
		// 	// },
		// 	{
		// 	role: ["administrator"],
		// 	title: "Additional Parking",
		// 	page: "/apark",
		// 	},
		// ],
	},

	{
		title: "Revenue",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		bullet: "dot",
		icon: "flaticon-price-tag",
		page: "/rental",
	},
	{
		title: "Billing",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance",
			"spv-tro",
			"admin-tro"
		],
		bullet: "dot",
		icon: "flaticon-file-2",
		submenu :[
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance",
					"spv-tro",
					"admin-tro"
				],
				title:"IPL Billing",
				// page : "/billing",
				submenu :[
				{
					role: [
						"manager",
						"administrator",
						"spv-finance",
						"admin-finance",
						"spv-tro",
						"admin-tro"
					],
					title:"IPL Billing",
					page : "/billing",
				},
				{
					role: [
						"manager",
						"administrator",
						"spv-finance",
						"admin-finance",
						"spv-tro",
						"admin-tro"
					],
					title:"History IPL Billing",
					page : "/blog",
				}
				]
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance",
					"spv-tro",
					"admin-tro"
				],
				title:"Rental Billing",
				page : "/rntlbilling",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance",
					"spv-tro",
					"admin-tro"
				],
				title:"Lease Billing",
				page : "/lsebilling",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance",
					"spv-tro",
					"admin-tro"
				],
				title:"Parking Billing",
				page : "/prkbilling",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance",
					"spv-tro",
					"admin-tro"
				],
				title:"Power Billing",
				page : "/pwbill",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance"
				],
				title:"Penalty",
				page : "/pinalty",
			},
		]
	},
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	{ 
		section: "Services & Helpdesk", 
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"spv-tro",
			"spv-finance",
			"admin-tro",
			"customer-service",
		]
	},
	{
		role: [
			"manager",
			"administrator",
			"admin-tro",
			"spv-tro"
		],
		bullet: "dot",
		icon: "flaticon-truck",
		title: 'Blast News Notification',
		page: '/blast-news'
	},
	{
		title: "Package Management",
		role: ["administrator",
				"manager",
				"spv-tro",
				"admin-tro",
				"customer-service"],
		bullet: "dot",
		icon: "flaticon-truck",
		page: "/packages",
	},
	{
		title: "Visitor Management",
		role: ["administrator",
				"manager",
				"spv-tro",
				"admin-tro",
				"customer-service"
			  ],
		bullet: "dot",
		icon: "flaticon-truck",
		page: "/visitor",
	},
	{
		title: "Facility Reservation",
		role: ["administrator",
				"manager",
				"spv-tro",
				"admin-tro",
		],
		bullet: "dot",
		icon: "flaticon-event-calendar-symbol",
		page: "/facility-reservation"
	},

	{
		title: "Ticketing",
		role: [
			"manager",
			"administrator",
			"spv-tro",
			"admin-tro",
			"spv-engineer",
			"admin-engineer",
			"engineer"
		],
		bullet: "dot",
		icon: "flaticon-security",
		submenu :[
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro",
					"spv-engineer",
				],
				title: "Calendar",
				page: "/calendar",
			},
			{
			role: [
				"manager",
				"administrator",
				"spv-tro",
				"admin-tro",
			],
			title: "Ticketing",
			page: "/ticket",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"spv-engineer",
					"admin-engineer"
				],
				title: "Ticketing (Spv)",
				page: "/SpvTicket",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro",
					"spv-engineer",
					"admin-engineer",
					"engineer",
					"user"
				],
				title: "Working Order",
				// icon: "flaticon2-send-1",
				page: "/deliveryorder",
			},
			{
				title: "Rating",
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro",
					"spv-engineer",
					"admin-engineer",
					"user"
				],
				bullet: "dot",
				// icon: "flaticon-star",
				page: "/rating",
			},
		],
	},
	{
		title: "Ticketing",
		role: [
			"manager",
			"administrator",
			"spv-tro",
			"admin-tro",
			"spv-engineer",
			"admin-engineer",
			"engineer"
		],
		bullet: "dot",
		icon: "flaticon-security",
		submenu :[
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro",
					"spv-engineer",
				],
				title: "Calendar",
				page: "/publicCalendar",
			},
			{
			role: [
				"manager",
				"administrator",
				"spv-tro",
				"admin-tro",
			],
			title: "Ticketing",
			page: "/publicticket",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"spv-engineer",
					"admin-engineer"
				],
				title: "Ticketing (Spv)",
				page: "/publicSpvTicket",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro",
					"spv-engineer",
					"admin-engineer",
					"engineer",
					"user"
				],
				title: "Working Order",
				// icon: "flaticon2-send-1",
				page: "/publicdeliveryorder",
			},
			{
				title: "Rating",
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro",
					"spv-engineer",
					"admin-engineer",
					"user"
				],
				bullet: "dot",
				// icon: "flaticon-star",
				page: "/publicRating",
			},
		],
	},

	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// { 
	// 	section: "Inventory Management", 
	// 	role: [
	// 		"manager",
	// 		"administrator",
	// 		"spv-finance",
	// 		"admin-finance"
	// 	]
	// },
	// {
	// 	title: "Product",
	// 	role: ["administrator",
	// 		  ],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page : "/stockProduct",
	// },
	// {
	// 	title: "Stock In",
	// 	role: ["administrator",
	// 			"manager",
	// 			"spv-tro",
	// 			"admin-tro",
	// 			"customer-service"
	// 		  ],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page : "/stockIn",
	// },
	// {
	// 			role: [
	// 				"administrator",
	// 			],
	// 			bullet: "dot",
	// 			icon: "flaticon-truck",
	// 			title: "Request Stock Out",
	// 			page : "/requestStockOut",
	// },
	// {
	// 	title: "Stock Out",
	// 	role: ["administrator",
	// 		  ],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page : "/stockOut",
	// },
	// {
	// 	title: "Product Out",
	// 	role: ["administrator",
	// 			"manager",
	// 			"spv-tro",
	// 			"admin-tro",
	// 			"customer-service"
	// 		  ],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page : "/adjustOut",
	// },
	{ 
		section: "Operational", 
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		]
	},
	// {
	// 	title: "Purchasing",
	// 	role: [
	// 		"manager",
	// 		"administrator",
	// 		"spv-tro",
	// 		"admin-tro",
	// 		"spv-engineer",
	// 		"admin-engineer",
	// 		"engineer"
	// 	],
	// 	bullet: "dot",
	// 	icon: "flaticon-security",
	// 	submenu :[
	// 			{
	// 				title: "Purchase Request",
	// 				role: ["administrator",
	// 						"manager",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						"customer-service"
	// 					],
	// 				bullet: "dot",
	// 				page : "/purchaseRequest",
	// 			},
	// 			{
	// 				title: "Purchase Order",
	// 				role: ["administrator",
	// 						"manager",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						"customer-service"
	// 					],
	// 				bullet: "dot",
	// 				page : "/purchaseOrder",
	// 			},
	// 			{
	// 				title: "Quotation",
	// 				role: ["administrator",
	// 						"manager",
	// 						"spv-tro",
	// 						"admin-tro",
	// 						"customer-service"
	// 					],
	// 				bullet: "dot",
	// 				page : "/quotation",
	// 			},
	// 		]
	// },
	{
		title: "Request Invoice",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		bullet: "dot",
		icon: "flaticon2-writing",
		page: "/requestInvoice",
	},
	{
		title: "Invoice",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		bullet: "dot",
		icon: "flaticon2-writing",
		page: "/invoice",
	},
	{
		title: "Deposit",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		bullet: "dot",
		icon: "flaticon2-list",
		page: "/deposit",
	},
	{ 
		section: "Finance Accounting", 
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		]
	},
	{
		title: "COA",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		icon: "flaticon-coins",
		submenu: [
				{
					role: [
						"manager",
						"administrator",
						"spv-finance",
						"admin-finance"
					],
					title: "Account Type",
					page: "/accountType",
					
				},
				{
					role: [
						"manager",
						"administrator",
						"spv-finance",
						"admin-finance"
					],
					title: "Account",
					page: "/accountGroup",
				},
			],
	},
	{
		title: "Account Receive",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		bullet: "dot",
		icon: "flaticon2-line-chart",
		page: "/ar",
	},
	{
		title: "Account Payable",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		bullet: "dot",
		icon: "flaticon2-shopping-cart",
		page: "/ap",
	},
	{
		// title: "Cash Bank",
		title: "General Ledger",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		bullet: "dot",
		icon: "flaticon-coins",
		page: "/cashb",
	},
	{
		title: "Opening Balance",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			// "admin-finance"
		],
		icon: "flaticon-coins",
		page: "/openingBalance",
	},
	{
		title: "Budget Management",
		role: ["administrator",
			   "manager",
			   "spv-finance",
				],
		bullet: "dot",
		icon: "flaticon-truck",
		page: "/budgeting",
	},
	{
		title: "Petty Cash",
		role: [
			"administrator",
		],
		bullet: "dot",
		icon: "flaticon2-paper",
		page: "/pettyCast",
	},
	{
		title: "Asset",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		bullet: "dot",
		icon: "flaticon-folder-1",
		submenu :[
			{
			role: [
				"manager",
				"administrator",
				"spv-finance",
				"admin-finance"
			],
			title: "Asset Management",
			page: "/am",
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance"
				],
				title: "Asset Depreciation",
				page: "/assetDepreciation",
				},
		],
	},	
	{
		title: "Report",
		role: [
			"manager",
			"administrator",
			"spv-finance",
			"admin-finance"
		],
		bullet: "dot",
		icon: "flaticon2-paper",
		submenu: [
			{
				role: [
					"administrator",
				],
				title: "GL Summary",
				page: "/gl",
			},
			{
				role: [
					"administrator",
				],
				title: "GL Detail",
				page: "/gldetail",
			},
			{
				role: [
					"administrator",
				],
				title: "Trial Balance",
				page: "/trialBalance",
			},
			{
				role: [
					"administrator",
				],
				title: "Profit Loss",
				page: "/profitLoss",
			},
			{
				role: [
					"administrator",
				],
				title: "Account Budget",
				page: "/accountBudget",
			},
		]
	},
	{ 
		section: "Master Data", 
		role: [
			"manager",
			"administrator",
			"spv-tro",
			"admin-tro",
			"spv-finance",
			"admin-finance",
			"spv-engineer",
			"admin-engineer"
		]
	},
	{
		title: "Setup Master",
		role: [
			"manager",
			"administrator",
			"spv-tro",
			"admin-tro",
			"spv-finance",
			"admin-finance",
			"spv-engineer",
			"admin-engineer"
		],
		bullet: "dot",
		icon: "flaticon-interface-1",
		submenu: [
			{
				role: [
					"administrator",
					"spv-tro",
					"admin-tro",
					"manager",
					"spv-finance",
					"spv-engineer",
					"admin-engineer"
				],
				title: "Building Management",
				submenu :[
					{
						role: [
							"manager",
							"administrator",
							"spv-tro",
							"admin-tro"
						],
						title: "Project",
						page: "/bgroup",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-tro",
							"admin-tro"
						],
						title: "Block",
						page: "/block",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-tro",
							"admin-tro"
						],
						title: "Floor",
						page: "/floor",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-tro",
							"admin-tro"
						],
						title: "Unit Type",
						page: "/typeunit",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-finance"
						],
						title: "Unit Rate",
						page: "/rateunit",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-tro",
							"admin-tro",
							"spv-finance",
							"admin-finance"
						],
						title: "Unit",
						page: "/unit",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-finance",
							"spv-engineer",
							"admin-engineer"
						],
						title: "Master Electricity",
						submenu: [
							{
								role: [
									"manager",
									"administrator",
									"spv-finance"
								],
								title: "Rate",
								page: "/power-management/power/rate",
							},
							{
								role: [
									"manager",
									"administrator",
									"spv-finance"
								],
								title: "Rate Prabayar",
								page: "/power-management/power/rt-prabayar",
							},
							{
								role: [
									"manager",
									"administrator",
									"spv-finance",
									"spv-engineer",
									"admin-engineer"
								],
								title: "Electricity Meter",
								page: "/power-management/power/meter",
							},
						],
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-finance",
							"spv-engineer",
							"admin-engineer"
						],
						title: "Master Water",
						submenu: [
							{
								role: [
									"manager",
									"administrator",
									"spv-finance",
									
									
								],
								title: "Rate",
								page: "/water-management/water/rate",
							},
							{
								role: [
									"manager",
									"administrator",
									"spv-finance",
									"spv-engineer",
									"admin-engineer"
								],
								title: "Water Meter",
								page: "/water-management/water/meter",
							},
						],
					},
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
					{
						role: [
							"manager",
							"administrator",
							"spv-finance"
						],
						title: "Revenue Rental",
						page: "/revenue",
					},
				]
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance"
				],
				title: "Parking",
				submenu :[
					{
						role: [
							"manager",
							"administrator",
							"spv-finance",
							"admin-finance"
						],
						title: "Vehicle Type",
						page: "/vehicletype",
					},
				]
			},
			// {
			// 	role: ["administrator"],
			// 	title: "Pinalty Rate",
			// 	page: "/ratePinalty",
			// },
			{
				title: "User",
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro",
					"spv-engineer"
				],
				submenu: [
					{
						role:  "administrator",
						title: "Role",
						page:  "/role",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-tro",
							"admin-tro"
						],
						title: "Customer",
						page: "/customer",
					},
					{
						role: ["administrator"],
						title: "Management",
						page: "/user-management/users",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-tro",
							"spv-engineer"
						],
						title: "Engineer",
						page: "/engineer",
					},
					
				],
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance"
				],
				title: "Asset",
				submenu :[
					{
						role: [
							"manager",
							"administrator",
							"spv-finance",
							"admin-finance"
						],
						title: "Fiscal Asset",
						page: "/fiscal",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-finance",
							"admin-finance"
						],
						title: "Fixed  Asset",
						page: "/fixed",
					},
				]
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-engineer",
					"admin-engineer"
					
				],
				title: "Helpdesk",
				submenu :[
					{
						role: [
							"manager",
							"administrator",
							"spv-engineer",
							"admin-engineer"
						],
						title: "Category Ticket",
						submenu: [
							{
								role: [
									"manager",
									"administrator",
									"spv-engineer",
									"admin-engineer"
								],
								title: "Location",
								page: "/category",
							},
							{
								role: [
									"manager",
									"administrator",
									"spv-engineer",
									"admin-engineer"
								],
								title: "Detail Location",
								page: "/defect",
							},
							{
								role: [ "manager",
										"administrator",
									    "spv-engineer",
										"admin-engineer"],
								title: "Defect",
								page: "/subdefect",
							},
							
						],
					},
				]
			},
			{
				role: [
					"manager",
					"administrator",
					"spv-finance",
					"admin-finance"
				],
				title: "Finance & Accounting",
				submenu :[
					{
						role: [
							"manager",
							"administrator",
							"spv-finance",
							"admin-finance"
						],
						title: "Bank",
						submenu: [
							{
								role: [
									"manager",
									"administrator",
									"spv-finance",
									"admin-finance"
								],
								title: "Bank List",
								page: "/bank",
							},
							{
								role: [
									"manager",
									"administrator",
									"spv-finance",
									"admin-finance"
								],
								title: "Bank Account",
								page: "/accountBank",
							},
						],
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-finance",
							"admin-finance"
						],
						title: "Tax",
						page: "/tax",
						
					},
					{
						role: [
							"administrator",
						],
						title: "Currency",
						page: "/currency",
						
					},
				]
			},
			{
				role: [
					"administrator",
				],
				title: "Inventory",
				submenu :[
					{
						role: [
							"administrator",
						],
						title: "Product Category",
						page : "/productCategory",
					},
					{
						role: [
							"administrator",
						],
						title: "Product Brand",
						page : "/productBrand",
					},
					{
						role: [
							"manager",
							"administrator",
							"spv-finance",
							"admin-finance"
						],
						title: "Uom",
						page: "/uom",
					},
					
				]
			},
			// {
			// 	role: [
			// 		"administrator",
			// 	],
			// 	title: "Vendor",
			// 	submenu :[
			// 		{
			// 			role: [
			// 				"administrator",
			// 			],
			// 			title: "Vendor Category",
			// 			page : "/vndrCategory",
			// 		},
			// 		{
			// 			role: [
			// 				"administrator",
			// 			],
			// 			title: "Vendor",
			// 			page : "/vendor",
			// 		}
			// 	]
			// },
			// {
			// 	role: [
			// 		"administrator",
			// 	],
			// 	title: "Department",
			// 	page : "/department",
			// },
			// {
			// 	role: [
			// 		"administrator",
			// 	],
			// 	title: "Division",
			// 	page : "/division",
			// },
			{
				role: [
					"manager",
					"administrator",
					"spv-tro",
					"admin-tro"
				],
				title: "Facility Management",
				page : "/facility",
			},
			// {
			// 	role: [
			// 		"administrator",
			// 		"spv-tro",
			// 		"admin-tro",
			// 		"manager",
			// 		"spv-finance",
			// 		"spv-engineer",
			// 		"admin-engineer"
			// 	],
			// 	title: "Commersil",
			// 	submenu :[
			// 		{
			// 			role: [
			// 				"manager",
			// 				"administrator",
			// 				"spv-tro",
			// 				"admin-tro"
			// 			],
			// 			title: "Commersil Customer",
			// 			page : "/comCustomer",
			// 		},
			// 		{
			// 			role: [
			// 				"manager",
			// 				"administrator",
			// 				"spv-tro",
			// 				"admin-tro"
			// 			],
			// 			title: "Commersil Type",
			// 			page : "/comType",
			// 		},
			// 		{
			// 			role: [
			// 				"manager",
			// 				"administrator",
			// 				"spv-tro",
			// 				"admin-tro"
			// 			],
			// 			title: "Commersil Unit",
			// 			page : "/comUnit",
			// 		},
			// 	]
			// }
		],
	},
	// { 
	// 	section: "Log History", 
	// 	role: [
	// 		"administrator",
	// 	]
	// },
	// {
	// 	title: "Purchasing",
	// 	role: ["administrator"],
	// 	submenu :[
	// 		{
	// 			role: [
	// 				"administrator",
	// 			],
	// 			title: "Purchase Request",
	// 			page : "/logFinance/PR",
	// 		},
	// 		{
	// 			role: [
	// 				"administrator",
	// 			],
	// 			title: "Purchase Order",
	// 			page : "/logFinance/PO",
	// 		},
	// 		{
	// 			role: [
	// 				"administrator",
	// 			],
	// 			title: "Quotation",
	// 			page : "/logFinance/QU",
	// 		},
	// 	]
	// },
	// {
	// 	title: "Finance & Accounting",
	// 	role: ["administrator"],
	// 	submenu :[
	// 		{
	// 			role: [
	// 				"administrator",
	// 			],
	// 			title: "AR",
	// 			page : "/logFinance/AR",
	// 		},
	// 		{
	// 			role: [
	// 				"administrator",
	// 			],
	// 			title: "AP",
	// 			page : "/logFinance/AP",
	// 		},
	// 	]
	// },
	// {
	// 	title: "Inventory",
	// 	role: ["administrator"],
	// 	submenu :[
	// 		{
	// 			role: [
	// 				"administrator",
	// 			],
	// 			title: "Product",
	// 			page : "/logFinance/PD",
	// 		},
	// 		{
	// 			role: [
	// 				"administrator",
	// 			],
	// 			title: "Stock In",
	// 			page : "/logFinance/SI",
	// 		},
	// 		{
	// 			role: [
	// 				"administrator",
	// 			],
	// 			title: "Stock Out",
	// 			// page : "/billLog",
	// 		},
	// 	]
	// },
	// {
	// 	title: "Billing",
	// 	role: ["administrator"],
	// 	submenu :[
	// 		{
	// 			role: [
	// 				"administrator",
	// 			],
	// 			title: "IPL",
	// 			page : "/billLog",
	// 		},
	// 		// {
	// 		// 	role: [
	// 		// 		"administrator",
	// 		// 	],
	// 		// 	title: "Invoice",
	// 		// 	// page : "/billLog",
	// 		// },
	// 		// {
	// 		// 	role: [
	// 		// 		"administrator",
	// 		// 	],
	// 		// 	title: "Deposit",
	// 		// 	// page : "/billLog",
	// 		// },
	// 	]
	// },
	// {
	// 	title: "Log Package",
	// 	role: ["administrator"],
	// 	bullet: "dot",
	// 	icon: "flaticon-truck",
	// 	page: "/pkgs",
	// },
];

export default menus