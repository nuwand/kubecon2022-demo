import React, { useState, forwardRef } from 'react';

import '../styles/InputWithButton.css';

export const InputWithButton = forwardRef(
    (
        {
            onSubmit,
            groupId,
            inputProps = {},
            disabled = false,
            buttonText,
            loadingButtonText,
            loading,
        },
        ref
    ) => {
        const [inputValue, setInputValue] = useState('');
        const { placeholder, disabled: inputDisabled } = inputProps;
        const disableAll = inputDisabled || disabled;
        function handleSubmit() {
            onSubmit(inputValue);
        }
        return (
            <div ref={ref} className="input-with-button-container">
                <input
                    placeholder={placeholder}
                    disabled={disableAll}
                    value={inputValue}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit();
                        }
                    }}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                    disabled={inputValue === '' || disableAll}
                    onClick={handleSubmit}
                >
                    {loading ? loadingButtonText : buttonText}
                </button>
            </div>
        );
    }
);

export default InputWithButton;
