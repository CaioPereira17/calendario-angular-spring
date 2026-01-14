package br.mil.eb.decex.calendario_spring.service;

import br.mil.eb.decex.calendario_spring.modelo.Pessoa;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

//import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Service
public class RelatorioService {

    public void gerarRelatorioRamais(List<Pessoa> lista, OutputStream outputStream, Integer mesFiltro) throws DocumentException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, outputStream);

        document.open();

        // --- TÍTULO ---
        Font fontTitulo = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitulo.setSize(18);
        Paragraph p = new Paragraph("Relatório de Ramais - DECEx", fontTitulo);
        p.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(p);

        document.add(new Paragraph(" ")); // Pular linha

        // --- TABELA ---

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100f);
//        table.setWidths(new float[] {3.5f, 1.5f, 2.0f, 2.0f});
        // Posto (1.5) | Nome (3.5) | Assessoria (2.0) | Ramal (2.0)
        table.setWidths(new float[] {1.5f, 3.5f, 2.0f, 2.0f});

        // --- CABEÇALHO ---
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
        cell.setPadding(5);
        Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);

        addHeaderCell(table, cell, "Posto", fontHeader);
        addHeaderCell(table, cell, "Nome / Guerra", fontHeader);
        addHeaderCell(table, cell, "Assessoria", fontHeader);
        addHeaderCell(table, cell, "Ramal", fontHeader);

        // --- DADOS ---
        Font fontDados = FontFactory.getFont(FontFactory.HELVETICA, 9);

        for (Pessoa pessoa : lista) {
            // AJUSTE DA ORDEM DOS DADOS (Tem que bater com o cabeçalho!):
            // 1. Posto
            table.addCell(new Phrase(pessoa.getPostoGraduacao().getViewValue(), fontDados));
            // 2. Nome
            table.addCell(new Phrase(pessoa.getNomeGuerra(), fontDados));
            // 3. Assessoria
            String siglaAssessoria = (pessoa.getAssessoria() != null) ? pessoa.getAssessoria().getSigla() : "-";
            table.addCell(new Phrase(siglaAssessoria, fontDados));
            // 4. Ramal
            table.addCell(new Phrase(pessoa.getRamal(), fontDados));
        }

        document.add(table);

        // --- RODAPÉ ---
        document.add(new Paragraph(" "));
        String infoFooter = "Total de registros: " + lista.size();
        if (mesFiltro != null) {
            infoFooter += " (Filtrado por Aniversariantes do Mês " + mesFiltro + ")";
        }
        document.add(new Paragraph(infoFooter, fontDados));

        document.close();
    }

    private void addHeaderCell(PdfPTable table, PdfPCell cell, String text, Font font) {
        cell.setPhrase(new Phrase(text, font));
        table.addCell(cell);
    }
}