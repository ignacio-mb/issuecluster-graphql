import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const allIssues: any[] = []
  let hasNextPage = true
  let afterCursor: string | null = null

  while (hasNextPage && allIssues.length < 100) {
      const query = `
      query {
        repository(owner: "metabase", name: "metabase") {
          issues(first: 100, states: [OPEN, CLOSED] ${afterCursor ? `, after: "${afterCursor}"` : ''}) {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              node {
                number
                title
                url
                state
                timelineItems(first: 100, itemTypes: CROSS_REFERENCED_EVENT) {
                  nodes {
                    ... on CrossReferencedEvent {
                      source {
                        __typename
                        ... on Issue {
                          number
                          title
                          url
                          state
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  
  

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    const result = await response.json()
    const page = result?.data?.repository?.issues

    if (!page) break

    const issues = page.edges.map((e: any) => e.node)
    allIssues.push(...issues)

    hasNextPage = page.pageInfo.hasNextPage
    afterCursor = page.pageInfo.endCursor
  }

  return { issues: allIssues }
})
