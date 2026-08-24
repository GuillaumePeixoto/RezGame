export const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "#facc15" : "white",
    borderRadius: "8px",
    boxShadow: "none",
    padding: "10px 0px",
    height: "100%",
    "&:hover": { borderColor: "#facc15" },
  }),
  input: (base) => ({
    ...base,
    color: "white",
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1a1a1a",
    zIndex: 9999,
    marginTop: "-5px",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#333" : "transparent",
    color: "white",
    cursor: "pointer",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#facc15",
  }),
  singleValue: (base) => ({
    ...base,
    color: "white",
  }),
};