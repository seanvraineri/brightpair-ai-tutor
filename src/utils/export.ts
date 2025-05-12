import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportData {
  active_students?: number;
  hours?: number;
  avg_score?: number;
  low_mastery?: number;
}

export const exportPdf = (data: ReportData) => {
  const doc = new jsPDF();
  doc.text("BrightPair Monthly Report", 14, 20);
  
  autoTable(doc, {
    startY: 30,
    body: [
      ['Active Students', data.active_students?.toString() || 'N/A'],
      ['Hours', data.hours ? Math.round(data.hours / 3600).toString() : 'N/A'],
      ['Avg Score', data.avg_score ? Math.round(data.avg_score).toString() : 'N/A'],
      ['Mastery Progress', data.low_mastery ? `${Math.round((1 - data.low_mastery) * 100)}%` : 'N/A']
    ]
  });
  
  doc.save("report.pdf");
};

export const exportCsv = (rows: string[][]) => {
  const csv = rows.map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "report.csv";
  link.click();
}; 