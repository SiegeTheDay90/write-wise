import React from 'react';
import { shortDate } from './util/DocX';
import '../../styles/ResumePreview.scss';

function EducationForm({ resume }){
    const { personal, education, work, skills } = resume;

    return (
        <div id="resume-preview-container" className="p-4 h-100">
            <section id="resume-preview-personal" className="resume-preview-section">
                <h4 id="resume-preview-name">{`${personal.firstName.trim() || 'Jay'} ${personal.lastName.trim() || 'Doe'}`}</h4>
                {personal.profession && <h6 id="resume-preview-profession">{`${personal.profession.trim() || ''}`}</h6>}
                <p id="resume-preview-email">{personal.email.trim() || 'JayDoe@writewise.io'}</p>
                {personal.phoneNumber && <p id="resume-preview-phone">{personal.phoneNumber.trim() || ''}</p>}
                {personal.website && <p id="resume-preview-website">{personal.website.trim() || ''}</p>}
            </section>

            <section id="resume-preview-work" className="mt-4 resume-preview-section">
                {work.length ? <h5>Experience</h5> : null}
                    {
                        work.map( (item, idx) => (
                            <div key={idx} className="resume-preview-work-item mt-1">
                                <h6 className="d-flex flex-row justify-content-between">
                                    <span>
                                        {item.companyName || 'company'} - {item.jobTitle || 'title'}
                                    </span>
                                    <span>
                                        {item.from ? shortDate(new Date(item.from).toLocaleDateString('en-US'))+' to ' : ''}{item.current ? 'Present' : item.to ? shortDate(new Date(item.to).toLocaleDateString('en-US')) : ''}
                                    </span>
                                </h6>
                                <p>{item.city || 'City, State'}</p>
                                {item.description?.split("\n").map((bullet, idx) => (
                                    bullet.trim() ? <li className={"bullet-point"} key={idx}><div>{bullet}</div></li>: null
                                ))}
                                {/* <p>{item.description || 'Description'}</p> */}
                            </div>
                        ))
                    }
            </section>

            <section id="resume-preview-education" className="mt-3 resume-preview-section">
                {education.length ? <h5>Education</h5> : null}
                    {
                        education.map( (item, idx) => {
                            return(
                            <div key={idx} className="resume-preview-work-item mt-1">
                                <h6 className="d-flex flex-row justify-content-between">
                                    <span>{item.degreeType ? item.degreeType+' - ' : ''}{item.fieldOfStudy || 'field'}</span>
                                    <span>{item.from ? shortDate(new Date(item.from).toLocaleDateString('en-US'))+' to ' : ''}{item.to ? (item.current && !item.from ? 'Graduating ' : '') + shortDate(new Date(item.to).toLocaleDateString('en-US')) : ''}</span>
                                </h6>
                                <p>{item.institutionName || 'School'}</p>
                                {item.description?.split("\n").map((bullet, idx) => (
                                    bullet.trim() ? <li className={"bullet-point"} key={idx}><div>{bullet}</div></li>: null
                                ))}                           
                            </div>
                        )})
                    }
            </section>

            <section id="resume-preview-skills" className="mt-3 resume-preview-section">
                {skills.length ? <h5>Skills</h5> : null}

                    {
                        skills.join(" | ")
                    }
            </section>
        </div>
    );
}

export default EducationForm
