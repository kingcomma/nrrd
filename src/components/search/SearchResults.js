import React, { useState, Fragment } from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'
import { Index } from 'elasticlunr'
import 'url-search-params-polyfill' // Temporary polyfill for EdgeHTML 14-16

import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

// import GlossaryTerm from '../components/GlossaryTerm/GlossaryTerm'

export const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: theme.spacing(3)
  },
  mainContent: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(2)
  },
  searchResultsContainer: {
    minHeight: '500px',
    maxWidth: '100%'
  }
}))

export const SearchResults = () => {
  const classes = useStyles()
  const data = useStaticQuery(graphql`
    query SearchIndexQuery {
      siteSearchIndex {
        index
      }
    }
  `
  )
  const index = Index.load(data.siteSearchIndex.index)
  let urlParams = new URLSearchParams()
  if (typeof window !== 'undefined' && window) {
    urlParams = new URLSearchParams(window.location.search)
  }
  const queryString = urlParams.get('q')
  const [results] = useState(index
    .search(queryString, {})
    // Map over each ID and return the full document
    .map(({ ref }) => index.documentStore.getDoc(ref))
  )

  return (
    <Fragment>
      <Container maxWidth="lg">
        <section className={classes.mainContent}>
          <Typography variant="h1" id="introduction" className={classes.title}>Search Results</Typography>
          <div className={classes.searchResultsContainer}>
            <article>
              <ul>
                {results.length > 0
                  ? results.map((item, index) => {
                    console.log(item)
                    return <li key={ index }><Link to={ item.path }>{ item.title }</Link></li>
                  }
                  ) : <p><strong>We didn't find any search results for " {queryString} ".</strong></p>
                }
              </ul>
            </article>
          </div>
        </section>
      </Container>
    </Fragment>
  )
}

export default SearchResults

/*
 {(glossaryResults.length > 0) &&
                  <Fragment>You might try searching for <GlossaryTerm>{queryString}</GlossaryTerm> in our glossary.</Fragment>}
*/
