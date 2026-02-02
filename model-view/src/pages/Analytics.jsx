import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { useNavigate } from 'react-router-dom';
import './trans-budget.css'
import axiosInstance from '../utils/axiosInstance';


const Analytics = () => {
  const chartInstance = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [modal, setModal] = useState({ isOpen: false, card: null });
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axiosInstance.get('/api/analytics', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { total_income, total_expense, net_savings } = res.data;

       setCards([
          { id: 1, title: 'Total Income', value: `$${total_income ?? 0}` },
          { id: 2, title: 'Total Expenses', value: `$${total_expense ?? 0}` },
          { id: 3, title: 'Savings', value: `$${net_savings ?? 0}` }
     ]);

        if (chartInstance.current) {
          chartInstance.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Income', 'Expenses'],
            datasets: [
              {
                label: 'Monthly Overview',
                data: [total_income ?? 0, total_expense ?? 0],
                backgroundColor: ['#28a745', '#dc3545']
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              animateScale: true,
              animateRotate: true
            },
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });

      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchAnalytics();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [navigate]);

  const openModal = (card) => {
    setModal({ isOpen: true, card });
    setEditValue(card.value);
  };

  const closeModal = () => {
    setModal({ isOpen: false, card: null });
    setEditValue('');
  };

  const handleSave = () => {
    
    setCards((prevCards) =>
      prevCards.map((c) =>
        c.id === modal.card.id ? { ...c, value: editValue } : c
      )
    );
    closeModal();
  };

  const handleDelete = () => {
    
    setCards((prevCards) => prevCards.filter((c) => c.id !== modal.card.id));
    closeModal();
  };

  return (
    <div className="page-container">
      <div className='page-nav'>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>&larr; Back</button>
        <h2>Analytics</h2>
      </div>

      <div style={{ position: 'relative', height: '300px', width: '100%' }}>
        <canvas id="myChart" ref={canvasRef}></canvas>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <div key={card.id} className="card" onClick={() => openModal(card)} style={{ cursor: 'pointer' }}>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </div>
        ))}
      </div>

      {modal.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit {modal.card.title}</h3>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="analytics-input"
            />
            
            <div className="modal-actions">
              <button className="modal-btn" onClick={handleSave}>Save</button>
              <button className="modal-btn btn-delete" onClick={handleDelete}>Delete</button>
              <button className="modal-btn" onClick={closeModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
