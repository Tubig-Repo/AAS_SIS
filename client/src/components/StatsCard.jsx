const StatsCard = (tuitionFees) => {
  return (
    <div className="row mb-4">
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                <i className="bi bi-cash-stack text-primary fs-4"></i>
              </div>
              <div>
                <h6 className="mb-1 text-muted">Fee Structures</h6>
                <h3 className="mb-0">{tuitionFees.length}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                <i className="bi bi-credit-card text-success fs-4"></i>
              </div>
              <div>
                <h6 className="mb-1 text-muted">Payment Options</h6>
                <h3 className="mb-0">2</h3>
                <small className="text-muted">Cash & Installment</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="bg-warning bg-opacity-10 rounded-3 p-3 me-3">
                <i className="bi bi-percent text-warning fs-4"></i>
              </div>
              <div>
                <h6 className="mb-1 text-muted">Installment Rate</h6>
                <h3 className="mb-0">10%</h3>
                <small className="text-muted">Additional charge</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="bg-info bg-opacity-10 rounded-3 p-3 me-3">
                <i className="bi bi-calendar-check text-info fs-4"></i>
              </div>
              <div>
                <h6 className="mb-1 text-muted">Academic Year</h6>
                <h3 className="mb-0">2024-25</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
