export function useGraphData(apiData: any) {
  const rawIssues = apiData?.issues || []

  const nodesMap = new Map<string, any>()
  const links: { source: string; target: string; weight: number }[] = []

  rawIssues.forEach((issue: any) => {
    const issueId = issue.number.toString()

    nodesMap.set(issueId, {
      id: issueId,
      title: issue.title,
      url: issue.url,
      group: issue.state === 'OPEN' ? 1 : 0,
    })

    console.log('Sample issue timeline:', issue.timelineItems?.nodes)

    issue.timelineItems.nodes.forEach((event: any) => {
      const source = event.source
      if (source && source.number) {
        const refId = source.number.toString()

        nodesMap.set(refId, {
          id: refId,
          title: source.title,
          url: source.url,
          group: source.state === 'OPEN' ? 1 : 0,
        })

        links.push({
          source: issueId,
          target: refId,
          weight: 1,
        })

        console.log('→ Added link:', issueId, '->', refId)
      }
    })
  })

  const nodes = Array.from(nodesMap.values())
  return { nodes, links }
}
