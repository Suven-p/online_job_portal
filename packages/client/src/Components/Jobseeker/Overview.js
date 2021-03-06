import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

function Overview() {
  const [jobs, setJobs] = useState([]);
  const [numPages, setNumPages] = useState([0]);
  const [curPage, setCurPage] = useState([1]);

  async function fetchJobs(curPage) {
    const res = await fetch(`/api/jobs?page=${curPage}`);
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function getJobs() {
      const overviewJobs = await fetchJobs(curPage);
      setJobs(overviewJobs.jobs);
      setNumPages(overviewJobs.numPages);
    }
    getJobs();
  }, [curPage]);

  return (
    <div className="overview card my-5">
      <h1 className="card-header">Overview</h1>
      <div className="jobs container">
        <ul className=" list-group">
          {jobs.map((job) => {
            return (
              <li key={job.jobId} className="p-3 my-3 bg-light list-group-item">
                <div className="job d-flex flex-row justify-content-between align-items-center my-2">
                  <div className="d-flex flex-column">
                    <h3>{job.title}</h3>
                    <h6>Company: {job.companyName}</h6>
                    <h6>Deadline: {job.deadline}</h6>
                  </div>
                  <div>
                    <Link
                      to={`/jobs/${job.jobId}`}
                      className="btn btn-secondary btn-lg mx-2"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="d-flex justify-content-center my-3 page-number">
        <ReactPaginate
          className="pagination"
          onPageChange={(e) => {
            setCurPage(e.selected + 1);
          }}
          pageClassName="page-item"
          pageLinkClassName="page-link"
          activeClassName="active"
          disabledClassName="disabled"
          breakLabel="..."
          breakClassName="page-item"
          nextLabel="Next >"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          previousLabel="Previous <"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          pageRangeDisplayed={5}
          pageCount={Math.ceil(numPages)}
          renderOnZeroPageCount={null}
        />
      </div>
    </div>
  );
}

export default Overview;
