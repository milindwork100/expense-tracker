const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");
const Transaction = require("../models/Transaction");

exports.exportCSV = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { user: req.user._id };

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean();

    const fields = ["date", "type", "category", "amount", "note"];
    const data = transactions.map((t) => ({
      date: new Date(t.date).toISOString().split("T")[0], // YYYY-MM-DD
      type: t.type,
      category: t.category,
      amount: t.amount,
      note: t.note || "",
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment(`transactions-${year || "all"}-${month || ""}.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportPDF = async (req, res) => {
  try {
    const { month, year } = req.query;
    const query = { user: req.user._id };

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .lean();

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const doc = new PDFDocument({ margin: 40 });

    res.header("Content-Type", "application/pdf");
    res.attachment(`transactions-${year || "all"}-${month || ""}.pdf`);
    doc.pipe(res);

    // Header
    doc.fontSize(20).text("Expense Tracker Report", { align: "center" });
    doc.moveDown();
    doc
      .fontSize(10)
      .fillColor("#666")
      .text(`Generated on ${new Date().toLocaleDateString()}`, {
        align: "center",
      });
    doc.moveDown(2);

    // Summary
    doc.fontSize(12).fillColor("#000");
    doc.text(`Total Income: Rs. ${totalIncome.toLocaleString()}`);
    doc.text(`Total Expense: Rs. ${totalExpense.toLocaleString()}`);
    doc.text(
      `Net Balance: Rs. ${(totalIncome - totalExpense).toLocaleString()}`,
    );
    doc.moveDown(1.5);

    // Table header
    const tableTop = doc.y;
    doc.fontSize(10).fillColor("#000");
    doc.text("Date", 40, tableTop, { width: 80 });
    doc.text("Type", 120, tableTop, { width: 60 });
    doc.text("Category", 180, tableTop, { width: 100 });
    doc.text("Note", 280, tableTop, { width: 150 });
    doc.text("Amount", 440, tableTop, { width: 80, align: "right" });

    doc
      .moveTo(40, tableTop + 15)
      .lineTo(520, tableTop + 15)
      .stroke();

    let y = tableTop + 22;

    transactions.forEach((t) => {
      if (y > 750) {
        doc.addPage();
        y = 40;
      }
      doc.fontSize(9).fillColor("#333");
      doc.text(new Date(t.date).toLocaleDateString(), 40, y, { width: 80 });
      doc.text(t.type, 120, y, { width: 60 });
      doc.text(t.category, 180, y, { width: 100 });
      doc.text(t.note || "-", 280, y, { width: 150 });
      doc.fillColor(t.type === "income" ? "#16a34a" : "#dc2626");
      doc.text(`Rs. ${t.amount.toLocaleString()}`, 440, y, {
        width: 80,
        align: "right",
      });
      y += 20;
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
