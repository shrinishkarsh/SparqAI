import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const campaigns = [
  {
    id: 1,
    name: "Enterprise Security Solutions",
    status: "active",
    stats: { sent: 847, responseRate: 23.4, meetings: 12 },
    statusColor: "bg-green-400"
  },
  {
    id: 2,
    name: "Financial Services Outreach",
    status: "running",
    stats: { sent: 432, responseRate: 19.8, meetings: 8 },
    statusColor: "bg-blue-400"
  },
  {
    id: 3,
    name: "Healthcare Innovation",
    status: "launching",
    stats: { sent: 0, responseRate: 0, meetings: 0 },
    statusColor: "bg-orange-400 animate-pulse"
  }
];

export function ActiveCampaigns() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Campaigns</CardTitle>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
            Manage All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors duration-150"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 ${campaign.statusColor} rounded-full`}></div>
                  <h4 className="text-sm font-semibold text-gray-900">{campaign.name}</h4>
                </div>
                <Badge variant="outline" className="capitalize">
                  {campaign.status}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{campaign.stats.sent}</p>
                  <p className="text-xs text-gray-600">Sent</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-green-600">
                    {campaign.stats.responseRate ? `${campaign.stats.responseRate}%` : '--'}
                  </p>
                  <p className="text-xs text-gray-600">Response</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple-600">
                    {campaign.stats.meetings || '--'}
                  </p>
                  <p className="text-xs text-gray-600">Meetings</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
