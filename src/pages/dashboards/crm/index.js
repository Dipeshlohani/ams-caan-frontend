// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'

// ** Custom Components Imports
import CardStatisticsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import CrmTotalSales from 'src/views/dashboards/crm/CrmTotalSales'
import CrmWeeklySales from 'src/views/dashboards/crm/CrmWeeklySales'
import CrmTotalGrowth from 'src/views/dashboards/crm/CrmTotalGrowth'
import CrmUpgradePlan from 'src/views/dashboards/crm/CrmUpgradePlan'
import CrmRevenueReport from 'src/views/dashboards/crm/CrmRevenueReport'
import CrmSalesOverview from 'src/views/dashboards/crm/CrmSalesOverview'
import CrmStatisticsCard from 'src/views/dashboards/crm/CrmStatisticsCard'
import CrmMeetingSchedule from 'src/views/dashboards/crm/CrmMeetingSchedule'
import CrmDeveloperMeetup from 'src/views/dashboards/crm/CrmDeveloperMeetup'
import CrmActivityTimeline from 'src/views/dashboards/crm/CrmActivityTimeline'
import CardTwitter from 'src/views/ui/cards/basic/CardTwitter'

import { useState, useEffect } from 'react'
import gql from 'graphql-tag'

import CardActivity from 'src/views/ui/cards/basic/CardActivity'
import { useQuery } from '@apollo/react-hooks'

const data = [
  {
    stats: '13.7k',
    title: 'Ratings',
    trendNumber: '+38%',
    chipColor: 'primary',
    chipText: 'Year of 2022',
    src: '/images/cards/pose_f9.png'
  },
  {
    stats: '24.5k',
    trend: 'negative',
    title: 'Sessions',
    trendNumber: '-22%',
    chipText: 'Last Week',
    chipColor: 'secondary',
    src: '/images/cards/pose_m18.png'
  }
]

const LIST_ACTIVITIES = gql`
  query {
    activities {
      _id
      title
      description
    }
  }
`

const CRMDashboard = ({}) => {
  const { loading, error, data } = useQuery(LIST_ACTIVITIES)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const activities = data.activities
  console.log(activities)

  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        {/* <Grid item xs={12} sm={6} md={3} sx={{ pt: theme => `${theme.spacing(12.25)} !important` }}>
          <CardStatisticsCharacter data={data[0]} />
        </Grid>
        <Grid item xs={12} sm={6} md={3} sx={{ pt: theme => `${theme.spacing(12.25)} !important` }}>
          <CardStatisticsCharacter data={data[1]} />
        </Grid> */}
        <Grid item xs={12}>
          <CardActivity />
        </Grid>
        <Grid item xs={12}>
          <CardActivity />
        </Grid>

        {/* <Grid item xs={12} md={6}>
          <CrmStatisticsCard />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CrmTotalSales />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CrmRevenueReport />
        </Grid>
        <Grid item xs={12} md={6}>
          <CrmSalesOverview />
        </Grid>
        <Grid item xs={12} md={6}>
          <CrmActivityTimeline />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={6}>
            <Grid item xs={12} sm={8}>
              <CrmWeeklySales />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container spacing={6}>
                <Grid item xs={6} sm={12}>
                  <CrmTotalGrowth />
                </Grid>
                <Grid item xs={6} sm={12}>
                  <CardStatisticsVerticalComponent
                    stats='862'
                    trend='negative'
                    trendNumber='-18%'
                    title='New Project'
                    subtitle='Yearly Project'
                    icon={<BriefcaseVariantOutline />}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CrmUpgradePlan />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CrmMeetingSchedule />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <CrmDeveloperMeetup />
        </Grid> */}
      </Grid>
    </ApexChartWrapper>
  )
}

export default CRMDashboard
