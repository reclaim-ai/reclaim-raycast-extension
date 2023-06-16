type TaskPlanDetails = {
  id: string;
  userId: string;
  title: string;
  durationTimeChunks: number;
  personal: boolean;
};

export interface Plan {
  planType: string;
  id: string;
  // description: string;
  planDetails: TaskPlanDetails;
}
