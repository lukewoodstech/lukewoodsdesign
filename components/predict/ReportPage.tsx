import PredictShell from '@/components/predict/PredictShell'
import ReportWidget from '@/components/predict/ReportWidget'
import { HEADER_PRIMARY, HEADER_SECONDARY, PRESETS, layoutAxes } from '@/lib/predict/metrics'

/*
 * A finished report in the redesigned system: two widgets stacked inside
 * Predict's chrome, the way a brand manager would see it before sending it
 * on. Static, for the final-designs band; the interactive version is
 * MetricLab. Both widgets read the same series, so the ACOS in the second
 * one really is the spend-to-ad-sales ratio behind the first.
 */
export default function ReportPage() {
  const combo = layoutAxes(PRESETS.linesAndBars, false)
  const classic = layoutAxes(PRESETS.classic, false)
  return (
    <PredictShell title="Q1 Business Review · Aurora Wellness" filter="Q1 · BY MONTH | AMAZON US | ALL | $USD">
      <ReportWidget
        title="Organic + Paid + Insights"
        brand="Aurora Wellness"
        caption="Does expanding organic content move conversion efficiency? Sales and ad sales against page views, month by month, to find where more pages start to pay off, plateau, or dilute performance."
        primary={HEADER_PRIMARY}
        secondary={HEADER_SECONDARY}
        layout={combo}
        chartHeight={200}
      />
      <ReportWidget
        title="Advertising Efficiency"
        brand="Aurora Wellness"
        caption="Ad clicks against ACOS. When clicks climb faster than cost, the campaign is buying attention efficiently; when ACOS climbs with them, it is not."
        primary={['adClicks', 'acos']}
        secondary={['adSales', 'adSpend', 'adOrders', 'cpc', 'adConversion']}
        layout={classic}
        chartHeight={200}
      />
    </PredictShell>
  )
}
