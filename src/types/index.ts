export type StatusType = 'success' | 'failed' | 'running' | 'pending';

export type TriggerType = 'manual' | 'scheduled' | 'webhook';

export type EnvironmentType = 'test' | 'staging' | 'production';

export type ReleaseStatus = 'pending_approval' | 'approved' | 'deploying' | 'completed' | 'rollback' | 'rejected';

export type EnvStatus = 'healthy' | 'warning' | 'error';

export type IssueType = 'feature' | 'bug';

export type IssueStatus = 'backlog' | 'in_progress' | 'testing' | 'done' | 'closed';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  id: string;
  name: string;
  description: string;
  team: string;
  createdAt: string;
  status: 'active' | 'archived';
}

export interface PipelineStep {
  id: string;
  name: string;
  status: StatusType;
  logs: string[];
  duration: number;
}

export interface PipelineStage {
  id: string;
  name: string;
  status: StatusType;
  steps: PipelineStep[];
  duration: number;
}

export interface Pipeline {
  id: string;
  name: string;
  projectId: string;
  projectName: string;
  status: StatusType;
  stages: PipelineStage[];
  lastRunAt: string;
  triggerType: TriggerType;
  branch: string;
  commitMessage: string;
  commitUser: string;
}

export interface Release {
  id: string;
  title: string;
  version: string;
  projectId: string;
  projectName: string;
  environment: EnvironmentType;
  status: ReleaseStatus;
  applicant: string;
  approver?: string;
  approvalComments?: string;
  relatedIssues: string[];
  description: string;
  createdAt: string;
  deployedAt?: string;
  rollbackFrom?: string;
}

export interface DeployRecord {
  id: string;
  version: string;
  deployedAt: string;
  deployedBy: string;
  status: 'success' | 'failed';
}

export interface Environment {
  id: string;
  name: string;
  type: EnvironmentType;
  status: EnvStatus;
  currentVersion: string;
  cpuUsage: number;
  memoryUsage: number;
  deployHistory: DeployRecord[];
  instances: number;
  region: string;
}

export interface Issue {
  id: string;
  title: string;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  projectId: string;
  projectName: string;
  assignee: string;
  creator: string;
  branchName?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  labels: string[];
}

export interface Activity {
  id: string;
  type: 'pipeline' | 'release' | 'issue';
  title: string;
  description: string;
  user: string;
  time: string;
  status: StatusType | ReleaseStatus | IssueStatus;
}

export interface MetricsData {
  deliveryCycle: {
    average: number;
    trend: { date: string; days: number }[];
  };
  releaseFrequency: {
    weekly: { week: string; count: number; success: number }[];
    monthly: { month: string; count: number; success: number }[];
  };
  failureReasons: {
    reason: string;
    count: number;
    percentage: number;
  }[];
  teamWeekly: {
    team: string;
    releases: number;
    issues: number;
    bugs: number;
    avgCycleTime: number;
    successRate: number;
  }[];
}

export interface OverviewStats {
  projects: number;
  pipelines: number;
  releases: number;
  issues: number;
  successRate: number;
  avgDeliveryTime: number;
}
