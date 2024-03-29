import { useRef, useState } from 'react'
import React from 'react';

function PersonalInfoForm({ resume: [resume, setResume] }){
    // const [formData, setFormData] = useState({
    //     firstName: '',
    //     lastName: '',
    //     phoneNumber: '',
    //     email: '',
    //     website: ''
    // });

    const formData = resume.personal;

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(value !== '' && name === "phoneNumber" && !/^\d{1,20}?$/.test(value)){
          return
        }
        setResume(prevState => ({
            ...prevState,
            personal: {
              ...prevState.personal,
              [name]: value
            }
        }));
    };


    return (
    <form onSubmit={(e) => e.preventDefault()} className='content'>
      <div className="row mb-3">
        <div className="col-sm-10 form-floating">
          <input type="text" className="form-control ps-2 bg-light" placeholder='_' id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            <label htmlFor="firstName" className="ms-2 col-form-label">First Name</label>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-10 form-floating">
          <input type="text" className="form-control ps-2 bg-light" placeholder='_' id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            <label htmlFor="lastName" className="ms-2 col-form-label">Last Name</label>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-10 form-floating">
          <input type="text" className="form-control ps-2 bg-light" placeholder='_' id="profession" name="profession" value={formData.profession} onChange={handleChange} />
            <label htmlFor="profession" className="ms-2 col-form-label">Profession</label>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-10 form-floating">
          <input type="email" className="form-control ps-2 bg-light" placeholder='_' id="email" name="email" value={formData.email} onChange={handleChange} />
            <label htmlFor="email" className="ms-2 col-form-label">Email</label>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-10 form-floating">
          <input type="tel" className="form-control ps-2 bg-light" placeholder='_' id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            <label htmlFor="phoneNumber" className="ms-2 col-form-label">Phone Number</label>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-sm-10 form-floating">
          <input type="url" className="form-control ps-2 bg-light" placeholder='_' id="website" name="website" value={formData.website} onChange={handleChange} />
            <label htmlFor="website" className="ms-2 col-form-label">Website</label>
        </div>
      </div>
    </form>
    )
}

export default PersonalInfoForm
