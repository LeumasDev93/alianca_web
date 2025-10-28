export const customStyles = {
  control: (provided: any, state: { isFocused: any; }) => ({
    ...provided,
    width: "384px", 
    fontFamily: "serif", 
    color: "#1e3a8a", 
    borderColor: state.isFocused ? "#1e3a8a" : "#1e3a8a", 
    borderRadius: "0.5rem", 
    boxShadow: state.isFocused ? "0 0 0 1px #1e3a8a" : "none", 
    "&:hover": {
      borderColor: "#1e3a8a", 
    },
  }),
  option: (provided: any, state: { isSelected: any; }) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#1e3a8a" : "white",
    color: state.isSelected ? "white" : "#1e3a8a", 
    "&:hover": {
      backgroundColor: "#bfdbfe", 
      color: "#1e3a8a", 
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: "#A9A7B3",
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: "#000000", 
  }),
  menu: (provided: any) => ({
    ...provided,
    borderRadius: "0.5rem", 
    border: "1px solid #1e3a8a", 
  }),
};