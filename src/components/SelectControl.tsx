import { ReactNode } from "react";

export interface ISelectControl {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
}

const SelectControl = ({
  id,
  label,
  value,
  disabled,
  onChange,
  children,
}: ISelectControl) => (
  <div className="form-control">
    <label className="label" htmlFor={id}>
      {label}
    </label>
    <select
      id={id}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      value={value}
    >
      {children}
    </select>
  </div>
);

export default SelectControl;
