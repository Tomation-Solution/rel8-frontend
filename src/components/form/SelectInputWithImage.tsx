interface SelectProps {
    register: any;
    name: string;
    options: { id: number; name: string }[];
    placeHolder?: string;
    disabled?: boolean;
  }
  
  const SelectInputWithImage = ({ register, name, options, placeHolder, disabled }: SelectProps) => {
    return (
      <div className="form-group">
        <select disabled={disabled} id={`#${name}`} className="form-control" name={name} {...register(`${name}`, { required: true })}>
          <option value="">{placeHolder || "Select an option"}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default SelectInputWithImage;
  