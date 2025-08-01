import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
        Card,
        Grid,
        Dialog,
        DialogTitle,
        DialogContent,
        DialogActions,
        Button,
        Divider,
        Table,
        TableBody,
        TableRow,
        TableCell,
} from "@mui/material";
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import axiosIns from "plugins/axios";

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

function Users() {
        const [users, setUsers] = useState([]);
        const [rows, setRows] = useState([]);
        const [selected, setSelected] = useState(null);
        const [open, setOpen] = useState(false);

        const columns = [
                { Header: "User", accessor: "user", width: "30%", align: "left" },
                { Header: "Email", accessor: "email", align: "left" },
                { Header: "Phone", accessor: "phone", align: "center" },
                { Header: "Coin Balance", accessor: "coinBalance", align: "center" },
                { Header: "Country", accessor: "country", align: "center" },
                { Header: "Action", accessor: "action", align: "center" },
        ];

        const getUsers = async () => {
                try {
                        const { data } = await axiosIns.get("users/list");
                        setUsers(data);
                } catch (err) {
                        console.error("Failed to fetch users", err);
                }
        };

        useEffect(() => {
                getUsers();
        }, []);

        useEffect(() => {
                const mapped = users.map((user) => {
                        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown";
                        return {
                                user: <Author image={user.avatarUrl} name={name} email={user.email} />,
                                email: (
                                        <MDTypography variant="caption" fontWeight="medium">
                                                {user.email}
                                        </MDTypography>
                                ),
                                phone: (
                                        <MDTypography variant="caption" fontWeight="medium">
                                                {user.phone}
                                        </MDTypography>
                                ),
                                coinBalance: (
                                        <MDTypography variant="caption" fontWeight="medium">
                                                {user.coinBalance != null ? user.coinBalance : 0}
                                        </MDTypography>
                                ),
                                country: (
                                        <MDTypography variant="caption" fontWeight="medium">
                                                {user.country || user.countryCode || "-"}
                                        </MDTypography>
                                ),
                                action: (
                                        <Button
                                                className="action-button"
                                                size="small"
                                                variant="outlined"
                                                onClick={() => {
                                                        setSelected(user);
                                                        setOpen(true);
                                                }}
                                                sx={{
                                                        borderRadius: "12px",
                                                        borderWidth: 2,
                                                        borderColor: "#4CCBA6",
                                                        backgroundColor: '#4CCBA6',
                                                        fontWeight: 600,
                                                        textTransform: "none",
                                                        px: 2,
                                                        "&:hover": {
                                                                borderColor: "gray",
                                                                backgroundColor: "gray",
                                                                color: "white",
                                                        },
                                                }}
                                        >
                                                Details
                                        </Button>
                                ),
                        };
                });
                setRows(mapped);
        }, [users]);

        const handleClose = () => {
                setOpen(false);
                setSelected(null);
        };

        const renderDetailRow = (label, value) => (
                <TableRow key={label}>
                        <TableCell
                                component="th"
                                scope="row"
                                style={{ fontWeight: 600, width: "30%" }}
                        >
                                {label}
                        </TableCell>
                        <TableCell>{value != null ? String(value) : "-"}</TableCell>
                </TableRow>
        );

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
                                                                        Users
                                                                </MDTypography>
                                                        </MDBox>
                                                        <MDBox pt={3}>
                                                                <DataTable
                                                                        table={{ columns, rows }}
                                                                        isSorted={false}
                                                                        entriesPerPage
                                                                        showTotalEntries
                                                                        noEndBorder
                                                                />
                                                        </MDBox>
                                                </Card>
                                        </Grid>
                                </Grid>
                        </MDBox>

                        <Footer />

                        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                                <DialogTitle>User Details</DialogTitle>
                                <DialogContent dividers>
                                        {selected ? (
                                                <>
                                                        <MDBox mb={2}>
                                                                <Author
                                                                        image={selected.avatarUrl}
                                                                        name={`${selected.firstName} ${selected.lastName}`}
                                                                        email={selected.email}
                                                                />
                                                        </MDBox>
                                                        <Divider />
                                                        <Table>
                                                                <TableBody>
                                                                        {renderDetailRow("First Name", selected.firstName)}
                                                                        {renderDetailRow("Last Name", selected.lastName)}
                                                                        {renderDetailRow("Email", selected.email)}
                                                                        {renderDetailRow("Phone", selected.phone)}
                                                                        {renderDetailRow("Coin Balance", selected.coinBalance)}
                                                                        {renderDetailRow("Country", selected.country)}
                                                                        {renderDetailRow("Country Code", selected.countryCode)}
                                                                        {renderDetailRow("Role", selected.role)}
                                                                        {renderDetailRow("Is Verified", selected.isVerified ? "Yes" : "No")}
                                                                        {renderDetailRow(
                                                                                "Current Challenge Progress",
                                                                                selected.currentChallengeProgress
                                                                        )}
                                                                        {renderDetailRow("Completed Challenges", selected.completedChallenges)}
                                                                        {renderDetailRow(
                                                                                "Subscription Active",
                                                                                selected.subscription?.isActive ? "Yes" : "No"
                                                                        )}
                                                                        {renderDetailRow(
                                                                                "Next Billing Date",
                                                                                selected.subscription?.nextBillingDate
                                                                                        ? new Date(selected.subscription.nextBillingDate).toLocaleString()
                                                                                        : "-"
                                                                        )}
                                                                        {renderDetailRow("Settings Language", selected.settings?.language)}
                                                                        {renderDetailRow("Push Notifications", selected.settings?.pushNotifications ? "On" : "Off")}
                                                                        {renderDetailRow("Daily Reminder", selected.settings?.dailyReminder ? "On" : "Off")}
                                                                        {renderDetailRow("Units", selected.settings?.units)}
                                                                        {renderDetailRow("Contact Email", selected.contact?.email)}
                                                                        {renderDetailRow("Contact Phone", selected.contact?.phone)}
                                                                        {renderDetailRow("Instagram", selected.contact?.instagram)}
                                                                        {/* include any other fields you want */}
                                                                </TableBody>
                                                        </Table>
                                                </>
                                        ) : (
                                                <MDTypography>Loading...</MDTypography>
                                        )}
                                </DialogContent>
                                <DialogActions>
                                        <Button onClick={handleClose}
                                                sx={{
                                                        borderRadius: "12px",
                                                        borderWidth: 2,
                                                        borderColor: "#4CCBA6",
                                                        backgroundColor: '#4CCBA6',
                                                        color: "white",
                                                        fontWeight: 600,
                                                        textTransform: "none",
                                                        px: 2,
                                                        "&:hover": {
                                                                borderColor: "gray",
                                                                backgroundColor: "gray",
                                                                color: "white",
                                                        },
                                                }}
                                        >
                                                Close
                                        </Button>
                                </DialogActions>
                        </Dialog>
                </DashboardLayout>
        );
}

export default Users;
