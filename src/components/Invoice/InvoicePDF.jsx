// src/components/Invoice/InvoicePDF.jsx

import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 12,
    },
    header: {
        marginBottom: 30,
        borderBottom: '2 solid #0891b2',
        paddingBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0891b2',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    invoiceInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    infoBlock: {
        width: '45%',
    },
    label: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 12,
        color: '#1e293b',
        marginBottom: 10,
    },
    table: {
        marginTop: 20,
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 10,
        borderRadius: 4,
    },
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottom: '1 solid #e2e8f0',
    },
    col1: {
        width: '50%',
    },
    col2: {
        width: '25%',
        textAlign: 'center',
    },
    col3: {
        width: '25%',
        textAlign: 'right',
    },
    headerText: {
        fontWeight: 'bold',
        color: '#475569',
        fontSize: 10,
        textTransform: 'uppercase',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
        paddingTop: 10,
        borderTop: '2 solid #0891b2',
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 20,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0891b2',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        textAlign: 'center',
        borderTop: '1 solid #e2e8f0',
        paddingTop: 20,
    },
    footerText: {
        fontSize: 10,
        color: '#94a3b8',
    },
    badge: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '4 8',
        borderRadius: 4,
        fontSize: 10,
        alignSelf: 'flex-start',
    },
});

// Invoice Document Component
const InvoiceDocument = ({ invoice }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>INVOICE</Text>
                <Text style={styles.subtitle}>Potholes Patrols Report Hub</Text>
            </View>

            {/* Invoice Info */}
            <View style={styles.invoiceInfo}>
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Billed To</Text>
                    <Text style={styles.value}>{invoice.userName}</Text>
                    <Text style={styles.value}>{invoice.userEmail}</Text>
                </View>
                <View style={styles.infoBlock}>
                    <Text style={styles.label}>Invoice Number</Text>
                    <Text style={styles.value}>{invoice.transactionId}</Text>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>
                        {new Date(invoice.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>
                    <Text style={styles.label}>Status</Text>
                    <Text style={styles.badge}>PAID</Text>
                </View>
            </View>

            {/* Table */}
            <View style={styles.table}>
                <View style={styles.tableHeader}>
                    <Text style={[styles.col1, styles.headerText]}>Description</Text>
                    <Text style={[styles.col2, styles.headerText]}>Type</Text>
                    <Text style={[styles.col3, styles.headerText]}>Amount</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.col1}>{invoice.description}</Text>
                    <Text style={styles.col2}>
                        {invoice.type === 'boost' ? 'Priority Boost' : 'Premium Subscription'}
                    </Text>
                    <Text style={styles.col3}>{invoice.amount} Tk</Text>
                </View>
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>{invoice.amount} Tk</Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Thank you for using Potholes Patrols Report Hub
                </Text>
                <Text style={styles.footerText}>
                    For support, contact: support@potholespatrols.com
                </Text>
            </View>
        </Page>
    </Document>
);

// Download Button Component
const InvoiceDownloadButton = ({ invoice, className = '' }) => {
    if (!invoice) return null;

    return (
        <PDFDownloadLink
            document={<InvoiceDocument invoice={invoice} />}
            fileName={`invoice-${invoice.transactionId}.pdf`}
            className={className}
        >
            {({ loading }) => (
                loading ? 'Generating PDF...' : 'Download Invoice'
            )}
        </PDFDownloadLink>
    );
};

export { InvoiceDocument, InvoiceDownloadButton };
export default InvoiceDownloadButton;
