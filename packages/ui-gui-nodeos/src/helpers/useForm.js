import { useState, useEffect } from 'react';

const useForm = (cb, validate) => {

    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if(Object.keys(errors).length === 0 && isSubmitting) {
            cb();
        }
    }, [errors]);

    const handleSubmit = (ev) => {
        if (ev) {
            ev.preventDefault();
        }
        setIsSubmitting(true);
        setErrors(validate(values));
    }

    const handleChange = (ev) => {
        ev.persist();
        setValues(
            values => ({ ...values, [ev.target.name]: ev.target.value})
        );
    }

    const updateValues = (vals) => {
        vals.forEach(function(val) {            
            setValues(
                values => ({ ...values, [val.name] : val.value })
            );
        });
    }

    return {
        handleChange,
        handleSubmit,
        values,
        setValues,
        updateValues,
        errors,
    }

};

export default useForm;
