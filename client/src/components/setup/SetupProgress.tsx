import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Building, Link, Target } from "lucide-react";

interface SetupProgressProps {
  currentStep: number;
  setupData: {
    company: any;
    integrations: any;
    campaign: any;
  };
}

const PROGRESS_ITEMS = [
  {
    id: 'company',
    title: 'Company Profile',
    icon: Building,
    description: 'Business information and ICP'
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: Link,
    description: 'LinkedIn, Email, and CRM connections'
  },
  {
    id: 'campaign',
    title: 'First Campaign',
    icon: Target,
    description: 'Initial outreach campaign setup'
  }
];

export function SetupProgress({ currentStep, setupData }: SetupProgressProps) {
  const completedSteps = Object.values(setupData).filter(Boolean).length;
  const totalSteps = PROGRESS_ITEMS.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  const getStepStatus = (stepId: string, index: number) => {
    const isCompleted = setupData[stepId as keyof typeof setupData] !== null;
    const isCurrent = index === currentStep;
    const isPast = index < currentStep;

    if (isCompleted) return 'completed';
    if (isCurrent) return 'current';
    if (isPast) return 'past';
    return 'upcoming';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'current':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'past':
        return 'text-gray-600 bg-gray-100 border-gray-200';
      default:
        return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'completed' ? CheckCircle : Circle;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Setup Progress</CardTitle>
          <Badge variant="outline">
            {completedSteps} of {totalSteps} completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overall Progress</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="space-y-3 mt-6">
            {PROGRESS_ITEMS.map((item, index) => {
              const status = getStepStatus(item.id, index);
              const StatusIcon = getStatusIcon(status);
              
              return (
                <div
                  key={item.id}
                  className={`flex items-center p-3 rounded-lg border transition-colors ${getStatusColor(status)}`}
                >
                  <StatusIcon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <item.icon className="h-4 w-4 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-sm opacity-75">{item.description}</div>
                  </div>
                  {status === 'completed' && (
                    <Badge variant="outline" className="bg-white">
                      Complete
                    </Badge>
                  )}
                  {status === 'current' && (
                    <Badge className="sparq-accent-light">
                      In Progress
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
          
          {completedSteps === totalSteps && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-800">
                  Setup Complete! Ready to launch your AI SDR.
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
