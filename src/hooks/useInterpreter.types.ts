import { Plan, SchedulingLinkPlanDetails, TaskPlanDetails } from "../types/plan";

export type ApiResponseInterpreter = {
  interpretedPlans: Plan<TaskPlanDetails | SchedulingLinkPlanDetails>[];
};
