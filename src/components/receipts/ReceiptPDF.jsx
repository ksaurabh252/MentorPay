
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  header: { fontSize: 20, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  table: { display: "flex", width: "100%", marginBottom: 10 },
  row: { flexDirection: "row", borderBottom: "1px solid #eee", padding: 5 },
  cellHeader: { width: "25%", fontWeight: "bold" },
  cell: { width: "25%" },
  totalRow: { flexDirection: "row", marginTop: 10, fontWeight: "bold" },
});

const ReceiptPDF = ({ receiptData }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>MENTOR PAYMENT RECEIPT</Text>

      <View style={{ marginBottom: 15 }}>
        <Text>Mentor: {receiptData.mentorName}</Text>
        <Text>Generated on: {receiptData.date}</Text>
      </View>

      {/* Sessions Table */}
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cellHeader}>Date</Text>
          <Text style={styles.cellHeader}>Type</Text>
          <Text style={styles.cellHeader}>Duration</Text>
          <Text style={styles.cellHeader}>Amount (₹)</Text>
        </View>

        {receiptData.sessions.map((session, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.cell}>{session.date}</Text>
            <Text style={styles.cell}>{session.type}</Text>
            <Text style={styles.cell}>{session.duration} mins</Text>
            <Text style={styles.cell}>{session.payout}</Text>
          </View>
        ))}
      </View>

      {/* Deductions & Total */}
      <View style={{ marginTop: 10 }}>
        <Text>Subtotal: ₹{receiptData.subtotal}</Text>
        <Text>Platform Fee: -₹{receiptData.deductions.platformFee}</Text>
        <Text>GST: -₹{receiptData.deductions.gst}</Text>
        <Text>TDS: -₹{receiptData.deductions.tds}</Text>
        <Text style={{ fontWeight: 'bold', marginTop: 5 }}>
          Total Payout: ₹{receiptData.total}
        </Text>
      </View>

      {receiptData.message && (
        <View style={{ marginTop: 15 }}>
          <Text>Note: {receiptData.message}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export default ReceiptPDF;