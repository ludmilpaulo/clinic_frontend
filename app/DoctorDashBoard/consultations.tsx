import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { selectUser } from '@/redux/slices/authSlice';
import axios from 'axios';
import { baseAPI } from '@/utils/variables';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Set the app element to the root of your application

interface ConsultationProps {
  userId: number | null;
}

const Consultations: React.FC<ConsultationProps> = ({ userId }) => {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(null);
  const [drugs, setDrugs] = useState<any[]>([]);
  const [prescriptionDrugs, setPrescriptionDrugs] = useState<any[]>([]);
  const [notes, setNotes] = useState<string>('');
  const user = useSelector((state: RootState) => selectUser(state));
  const token = user?.token;

  const fetchConsultations = (appointmentTime: Date | null) => {
    let url = `${baseAPI}/pharmacy/appointments/${userId}`;
    if (appointmentTime) {
      url += `?appointment_time=${appointmentTime.toISOString()}`;
    }

    if (token && userId) {
      axios.get(url, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        setConsultations(response.data);
      })
      .catch(error => {
        console.error('Error fetching consultations:', error);
      });
    }
  };

  const fetchDrugs = () => {
    if (token) {
      axios.get(`${baseAPI}/pharmacy/drugs/`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        setDrugs(response.data);
      })
      .catch(error => {
        console.error('Error fetching drugs:', error);
      });
    }
  };

  const handlePrescriptionSubmit = () => {
    if (token && selectedConsultation) {
      const data = {
        patient: selectedConsultation.patient.id,
        prescribed_by: user.user_id,
        drugs: prescriptionDrugs.map(drug => ({
          drug: drug.id,
          quantity: drug.quantity,
        })),
        notes,
      };

      axios.post(`${baseAPI}/pharmacy/prescriptions/`, data, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => {
        console.log('Prescription created:', response.data);
        // Close modal and reset form
        setSelectedConsultation(null);
        setPrescriptionDrugs([]);
        setNotes('');
      })
      .catch(error => {
        console.error('Error creating prescription:', error);
      });
    }
  };

  useEffect(() => {
    fetchConsultations(selectedTime);
  }, [token, userId, selectedTime]);

  useEffect(() => {
    fetchDrugs();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">My Consultations</h2>
        <div className="mb-4">
          <DatePicker
            selected={selectedTime}
            onChange={(date) => setSelectedTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="border border-gray-300 rounded p-2"
            placeholderText="Select appointment time"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow duration-200"
              onClick={() => setSelectedConsultation(consultation)}
            >
              <h3 className="text-lg font-semibold mb-2">{dayjs(consultation.appointment_time).format('MMMM D, YYYY')}</h3>
              <p className="text-sm text-gray-600">Patient: {consultation.patient_name}</p>
              <p className="text-sm text-gray-600">Time: {dayjs(consultation.appointment_time).format('h:mm A')}</p>
              <p className="text-sm text-gray-600">Status: {consultation.status}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal
        isOpen={!!selectedConsultation}
        onRequestClose={() => setSelectedConsultation(null)}
        contentLabel="Prescription Form"
        ariaHideApp={false}
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedConsultation && (
          <div>
            <h2 className="text-xl font-bold mb-4">Create Prescription for {selectedConsultation.patient_name}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Drugs</label>
              {drugs.map(drug => (
                <div key={drug.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={`drug-${drug.id}`}
                    className="mr-2"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPrescriptionDrugs([...prescriptionDrugs, { ...drug, quantity: 1 }]);
                      } else {
                        setPrescriptionDrugs(prescriptionDrugs.filter(d => d.id !== drug.id));
                      }
                    }}
                  />
                  <label htmlFor={`drug-${drug.id}`} className="text-sm text-gray-600">{drug.name}</label>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <textarea
                className="border border-gray-300 rounded p-2 w-full"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={handlePrescriptionSubmit}
            >
              Submit Prescription
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Consultations;
