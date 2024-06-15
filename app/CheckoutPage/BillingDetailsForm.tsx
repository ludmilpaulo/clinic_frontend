import React, { useState } from 'react';

interface FormState {
  name: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface BillingDetailsFormProps {
  onSubmit: (form: FormState) => void;
  loading: boolean;
}

const BillingDetailsForm: React.FC<BillingDetailsFormProps> = ({ onSubmit, loading }) => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
      <input 
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
        className="mb-4 w-full p-2 border rounded"
        required
      />
      <input 
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="mb-4 w-full p-2 border rounded"
        required
      />
      <input 
        type="text"
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="mb-4 w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="city"
        value={form.city}
        onChange={handleChange}
        placeholder="City"
        className="mb-4 w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="postalCode"
        value={form.postalCode}
        onChange={handleChange}
        placeholder="Postal Code"
        className="mb-4 w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="country"
        value={form.country}
        onChange={handleChange}
        placeholder="Country"
        className="mb-4 w-full p-2 border rounded"
        required
      />
    </form>
  );
};

export default BillingDetailsForm;
