import type { Faq } from "@/lib/site";

export type SeoLandingPage = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  summary: string;
  audience: string;
  primaryKeyword: string;
  fileExamples: string[];
  columns: string[];
  checks: string[];
  outcomes: string[];
  mistakes: string[];
  related: { label: string; href: string }[];
  faqs: Faq[];
};

export const seoLandingPages: SeoLandingPage[] = [
  {
    slug: "excel-data-analyzer",
    title: "Excel Data Analyzer Online",
    metaTitle: "Excel Data Analyzer Online | ReportDoctor.pk",
    metaDescription:
      "Upload Excel files and get a free scan with missing values, duplicate rows, charts, insights, and a paid PDF report option.",
    eyebrow: "Excel analysis",
    summary:
      "Analyze Excel spreadsheets without building formulas from scratch. ReportDoctor.pk checks file quality, recommends dashboards, creates charts, and explains the results in plain English.",
    audience: "business owners, ecommerce sellers, operations teams, researchers, students, and analysts",
    primaryKeyword: "Excel data analyzer",
    fileExamples: ["monthly sales workbooks", "inventory sheets", "Google Sheets exports", "academy fee records"],
    columns: ["date", "amount", "product", "customer", "quantity", "cost", "stock", "city"],
    checks: ["missing cells", "duplicate rows", "column types", "numeric summaries", "top categories", "trend-ready dates"],
    outcomes: ["cleaner spreadsheets", "faster review", "better report decisions", "PDF-ready summaries"],
    mistakes: ["merged headings", "blank column names", "mixed date formats", "amounts saved as text"],
    related: [
      { label: "Start Free Scan", href: "/free-scan" },
      { label: "CSV Report Generator", href: "/csv-report-generator" },
      { label: "Missing Values Checker", href: "/missing-values-checker" }
    ],
    faqs: [
      {
        question: "Can I upload Excel files directly?",
        answer: "Yes. ReportDoctor.pk supports XLSX and XLS files, plus CSV files, with a default public upload limit of 10 MB."
      },
      {
        question: "Does the free scan create a full PDF?",
        answer: "The free scan shows a useful preview. Paid report credits unlock the full PDF report; manual local payment support is available during launch."
      },
      {
        question: "Do I need to prepare formulas first?",
        answer: "No. The tool detects common columns and creates summaries from the uploaded file, but clean headings improve the result."
      },
      {
        question: "Is it safe for sensitive files?",
        answer: "Files are processed for analysis, but users should not upload highly sensitive personal, banking, or confidential files."
      }
    ]
  },
  {
    slug: "csv-report-generator",
    title: "CSV Report Generator",
    metaTitle: "CSV Report Generator with PDF Option | ReportDoctor.pk",
    metaDescription:
      "Turn CSV files into data diagnosis, smart dashboards, business insights, and downloadable PDF reports.",
    eyebrow: "CSV reports",
    summary:
      "Upload a CSV export from a business tool, marketplace, form, or spreadsheet and turn it into an understandable report preview with charts, insights, and a full PDF unlock workflow.",
    audience: "users who export reports from POS software, ecommerce platforms, Google Forms, accounting sheets, and custom systems",
    primaryKeyword: "CSV report generator",
    fileExamples: ["POS exports", "ecommerce order CSV files", "survey response CSV files", "customer lists"],
    columns: ["order date", "order id", "item", "amount", "category", "rating", "stock", "response group"],
    checks: ["CSV headers", "blank rows", "duplicate records", "missing values", "numeric fields", "category counts"],
    outcomes: ["shareable summaries", "cleaner CSV files", "fewer manual formulas", "PDF report requests"],
    mistakes: ["extra comma issues", "missing headers", "different spellings for the same item", "text in amount columns"],
    related: [
      { label: "Free CSV Scan", href: "/free-scan" },
      { label: "CSV to PDF Tool", href: "/tools/csv-to-pdf-report-generator" },
      { label: "Duplicate Row Finder", href: "/duplicate-row-finder" }
    ],
    faqs: [
      {
        question: "What kind of CSV file works best?",
        answer: "A clean CSV with one header row, consistent columns, and one record per row gives the best scan and report output."
      },
      {
        question: "Can I convert a CSV to a PDF report?",
        answer: "Yes. The free scan previews the analysis, and a paid unlock code enables the full PDF report download."
      },
      {
        question: "Can this handle survey CSV exports?",
        answer: "Yes. Choose Survey Data mode for response counts, rating summaries, category charts, and simple insights."
      },
      {
        question: "Does it edit my CSV file?",
        answer: "No. It analyzes the uploaded file and reports issues. Keep your original file and make edits manually after review."
      }
    ]
  },
  {
    slug: "sales-report-generator",
    title: "Sales Report Generator",
    metaTitle: "Sales Report Generator from Excel or CSV | ReportDoctor.pk",
    metaDescription:
      "Create sales summaries from Excel or CSV files with revenue checks, top products, trends, missing values, and PDF reports.",
    eyebrow: "Sales reporting",
    summary:
      "Convert retail, ecommerce, or service sales files into a practical sales report with total sales, order counts, top products, trends, and data quality warnings.",
    audience: "retail teams, ecommerce sellers, wholesalers, academies, and service businesses",
    primaryKeyword: "sales report generator",
    fileExamples: ["monthly sales ledgers", "ecommerce seller exports", "retail order files", "service invoice sheets"],
    columns: ["date", "order id", "product", "customer", "quantity", "amount", "cost", "channel"],
    checks: ["total sales", "average order value", "top products", "duplicate orders", "missing amounts", "cost availability"],
    outcomes: ["clearer sales performance", "faster monthly review", "better stock decisions", "professional PDF reporting"],
    mistakes: ["duplicate order rows", "missing sale amounts", "cost columns left blank", "dates written in mixed formats"],
    related: [
      { label: "Analyze Sales File", href: "/free-scan" },
      { label: "Profit Loss Calculator", href: "/profit-loss-calculator" },
      { label: "Sales Tool Page", href: "/tools/sales-report-generator" }
    ],
    faqs: [
      {
        question: "Which columns should a sales report file include?",
        answer: "Useful sales files include date, product, customer, quantity, amount, and optional cost or channel columns."
      },
      {
        question: "Can it estimate profit?",
        answer: "Yes, if the file includes cost data. Without cost, the report focuses on revenue, counts, trends, and top categories."
      },
      {
        question: "Can ecommerce sellers use it?",
        answer: "Yes. Export orders as CSV or Excel, upload the file, and review the detected columns and sales summary."
      },
      {
        question: "Will it replace accounting software?",
        answer: "No. It is a reporting helper. Review generated reports before accounting, tax, or business decisions."
      }
    ]
  },
  {
    slug: "inventory-report-generator",
    title: "Inventory Report Generator",
    metaTitle: "Inventory Report Generator from Excel | ReportDoctor.pk",
    metaDescription:
      "Upload inventory Excel or CSV files to find low stock, stock value, slow items, missing values, and PDF report options.",
    eyebrow: "Inventory reporting",
    summary:
      "Turn a stock sheet into an inventory report that highlights low stock, stock value, reorder risks, slow-moving items, and data quality issues.",
    audience: "retail teams, clinics, warehouses, ecommerce sellers, school stores, and small distributors",
    primaryKeyword: "inventory report generator",
    fileExamples: ["stock ledgers", "SKU lists", "warehouse sheets", "retail inventory exports"],
    columns: ["sku", "item", "category", "current stock", "reorder level", "cost", "price", "sold quantity"],
    checks: ["low stock", "stock value", "slow movers", "missing SKU values", "duplicate items", "category summaries"],
    outcomes: ["better reorder planning", "clear stock risk lists", "less manual counting", "PDF inventory summaries"],
    mistakes: ["same item under different spellings", "missing reorder levels", "old stock counts", "cost and price mixed together"],
    related: [
      { label: "Check Inventory", href: "/free-scan" },
      { label: "Inventory Tool Page", href: "/tools/inventory-report-generator" },
      { label: "Download Templates", href: "/templates" }
    ],
    faqs: [
      {
        question: "What columns are best for inventory analysis?",
        answer: "Item name, current stock, reorder level, cost, price, category, SKU, and sold quantity are the most useful columns."
      },
      {
        question: "Can it find low-stock items?",
        answer: "Yes. If stock and reorder level columns are present, the report can highlight items that need attention."
      },
      {
        question: "Can it calculate stock value?",
        answer: "Yes, when current stock and cost or price columns exist in the uploaded file."
      },
      {
        question: "Can I use a template?",
        answer: "Yes. The templates page includes a starter inventory CSV template for cleaner uploads."
      }
    ]
  },
  {
    slug: "missing-values-checker",
    title: "Missing Values Checker",
    metaTitle: "Missing Values Checker for Excel and CSV | ReportDoctor.pk",
    metaDescription:
      "Find blank cells and incomplete columns in Excel or CSV files before creating business reports, charts, or PDFs.",
    eyebrow: "Data quality",
    summary:
      "Find missing values before they damage totals, averages, charts, customer lists, sales summaries, or survey conclusions.",
    audience: "business owners, analysts, students, researchers, survey teams, and admin staff",
    primaryKeyword: "missing values checker",
    fileExamples: ["sales files with blank amounts", "survey exports", "customer lists", "inventory sheets"],
    columns: ["amount", "date", "phone", "rating", "stock", "product", "city", "remarks"],
    checks: ["blank cells", "missing percentages", "incomplete columns", "risky business fields", "sample values", "column profile"],
    outcomes: ["cleaner reports", "safer decisions", "better charts", "clear cleanup priorities"],
    mistakes: ["hidden blanks", "spaces that look like values", "important columns left incomplete", "headers without useful names"],
    related: [
      { label: "Find Missing Values", href: "/free-scan" },
      { label: "Duplicate Row Finder", href: "/duplicate-row-finder" },
      { label: "Missing Values Tool Page", href: "/tools/missing-values-checker" }
    ],
    faqs: [
      {
        question: "Why should I check missing values before reporting?",
        answer: "Missing values can make totals, averages, charts, and business conclusions misleading if they are not reviewed."
      },
      {
        question: "Does the tool fill missing values automatically?",
        answer: "No. It reports missing values and gives guidance. Users should review the file before changing source data."
      },
      {
        question: "Can it show which columns have the most blanks?",
        answer: "Yes. The scan includes missing counts and percentages by column."
      },
      {
        question: "Is a blank phone number always a problem?",
        answer: "Not always. A missing amount or date is usually more serious than an optional phone or notes field."
      }
    ]
  },
  {
    slug: "duplicate-row-finder",
    title: "Duplicate Row Finder",
    metaTitle: "Duplicate Row Finder for Excel and CSV | ReportDoctor.pk",
    metaDescription:
      "Upload Excel or CSV files and find duplicate rows that can inflate sales, customer counts, stock records, or survey totals.",
    eyebrow: "Data cleanup",
    summary:
      "Find repeated rows before they double-count revenue, customers, inventory items, survey responses, or monthly totals.",
    audience: "people cleaning sales ledgers, CRM exports, survey files, inventory records, and order sheets",
    primaryKeyword: "duplicate row finder",
    fileExamples: ["order exports", "customer lists", "stock sheets", "survey responses"],
    columns: ["order id", "customer", "product", "amount", "date", "sku", "response id", "phone"],
    checks: ["exact duplicate rows", "duplicate risk", "row count", "unique values", "duplicate-sensitive columns", "data quality summary"],
    outcomes: ["more reliable totals", "cleaner lists", "better reporting confidence", "fewer inflated counts"],
    mistakes: ["copy-pasted rows", "same export imported twice", "duplicate survey responses", "old and new records mixed together"],
    related: [
      { label: "Check Duplicates", href: "/free-scan" },
      { label: "Missing Values Checker", href: "/missing-values-checker" },
      { label: "Duplicate Tool Page", href: "/tools/duplicate-rows-finder" }
    ],
    faqs: [
      {
        question: "What is a duplicate row?",
        answer: "A duplicate row is an exact repeated record across the file. It can make totals and counts too high."
      },
      {
        question: "Does the tool delete duplicates?",
        answer: "No. It reports duplicate row counts. Users should confirm whether duplicates are mistakes before deleting anything."
      },
      {
        question: "Can duplicate rows affect sales reports?",
        answer: "Yes. Repeated order rows can inflate sales, quantities, top products, customer counts, and averages."
      },
      {
        question: "Can two similar rows be valid?",
        answer: "Yes. Two orders from the same customer can be valid if order IDs, dates, products, or amounts are different."
      }
    ]
  },
  {
    slug: "survey-data-analyzer",
    title: "Survey Data Analyzer",
    metaTitle: "Survey Data Analyzer for Excel and CSV | ReportDoctor.pk",
    metaDescription:
      "Analyze survey Excel or CSV responses with missing answers, duplicate responses, rating summaries, charts, and PDF report options.",
    eyebrow: "Survey analysis",
    summary:
      "Turn survey exports into response summaries, rating checks, category charts, missing answer warnings, and plain-language findings.",
    audience: "students, NGOs, clinics, academies, training teams, research groups, and feedback collectors",
    primaryKeyword: "survey data analyzer",
    fileExamples: ["Google Forms exports", "feedback forms", "training surveys", "clinic satisfaction sheets"],
    columns: ["response id", "response date", "respondent group", "rating", "service quality", "comments", "city", "age group"],
    checks: ["response count", "missing answers", "duplicate responses", "rating averages", "category counts", "comment availability"],
    outcomes: ["faster survey summaries", "cleaner findings", "presentation-ready charts", "PDF reporting support"],
    mistakes: ["duplicate responses", "blank required answers", "rating scales mixed together", "comments stored in unclear columns"],
    related: [
      { label: "Analyze Survey", href: "/free-scan" },
      { label: "Survey Tool Page", href: "/tools/survey-data-analyzer" },
      { label: "Download Survey Template", href: "/templates" }
    ],
    faqs: [
      {
        question: "Can I upload Google Forms responses?",
        answer: "Yes. Export responses as CSV or Excel and choose Survey Data mode on the free scan page."
      },
      {
        question: "Can it summarize ratings?",
        answer: "Yes. Numeric rating columns can be summarized, and categorical answers can be shown in charts."
      },
      {
        question: "Does it write final research conclusions?",
        answer: "It gives useful summaries and insights, but final conclusions should be reviewed by the researcher or project owner."
      },
      {
        question: "Can survey reports include simple language guidance?",
        answer: "Yes. The scan includes plain-language guidance to make findings easier to understand."
      }
    ]
  },
  {
    slug: "profit-loss-calculator",
    title: "Profit Loss Calculator from Sales Data",
    metaTitle: "Profit Loss Calculator from Excel Sales Data | ReportDoctor.pk",
    metaDescription:
      "Estimate profit and loss from Excel or CSV sales data using revenue, cost, quantity, products, and simple business insights.",
    eyebrow: "Profit analysis",
    summary:
      "Use sales and cost columns to estimate gross profit, review product performance, and understand whether revenue is turning into useful margin.",
    audience: "small businesses, online sellers, retail teams, wholesalers, service providers, and finance helpers",
    primaryKeyword: "profit loss calculator",
    fileExamples: ["sales sheets with cost columns", "product ledgers", "monthly revenue files", "ecommerce exports with item cost added"],
    columns: ["date", "product", "quantity", "amount", "cost", "customer", "channel", "category"],
    checks: ["revenue", "cost availability", "gross profit estimate", "top products", "missing cost values", "duplicate sales rows"],
    outcomes: ["better margin visibility", "clearer pricing questions", "profit-focused reporting", "PDF report workflow"],
    mistakes: ["cost missing for some products", "revenue and profit treated as the same thing", "discounts not recorded", "duplicate orders"],
    related: [
      { label: "Calculate from Sales File", href: "/free-scan" },
      { label: "Sales Report Generator", href: "/sales-report-generator" },
      { label: "CSV Report Generator", href: "/csv-report-generator" }
    ],
    faqs: [
      {
        question: "Can ReportDoctor.pk calculate exact accounting profit?",
        answer: "It can estimate gross profit when cost data exists. Exact accounting profit requires complete expenses and professional review."
      },
      {
        question: "Which columns are needed for profit analysis?",
        answer: "Amount, cost, product, quantity, and date columns are the most helpful. More complete files produce better insights."
      },
      {
        question: "Can it find products with weak margin?",
        answer: "The report can highlight product-level sales and cost-based estimates when the uploaded data supports it."
      },
      {
        question: "Should I use the report for tax filing?",
        answer: "No. Reports are automatically generated and should be reviewed before business, tax, or accounting decisions."
      }
    ]
  }
];

export function getSeoLandingBySlug(slug: string) {
  return seoLandingPages.find((page) => page.slug === slug);
}
