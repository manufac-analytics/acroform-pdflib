import { PDFDocument } from "pdf-lib";

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

  await pdfDoc.save();
}

flattenForm().catch((err: unknown) => {
  console.log(err);
});
