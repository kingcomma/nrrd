/* eslint-disable no-undef */
import React from 'react'
import ArchiveBanner from './ArchiveBanner'
import { create } from 'react-test-renderer'
import theme from '../../../js/mui/theme'
import { ThemeProvider } from '@material-ui/core/styles'

describe('Archive Banner:', () => {
  function MockedTheme ({ children }) {
    return (
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    )
  }

  test('Match snapshot', () => expect(create(<MockedTheme><ArchiveBanner /></MockedTheme>).toJSON()).toMatchSnapshot())
})
