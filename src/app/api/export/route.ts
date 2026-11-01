import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get('format') || 'excel';
    const eventId = searchParams.get('eventId');

    const gifts = await prisma.gift.findMany({
      where: eventId ? { eventId } : undefined,
      include: {
        guest: true,
        event: true,
        reciprocity: true,
      },
      orderBy: { receivedAt: 'desc' },
    });

    const rows = gifts.map((g, index) => ({
      'S.No': index + 1,
      'Guest Name': g.guest.name,
      Relation: g.guest.relation || 'N/A',
      Phone: g.guest.phone || 'N/A',
      City: g.guest.city || 'N/A',
      Event: g.event.title,
      'Gift Type': g.giftType,
      'Cash Amount (INR)': g.cashAmount ? Number(g.cashAmount) : 0,
      'Gift Description': g.giftDescription || 'N/A',
      'Received Date': new Date(g.receivedAt).toLocaleDateString('en-IN'),
      'Reciprocity Status': g.reciprocity?.status || 'N/A',
    }));

    if (format === 'excel') {
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Shagun Records');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="shagun-gift-registry.xlsx"',
        },
      });
    }

    if (format === 'pdf') {
      const doc = new jsPDF();
      doc.text('Shagun Wedding Gift Registry', 14, 15);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-IN')}`, 14, 22);

      const tableData = rows.map((r) => [
        r['S.No'],
        r['Guest Name'],
        r.Relation,
        r.Event,
        r['Cash Amount (INR)'] > 0 ? `₹${r['Cash Amount (INR)']}` : r['Gift Description'],
        r['Received Date'],
      ]);

      (doc as any).autoTable({
        head: [['#', 'Guest', 'Relation', 'Event', 'Gift/Amount', 'Date']],
        body: tableData,
        startY: 28,
        theme: 'striped',
        headStyles: { fillColor: [196, 30, 58] }, // Shagun Red
      });

      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      return new NextResponse(pdfBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="shagun-gift-registry.pdf"',
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Unsupported format' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
