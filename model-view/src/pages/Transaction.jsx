import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const Transaction = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, transaction: null, mode: 'edit' });
  const [form, setForm] = useState({ category: '', amount: '', type: 'income', note: '' });

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const openModal = (tx = null, mode = 'edit') => {
    setForm(
      tx
        ? {
            category: tx.category,
            amount: tx.amount,
            type: tx.type,
            note: tx.note || '',
          }
        : { category: '', amount: '', type: 'income', note: '' }
    );

    setModal({ isOpen: true, transaction: tx, mode });
  };

  const closeModal = () => {
    setModal({ isOpen: false, transaction: null, mode: 'edit' });
    setForm({ category: '', amount: '', type: 'income', note: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const data = {
      category: form.category,
      amount: Number(form.amount),
      type: form.type,
      note: form.note,
    };

    try {
      if (modal.transaction) {
        await axios.put(`/api/transactions/${modal.transaction.id}`, data);
      } else {
        await axios.post('/api/transactions', data);
      }

      fetchTransactions();
      closeModal();
    } catch (err) {
      console.error('Submit failed:', err);
      alert(err.response?.data?.message || 'Something went wrong');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/transactions/${modal.transaction.id}`);
      fetchTransactions();
      closeModal();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="page-container">
      <button className="btn btn-back" onClick={() => navigate('/dashboard')}>
        ← Back to Dashboard
      </button>

      <h2>Transactions</h2>
      <button className="add-btn" onClick={() => openModal(null, 'create')}>
        + Add Transaction
      </button>

      <div className="card-grid">
        {transactions.map((tx) => (
          <div className="card" key={tx.id}>
            <h3>{tx.category} ({tx.type})</h3>
            <p>Amount: ₦{tx.amount}</p>
            {tx.note && <p>Note: {tx.note}</p>

            }
            <div className="card-actions">
              <button className="btn" onClick={() => openModal(tx, 'edit')}>
                Edit
              </button>
              <button className="btn btn-delete" onClick={() => openModal(tx, 'delete')}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal-trans">
            <h3>
              {modal.mode === 'delete'
                ? 'Confirm Delete'
                : modal.transaction
                ? 'Edit Transaction'
                : 'New Transaction'}
            </h3>

            {modal.mode !== 'delete' ? (
              <>
                <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
                <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} />
                <input name="note" placeholder="Note" value={form.note} onChange={handleChange} />

                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </>
            ) : (
              <p>
                Are you sure you want to delete <strong>{modal.transaction?.category}</strong>?
              </p>
            )}

            <div className="modal-actions">
              {modal.mode === 'delete' ? (
                <button className="btn btn-delete" onClick={handleDelete}>
                  Confirm Delete
                </button>
              ) : (
                <button className="btn" onClick={handleSubmit}>
                  Save
                </button>
              )}
              <button className="btn" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transaction;
