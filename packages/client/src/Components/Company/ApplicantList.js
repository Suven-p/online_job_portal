import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ApplicantList() {
  const [job, setJob] = useState();
  const [applicants, setApplicants] = useState();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(true);
  const [isValidJob, setValidJob] = useState(false);
  const [isValidApplicant, setValidApplicant] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function fetchJobs() {
    const res = await fetch(`/api/jobs/${id}`);
    const data = await res.json();
    return data;
  }

  async function fetchApplicants() {
    const res = await fetch(`/api/jobs/${id}/applicants`);
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function getJobs() {
      const overviewJobs = await fetchJobs();
      const overviewApplicants = await fetchApplicants();
      if (overviewJobs.success) {
        setJob(overviewJobs.jobDetails);
        setValidJob(true);
        if (overviewApplicants.success) {
          setApplicants(overviewApplicants.applicants);
          setValidApplicant(true);
        } else {
          setValidApplicant(false);
          setErrorMessage(overviewApplicants.message);
        }
      } else {
        setValidJob(false);
        setErrorMessage('Job does not exist');
      }
      setLoading(false);
    }
    getJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="container m-5">
        <h6>Loading...</h6>
      </div>
    );
  }
  if (!isValidJob || !isValidApplicant) {
    return (
      <div className="container m-5">
        <h6>{errorMessage}</h6>
      </div>
    );
  }
  return (
    <div className="container m-2">
      <div className="job-details my-3 py-2">
        <h3>{job.title}</h3>
        <h6>Deadline: {job.deadline}</h6>
      </div>
      <div className="sort-by my-3 ms-1 row">
        <form className="col-md-4">
          <div className="input-group mb-3">
            <label className="input-group-text" for="sortOptions">
              Sort By
            </label>
            <select className="form-select" id="sortOptions">
              <option selected value="qualification">
                Qualification
              </option>
              <option value="skills">Skills</option>
              <option value="experience">Experience</option>
            </select>
          </div>
        </form>
      </div>
      <div className="applicants container">
        <ul className="list-group">
          {applicants.map((applicant) => {
            return (
              <li
                key={applicant.applicantId}
                className="p-3 my-3 bg-light list-group-item"
              >
                <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                  <div className="d-flex flex-column">
                    <h4>
                      {applicant.firstName} {applicant.middleName}{' '}
                      {applicant.lastName}
                    </h4>
                    <h6>Email: {applicant.email}</h6>
                  </div>
                  <div>
                    <Link
                      to={`/company/applicants/profile/${applicant.applicantId}`}
                      className="btn btn-primary btn-lg mx-2"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default ApplicantList;
