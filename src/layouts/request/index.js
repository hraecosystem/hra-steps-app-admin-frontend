import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axiosIns from "plugins/axios";
import dayjs from "dayjs";
import Divider from "@mui/material/Divider";

const Author = ({ image, name, email }) => (
  <MDBox display="flex" alignItems="center" lineHeight={1}>
    <MDAvatar src={image} name={name} size="sm" />
    <MDBox ml={2} lineHeight={1}>
      <MDTypography display="block" variant="button" fontWeight="medium">
        {name}
      </MDTypography>
      <MDTypography variant="caption">{email}</MDTypography>
    </MDBox>
  </MDBox>
);
Author.propTypes = {
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  email: PropTypes.string,
};
Author.defaultProps = {
  image: "",
  email: "",
};

const StatusBadge = ({ status }) => {
  let color;
  switch (status) {
    case "Approved":
      color = "success";
      break;
    case "Rejected":
      color = "error";
      break;
    case "Paid":
      color = "primary";
      break;
    default:
      color = "warning";
  }
  return (
    <MDBadge
      badgeContent={status}
      color={color}
      variant="gradient"
      size="sm"
      container
    />
  );
};
StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

function WithdrawalRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentReq, setCurrentReq] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [txId, setTxId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const statusOptions = ["Pending", "Approved", "Rejected", "Paid"];

  const getRequests = async () => {
    try {
      setLoading(true);
      const { data } = await axiosIns.get("withdrawals/all");
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch withdrawal requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  const handleOpenModal = (req, status) => {
    setCurrentReq(req);
    setNewStatus(status);
    setRemarks("");
    setTxId("");
    setActionError(null);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentReq(null);
  };

  const handleSubmit = async () => {
    if (!newStatus) return;
    setSubmitting(true);
    try {
      const payload = { status: newStatus };
      if (remarks) payload.remarks = remarks;
      if (txId) payload.txId = txId;
      const { data } = await axiosIns.put(
        `withdrawals/${currentReq._id}`,
        payload
      );
      // update local list
      setRequests((prev) =>
        prev.map((r) => (r._id === data._id ? data : r))
      );
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setActionError(
        err.response?.data?.message || "Failed to update request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { Header: "Requester", accessor: "requester", width: "30%", align: "left" },
    { Header: "Amount", accessor: "amount", align: "center" },
    { Header: "Wallet", accessor: "wallet", align: "left" },
    { Header: "Status", accessor: "status", align: "center" },
    { Header: "Requested At", accessor: "requestedAt", align: "center" },
    { Header: "Processed At", accessor: "processedAt", align: "center" },
    { Header: "TxId", accessor: "txId", align: "left" },
    { Header: "Remarks", accessor: "remarks", align: "left" },
    { Header: "Action", accessor: "action", align: "center" },
  ];

  const rows = requests.map((req) => {
    const user = req.userId || {};
    const name =
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.email || "Unknown";
    const avatar = user.avatarUrl || "";

    return {
      requester: <Author image={avatar} name={name} email={user.email} />,
      amount: (
        <MDTypography variant="caption" fontWeight="medium">
          {req.amount}
        </MDTypography>
      ),
      wallet: (
        <MDTypography variant="caption" fontWeight="medium">
          {req.walletAddress}
        </MDTypography>
      ),
      status: (
        <MDBox display="flex" justifyContent="center">
          <StatusBadge status={req.status} />
        </MDBox>
      ),
      requestedAt: (
        <MDTypography variant="caption" fontWeight="medium">
          {req.requestedAt
            ? dayjs(req.requestedAt).format("DD/MM/YYYY HH:mm")
            : "-"}
        </MDTypography>
      ),
      processedAt: (
        <MDTypography variant="caption" fontWeight="medium">
          {req.processedAt
            ? dayjs(req.processedAt).format("DD/MM/YYYY HH:mm")
            : "-"}
        </MDTypography>
      ),
      txId: (
        <MDTypography variant="caption" fontWeight="medium">
          {req.txId || "-"}
        </MDTypography>
      ),
      remarks: (
        <MDTypography variant="caption" fontWeight="medium">
          {req.remarks || "-"}
        </MDTypography>
      ),
      action: (
        <FormControl variant="standard" size="small">
          <InputLabel id={`status-label-${req._id}`}>Change</InputLabel>
          <Select
            labelId={`status-label-${req._id}`}
            value={req.status}
            onChange={(e) => handleOpenModal(req, e.target.value)}
            label="Change"
            disabled={req.status === "Paid"}
          >
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    };
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Withdrawal Requests
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage
                  showTotalEntries
                  noEndBorder
                  loading={loading}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      {/* Modal for updating status */}
      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Update Withdrawal Request</DialogTitle>
        <DialogContent dividers>
          {currentReq && (
            <>
              <MDBox mb={2}>
                <Author
                  image={currentReq.userId?.avatarUrl}
                  name={
                    currentReq.userId
                      ? `${currentReq.userId.firstName} ${currentReq.userId.lastName}`
                      : "Unknown"
                  }
                  email={currentReq.userId?.email}
                />
              </MDBox>
              <Divider />
              <MDTypography variant="body2" mt={2}>
                <strong>Amount:</strong> {currentReq.amount}
              </MDTypography>
              <MDTypography variant="body2">
                <strong>Wallet:</strong> {currentReq.walletAddress}
              </MDTypography>
              <MDTypography variant="body2">
                <strong>Current Status:</strong> <StatusBadge status={currentReq.status} />
              </MDTypography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="new-status-label">New Status</InputLabel>
                <Select
                  labelId="new-status-label"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="New Status"
                >
                  {statusOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Transaction ID (optional)"
                fullWidth
                margin="dense"
                value={txId}
                onChange={(e) => setTxId(e.target.value)}
              />
              <TextField
                label="Remarks"
                fullWidth
                margin="dense"
                multiline
                minRows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
              {actionError && (
                <MDTypography color="error" variant="caption">
                  {actionError}
                </MDTypography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting || !newStatus}
          >
            {submitting ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}

export default WithdrawalRequests;
