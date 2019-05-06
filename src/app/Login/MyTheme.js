export const Container = {
  fontFamily: "'Amazon Ember', 'Helvetica Neue', sans-serif",
  fontWeight: "400",
  width: "100%",
  margin: "0 auto",
  backgroundColor: "#fff",
  padding: "20px 40px 40px",
  color: "#000"
};

export const FormField = {
  marginBottom: "20px"
};

export const SectionHeader = {
  marginBottom: "20px",
  fontSize: "16px",
  fontWeight: "500"
};

export const SectionBody = {
  marginBottom: "10px"
};

export const SectionFooter = {
  fontSize: "12px",
  color: "#777777"
};

export const SectionFooterPrimaryContent = {
  marginLeft: "auto",
  width: "100%",
  marginBottom: "8px",
  display: "block"
};

export const SectionFooterSecondaryContent = {
  display: "block",
  textAlign: "right"
};

export const Input = {
  display: "block",
  width: "100%",
  padding: "10px",
  fontSize: "14px",
  height: "40px",
  fontFamily: "'Amazon Ember', Arial",
  color: "#000",
  backgroundColor: "#fff",
  backgroundImage: "none",
  border: "1px solid #dedede",
  boxSizing: "border-box",
  marginBottom: "6px"
};

export const Button = {
  minWidth: "153px",
  display: "inline-block",
  marginBottom: "0",
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "1.42857143",
  textAlign: "center",
  whiteSpace: "nowrap",
  verticalAlign: "middle",
  touchAction: "manipulation",
  cursor: "pointer",
  userSelect: "none",
  backgroundImage: "none",
  color: "#fff",
  backgroundColor: "#36D58F",
  borderColor: "#ccc",
  textTransform: "uppercase",
  padding: "14px 0",
  letterSpacing: "1.1px",
  border: "none",
  width: "100%"
};

export const A = {
  color: "#36D58F",
  cursor: "pointer"
};

export const Hint = {
  color: "#575A65",
  fontSize: "12px"
};

export const InputLabel = {
  fontSize: "12px",
  marginBottom: "6px",
  color: "#777777"
};

export const Toast = {
  color: "#f00"
};

const Bootstrap = {
  container: Container,
  formField: FormField,

  sectionHeader: SectionHeader,
  sectionBody: SectionBody,
  sectionFooter: SectionFooter,
  sectionFooterPrimaryContent: SectionFooterPrimaryContent,
  sectionFooterSecondaryContent: SectionFooterSecondaryContent,

  input: Input,
  button: Button,
  a: A,

  hint: Hint,
  inputLabel: InputLabel,
  toast: Toast
};

export default Bootstrap;
