import React from 'react';

import './form-input.styles.scss';


const FormInput = ({ handleChange, label, ...otherProps }) => (
  <div className="relative">
    <input 
      className='w-full px-3 py-3 border border-gray-300 rounded-md placeholder-transparent focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent peer' 
      onChange={handleChange} 
      placeholder={label}
      {...otherProps} 
    />
    {
      label ?
        (<label className={`absolute left-3 transition-all duration-200 pointer-events-none ${
          otherProps.value && otherProps.value.length 
            ? '-top-2 text-xs bg-white px-1 ' 
            : 'top-3 peer-placeholder-shown:top-3 peer-focus:-top-2 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1 peer-focus:'
        }`}>
          {label}
        </label>)
        : null
    }
  </div>
)

export default FormInput;