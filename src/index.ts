import { PDFDocument, type PDFTextField } from "pdf-lib";
import { writeFile, readFile } from "fs/promises";

async function flattenForm() {
  const formUrl = "https://pdf-lib.js.org/assets/form_to_flatten.pdf";
  const formPdfBytes = await fetch(formUrl).then((res) => {
    return res.arrayBuffer();
  });

  const pdfDoc = await PDFDocument.load(formPdfBytes);

  const form = pdfDoc.getForm();

  form.getTextField("Text1").setText("Some Text");
  form.getRadioGroup("Group2").select("Choice1");
  form.getRadioGroup("Group3").select("Choice3");
  form.getRadioGroup("Group4").select("Choice1");
  form.getCheckBox("Check Box3").check();
  form.getCheckBox("Check Box4").uncheck();
  form.getDropdown("Dropdown7").select("Infinity");
  form.getOptionList("List Box6").select("Honda");

  form.flatten();

  const pdfBytes = await pdfDoc.save();

  // Write the PDF to a file
  await writeFile("flattened-form.pdf", pdfBytes);

  console.log("PDF saved to flattened-form.pdf");
}

async function flattenLocalForm() {
  // Read the local PDF file
  const pdfBytes = await readFile("sample.pdf");

  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  // Get all form fields to see what's available
  const fields = form.getFields();
  console.log("Available form fields:");
  fields.forEach((field) => {
    console.log(`- ${field.getName()} (${field.constructor.name})`);
  });

  // Fill the given name field
  try {
    const givenNameField = fields.find((field) => {
      const fieldName = field.getName().toLowerCase();
      return fieldName.includes("given") || fieldName.includes("first");
    });

    if (givenNameField && givenNameField.constructor.name === "PDFTextField") {
      const textField = givenNameField as PDFTextField;
      textField.setText("John");
      console.log(`Filled field "${givenNameField.getName()}" with "John"`);
    } else {
      console.log("No given name field found");
    }

    form.flatten();
    const flattened = await pdfDoc.save();
    await writeFile("flattened-local-form.pdf", flattened);
    console.log("PDF saved to flattened-local-form.pdf");
  } catch (error) {
    console.error("Error processing form:", error);
  }
}

flattenForm().catch((err: unknown) => {
  console.log(err);
});

flattenLocalForm().catch((err: unknown) => {
  console.log(err);
});
