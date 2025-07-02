import { Header } from "@/components/layout/Header";
import { SequencesPanel } from "@/components/sequences/SequencesPanel";
import { Button } from "@/components/ui/button";
import { Plus, Download, Filter } from "lucide-react";

export default function Sequences() {
  return (
    <div className="flex-1">
      <Header
        title="Sequences"
        subtitle="Manage your email and LinkedIn outreach sequences"
      >
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </Header>

      <main className="flex-1 p-6">
        <SequencesPanel userId={1} />
      </main>
    </div>
  );
}