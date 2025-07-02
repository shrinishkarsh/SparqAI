import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const data = [
  { name: 'Mon', leads: 20, replies: 5, meetings: 1 },
  { name: 'Tue', leads: 25, replies: 8, meetings: 2 },
  { name: 'Wed', leads: 35, replies: 12, meetings: 3 },
  { name: 'Thu', leads: 30, replies: 10, meetings: 2 },
  { name: 'Fri', leads: 45, replies: 15, meetings: 4 },
  { name: 'Sat', leads: 40, replies: 18, meetings: 6 },
  { name: 'Sun', leads: 52, replies: 22, meetings: 8 },
];

export function CampaignChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Campaign Performance</CardTitle>
            <p className="text-sm text-gray-600">Response rates and engagement over time</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="sparq-accent-light">7d</Button>
            <Button variant="ghost" size="sm" className="text-gray-600">30d</Button>
            <Button variant="ghost" size="sm" className="text-gray-600">90d</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#888888" />
              <YAxis stroke="#888888" />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="leads" 
                stroke="hsl(239, 84%, 67%)" 
                strokeWidth={2}
                dot={{ fill: "hsl(239, 84%, 67%)", strokeWidth: 2 }}
                name="Leads Contacted"
              />
              <Line 
                type="monotone" 
                dataKey="replies" 
                stroke="hsl(142, 76%, 36%)" 
                strokeWidth={2}
                dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2 }}
                name="Replies"
              />
              <Line 
                type="monotone" 
                dataKey="meetings" 
                stroke="hsl(271, 76%, 53%)" 
                strokeWidth={2}
                dot={{ fill: "hsl(271, 76%, 53%)", strokeWidth: 2 }}
                name="Meetings"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
