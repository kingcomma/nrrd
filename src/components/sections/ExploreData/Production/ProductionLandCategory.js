import React, { useContext } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

// utility functions
import utils from '../../../../js/utils'
import { StoreContext } from '../../../../store'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { DATA_FILTER_CONSTANTS as DFC } from '../../../../constants'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  useTheme
} from '@material-ui/core'

// import CloseIcon from '@material-ui/icons/Close'
// import IconMap from '-!svg-react-loader!../../../img/svg/icon-us-map.svg'
import StackedBarChart from '../../../data-viz/StackedBarChart/StackedBarChart.js'

const APOLLO_QUERY = gql`
  query FiscalProduction($state: String!, $location: String!, $commodity: String!) {
    fiscal_production_summary(where: {state_or_area: {_eq: $state}, location_type: {_eq: $location},  commodity: {_eq: $commodity}}, order_by: {sum: desc}) {
      fiscal_year
      land_category    
  state_or_area
      sum
      
    }
  }
`

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '100%',
    width: '100%',
    margin: theme.spacing(1),
    '@media (max-width: 768px)': {
      maxWidth: '100%',
      margin: 0,
    }
  },
  progressContainer: {
    maxWidth: '25%',
    display: 'flex',
    '& > *': {
      marginTop: theme.spacing(3),
      marginRight: 'auto',
      marginLeft: 'auto',
    }
  },
  circularProgressRoot: {
    color: theme.palette.primary.dark,
  },
}))

const ProductionLandCategory = ({ title, ...props }) => {
  const classes = useStyles()
  const theme = useTheme()
  const { state: filterState } = useContext(DataFilterContext)
  const year = (filterState[DFC.YEAR]) ? filterState[DFC.YEAR] : 2019
  const location = (filterState[DFC.COUNTIES]) ? filterState[DFC.COUNTIES] : 'State'
  const commodity = (filterState[DFC.COMMODITY]) ? filterState[DFC.COMMODITY] : 'Oil (bbl)'
  const state = props.abbr
  const { loading, error, data } = useQuery(APOLLO_QUERY, { variables: { state, location, commodity } })
  if (loading) {
    return (
      <div className={classes.progressContainer}>
        <CircularProgress classes={{ root: classes.circularProgressRoot }} />
      </div>
    )
  }
  if (error) return `Error! ${ error.message }`

  let chartData = []
  const dataSet = commodity

  if (data) {
    chartData = data.fiscal_production_summary
    console.debug(chartData)
    return (

      <Box className={classes.root}>
        {title && <Box component="h4" fontWeight="bold" mb={2}>{title}</Box>}
        <Box>
          <StackedBarChart
            data={chartData}
            xAxis='fiscal_year'
            yGroupBy = 'land_category'
            yAxis='sum'
            format={ d => utils.formatToCommaInt(d) }
            legendFormat={v => utils.formatToCommaInt(v)}
            xLabels={ values => {
              return values.map((v, i) => (i % 2 === 0) ? '\'' + v.toString().substr(2) : '')
            }}
            yLabel={dataSet}
          />
        </Box>
      </Box>

    )
  }
  else {
    return null
  }
}

export default ProductionLandCategory

ProductionLandCategory.propTypes = {
  title: PropTypes.string
}