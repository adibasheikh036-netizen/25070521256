import { ChevronDown, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

function Field({ id, label, error, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

const describedBy = (id, error) => (error ? `${id}-error` : undefined);

export function TextField({ id, label, icon: Icon, error, ...inputProps }) {
  return (
    <Field id={id} label={label} error={error}>
      <div className="field-control">
        <Icon className="field-icon" size={18} aria-hidden="true" />
        <input id={id} aria-invalid={Boolean(error)} aria-describedby={describedBy(id, error)} {...inputProps} />
      </div>
    </Field>
  );
}

export function PasswordField({ id, label, icon: Icon, error, ...inputProps }) {
  const [visible, setVisible] = useState(false);

  return (
    <Field id={id} label={label} error={error}>
      <div className="field-control">
        <Icon className="field-icon" size={18} aria-hidden="true" />
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error)}
          {...inputProps}
        />
        <button
          type="button"
          className="field-action"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </Field>
  );
}

export function SelectField({ id, label, icon: Icon, error, options, placeholder, ...selectProps }) {
  return (
    <Field id={id} label={label} error={error}>
      <div className="field-control">
        <Icon className="field-icon" size={18} aria-hidden="true" />
        <select
          id={id}
          className={selectProps.value ? '' : 'is-placeholder'}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy(id, error)}
          {...selectProps}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="field-chevron" size={18} aria-hidden="true" />
      </div>
    </Field>
  );
}
