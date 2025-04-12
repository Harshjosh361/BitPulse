"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

export default function AnalyticsDashboard() {
  const { data: session } = useSession()
  const [urls, setUrls] = useState([])
  const [status, setStatus] = useState({ loading: true, error: "" })

  useEffect(() => {
    if (!session?.user?.id) return

    fetch("/api/url/user")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data")
        return res.json()
      })
      .then((data) => setUrls(data))
      .catch((err) => setStatus({ loading: false, error: err.message }))
      .finally(() => setStatus((prev) => ({ ...prev, loading: false })))
  }, [session?.user?.id])

  // Process data for charts - only compute when urls change
  const { clicksData, deviceChartData } = urls.length ? processChartData(urls) : { clicksData: [], deviceChartData: [] }

  if (status.loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-800"></div>
      </div>
    )
  }

  if (status.error) {
    return (
      <div className="rounded border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
        {status.error}
      </div>
    )
  }

  if (!urls.length) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900">No URLs found</h3>
        <p className="mt-2 text-sm text-gray-500">Create some shortened URLs to see analytics here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ChartCard title="Clicks Over Time">
          <LineChart data={clicksData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="clicks" stroke="#000" activeDot={{ r: 8 }} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Device Breakdown">
          <BarChart data={deviceChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#555" />
          </BarChart>
        </ChartCard>
      </div>

      <UrlsTable urls={urls} />
    </div>
  )
}

// Extracted components for better organization
function ChartCard({ title, children }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function UrlsTable({ urls }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Original URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Short URL
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Clicks</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {urls.map((url) => (
              <tr key={url._id}>
                <td className="px-4 py-3 text-sm text-gray-500">
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:underline"
                  >
                    {truncateUrl(url.originalUrl)}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  <a
                    href={`/${url.shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:underline"
                  >
                    {url.shortUrl}
                  </a>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{url.clicks}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(url.createdAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      isExpired(url.expiresAt) ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {isExpired(url.expiresAt) ? "Expired" : "Active"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Helper functions
function processChartData(urls) {
  // Process clicks data
  const clicksData = urls.map((url) => ({
    date: formatDate(url.createdAt),
    clicks: url.clicks,
  }))

  // Process device data
  const deviceData = urls.reduce(
    (acc, url) => {
      const stats = url.deviceStats || { desktop: 0, mobile: 0, tablet: 0 }
      acc.desktop += stats.desktop
      acc.mobile += stats.mobile
      acc.tablet += stats.tablet
      return acc
    },
    { desktop: 0, mobile: 0, tablet: 0 },
  )

  const deviceChartData = [
    { name: "Desktop", value: deviceData.desktop },
    { name: "Mobile", value: deviceData.mobile },
    { name: "Tablet", value: deviceData.tablet },
  ]

  return { clicksData, deviceChartData }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

function isExpired(expiresAt) {
  return expiresAt && new Date() > new Date(expiresAt)
}

function truncateUrl(url, maxLength = 30) {
  return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url
}
