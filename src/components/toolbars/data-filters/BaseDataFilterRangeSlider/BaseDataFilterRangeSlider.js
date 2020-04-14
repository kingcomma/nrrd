import React, { useContext, useEffect } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { DataFilterContext } from '../../../../stores/data-filter-store'
import { AppStatusContext } from '../../../../stores/app-status-store'
import DFQM from '../../../../js/data-filter-query-manager/index'
import {
  YEARS,
} from '../../../../constants'

import { range } from '../../../../js/utils'

import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemText from '@material-ui/core/ListItemText'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import {
  IconButton,
  Grid,
  Slider,
  Typography,
  LinearProgress
} from '@material-ui/core'
import { ClearAll } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(2),
    width: '-webkit-fill-available',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  MuiSlider: {
    color: 'black',
    thumb: {
      color: 'blue'
    }
  }
}))

const BaseDataFilterRangeSlider = ({ dataFilterKey, label = 'Years', helperText, loadingMessage = 'Updating...' }) => {
  const { state } = useContext(DataFilterContext)
  const { loading, error, data } = useQuery(DFQM.getQuery(dataFilterKey, state), DFQM.getVariables(state))

  const { updateLoadingStatus, showErrorMessage } = useContext(AppStatusContext)

  useEffect(() => {
    if (error) {
      showErrorMessage(`Error!: ${ error.message }`)
    }
  }, [error])

  useEffect(() => {
    updateLoadingStatus({ status: loading, message: loadingMessage })
  }, [loading])

  return (
    <React.Fragment>
      <BaseDataFilterRangeSliderImpl dataFilterKey={dataFilterKey} data={data} label={label} helperText={helperText} />
    </React.Fragment>
  )
}

export default BaseDataFilterRangeSlider

const BaseDataFilterRangeSliderImpl = ({ dataFilterKey, label, data, helperText }) => {
  const classes = useStyles()
  const { state, updateDataFilter } = useContext(DataFilterContext)
  const handleChange = (event, newValue) => {
    updateDataFilter({ [dataFilterKey]: range(newValue[0], newValue[newValue.length - 1]).toString() })
  }

  useEffect(() => {
    if (data && data.options.length === 0) {
      updateDataFilter({ [dataFilterKey]: undefined })
    }
  }, [data])

  const currentYears = state[dataFilterKey] ? state[dataFilterKey].split(',') : []

  const yearOptions = (data && data.options.length > 0) && data.options.map(item => item.option)

  const getCurrentValues = () => {
    let values = []
    if (currentYears.length > 0) {
      values = [parseInt(currentYears[0]), parseInt(currentYears[currentYears.length - 1])]
    }
    else if (yearOptions && yearOptions.length > 0) {
      values = [yearOptions[0], yearOptions[yearOptions.length - 1]]
    }
    return values
  }
  const getCurrentValuesText = () => {
    let valuesText = ''
    if (currentYears.length > 0) {
      valuesText = valuesText.concat(`${ currentYears[0] } - ${ currentYears[currentYears.length - 1] }`)
    }
    else if (yearOptions && yearOptions.length > 0) {
      valuesText = valuesText.concat(`${ yearOptions[0] } - ${ yearOptions[yearOptions.length - 1] }`)
    }
    return valuesText
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <FormControl className={classes.formControl} disabled={(data && data.options.length === 0)}>
          <InputLabel id="years-select-label">
            {label.concat(': ')}<Typography display={'inline'} color={'textSecondary'}>{getCurrentValuesText()}</Typography>
          </InputLabel>
          {yearOptions &&
            <Slider
              defaultValue={getCurrentValues()}
              getAriaValueText={getCurrentValuesText}
              aria-labelledby="years-select-label"
              valueLabelDisplay="auto"
              step={1}
              onChangeCommitted={handleChange}
              marks
              min={yearOptions[0]}
              max={yearOptions[yearOptions.length - 1]}
              className={classes.MuiSlider} />
          }
          {helperText &&
            <FormHelperText>{helperText}</FormHelperText>
          }
          {(data && data.options.length === 0) &&
            <FormHelperText>No '{label}' match the current filter options.</FormHelperText>
          }
        </FormControl>
      </Grid>
    </Grid>
  )
}
