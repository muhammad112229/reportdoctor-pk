export const site = {
  name: "ReportDoctor.pk",
  tagline: "Excel/CSV file upload karein, professional report hasil karein.",
  description:
    "ReportDoctor.pk helps Pakistani businesses turn Excel and CSV files into data quality checks, charts, plain-language insights, and downloadable PDF reports.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://reportdoctor.pk",
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@reportdoctor.pk"
};

export type Faq = {
  question: string;
  answer: string;
};

export type ToolPage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  summary: string;
  primaryAction: string;
  useCases: string[];
  features: string[];
  faq: Faq[];
};

export const toolPages: ToolPage[] = [
  {
    slug: "data-analyzer",
    title: "Excel/CSV Data Analyzer",
    metaTitle: "Excel/CSV Data Analyzer Online for Pakistan | ReportDoctor.pk",
    metaDescription:
      "Upload Excel or CSV files and get summaries, missing values, duplicate checks, charts, business insights, and PDF report options.",
    eyebrow: "Working analysis tool",
    summary:
      "Upload a spreadsheet and get an instant scan with column detection, missing values, duplicate rows, charts, and simple English plus Roman Urdu insights.",
    primaryAction: "Start Free Scan",
    useCases: ["Sales files", "Inventory sheets", "Survey results", "Expense records", "Customer lists"],
    features: [
      "CSV, XLSX, and XLS upload",
      "Automatic numeric, category, date, and text detection",
      "Free scan with limited summary and two charts",
      "Paid full PDF report workflow for manual Easypaisa and WhatsApp screenshot verification"
    ],
    faq: [
      {
        question: "Are uploaded files stored permanently?",
        answer:
          "No. In the MVP backend files are processed in memory and are not stored permanently unless you choose to add storage later."
      },
      {
        question: "Can beginners use this without knowing data analysis?",
        answer:
          "Yes. Beginner Mode explains detected columns and suggests which columns look like date, amount, product, customer, quantity, cost, or stock."
      },
      {
        question: "What file formats are supported?",
        answer: "CSV, XLSX, and XLS files are supported, with a default 10 MB upload limit."
      }
    ]
  },
  {
    slug: "sales-report-generator",
    title: "Sales Report Generator",
    metaTitle: "Sales Report Generator from Excel | ReportDoctor.pk",
    metaDescription:
      "Create sales summaries, top products, top customers, order values, trends, and profit estimates from Excel or CSV sales data.",
    eyebrow: "For shops and online sellers",
    summary:
      "Convert sales exports from Daraz, POS systems, or manual Excel sheets into understandable sales KPIs, charts, and recommendations.",
    primaryAction: "Analyze Sales File",
    useCases: ["Mobile shops", "Daraz sellers", "Retail stores", "Wholesale ledgers"],
    features: [
      "Total sales, order count, and average order value",
      "Top products and slow products",
      "Weekly or monthly trends when a date column exists",
      "Profit estimate when cost data is available"
    ],
    faq: [
      {
        question: "Which columns should a sales file include?",
        answer: "A good sales file has date, order ID, product, customer, amount, quantity, and optional cost columns."
      },
      {
        question: "Can it analyze Daraz seller exports?",
        answer: "Yes, upload the export as CSV or Excel and map the relevant columns if names are different."
      }
    ]
  },
  {
    slug: "inventory-report-generator",
    title: "Inventory Report Generator",
    metaTitle: "Inventory Report Generator from Excel | ReportDoctor.pk",
    metaDescription:
      "Upload inventory spreadsheets and find low stock, high stock, stock value, and slow-moving products.",
    eyebrow: "For stock control",
    summary:
      "Find low-stock and overstocked items quickly, estimate stock value, and prepare a practical reorder list for small businesses.",
    primaryAction: "Check Inventory",
    useCases: ["Grocery stores", "Mobile accessories", "Clinics", "Warehouses"],
    features: [
      "Low stock and high stock item detection",
      "Stock value if price or cost is available",
      "Slow-moving items if sales quantity exists",
      "Beginner-friendly column mapping"
    ],
    faq: [
      {
        question: "What columns should inventory data contain?",
        answer: "Product/item name and current stock are required. Cost, price, SKU, and sold quantity improve the report."
      },
      {
        question: "Can I download an inventory template?",
        answer: "Yes, the Templates page includes a starter inventory CSV template."
      }
    ]
  },
  {
    slug: "missing-values-checker",
    title: "Missing Values Checker",
    metaTitle: "Missing Values Checker for Excel and CSV | ReportDoctor.pk",
    metaDescription:
      "Find blank cells, missing values, and incomplete columns in Excel or CSV files before reporting.",
    eyebrow: "Data quality",
    summary:
      "Spot blank cells and incomplete columns before they cause wrong totals, weak charts, or confusing business reports.",
    primaryAction: "Find Missing Values",
    useCases: ["Survey cleaning", "Customer data", "Sales ledgers", "Research data"],
    features: [
      "Column-wise missing value counts",
      "Missing percentage chart",
      "Plain-language cleanup suggestions",
      "Works with CSV and Excel files"
    ],
    faq: [
      {
        question: "Why do missing values matter?",
        answer: "Missing values can make totals, averages, filters, and charts misleading if they are not reviewed."
      },
      {
        question: "Does this remove missing values automatically?",
        answer: "The MVP reports missing values and gives suggestions. Automatic cleaning should be reviewed by the user."
      }
    ]
  },
  {
    slug: "duplicate-rows-finder",
    title: "Duplicate Rows Finder",
    metaTitle: "Duplicate Rows Finder for Excel and CSV | ReportDoctor.pk",
    metaDescription:
      "Upload Excel or CSV data and find repeated rows that can inflate totals, customer counts, or survey results.",
    eyebrow: "Data quality",
    summary:
      "Catch repeated records before they double-count sales, customers, inventory items, or survey responses.",
    primaryAction: "Check Duplicates",
    useCases: ["CRM lists", "Order exports", "Survey forms", "Stock sheets"],
    features: [
      "Total duplicate row count",
      "Duplicate risk explanation",
      "Data quality report section",
      "CSV and Excel support"
    ],
    faq: [
      {
        question: "What is a duplicate row?",
        answer: "A duplicate row is a record that exactly matches another row across all columns."
      },
      {
        question: "Can duplicate rows affect sales reports?",
        answer: "Yes. Duplicate order rows can inflate total sales, order counts, product counts, and customer totals."
      }
    ]
  },
  {
    slug: "survey-data-analyzer",
    title: "Survey Data Analyzer",
    metaTitle: "Survey Data Analyzer Online | ReportDoctor.pk",
    metaDescription:
      "Analyze survey Excel and CSV files with response counts, question summaries, categorical charts, and numeric averages.",
    eyebrow: "For forms and research",
    summary:
      "Turn survey exports into response summaries, charts, and simple findings for NGOs, academies, clinics, and student researchers.",
    primaryAction: "Analyze Survey",
    useCases: ["Google Forms exports", "NGO surveys", "Student research", "Clinic feedback"],
    features: [
      "Response count",
      "Question-wise summaries",
      "Categorical answer charts",
      "Numeric average scores"
    ],
    faq: [
      {
        question: "Can this analyze Google Forms exports?",
        answer: "Yes. Export responses as CSV or Excel, then upload the file to the analyzer."
      },
      {
        question: "Does it create research conclusions?",
        answer: "It creates useful summaries and insights, but the final interpretation should be reviewed by the researcher."
      }
    ]
  },
  {
    slug: "csv-to-pdf-report-generator",
    title: "CSV to PDF Report Generator",
    metaTitle: "CSV to PDF Report Generator | ReportDoctor.pk",
    metaDescription:
      "Convert CSV data into a structured PDF report with summaries, charts, insights, recommendations, and disclaimer.",
    eyebrow: "Downloadable reports",
    summary:
      "Create a professional PDF-style report from CSV data after a free scan and manual paid report unlock.",
    primaryAction: "Generate PDF Report",
    useCases: ["Monthly reports", "Client reporting", "Shop performance", "Research summaries"],
    features: [
      "Cover page and dataset summary",
      "Data quality section",
      "Charts and recommendations",
      "Manual payment workflow placeholder for MVP"
    ],
    faq: [
      {
        question: "Is PDF export free?",
        answer:
          "The MVP includes a free scan. Full PDF export is shown as a paid report option with manual payment instructions."
      },
      {
        question: "Can I customize the PDF later?",
        answer: "Yes. The backend PDF utility is organized so branding, sections, and pricing can be updated."
      }
    ]
  }
];

export const sampleReports = [
  {
    slug: "mobile-shop-sales-report",
    title: "Mobile Shop Sales Report",
    description: "A sample sales dashboard and PDF flow for a mobile accessories shop.",
    pdf: "/sample-reports/mobile-shop-sales-report.pdf"
  },
  {
    slug: "daraz-seller-sales-report",
    title: "Daraz Seller Sales Report",
    description: "A seller-friendly example focused on revenue, top SKUs, returns, and slow products.",
    pdf: "/sample-reports/daraz-seller-sales-report.pdf"
  },
  {
    slug: "tuition-academy-fee-report",
    title: "Tuition Academy Fee Report",
    description: "Fee collection, outstanding dues, and class-wise revenue example.",
    pdf: "/sample-reports/tuition-academy-fee-report.pdf"
  },
  {
    slug: "clinic-patient-report",
    title: "Clinic Patient Report",
    description: "Patient visit and service trend report for a small clinic.",
    pdf: "/sample-reports/clinic-patient-report.pdf"
  },
  {
    slug: "inventory-report",
    title: "Inventory Report",
    description: "Low stock, stock value, and slow-moving item sample report.",
    pdf: "/sample-reports/inventory-report.pdf"
  }
];

export const templates = [
  {
    name: "Sales Template",
    description: "Date, order ID, product, customer, quantity, amount, and cost columns.",
    href: "/templates/sales-template.csv"
  },
  {
    name: "Inventory Template",
    description: "SKU, item, category, stock, reorder level, cost, price, and sold quantity.",
    href: "/templates/inventory-template.csv"
  },
  {
    name: "Expense Template",
    description: "Date, category, vendor, amount, payment method, and notes.",
    href: "/templates/expense-template.csv"
  },
  {
    name: "Customer Template",
    description: "Customer name, city, phone, last purchase date, total spend, and segment.",
    href: "/templates/customer-template.csv"
  },
  {
    name: "Survey Template",
    description: "Response ID, date, respondent group, rating, and question columns.",
    href: "/templates/survey-template.csv"
  }
];

export const pricingTiers = [
  {
    name: "Free Scan",
    price: "Rs. 0",
    description: "Quick data quality and summary preview for beginners.",
    features: ["Upload CSV or Excel", "Dataset shape and columns", "Missing and duplicate checks", "2 charts", "Limited insights"],
    action: "Start Free Scan"
  },
  {
    name: "Single Full Report",
    price: "Rs. 1,500",
    description: "Manual payment MVP option for one full PDF report.",
    features: ["Full charts", "Business mode analysis", "English and Roman Urdu insights", "PDF report", "Recommendations"],
    action: "Request Full Report"
  },
  {
    name: "Business Monthly",
    price: "Rs. 9,500",
    description: "For shops, academies, clinics, or sellers that need recurring reports.",
    features: ["Up to 10 reports", "Template setup help", "Monthly trend tracking", "Priority review", "Custom recommendations"],
    action: "Contact Us"
  }
];

function cleanPublicValue(value: string | undefined, placeholders: string[] = []) {
  const trimmed = value?.trim() || "";
  return placeholders.includes(trimmed) ? "" : trimmed;
}

export const paymentOptions = {
  jazzcash: cleanPublicValue(process.env.NEXT_PUBLIC_JAZZCASH_NUMBER, ["03XX-XXXXXXX"]),
  easypaisa: cleanPublicValue(process.env.NEXT_PUBLIC_EASYPAISA_NUMBER, ["03XX-XXXXXXX"]) || "03100906678",
  bank:
    cleanPublicValue(process.env.NEXT_PUBLIC_BANK_DETAILS, ["Bank name / account title / IBAN"]) ||
    "Available on WhatsApp",
  whatsapp: cleanPublicValue(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, ["923000000000"]) || "923100906678"
};

export const blogPosts = [
  {
    slug: "how-to-analyze-excel-data-online",
    title: "How to Analyze Excel Data Online",
    description: "A beginner guide to uploading Excel data, checking quality, creating charts, and reading insights.",
    body: [
      "Online Excel analysis is useful when you need a quick report but do not want to build formulas from scratch. Start by checking that every column has a clear heading, dates are in one format, and amounts are numeric.",
      "After upload, review dataset shape, missing values, duplicate rows, and column types. These checks catch many common mistakes before charts are created.",
      "For business users in Pakistan, a simple workflow works best: upload file, choose business mode, review suggestions, then download or request the full report."
    ]
  },
  {
    slug: "how-to-create-a-sales-report-from-excel",
    title: "How to Create a Sales Report from Excel",
    description: "Learn the essential columns and KPIs for a useful Excel sales report.",
    body: [
      "A strong sales report needs date, order ID, product, customer, quantity, amount, and optional cost. These columns make it possible to calculate total sales, order count, average order value, and profit.",
      "Group sales by month to understand seasonality. Group by product to find winners and weak items. If customer data exists, identify repeat buyers and high-value customers.",
      "Before sharing the report, check duplicates and missing amounts. Even a few duplicate orders can make a small business report misleading."
    ]
  },
  {
    slug: "how-to-find-missing-values-in-excel-and-csv-files",
    title: "How to Find Missing Values in Excel and CSV Files",
    description: "Why blanks matter and how to find incomplete fields before reporting.",
    body: [
      "Missing values are blank or unavailable cells. They can appear because a form was skipped, a system export was incomplete, or the wrong file format was used.",
      "Review missing values column by column. A missing phone number may be acceptable, but a missing amount, date, or product name can damage a business report.",
      "For important files, keep a copy of the original data before cleaning. Then decide whether each blank should be filled, removed, or marked as unknown."
    ]
  },
  {
    slug: "how-to-remove-duplicate-rows-from-excel-data",
    title: "How to Remove Duplicate Rows from Excel Data",
    description: "Find repeated records and decide when duplicates should be removed.",
    body: [
      "Duplicate rows are repeated records. In sales data they can double-count revenue. In customer data they can inflate the size of a contact list.",
      "Before removing duplicates, confirm whether they are truly accidental. Two orders from the same customer are not duplicates if order IDs or dates are different.",
      "Use a report tool to count exact duplicate rows first, then review samples manually before deleting anything."
    ]
  },
  {
    slug: "how-to-calculate-profit-and-loss-from-sales-data",
    title: "How to Calculate Profit and Loss from Sales Data",
    description: "Use sales amount, cost, and expense data to estimate profit.",
    body: [
      "Profit is usually sales minus cost and expenses. At product level, the basic calculation is revenue minus product cost. If quantity is available, multiply unit cost by quantity.",
      "A useful Excel report separates revenue, cost of goods, discounts, delivery charges, platform fees, and other expenses.",
      "For MVP analysis, cost columns can estimate gross profit. For accounting decisions, always review the report with complete records."
    ]
  },
  {
    slug: "how-daraz-sellers-can-analyze-sales-data",
    title: "How Daraz Sellers Can Analyze Sales Data",
    description: "Practical reporting ideas for Daraz sellers using CSV or Excel exports.",
    body: [
      "Daraz sellers can use exports to track top SKUs, cancelled orders, returned items, monthly revenue, and slow products. The key is to keep SKU, product, order date, quantity, and net amount columns clean.",
      "Start with product-level sales. Then compare monthly trends and identify items that sell often but produce weak profit after cost and fees.",
      "Use the same template each month so trend reports become easier and more reliable."
    ]
  },
  {
    slug: "how-small-businesses-can-track-inventory-in-excel",
    title: "How Small Businesses Can Track Inventory in Excel",
    description: "A simple inventory structure for shops and small warehouses.",
    body: [
      "Small businesses can track inventory with SKU, item name, category, current stock, reorder level, cost, price, and sold quantity. This is enough to find low-stock and overstocked items.",
      "Update stock consistently. A stock report is only useful when receiving, selling, and returning items are recorded.",
      "Review slow-moving products monthly. They may need discounts, bundles, or lower reorder quantities."
    ]
  },
  {
    slug: "what-is-csv-and-how-to-use-it",
    title: "What Is CSV and How to Use It",
    description: "A beginner explanation of CSV files and how they differ from Excel workbooks.",
    body: [
      "CSV means comma-separated values. It is a simple text format where each row is a record and columns are separated by commas.",
      "CSV files open in Excel, Google Sheets, and most business tools. They are lightweight and common for exports from marketplaces, forms, and POS systems.",
      "CSV does not store formulas, multiple sheets, or formatting. For reporting, that simplicity is often helpful."
    ]
  },
  {
    slug: "how-to-create-a-monthly-business-report",
    title: "How to Create a Monthly Business Report",
    description: "A practical monthly reporting checklist for owners and managers.",
    body: [
      "A monthly business report should answer simple questions: what changed, what sold, what is low in stock, what expenses increased, and what needs attention next month.",
      "Use consistent templates for sales, inventory, expenses, and customer records. Consistency makes month-to-month comparison easier.",
      "Add recommendations at the end of the report so the owner can act instead of only looking at charts."
    ]
  },
  {
    slug: "common-excel-data-mistakes-and-how-to-fix-them",
    title: "Common Excel Data Mistakes and How to Fix Them",
    description: "Avoid wrong totals and confusing reports by fixing common spreadsheet issues.",
    body: [
      "Common Excel mistakes include merged headers, blank column names, mixed date formats, text stored as numbers, duplicate rows, and inconsistent product names.",
      "Fix the structure before analysis. One row should represent one record, and each column should represent one field.",
      "When in doubt, run a data quality scan first. It is faster to fix structure early than to repair a report after charts look wrong."
    ]
  }
];

export function getToolBySlug(slug: string) {
  return toolPages.find((tool) => tool.slug === slug);
}

export function absoluteUrl(path = "") {
  return `${site.url}${path}`;
}
