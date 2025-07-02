import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CompanySetup } from "@/components/setup/CompanySetup";
import { IntegrationSetup } from "@/components/setup/IntegrationSetup";
import { CampaignSetup } from "@/components/setup/CampaignSetup";
import { SetupProgress } from "@/components/setup/SetupProgress";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

const SETUP_STEPS = [
  {
    id: 'company',
    title: 'Company Profile',
    description: 'Tell us about your business and ideal customers'
  },
  {
    id: 'integrations',
    title: 'Connect Integrations',
    description: 'Link your LinkedIn, email, and CRM accounts'
  },
  {
    id: 'campaign',
    title: 'First Campaign',
    description: 'Create your first AI-powered outreach campaign'
  }
];

export default function Setup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupData, setSetupData] = useState({
    company: null,
    integrations: null,
    campaign: null
  });

  const { toast } = useToast();

  const { data: user } = useQuery({
    queryKey: ["/api/user/1"],
    queryFn: () => api.getUser(1),
  });

  const { data: company } = useQuery({
    queryKey: ["/api/company/user/1"],
    queryFn: () => api.getCompanyByUserId(1),
  });

  const { data: integrations } = useQuery({
    queryKey: ["/api/integrations/user/1"],
    queryFn: () => api.getIntegrationsByUserId(1),
  });

  const completeSetupMutation = useMutation({
    mutationFn: async () => {
      await api.updateUser(1, { isSetupComplete: true });
    },
    onSuccess: () => {
      toast({
        title: "Setup Complete!",
        description: "Your SparqAI account is now ready to generate leads.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/1"] });
    },
  });

  const progressPercentage = ((currentStep + 1) / SETUP_STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < SETUP_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeSetupMutation.mutate();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = (stepId: string, data: any) => {
    setSetupData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  const isStepComplete = (stepIndex: number) => {
    const stepId = SETUP_STEPS[stepIndex].id;
    return setupData[stepId as keyof typeof setupData] !== null;
  };

  const canProceed = () => {
    const currentStepId = SETUP_STEPS[currentStep].id;
    return setupData[currentStepId as keyof typeof setupData] !== null;
  };

  if (user?.isSetupComplete) {
    return (
      <div className="flex-1">
        <Header
          title="Setup Complete"
          subtitle="Your SparqAI account is fully configured"
        />
        <main className="flex-1 p-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to SparqAI!
              </h2>
              <p className="text-gray-600 mb-6">
                Your account is fully set up and ready to start generating leads. 
                Head to the dashboard to begin your first campaign.
              </p>
              <Button 
                className="sparq-gradient hover:sparq-gradient-hover text-white"
                onClick={() => window.location.href = '/'}
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Header
        title="Welcome to SparqAI"
        subtitle="Let's get your AI SDR set up in just a few steps"
      />

      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Step {currentStep + 1} of {SETUP_STEPS.length}: {SETUP_STEPS[currentStep].title}
              </h2>
              <span className="text-sm text-gray-500">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="flex items-center justify-center mb-8">
            {SETUP_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-200 ${
                    index <= currentStep
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {isStepComplete(index) ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                {index < SETUP_STEPS.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-4 transition-colors duration-200 ${
                      index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {SETUP_STEPS[currentStep].title}
                </h3>
                <p className="text-gray-600">
                  {SETUP_STEPS[currentStep].description}
                </p>
              </div>

              {currentStep === 0 && (
                <CompanySetup
                  initialData={company}
                  onComplete={(data) => handleStepComplete('company', data)}
                />
              )}

              {currentStep === 1 && (
                <IntegrationSetup
                  initialData={integrations}
                  onComplete={(data) => handleStepComplete('integrations', data)}
                />
              )}

              {currentStep === 2 && (
                <CampaignSetup
                  companyData={setupData.company || company}
                  onComplete={(data) => handleStepComplete('campaign', data)}
                />
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <Button
              className="sparq-gradient hover:sparq-gradient-hover text-white"
              onClick={handleNext}
              disabled={!canProceed() || completeSetupMutation.isPending}
            >
              {currentStep === SETUP_STEPS.length - 1 ? (
                completeSetupMutation.isPending ? (
                  "Completing Setup..."
                ) : (
                  "Complete Setup"
                )
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Setup Progress Component */}
          <div className="mt-8">
            <SetupProgress 
              currentStep={currentStep}
              setupData={setupData}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
