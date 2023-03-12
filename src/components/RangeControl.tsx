export interface IRangeControl {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const RangeControl = ({
  id,
  label,
  min,
  max,
  value,
  disabled,
  onChange,
}: IRangeControl) => (
  <div className="form-control">
    <label className="label" htmlFor={id}>
      {label}
    </label>
    <input
      className="range range-xs"
      id={id}
      type="range"
      min={min}
      value={value}
      max={max}
      disabled={disabled}
      onChange={(e) => {
        onChange(parseInt(e.target.value, 10));
      }}
    />
  </div>
);
export default RangeControl;
