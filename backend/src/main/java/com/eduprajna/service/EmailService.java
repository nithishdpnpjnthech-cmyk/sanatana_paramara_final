package com.eduprajna.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.awt.Color;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service for sending emails and generating PDF invoices.
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${mail.from.email:${spring.mail.username}}")
    private String fromEmail;

    private static final String LOGO_PATH = "static/images/logo.png";

    @jakarta.annotation.PostConstruct
    public void init() {
        logger.info("EmailService initialized with sender: {}", fromEmail);
    }

    /**
     * Send password reset email
     */
    public boolean sendPasswordResetEmail(String recipientEmail, String username, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("Sanatana Parampara - Password Reset Request");
            message.setText(buildPasswordResetEmailBody(username, resetLink, recipientEmail));

            mailSender.send(message);
            logger.info("Password reset email sent to: {}", recipientEmail);
            return true;
        } catch (Exception e) {
            logger.error("Failed to send password reset email", e);
            return false;
        }
    }

    private String buildPasswordResetEmailBody(String username, String resetLink, String email) {
        return "Hello " + username + ",\n\n" +
                "We received a request to reset your password. Click the link below to reset your password:\n\n" +
                resetLink + "\n\n" +
                "This link will expire in 24 hours.\n\n" +
                "Best regards,\n" +
                "Sanatana Parampara Support Team";
    }

    /**
     * Send account credentials via email
     */
    public boolean sendCredentialsEmail(String recipientEmail, String username, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("Sanatana Parampara - Your Account Credentials");
            message.setText("Hello " + username + ",\n\nYour account credentials:\nEmail: " + recipientEmail
                    + "\nUsername: " + username + "\nPassword: " + password);

            mailSender.send(message);
            logger.info("Credentials email sent to: {}", recipientEmail);
            return true;
        } catch (Exception e) {
            logger.error("Failed to send credentials email", e);
            return false;
        }
    }

    public boolean sendContactThankYou(String name, String email) throws Exception {
        logger.info("Starting sendContactThankYou for: {}", email);
        try {
            if (mailSender == null)
                throw new RuntimeException("JavaMailSender is NOT injected!");
            if (templateEngine == null)
                throw new RuntimeException("TemplateEngine is NOT injected!");

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            Context context = new Context();
            context.setVariable("name", name);

            boolean logoExists = checkLogoExists();
            logger.info("Logo exists: {}, Path: {}", logoExists, LOGO_PATH);
            context.setVariable("logoExists", logoExists);

            logger.info("Processing template: email/contact-thankyou");
            String htmlContent = templateEngine.process("email/contact-thankyou", context);
            logger.info("Template processed successfully. Length: {}", htmlContentLength(htmlContent));

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Thank you for reaching us!");
            helper.setText(htmlContent, true);

            if (logoExists) {
                helper.addInline("logo", new ClassPathResource(LOGO_PATH));
            }

            logger.info("Sending email to: {}", email);
            mailSender.send(mimeMessage);
            logger.info("Contact thank you email sent successfully to: {}", email);
            return true;
        } catch (Exception e) {
            logger.error("CRITICAL ERROR in sendContactThankYou: {}", e.getMessage(), e);
            throw e;
        }
    }

    public boolean sendSubscriptionConfirmation(String email) throws Exception {
        logger.info("Starting sendSubscriptionConfirmation for: {}", email);
        try {
            if (mailSender == null)
                throw new RuntimeException("JavaMailSender is NOT injected!");
            if (templateEngine == null)
                throw new RuntimeException("TemplateEngine is NOT injected!");

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            Context context = new Context();
            boolean logoExists = checkLogoExists();
            logger.info("Logo exists: {}, Path: {}", logoExists, LOGO_PATH);
            context.setVariable("logoExists", logoExists);

            logger.info("Processing template: email/subscription-confirmation");
            String htmlContent = templateEngine.process("email/subscription-confirmation", context);
            logger.info("Template processed successfully. Length: {}", htmlContentLength(htmlContent));

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Thank you for subscribing!");
            helper.setText(htmlContent, true);

            if (logoExists) {
                helper.addInline("logo", new ClassPathResource(LOGO_PATH));
            }

            logger.info("Sending email to: {}", email);
            mailSender.send(mimeMessage);
            logger.info("Subscription confirmation email sent successfully to: {}", email);
            return true;
        } catch (Exception e) {
            logger.error("CRITICAL ERROR in sendSubscriptionConfirmation: {}", e.getMessage(), e);
            throw e;
        }
    }

    private int htmlContentLength(String html) {
        return html != null ? html.length() : 0;
    }

    /**
     * Send order confirmation email with PDF invoice
     */
    public boolean sendOrderConfirmation(Map<String, Object> orderData) throws Exception {
        String email = (String) orderData.get("email");
        String orderIdStr = String.valueOf(orderData.getOrDefault("orderId", orderData.getOrDefault("id", "N/A")));
        logger.info("Starting sendOrderConfirmation for Order: {}, Email: {}", orderIdStr, email);

        try {
            if (mailSender == null)
                throw new RuntimeException("JavaMailSender is NOT injected!");
            if (templateEngine == null)
                throw new RuntimeException("TemplateEngine is NOT injected!");

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Prepare Thymeleaf context
            Context context = new Context();
            context.setVariables(orderData);
            context.setVariable("orderId", orderIdStr);
            boolean logoExists = checkLogoExists();
            logger.info("Logo exists: {}, Path: {}", logoExists, LOGO_PATH);
            context.setVariable("logoExists", logoExists);

            logger.info("Processing template: email/order-confirmation");
            String htmlContent = templateEngine.process("email/order-confirmation", context);
            logger.info("Template processed successfully. Length: {}", htmlContentLength(htmlContent));

            helper.setFrom(fromEmail);
            helper.setTo(email);
            helper.setSubject("Order Confirmation #" + orderIdStr + " - Sanatana Parampare");
            helper.setText(htmlContent, true);

            if (logoExists) {
                helper.addInline("logo", new ClassPathResource(LOGO_PATH));
            }

            // Generate PDF attachment
            logger.info("Generating invoice PDF for Order: {}", orderIdStr);
            byte[] pdfBytes = generateInvoicePDF(orderData);
            logger.info("PDF generated successfully. Size: {} bytes", pdfBytes.length);
            helper.addAttachment("invoice_" + orderIdStr + ".pdf", new ByteArrayResource(pdfBytes));

            logger.info("Sending email to: {}", email);
            mailSender.send(mimeMessage);
            logger.info("Order confirmation email with PDF sent successfully to: {}", email);
            return true;
        } catch (Exception e) {
            logger.error("CRITICAL ERROR in sendOrderConfirmation for Order {}: {}", orderIdStr, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Generate Invoice PDF using OpenPDF
     */
    private byte[] generateInvoicePDF(Map<String, Object> orderData) throws Exception {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(document, outputStream);
        document.open();

        Color darkBg = new Color(52, 58, 64);
        Color lightBg = new Color(248, 248, 248);
        Color borderColor = new Color(220, 220, 220);

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, Color.WHITE);
        Font whiteNormal = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.WHITE);
        Font whiteBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);

        Font headerGray = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.DARK_GRAY);
        Font textNormal = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

        // 1. Top Dark Block (Full width)
        PdfPTable topTable = new PdfPTable(2);
        topTable.setWidthPercentage(100);
        topTable.setWidths(new float[] { 1, 1 });

        // Left side of Top Table (Logo + Company Name)
        PdfPTable logoTable = new PdfPTable(2);
        logoTable.setWidthPercentage(100);
        logoTable.setWidths(new float[] { 1, 3 });

        PdfPCell logoContainer = new PdfPCell();
        logoContainer.setBackgroundColor(Color.WHITE);
        logoContainer.setBorder(Rectangle.NO_BORDER);
        logoContainer.setPadding(5);
        if (checkLogoExists()) {
            InputStream is = new ClassPathResource(LOGO_PATH).getInputStream();
            Image logo = Image.getInstance(is.readAllBytes());
            logo.scaleToFit(50, 50);
            logo.setAlignment(Element.ALIGN_CENTER);
            logoContainer.addElement(logo);
        }
        
        PdfPCell logoOuterCell = new PdfPCell(logoContainer);
        logoOuterCell.setBorder(Rectangle.NO_BORDER);
        logoOuterCell.setBackgroundColor(darkBg);
        logoOuterCell.setPadding(10);
        logoTable.addCell(logoOuterCell);

        PdfPCell companyNameCell = new PdfPCell();
        companyNameCell.setBorder(Rectangle.NO_BORDER);
        companyNameCell.setBackgroundColor(darkBg);
        companyNameCell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        companyNameCell.addElement(new Paragraph("sanathana-parampara", titleFont));
        companyNameCell.addElement(new Paragraph("Bengaluru, India", whiteNormal));
        logoTable.addCell(companyNameCell);

        PdfPCell leftHeaderCell = new PdfPCell(logoTable);
        leftHeaderCell.setBorder(Rectangle.NO_BORDER);
        leftHeaderCell.setBackgroundColor(darkBg);
        leftHeaderCell.setPadding(10);
        topTable.addCell(leftHeaderCell);

        // Right side of Top Table (Invoice label + Contact)
        PdfPCell rightHeaderCell = new PdfPCell();
        rightHeaderCell.setBorder(Rectangle.NO_BORDER);
        rightHeaderCell.setBackgroundColor(darkBg);
        rightHeaderCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        rightHeaderCell.setPadding(10);

        Paragraph invoiceLabel = new Paragraph("Invoice", whiteBold);
        invoiceLabel.setAlignment(Element.ALIGN_RIGHT);
        rightHeaderCell.addElement(invoiceLabel);

        Paragraph emailLabel = new Paragraph("support@sanatanaparampara.com", whiteNormal);
        emailLabel.setAlignment(Element.ALIGN_RIGHT);
        rightHeaderCell.addElement(emailLabel);

        Paragraph phoneLabel = new Paragraph("+91 99025 23333", whiteNormal);
        phoneLabel.setAlignment(Element.ALIGN_RIGHT);
        rightHeaderCell.addElement(phoneLabel);

        topTable.addCell(rightHeaderCell);
        document.add(topTable);

        // 2. TAX INVOICE Strip
        PdfPTable taxInvoiceTable = new PdfPTable(1);
        taxInvoiceTable.setWidthPercentage(100);
        taxInvoiceTable.setSpacingBefore(0);
        PdfPCell taxInvoiceCell = new PdfPCell(new Phrase("TAX INVOICE", headerGray));
        taxInvoiceCell.setBackgroundColor(lightBg);
        taxInvoiceCell.setBorderColor(new Color(230, 230, 230)); // Lighter border
        taxInvoiceCell.setPadding(8);
        taxInvoiceTable.addCell(taxInvoiceCell);
        document.add(taxInvoiceTable);

        // 3. Meta Information Row
        PdfPTable metaTable = new PdfPTable(3);
        metaTable.setWidthPercentage(100);
        metaTable.setSpacingBefore(10);

        String orderId = String.valueOf(orderData.getOrDefault("orderId", orderData.getOrDefault("id", "N/A")));
        String invoiceDate = new SimpleDateFormat("dd/M/yyyy").format(new Date());
        long fortnight = 14L * 24 * 60 * 60 * 1000;
        String dueDate = new SimpleDateFormat("dd/M/yyyy").format(new Date(System.currentTimeMillis() + fortnight));

        addMetaColumn(metaTable, "INVOICE NO.", "NN-2026-" + orderId, headerGray, textNormal);
        addMetaColumn(metaTable, "ISSUE DATE", invoiceDate, headerGray, textNormal);
        addMetaColumn(metaTable, "DUE DATE", dueDate, headerGray, textNormal);

        document.add(metaTable);
        
        // Horizontal line separator
        document.add(new Paragraph("\n"));
        LineSeparator sep = new LineSeparator();
        sep.setLineColor(borderColor);
        document.add(sep);

        // 4. Address Boxes (FROM and TO)
        PdfPTable addressTable = new PdfPTable(3);
        addressTable.setWidthPercentage(100);
        addressTable.setWidths(new float[] { 48, 4, 48 });
        addressTable.setSpacingBefore(15);
        addressTable.setSpacingAfter(20);

        // FROM Box
        PdfPTable fromTable = new PdfPTable(1);
        PdfPCell fromTitle = new PdfPCell(new Phrase("FROM", headerGray));
        fromTitle.setBorder(Rectangle.NO_BORDER);
        fromTable.addCell(fromTitle);
        PdfPCell fromDetails = new PdfPCell();
        fromDetails.setBorder(Rectangle.NO_BORDER);
        fromDetails.addElement(new Paragraph("sanathana-parampara", textNormal));
        fromDetails.addElement(new Paragraph("Anand Vihari No - 87, 2nd main road, 2nd stage, Vinayaka layout,", textNormal));
        fromDetails.addElement(new Paragraph("Vijayanagar, Bengaluru - 560040", textNormal));
        fromDetails.addElement(new Paragraph("support@sanatanaparampara.com", textNormal));
        fromDetails.addElement(new Paragraph("+91 99025 23333", textNormal));
        fromTable.addCell(fromDetails);

        PdfPCell fromCellOuter = new PdfPCell(fromTable);
        fromCellOuter.setBorderColor(borderColor);
        fromCellOuter.setPadding(10);
        addressTable.addCell(fromCellOuter);

        // Empty spacer cell
        PdfPCell emptySpacer = new PdfPCell();
        emptySpacer.setBorder(Rectangle.NO_BORDER);
        addressTable.addCell(emptySpacer);

        // TO Box
        PdfPTable toTable = new PdfPTable(1);
        PdfPCell toTitle = new PdfPCell(new Phrase("TO", headerGray));
        toTitle.setBorder(Rectangle.NO_BORDER);
        toTable.addCell(toTitle);
        PdfPCell toDetails = new PdfPCell();
        toDetails.setBorder(Rectangle.NO_BORDER);

        String customerName = String.valueOf(orderData.getOrDefault("name", orderData.getOrDefault("firstName", "Customer")));
        String customerEmail = String.valueOf(orderData.getOrDefault("email", ""));
        String customerPhone = String.valueOf(orderData.getOrDefault("phone", ""));
        String customerAddress = String.valueOf(orderData.getOrDefault("street", ""));
        String customerCity = String.valueOf(orderData.getOrDefault("city", ""));
        String customerState = String.valueOf(orderData.getOrDefault("state", ""));
        String customerPincode = String.valueOf(orderData.getOrDefault("pincode", ""));

        toDetails.addElement(new Paragraph(customerName, textNormal));
        if (!customerAddress.isEmpty()) toDetails.addElement(new Paragraph(customerAddress, textNormal));
        if (!customerCity.isEmpty()) toDetails.addElement(new Paragraph(customerCity + ", " + customerState + " - " + customerPincode, textNormal));
        if (!customerEmail.isEmpty()) toDetails.addElement(new Paragraph(customerEmail, textNormal));
        if (!customerPhone.isEmpty()) toDetails.addElement(new Paragraph(customerPhone, textNormal));

        toTable.addCell(toDetails);

        PdfPCell toCellOuter = new PdfPCell(toTable);
        toCellOuter.setBorderColor(borderColor);
        toCellOuter.setPadding(10);
        addressTable.addCell(toCellOuter);

        document.add(addressTable);

        // 5. Items Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 5, 2, 2, 2 });
        table.setSpacingBefore(10);

        addModernTableHeader(table, "DESCRIPTION", Element.ALIGN_LEFT, lightBg, headerGray, borderColor);
        addModernTableHeader(table, "QUANTITY", Element.ALIGN_CENTER, lightBg, headerGray, borderColor);
        addModernTableHeader(table, "UNIT PRICE", Element.ALIGN_RIGHT, lightBg, headerGray, borderColor);
        addModernTableHeader(table, "AMOUNT", Element.ALIGN_RIGHT, lightBg, headerGray, borderColor);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("items");
        if (items != null) {
            for (Map<String, Object> item : items) {
                String itemName = String.valueOf(item.get("name"));
                String weight = item.getOrDefault("weightValue", "") + " " + item.getOrDefault("weightUnit", "");
                if (!weight.trim().isEmpty()) {
                    itemName += " (" + weight.trim() + ")";
                }

                addModernTableCell(table, itemName, Element.ALIGN_LEFT, textNormal, borderColor);
                addModernTableCell(table, String.valueOf(item.get("quantity")), Element.ALIGN_CENTER, textNormal, borderColor);

                double price = parseDouble(item.get("price"));
                int qty = parseInt(item.get("quantity"));

                addModernTableCell(table, "\u20B9" + String.format("%.2f", price), Element.ALIGN_RIGHT, textNormal, borderColor);
                addModernTableCell(table, "\u20B9" + String.format("%.2f", price * qty), Element.ALIGN_RIGHT, textNormal, borderColor);
            }
        }
        document.add(table);
        document.add(new Paragraph("\n"));

        // 6. Totals
        PdfPTable totalsTable = new PdfPTable(2);
        totalsTable.setWidthPercentage(40);
        totalsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);
        
        // Remove left and right borders from the totals table itself so it aligns nicely
        totalsTable.getDefaultCell().setBorder(Rectangle.NO_BORDER);

        double subtotal = parseDouble(orderData.get("subtotal"));
        double shippingCost = parseDouble(orderData.get("shippingCost"));
        double discountAmount = parseDouble(orderData.get("discountAmount"));
        double total = parseDouble(orderData.get("total"));

        addModernTotalRow(totalsTable, "Subtotal", "\u20B9" + String.format("%.2f", subtotal), textNormal, lightBg, borderColor, false);
        addModernTotalRow(totalsTable, "Shipping", "\u20B9" + String.format("%.2f", shippingCost), textNormal, lightBg, borderColor, false);
        if (discountAmount > 0) {
            addModernTotalRow(totalsTable, "Discount", "-\u20B9" + String.format("%.2f", discountAmount), textNormal, lightBg, borderColor, false);
        }
        addModernTotalRow(totalsTable, "Total Due", "\u20B9" + String.format("%.2f", total), whiteBold, darkBg, darkBg, true);

        document.add(totalsTable);
        document.add(new Paragraph("\n\n"));

        // 7. Footer
        String payMethod = String.valueOf(orderData.getOrDefault("paymentMethod", "N/A"));
        if (payMethod.equalsIgnoreCase("cod")) payMethod = "Cash on Delivery";
        else if (payMethod.equalsIgnoreCase("upi")) payMethod = "UPI";
        else if (payMethod.equalsIgnoreCase("card")) payMethod = "Card";

        String orderStatus = String.valueOf(orderData.getOrDefault("status", "pending"));

        PdfPTable footerInfo = new PdfPTable(1);
        footerInfo.setWidthPercentage(100);

        Paragraph pMethod = new Paragraph();
        pMethod.add(new Chunk("Payment Method: ", headerGray));
        pMethod.add(new Chunk(payMethod, textNormal));
        PdfPCell c1 = new PdfPCell(pMethod);
        c1.setBorder(Rectangle.NO_BORDER);
        footerInfo.addCell(c1);

        Paragraph pStatus = new Paragraph();
        pStatus.add(new Chunk("Order Status: ", headerGray));
        pStatus.add(new Chunk(orderStatus, textNormal));
        PdfPCell c2 = new PdfPCell(pStatus);
        c2.setBorder(Rectangle.NO_BORDER);
        footerInfo.addCell(c2);

        Paragraph pThank = new Paragraph("Thank you for your order. Please contact us for any clarification.", textNormal);
        PdfPCell c3 = new PdfPCell(pThank);
        c3.setBorder(Rectangle.NO_BORDER);
        c3.setPaddingTop(5);
        footerInfo.addCell(c3);

        document.add(footerInfo);

        document.add(new Paragraph("\n\n\n"));
        Paragraph autoGen = new Paragraph("This is a computer-generated invoice. No signature required.", headerGray);
        autoGen.setAlignment(Element.ALIGN_CENTER);
        document.add(autoGen);

        document.close();
        return outputStream.toByteArray();
    }

    private void addMetaColumn(PdfPTable table, String header, String value, Font headerFont, Font valueFont) {
        PdfPTable col = new PdfPTable(1);
        PdfPCell hCell = new PdfPCell(new Phrase(header, headerFont));
        hCell.setBorder(Rectangle.NO_BORDER);
        hCell.setPaddingLeft(0);
        col.addCell(hCell);

        PdfPCell vCell = new PdfPCell(new Phrase(value, valueFont));
        vCell.setBorder(Rectangle.NO_BORDER);
        vCell.setPaddingLeft(0);
        vCell.setPaddingTop(2);
        col.addCell(vCell);

        PdfPCell outer = new PdfPCell(col);
        outer.setBorder(Rectangle.NO_BORDER);
        table.addCell(outer);
    }

    private void addModernTableHeader(PdfPTable table, String text, int alignment, Color bg, Font font, Color borderCol) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bg);
        cell.setBorderColor(borderCol);
        cell.setBorderWidth(1);
        cell.setBorderWidthLeft(0);
        cell.setBorderWidthRight(0);
        cell.setPaddingTop(8);
        cell.setPaddingBottom(8);
        cell.setHorizontalAlignment(alignment);
        table.addCell(cell);
    }

    private void addModernTableCell(PdfPTable table, String text, int alignment, Font font, Color borderCol) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorderColor(borderCol);
        cell.setBorderWidthBottom(1);
        cell.setBorderWidthTop(0);
        cell.setBorderWidthLeft(0);
        cell.setBorderWidthRight(0);
        cell.setPaddingTop(10);
        cell.setPaddingBottom(10);
        cell.setHorizontalAlignment(alignment);
        table.addCell(cell);
    }

    private void addModernTotalRow(PdfPTable table, String label, String value, Font font, Color bg, Color borderCol, boolean isFinal) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, font));
        labelCell.setBackgroundColor(bg);
        labelCell.setBorderColor(borderCol);
        labelCell.setBorderWidth(1);
        labelCell.setPadding(8);

        PdfPCell valueCell = new PdfPCell(new Phrase(value, font));
        valueCell.setBackgroundColor(bg);
        valueCell.setBorderColor(borderCol);
        valueCell.setBorderWidth(1);
        valueCell.setPadding(8);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        table.addCell(labelCell);
        table.addCell(valueCell);
    }


    private boolean checkLogoExists() {
        return new ClassPathResource(LOGO_PATH).exists();
    }

    private Double parseDouble(Object value) {
        if (value == null)
            return 0.0;
        if (value instanceof Number)
            return ((Number) value).doubleValue();
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }

    private int parseInt(Object value) {
        if (value == null)
            return 0;
        if (value instanceof Number)
            return ((Number) value).intValue();
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
