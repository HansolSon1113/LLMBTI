import React from 'react';
import './UserdataInput.css'
const UserdataInput = ({ userData, handleUserDataChange, handleSubmitUserInfo }) => {
  return (
    <div className="user-info-form">
      <div className="user-info-form-container">
        <h1>당신은...??</h1>
        <form className="space-y-4">
          <input
            type="text"
            name="Age"
            placeholder="Age"
            value={userData.Age}
            onChange={handleUserDataChange}
            className="user-info-form-input"
          />
          <input
            type="text"
            name="Job"
            placeholder="Job"
            value={userData.Job}
            onChange={handleUserDataChange}
            className="user-info-form-input"
          />
          <input
            type="text"
            name="Country"
            placeholder="Country"
            value={userData.Country}
            onChange={handleUserDataChange}
            className="user-info-form-input"
          />
          <input
            type="text"
            name="Interest"
            placeholder="Interest"
            value={userData.Interest}
            onChange={handleUserDataChange}
            className="user-info-form-input"
          />
          <button
            type="button"
            onClick={handleSubmitUserInfo}
            className="user-info-form-button"
          >
            MBTI 검사 시작하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserdataInput;
