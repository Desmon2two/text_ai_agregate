import { ApiError } from "./ApiErrorType";

export type JobStateMachineTypes<T> = 
  | {state:"created"}
  | {state:"accepted"}
  | {state:"queued"}
  | {state:"recieved"}
  | {state:"complete", data: T}
  | {state:"error", error: ApiError}

// the retry policy shall be recorded separately