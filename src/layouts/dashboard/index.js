/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import axiosIns from "plugins/axios";
import { useEffect, useState } from "react";

function Dashboard() {
  const [stats, setStats] = useState({
    total: null,
    last24h: null,
    last7d: null,
    last30d: null,
    totalRequests: null,
    requestsLast24h: null,
    requestsLast7d: null,
    requestsLast30d: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [userRes, requestRes] = await Promise.all([
          axiosIns.get("users/stats"),
          axiosIns.get("withdrawals/requests-withdrawals"),
        ]);

        setStats({
          total: userRes.data.total,
          last24h: userRes.data.last24h,
          last7d: userRes.data.last7d,
          last30d: userRes.data.last30d,
          totalRequests: requestRes.data.totalRequests,
          requestsLast24h: requestRes.data.requestsLast24h,
          requestsLast7d: requestRes.data.requestsLast7d,
          requestsLast30d: requestRes.data.requestsLast30d,
        });
      } catch (e) {
        console.error("Failed to load stats", e);
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const display = (value) => {
    if (loading) return "…";
    if (error) return "N/A";
    return value ?? 0;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* User stats */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="people"
                title="Total Users"
                count={display(stats.total)}
                percentage={{ label: "since start" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="schedule"
                title="New Users (24h)"
                count={display(stats.last24h)}
                percentage={{ label: "last day" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="date_range"
                title="New Users (7d)"
                count={display(stats.last7d)}
                percentage={{ label: "last week" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="calendar_month"
                title="New Users (30d)"
                count={display(stats.last30d)}
                percentage={{ label: "last 30 days" }}
              />
            </MDBox>
          </Grid>

          {/* Withdrawal request stats */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="request_page"
                title="Total Withdrawal Requests"
                count={display(stats.totalRequests)}
                percentage={{ label: "since start" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="timer"
                title="New Requests (24h)"
                count={display(stats.requestsLast24h)}
                percentage={{ label: "last day" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="date_range"
                title="New Requests (7d)"
                count={display(stats.requestsLast7d)}
                percentage={{ label: "last week" }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="warning"
                icon="calendar_month"
                title="New Requests (30d)"
                count={display(stats.requestsLast30d)}
                percentage={{ label: "last 30 days" }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}


export default Dashboard;
